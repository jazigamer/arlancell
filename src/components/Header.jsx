import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import CartDrawer from "./CartDrawer.jsx";

export default function Header() {
  const { count, setOpen } = useCart();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();

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
          <Link to="/" className="logo">
            <img src="/logo-full.png" alt="Arlancell" className="logo-img" />
          </Link>

          <form className="header-search" onSubmit={(e) => { e.preventDefault(); nav(`/catalogo?q=${encodeURIComponent(q)}`); setMenuOpen(false); }}>
            <input placeholder="Buscar produtos, marcas e categorias..." value={q} onChange={(e) => setQ(e.target.value)} />
            <button type="submit">🔍</button>
          </form>

          <div className="header-actions">
            <Link to="/admin" className="header-action">
              <span className="icon">👤</span>
              <div><small>Minha conta</small><strong>Entrar</strong></div>
            </Link>
            <button className="header-action cart" onClick={() => setOpen(true)}>
              <span className="icon">🛒</span>
              <div><small>Carrinho</small><strong>{count} item(ns)</strong></div>
            </button>
          </div>
          
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </header>

      <nav className={`nav-bar ${menuOpen ? "open" : ""}`}>
        <div className="container nav-inner">
          <button className="btn-todas-cat">☰ Todas as categorias</button>
          <NavLink to="/catalogo?cat=celulares">Celulares</NavLink>
          <NavLink to="/catalogo?cat=acessorios">Acessórios</NavLink>
          <NavLink to="/catalogo?cat=informatica">Informática</NavLink>
          <NavLink to="/catalogo?cat=eletronicos">Eletrônicos</NavLink>
          <NavLink to="/catalogo?cat=smartwatch">Smartwatch</NavLink>
          <NavLink to="/catalogo?cat=audio">Áudio</NavLink>
          <NavLink to="/catalogo?cat=games">Games</NavLink>
          <NavLink to="/assistencia" className="text-orange font-bold">🔧 Assistência Técnica</NavLink>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
}

