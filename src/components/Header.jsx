import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useProducts } from "../context/ProductsContext.jsx";
import CartDrawer from "./CartDrawer.jsx";

export default function Header() {
  const { count, setOpen, settings } = useCart();
  const { categories } = useProducts();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const activeCat = loc.pathname === "/catalogo" ? new URLSearchParams(loc.search).get("cat") : null;
  const wa = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de atendimento.")}`;
  const linkClass = (active) => (active ? "active" : "");

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-item"><span className="icon">📍</span> Entrega no mesmo dia em Aracoiaba</div>
          <div className="topbar-item"><span className="icon">💳</span> Parcelamos em até 21x no cartão</div>
          <div className="topbar-item"><span className="icon">🎧</span> Atendimento via WhatsApp</div>
        </div>
      </div>

      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <img src="/logo-full.png" alt={settings.nomeLoja || "Arlancell"} className="logo-img" />
          </Link>

          <form className="header-search" onSubmit={(e) => { e.preventDefault(); nav(`/catalogo?q=${encodeURIComponent(q)}`); setMenuOpen(false); }}>
            <input aria-label="Buscar produtos" placeholder="Buscar produtos, marcas e categorias..." value={q} onChange={(e) => setQ(e.target.value)} />
            <button type="submit" aria-label="Buscar">🔍</button>
          </form>

          <div className="header-actions">
            <a href={wa} target="_blank" rel="noreferrer" className="header-action">
              <span className="icon">💬</span>
              <div><small>Fale conosco</small><strong>WhatsApp</strong></div>
            </a>
            <button className="header-action cart" onClick={() => setOpen(true)} aria-label="Abrir carrinho">
              <span className="icon">🛒</span>
              {count > 0 && <span className="cart-badge">{count}</span>}
              <div><small>Carrinho</small><strong>{count} item(ns)</strong></div>
            </button>
          </div>

          <button className="hamburger" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </header>

      <nav className={`nav-bar ${menuOpen ? "open" : ""}`}>
        <div className="container nav-inner" onClick={() => setMenuOpen(false)}>
          <Link to="/catalogo" className="btn-todas-cat">☰ Todos os produtos</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/catalogo?cat=${c.id}`} className={linkClass(activeCat === c.id)}>{c.label}</Link>
          ))}
          <Link to="/assistencia" className={`text-orange font-bold ${linkClass(loc.pathname === "/assistencia")}`}>🔧 Assistência Técnica</Link>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
}
