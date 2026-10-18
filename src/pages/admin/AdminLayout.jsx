import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../services/auth.js";
import { useCart } from "../../context/CartContext.jsx";

export default function AdminLayout() {
  const nav = useNavigate();
  const { settings } = useCart();
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    auth.getSession().then(session => {
      setIsLogged(!!session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: 50, textAlign: "center", color: "#fff", background: "#000", minHeight: "100vh" }}>Verificando acesso...</div>;
  if (!isLogged) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-layout">
      <aside className="admin-side">
        <h2><span className="logo-orange">Arlan</span><span className="logo-gold">cell</span></h2>
        <p className="admin-side-label">ADMIN</p>
        <nav>
          <NavLink to="/admin" end>📊 Dashboard</NavLink>
          <NavLink to="/admin/produtos">📦 Produtos</NavLink>
          <NavLink to="/admin/pedidos">🛒 Pedidos</NavLink>
          <NavLink to="/admin/categorias">🏷️ Categorias</NavLink>
          <NavLink to="/admin/leads">📬 Leads</NavLink>
          <NavLink to="/admin/config">⚙️ Configurações</NavLink>
          <hr />
          <a href="/" target="_blank" rel="noreferrer">🌐 Ver site</a>
        </nav>
        <button className="btn-sair" onClick={async () => { await auth.logout(); nav("/admin/login"); }}>Sair</button>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
