import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductSkeleton from "../components/ProductSkeleton.jsx";

export default function Home() {
  const { products, categories, loading } = useProducts();
  const { settings } = useCart();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const destaques = featured.length > 0 ? featured : products.slice(0, 4);
  const tituloDestaques = featured.length > 0 ? "⭐ Destaques" : "🆕 Novidades";
  const ofertas = products.filter((p) => p.oldPrice).slice(0, 4);
  const wa = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de atendimento.")}`;

  return (
    <>
      {/* HERO */}
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
            <div className="hero-cta">
              <Link to="/catalogo" className="btn-primary">Ver ofertas →</Link>
              <a href={wa} target="_blank" rel="noreferrer" className="btn-secondary">💬 Falar no WhatsApp</a>
            </div>
            <ul className="hero-chips">
              <li>🚚 Entrega no mesmo dia em Aracoiaba</li>
              <li>💳 Até 21x no cartão</li>
              <li>🔧 Assistência com garantia</li>
            </ul>
          </div>
          <div className="hero-image">
            <img src={settings.bannerImage} alt={settings.bannerTitle} />
          </div>
        </div>
      </section>

      {/* FAIXA DE CONFIANÇA */}
      <section className="trust-strip">
        <div className="container trust-grid">
          <div className="trust-item"><span>📍</span><div><strong>Entrega Local</strong><p>Grátis* e no mesmo dia em Aracoiaba</p></div></div>
          <div className="trust-item"><span>📦</span><div><strong>Envio p/ Todo o Brasil</strong><p>Via Correios, frete combinado no WhatsApp</p></div></div>
          <div className="trust-item"><span>💳</span><div><strong>Pagamento Facilitado</strong><p>Cartão em até 21x ou à vista</p></div></div>
          <div className="trust-item"><span>🔧</span><div><strong>Assistência Técnica</strong><p>Conserto com garantia</p></div></div>
        </div>
      </section>

      {/* CATEGORIAS */}
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

      {/* DESTAQUES */}
      {(loading || destaques.length > 0) && (
        <section className="container section tight">
          <div className="section-header-lux">
            <div>
              <h2>{tituloDestaques}</h2>
              <span className="subtitle">Escolhidos a dedo para você</span>
            </div>
            <Link to="/catalogo" className="ver-tudo">Ver catálogo completo →</Link>
          </div>
          {loading ? <ProductSkeleton count={4} /> : <div className="grid">{destaques.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
        </section>
      )}

      {!loading && products.length === 0 && (
        <section className="container section">
          <p className="empty">🛠️ Estamos atualizando o catálogo. Chame a gente no WhatsApp para saber os produtos disponíveis!</p>
        </section>
      )}

      {/* OFERTAS */}
      {ofertas.length > 0 && (
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
              <h3>COM ATÉ<br /><span className="text-orange">50% OFF</span></h3>
              <p>Capas, películas, fones, carregadores e muito mais!</p>
              <Link to="/catalogo?cat=acessorios" className="btn-primary">Ver ofertas →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ASSISTÊNCIA */}
      <section className="container section tight">
        <div className="assist-banner">
          <div>
            <span className="promo-tag">ASSISTÊNCIA TÉCNICA</span>
            <h2>Seu celular quebrou? A gente resolve.</h2>
            <p>Conserto de iPhone e Android com peças de qualidade e garantia. Em Aracoiaba, buscamos o aparelho na sua casa.</p>
          </div>
          <Link to="/assistencia" className="btn-primary">Pedir orçamento →</Link>
        </div>
      </section>

      {/* COMO COMPRAR */}
      <section className="container section">
        <div className="section-header-lux">
          <div>
            <h2>Como comprar</h2>
            <span className="subtitle">Simples, rápido e com atendimento de verdade</span>
          </div>
        </div>
        <div className="how-grid">
          <div className="how-step"><span className="how-num">1</span><h3>Escolha</h3><p>Navegue pelo catálogo e adicione os produtos ao carrinho.</p></div>
          <div className="how-step"><span className="how-num">2</span><h3>Finalize</h3><p>Preencha seus dados e envie o pedido direto para o nosso WhatsApp.</p></div>
          <div className="how-step"><span className="how-num">3</span><h3>Receba</h3><p>Combinamos pagamento e entrega com você e o produto chega rapidinho.</p></div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container section tight">
        <div className="cta-final">
          <h2>Ficou com alguma dúvida?</h2>
          <p>Fale direto com a nossa equipe. Respondemos rápido!</p>
          <a href={wa} target="_blank" rel="noreferrer" className="btn-whatsapp-cta">💬 Chamar no WhatsApp</a>
        </div>
      </section>
    </>
  );
}
