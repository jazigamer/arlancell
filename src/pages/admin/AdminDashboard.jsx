import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import { storage } from "../../services/storage.js";
import { formatBRL } from "../../utils/format.js";

export default function AdminDashboard() {
  const { products } = useProducts();
  const leads = storage.getLeads();
  const orders = storage.getOrders();
  
  const totalEstoque = products.reduce((s, p) => s + (p.stock || 0), 0);
  const valorEstoque = products.reduce((s, p) => s + p.price * (p.stock || 0), 0);
  const estoqueBaixo = products.filter((p) => (p.stock || 0) <= 3);
  const pedidosPendentes = orders.filter((o) => o.status === "pendente").length;
  const faturamento = orders.filter((o) => o.status !== "cancelado").reduce((s, o) => s + (o.total || 0), 0);

  // Dados do gráfico
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return { label: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace('.', ''), count: leads.filter((l) => l.createdAt?.slice(0, 10) === key).length };
  });
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Painel de Controle</h1>
          <p className="muted">Visão geral da loja em tempo real</p>
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
          <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '10px' }}>📈 Leads (Últimos 7 dias)</h3>
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
          <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '10px' }}>🏆 Top Produtos</h3>
          <p className="muted">Nenhum pedido ainda.</p>
        </div>
      </div>

      <h2>Últimos pedidos</h2>
      <p className="muted">Nenhum pedido ainda.</p>
    </div>
  );
}
