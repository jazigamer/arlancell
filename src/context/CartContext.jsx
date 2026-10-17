import { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../services/storage.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [settings, setSettingsState] = useState(() => storage.getSettings());
  const [items, setItems] = useState(() => {
    const s = localStorage.getItem("arlancell_cart");
    return s ? JSON.parse(s) : [];
  });
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [coupon, setCoupon] = useState(() => localStorage.getItem("arlancell_coupon") || "");

  useEffect(() => { localStorage.setItem("arlancell_cart", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("arlancell_coupon", coupon); }, [coupon]);

  function updateSettings(s) { storage.setSettings(s); setSettingsState(s); }

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

  function finalizarPedido(cliente) {
    if (items.length === 0) return null;
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = coupon && settings.cupons[coupon] ? subtotal * settings.cupons[coupon] : 0;
    const total = subtotal - discount;
    const order = storage.addOrder({
      cliente, items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
      subtotal, discount, coupon, total, status: "pendente",
    });
    const linhas = items.map((i) => `• ${i.name} (x${i.qty}) — ${formatBRL(i.price * i.qty)}`).join("\n");
    const cupom = coupon ? `\nCupom: ${coupon} (-${formatBRL(discount)})` : "";
    const msg = `Olá ${settings.nomeLoja}! Quero fazer um pedido:\n\nPedido ${order.numero}\n\n${linhas}${cupom}\n\nTotal: ${formatBRL(total)}\n\nNome: ${cliente.nome}\nWhatsApp: ${cliente.telefone}`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    setItems([]); setCoupon("");
    return order;
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = coupon && settings.cupons[coupon] ? subtotal * settings.cupons[coupon] : 0;
  const total = subtotal - discount;
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, changeQty, clear, count, subtotal, discount, total, coupon, applyCoupon, open, setOpen, toast, showToast, settings, updateSettings, finalizarPedido }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);

function formatBRL(v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
