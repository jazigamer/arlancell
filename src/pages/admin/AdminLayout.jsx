import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../services/auth.js";

export default function AdminLayout() {
  const nav = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | out | denied | ok

  useEffect(() => {
    (async () => {
      const session = await auth.getSession();
      if (!session) return setStatus("out");
      const ok = await auth.isAdmin();
      setStatus(ok ? "ok" : "denied");
    })();
  }, []);

  const tela = { padding: 50, textAlign: "center", color: "#fff", background: "#000", minHeight: "100vh" };

  if (status === "loading") return <div style={tela}>Verificando acesso...</div>;
  if (status === "out") return <Navigate to="/admin/login" replace />;
  if (status === "denied") {
    return (
      <div style={tela}>
        <h2>Acesso negado</h2>
        <p>Este usuário não está autorizado como administrador.</p>
        <p style={{ opacity: 0.7 }}>Confira se o e-mail está na tabela <code>admins</code> do Supabase e se o setup.sql foi executado.</p>
        <button className="btn-primary" onClick={async () => { await auth.logout(); nav("/admin/login"); }}>Sair</button>
      </div>
    );
  }

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
