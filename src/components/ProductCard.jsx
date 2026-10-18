import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatBRL } from "../utils/format.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = product.oldPrice ? Math.round(100 - (product.price / product.oldPrice) * 100) : 0;
  const stock = Number(product.stock);
  const esgotado = product.stock != null && stock <= 0;
  const ultimas = !esgotado && product.stock != null && stock > 0 && stock <= 3;

  return (
    <article className={`product-card ${esgotado ? "is-soldout" : ""}`}>
      <Link to={`/produto/${product.id}`} className="product-image-link">
        <div className="product-image">
          {discount > 0 && <span className="discount">-{discount}%</span>}
          {product.badge && <span className="product-badge">{product.badge}</span>}
          <img src={product.image} alt={product.name} loading="lazy" />
          {esgotado && <span className="soldout-overlay">Esgotado</span>}
        </div>
      </Link>
      <div className="product-body">
        {product.brand && <span className="product-brand">{product.brand}</span>}
        <Link to={`/produto/${product.id}`} className="product-title"><h3>{product.name}</h3></Link>

        <div className="price-row">
          {product.oldPrice && <span className="old-price">{formatBRL(product.oldPrice)}</span>}
          <span className="price">{formatBRL(product.price)}</span>
        </div>

        <span className="parcelas">Parcelamos em até 21x</span>
        <div className="card-tags">
          {product.freeShipping && <span className="free-ship">🚚 Frete grátis</span>}
          {ultimas && <span className="low-stock">🔥 Últimas {stock} unidades</span>}
        </div>

        <button className="btn-buy" disabled={esgotado} onClick={() => addItem(product)}>
          {esgotado ? "Indisponível" : <><span>🛒</span> Adicionar</>}
        </button>
      </div>
    </article>
  );
}
