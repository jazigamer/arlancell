import { useState, useEffect } from "react";
import { listOrders, updateOrderStatus, removeOrder } from "../../services/orders.js";
import { formatBRL } from "../../utils/format.js";
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const filtered = filtro === "todos" ? orders : orders.filter((o) => o.status === filtro);

  async function carregar() {
    try { setOrders(await listOrders()); }
    catch (e) { alert("Erro ao carregar pedidos:\n" + e.message); }
    setLoading(false);
  }
  useEffect(() => { carregar(); }, []);

  async function mudarStatus(id, status) {
    try { await updateOrderStatus(id, status); await carregar(); }
    catch (e) { alert("Erro ao atualizar:\n" + e.message); }
  }
  async function remover(id) {
    if (!confirm("Excluir pedido?")) return;
    try { await removeOrder(id); await carregar(); }
    catch (e) { alert("Erro ao excluir:\n" + e.message); }
  }

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
        <button className="btn-small" onClick={carregar}>🔄 Atualizar</button>
      </div>
      {loading ? <p className="muted">Carregando...</p> : filtered.length === 0 ? <p className="muted">Nenhum pedido.</p> : (
        <table className="admin-table">
          <thead><tr><th>#</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Status</th><th>Data</th><th></th></tr></thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td><strong>{o.numero}</strong></td>
                <td>{o.cliente?.nome || "—"}<br /><small>{o.cliente?.telefone}</small></td>
                <td>{o.items?.length} item(ns)</td>
                <td><strong>{formatBRL(Number(o.total) || 0)}</strong></td>
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
