import { useState } from "react";
import { storage } from "../../services/storage.js";
import { formatBRL } from "../../utils/format.js";
export default function AdminOrders() {
  const [orders, setOrders] = useState(storage.getOrders());
  const [filtro, setFiltro] = useState("todos");
  const filtered = filtro === "todos" ? orders : orders.filter((o) => o.status === filtro);

  function mudarStatus(id, status) { storage.updateOrderStatus(id, status); setOrders(storage.getOrders()); }
  function remover(id) { if (!confirm("Excluir pedido?")) return; storage.removeOrder(id); setOrders(storage.getOrders()); }

  return (
    <div className="admin-page">
      <h1>Pedidos ({orders.length})</h1>
      <div className="admin-filters">
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="pendente">Pendentes</option>
          <option value="pago">Pagos</option>
          <option value="enviado">Enviados</option>
          <option value="entregue">Entregues</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>
      {filtered.length === 0 ? <p className="muted">Nenhum pedido.</p> : (
        <table className="admin-table">
          <thead><tr><th>#</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Status</th><th>Data</th><th></th></tr></thead>
          <tbody>
            {filtered.slice().reverse().map((o) => (
              <tr key={o.id}>
                <td><strong>{o.numero}</strong></td>
                <td>{o.cliente?.nome || "—"}<br /><small>{o.cliente?.telefone}</small></td>
                <td>{o.items?.length} item(ns)</td>
                <td><strong>{formatBRL(o.total)}</strong></td>
                <td>
                  <select value={o.status} onChange={(e) => mudarStatus(o.id, e.target.value)} className={`status-select status-${o.status}`}>
                    <option value="pendente">Pendente</option><option value="pago">Pago</option>
                    <option value="enviado">Enviado</option><option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
                <td>{new Date(o.createdAt).toLocaleString("pt-BR")}</td>
                <td><button className="btn-small danger" onClick={() => remover(o.id)}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
