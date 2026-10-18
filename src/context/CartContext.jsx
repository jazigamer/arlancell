import { createContext, useContext, useState, useEffect } from "react";
import { defaultSettings, fetchSettings, saveSettings } from "../services/settings.js";
import { createOrder } from "../services/orders.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [settings, setSettingsState] = useState(defaultSettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [items, setItems] = useState(() => {
    try {
      const s = localStorage.getItem("arlancell_cart");
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [coupon, setCoupon] = useState(() => localStorage.getItem("arlancell_coupon") || "");

  useEffect(() => { localStorage.setItem("arlancell_cart", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("arlancell_coupon", coupon); }, [coupon]);

  // Configurações da loja agora vêm do Supabase (todos os visitantes veem o mesmo)
  useEffect(() => {
    fetchSettings().then((s) => { setSettingsState(s); setSettingsLoaded(true); });
  }, []);

  async function updateSettings(s) {
    const saved = await saveSettings(s); // lança erro se não salvar
    setSettingsState(saved);
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2200); }
  function addItem(product) {
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✅ ${product.name} adicionado!`);
    setOpen(true);
  }
  function removeItem(id) { setItems((prev) => prev.filter((i) => i.id !== id)); }
  function changeQty(id, qty) { if (qty < 1) return removeItem(id); setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i))); }
  function clear() { setItems([]); setCoupon(""); }

  function applyCoupon(code) {
    const c = code.trim().toUpperCase();
    const coupons = settings.cupons || {};
    if (coupons[c]) { setCoupon(c); showToast(`🎉 Cupom ${c} aplicado!`); return true; }
    showToast("❌ Cupom inválido"); return false;
  }

  async function finalizarPedido(cliente) {
    if (items.length === 0) return null;
    const cupons = settings.cupons || {};
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = coupon && cupons[coupon] ? subtotal * cupons[coupon] : 0;
    const total = subtotal - discount;

    // Abre a aba do WhatsApp já (antes do await) para o celular não bloquear o pop-up
    const win = window.open("", "_blank");

    let order = null;
    try {
      order = await createOrder({
        cliente,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        subtotal, discount, coupon, total,
      });
    } catch (err) {
      // Se o banco falhar, o pedido ainda segue pelo WhatsApp (venda não se perde)
      console.error("Erro ao registrar pedido:", err);
    }

    const linhas = items.map((i) => `• ${i.name} (x${i.qty}) — ${formatBRL(i.price * i.qty)}`).join("\n");
    const cupom = coupon ? `\nCupom: ${coupon} (-${formatBRL(discount)})` : "";
    const numero = order ? `Pedido ${order.numero}\n\n` : "";
    const msg = `Olá ${settings.nomeLoja}! Quero fazer um pedido:\n\n${numero}${linhas}${cupom}\n\nTotal: ${formatBRL(total)}\n\nNome: ${cliente.nome}\nWhatsApp: ${cliente.telefone}`;
    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`;
    if (win) win.location.href = url; else window.location.href = url;

    setItems([]); setCoupon("");
    return order;
  }

  const cupons = settings.cupons || {};
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = coupon && cupons[coupon] ? subtotal * cupons[coupon] : 0;
  const total = subtotal - discount;
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, changeQty, clear, count, subtotal, discount, total, coupon, applyCoupon, open, setOpen, toast, showToast, settings, settingsLoaded, updateSettings, finalizarPedido }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);

function formatBRL(v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
