import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const { products, categories } = useProducts();
  const { settings } = useCart();
  const destaques = products.filter((p) => p.featured).slice(0, 4);
  const ofertas = products.filter((p) => p.oldPrice).slice(0, 4);

  return (
    <>
      {/* HERO BANNER */}
      <section className="hero-banner">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="badge-lancamento">LANÇAMENTO</span>
            <h1>{settings.bannerTitle}</h1>
            <p>{settings.bannerSubtitle}</p>
            <div className="hero-price">
              <span>A partir de</span>
              <strong>{settings.bannerPrice}</strong>
            </div>
            <Link to="/catalogo" className="btn-primary">Ver ofertas →</Link>
          </div>
          <div className="hero-image">
            <img src={settings.bannerImage} alt={settings.bannerTitle} />
          </div>
        </div>
      </section>

      {/* CATEGORIAS VISUAIS */}
      <section className="container section">
        <div className="categories-row">
          {categories.map((c) => (
            <Link key={c.id} to={`/catalogo?cat=${c.id}`} className="cat-card">
              <span className="cat-icon">{c.icon}</span>
              <span>{c.label}</span>
            </Link>
          ))}
          <Link to="/catalogo" className="cat-card">
            <span className="cat-icon">🗂️</span>
            <span>Ver todas →</span>
          </Link>
        </div>
      </section>

      {/* OFERTAS DO DIA + BANNER LATERAL */}
      <section className="container section" id="ofertas">
        <div className="section-header-lux">
          <div>
            <h2>🔥 Ofertas do Dia</h2>
            <span className="subtitle">Os melhores preços para você aproveitar!</span>
          </div>
          <Link to="/catalogo" className="ver-tudo">Ver todas as ofertas →</Link>
        </div>
        
        <div className="ofertas-grid-layout">
          <div className="grid">{ofertas.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          
          <div className="banner-promo">
            <span className="promo-tag">ACESSÓRIOS</span>
            <h3>COM ATÉ<br/><span className="text-orange">50% OFF</span></h3>
            <p>Capas, películas, fones, carregadores e muito mais!</p>
            <Link to="/catalogo?cat=acessorios" className="btn-primary">Ver ofertas →</Link>
          </div>
        </div>
      </section>
    </>
  );
}



