import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { formatBRL } from "../utils/format.js";
export default function Checkout() {
  const { items, total, finalizarPedido } = useCart();
  const nav = useNavigate();
  const [sending, setSending] = useState(false);
  const [cliente, setCliente] = useState({ nome: "", telefone: "", email: "", endereco: "", obs: "" });
  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    await finalizarPedido(cliente);
    nav("/");
  }
  if (items.length === 0) return <section className="container section"><h1>Carrinho vazio</h1></section>;
  return (
    <section className="container section checkout">
      <h1>Finalizar pedido</h1>
      <div className="checkout-grid">
        <form className="admin-form" onSubmit={submit}>
          <h3>Seus dados</h3>
          <label>Nome completo<input required value={cliente.nome} onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} /></label>
          <div className="form-row">
            <label>WhatsApp<input required value={cliente.telefone} onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })} /></label>
            <label>E-mail<input type="email" value={cliente.email} onChange={(e) => setCliente({ ...cliente, email: e.target.value })} /></label>
          </div>
          <label>Endereço (se for entrega)<input value={cliente.endereco} onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })} /></label>
          <label>Observações<textarea rows="2" value={cliente.obs} onChange={(e) => setCliente({ ...cliente, obs: e.target.value })} /></label>
          <button type="submit" className="btn-primary big" disabled={sending}>{sending ? "Enviando..." : "Enviar pedido pelo WhatsApp"}</button>
        </form>
        <div className="admin-form">
          <h3>Resumo</h3>
          {items.map((i) => (
            <div key={i.id} className="checkout-item"><img src={i.image} alt="" /><div><strong>{i.name}</strong><span>{i.qty}x {formatBRL(i.price)}</span></div></div>
          ))}
          <div className="cart-total"><span>Total</span><strong>{formatBRL(total)}</strong></div>
        </div>
      </div>
    </section>
  );
}
