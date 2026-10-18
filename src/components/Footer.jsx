import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useProducts } from "../context/ProductsContext.jsx";

export default function Footer() {
  const { settings } = useCart();
  const { categories } = useProducts();
  const wa = `https://wa.me/${settings.whatsapp}`;

  return (
    <footer className="footer">
      <div className="container footer-cols">
        <div className="f-brand">
          <img src="/logo-full.png" alt={settings.nomeLoja || "Arlancell"} className="footer-logo-img" />
          <p className="f-about">Celulares, acessórios e assistência técnica com atendimento próximo e preço justo.</p>
        </div>

        <div className="f-col">
          <h4>Loja</h4>
          <Link to="/catalogo">Todos os produtos</Link>
          {categories.slice(0, 5).map((c) => <Link key={c.id} to={`/catalogo?cat=${c.id}`}>{c.label}</Link>)}
          <Link to="/assistencia">Assistência técnica</Link>
        </div>

        <div className="f-col">
          <h4>Atendimento</h4>
          <a href={wa} target="_blank" rel="noreferrer">💬 WhatsApp</a>
          {settings.email && <a href={`mailto:${settings.email}`}>✉️ {settings.email}</a>}
          {settings.horario && <span>🕒 {settings.horario}</span>}
          {settings.endereco && <span>📍 {settings.endereco}</span>}
          {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer">📷 Instagram</a>}
        </div>

        <div className="f-col">
          <h4>Pagamento</h4>
          <span>💳 Cartão em até 21x</span>
          <span>💵 À vista (dinheiro ou Pix)</span>
          <span>🚚 Entrega no mesmo dia em Aracoiaba</span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} {settings.nomeLoja || "Arlancell"}. Todos os direitos reservados.</span>
          <Link to="/admin" className="f-admin">Área administrativa</Link>
        </div>
      </div>
    </footer>
  );
}
