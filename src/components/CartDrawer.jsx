import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatBRL } from "../utils/format.js";

export default function CartDrawer() {
  const { items, open, setOpen, removeItem, changeQty, subtotal, discount, total, coupon, applyCoupon, clear } = useCart();
  const [code, setCode] = useState("");
  const nav = useNavigate();

  if (!open) return null;

  return (
    <div className="cart-overlay" onClick={() => setOpen(false)}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 Seu carrinho</h2>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>
        
        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-emoji">🛒</div>
            <p>Seu carrinho está vazio</p>
            <button className="btn-primary" onClick={() => setOpen(false)}>Continuar comprando</button>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((i) => (
                <li key={i.id} className="cart-item">
                  <img src={i.image} alt={i.name} />
                  <div className="cart-item-info">
                    <strong>{i.name}</strong>
                    <span className="cart-price">{formatBRL(i.price)}</span>
                    <div className="qty">
                      <button onClick={() => changeQty(i.id, i.qty - 1)}>−</button><span>{i.qty}</span><button onClick={() => changeQty(i.id, i.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove" onClick={() => removeItem(i.id)}>🗑</button>
                </li>
              ))}
            </ul>
            
            <div className="cart-coupon">
              <input placeholder="Cupom de desconto" value={code} onChange={(e) => setCode(e.target.value)} />
              <button onClick={() => applyCoupon(code)}>Aplicar</button>
            </div>

            <div className="cart-footer">
              <div className="cart-line"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
              {discount > 0 && <div className="cart-line discount-line"><span>Cupom {coupon}</span><span>-{formatBRL(discount)}</span></div>}
              
              <div className="cart-shipping-note">
                <p>📍 <strong>É de Aracoiaba?</strong> A entrega é feita no mesmo dia!</p>
                <p>🚚 <strong>Outras cidades:</strong> Enviamos o orçamento do frete pelo WhatsApp.</p>
              </div>

              <div className="cart-total"><span>Total</span><strong>{formatBRL(total)}</strong></div>
              
              <button className="btn-primary" onClick={() => { setOpen(false); nav("/checkout"); }}>Finalizar pedido</button>
              <button className="btn-ghost" onClick={clear}>Limpar carrinho</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}


