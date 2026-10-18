import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import { listOrders } from "../../services/orders.js";
import { listLeads } from "../../services/leads.js";
import { formatBRL } from "../../utils/format.js";

export default function AdminDashboard() {
  const { products } = useProducts();
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    listOrders().then(setOrders).catch((e) => console.error("Pedidos:", e.message));
    listLeads().then(setLeads).catch((e) => console.error("Leads:", e.message));
  }, []);

  const totalEstoque = products.reduce((s, p) => s + (p.stock || 0), 0);
  const valorEstoque = products.reduce((s, p) => s + p.price * (p.stock || 0), 0);
  const estoqueBaixo = products.filter((p) => (p.stock || 0) <= 3);
  const pedidosPendentes = orders.filter((o) => o.status === "pendente").length;
  const faturamento = orders.filter((o) => o.status !== "cancelado").reduce((s, o) => s + (Number(o.total) || 0), 0);

  const vendidos = {};
  orders.filter((o) => o.status !== "cancelado").forEach((o) =>
    (o.items || []).forEach((i) => { vendidos[i.name] = (vendidos[i.name] || 0) + (i.qty || 0); })
  );
  const topProdutos = Object.entries(vendidos).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return { label: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""), count: leads.filter((l) => l.createdAt?.slice(0, 10) === key).length };
  });
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Painel de Controle</h1>
          <p className="muted">Visão geral da loja</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span>📦</span><strong>{products.length}</strong><p>Produtos Ativos</p></div>
        <div className="stat-card"><span>💰</span><strong>{formatBRL(valorEstoque)}</strong><p>Valor em Estoque</p></div>
        <div className="stat-card"><span>🛒</span><strong>{orders.length}</strong><p>Pedidos ({pedidosPendentes} pendentes)</p></div>
        <div className="stat-card"><span>💵</span><strong>{formatBRL(faturamento)}</strong><p>Faturamento</p></div>
        <div className="stat-card"><span>📊</span><strong>{totalEstoque}</strong><p>Itens no total</p></div>
        <div className="stat-card"><span>📬</span><strong>{leads.length}</strong><p>Leads capturados</p></div>
      </div>

      {estoqueBaixo.length > 0 && (
        <div className="alert-card">
          <h3>⚠️ Estoque Baixo ({estoqueBaixo.length})</h3>
          <div className="alert-list">
            {estoqueBaixo.map((p) => (
              <Link key={p.id} to={`/admin/produtos/editar/${p.id}`} className="alert-item">
                <img src={p.image} alt="" />
                <span title={p.name}>{p.name}</span>
                <strong>{p.stock} un.</strong>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-row">
        <div className="stat-card">
          <h3 style={{ color: "#fff", fontSize: "1rem", marginBottom: "10px" }}>📈 Leads (Últimos 7 dias)</h3>
          <div className="bar-chart">
            {days.map((d, i) => (
              <div key={i} className="bar-col">
                <div className="bar" style={{ height: `${(d.count / maxCount) * 100}%` }}>
                  {d.count > 0 && <span>{d.count}</span>}
                </div>
                <small>{d.label}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h3 style={{ color: "#fff", fontSize: "1rem", marginBottom: "10px" }}>🏆 Top Produtos</h3>
          {topProdutos.length === 0 ? <p className="muted">Nenhum pedido ainda.</p> : (
            <ol style={{ paddingLeft: 18, margin: 0 }}>
              {topProdutos.map(([nome, qtd]) => <li key={nome}>{nome} — <strong>{qtd} un.</strong></li>)}
            </ol>
          )}
        </div>
      </div>

      <h2>Últimos pedidos</h2>
      {orders.length === 0 ? <p className="muted">Nenhum pedido ainda.</p> : (
        <table className="admin-table">
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id}>
                <td><strong>{o.numero}</strong></td>
                <td>{o.cliente?.nome || "—"}</td>
                <td>{formatBRL(Number(o.total) || 0)}</td>
                <td>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
