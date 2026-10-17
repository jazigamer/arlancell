import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatBRL } from "../utils/format.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = product.oldPrice ? Math.round(100 - (product.price / product.oldPrice) * 100) : 0;
  
  return (
    <article className="product-card">
      <Link to={`/produto/${product.id}`} className="product-image-link">
        <div className="product-image">
          {discount > 0 && <span className="discount">-{discount}%</span>}
          <img src={product.image} alt={product.name} loading="lazy" />
          {product.images?.length > 1 && <span className="photo-count">📷 {product.images.length}</span>}
        </div>
      </Link>
      <div className="product-body">
        {product.brand && <span className="product-brand">{product.brand}</span>}
        <Link to={`/produto/${product.id}`} className="product-title"><h3>{product.name}</h3></Link>
        <div className="product-rating">⭐⭐⭐⭐⭐ <span className="text-gold">4.8</span></div>
        
        <div className="price-row">
          {product.oldPrice && <span className="old-price">{formatBRL(product.oldPrice)}</span>}
          <span className="price">{formatBRL(product.price)}</span>
        </div>
        
        {/* Agora só um aviso limpo, sem simulação */}
        <span className="parcelas">Parcelamos em até 21x</span>
        {product.freeShipping && <span className="free-ship">🚚 Frete grátis</span>}
        
        <button className="btn-buy" onClick={() => addItem(product)}>
          <span>🛒</span> Adicionar
        </button>
      </div>
    </article>
  );
}
