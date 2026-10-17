import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatBRL } from "../utils/format.js";

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.id === Number(id));
  const { addItem, settings } = useCart();
  
  const [imgIdx, setImgIdx] = useState(0);
  const [cep, setCep] = useState("");
  const [freteMsg, setFreteMsg] = useState(null);
  const [freteTipo, setFreteTipo] = useState(""); 

  if (!product) return <div className="container section"><h1>Produto não encontrado</h1><Link to="/catalogo" className="btn-primary">Voltar</Link></div>;

  const discount = product.oldPrice ? Math.round(100 - (product.price / product.oldPrice) * 100) : 0;
  const imgs = product.images?.length ? product.images : [product.image];

  function calcFrete() {
    const num = cep.replace(/\D/g, "");
    if (num.length !== 8) { 
      setFreteMsg("Ops, CEP inválido. Confira os 8 números e tente de novo."); 
      setFreteTipo("erro");
      return; 
    }

    if (num === "62750000") {
      setFreteTipo("local");
      if (product.freeShipping) {
        setFreteMsg("Boa notícia! Você é de Aracoiaba: a entrega é GRÁTIS e chega hoje mesmo. 🚀");
      } else {
        setFreteMsg("Você é de Aracoiaba! Entregamos hoje. A taxa de entrega é calculada direto no WhatsApp.");
      }
    } else {
      setFreteTipo("externo");
      setFreteMsg("Para outras cidades, o frete é sob consulta. Chama a gente no WhatsApp que fazemos o cálculo certinho.");
    }
  }

  const msgWhats = `Olá! Quero saber o valor do frete para o CEP *${cep}* do produto *${product.name}*.`;

  return (
    <section className="container section product-detail-page">
      <div className="breadcrumb">
        <Link to="/">Início</Link> <span className="sep">/</span> 
        <Link to="/catalogo">Catálogo</Link> <span className="sep">/</span> 
        <span className="current">{product.name}</span>
      </div>

      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="main-image-box">
            {discount > 0 && <span className="badge-discount">-{discount}%</span>}
            <img src={imgs[imgIdx]} alt={product.name} />
          </div>
          {imgs.length > 1 && (
            <div className="thumbnails">
              {imgs.map((img, i) => (
                <button key={i} className={`thumb ${i === imgIdx ? "active" : ""}`} onClick={() => setImgIdx(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          {product.brand && <span className="brand-tag">{product.brand}</span>}
          <h1>{product.name}</h1>
          <div className="rating">⭐⭐⭐⭐⭐ <span>(24 avaliações)</span></div>
          
          <div className="price-box">
            {product.oldPrice && <span className="old-price">{formatBRL(product.oldPrice)}</span>}
            <span className="current-price">{formatBRL(product.price)}</span>
            <span className="installments">💳 Parcelamos em até 21x no cartão</span>
          </div>

          {/* GARANTIA DE PREÇO (Aparece apenas se estiver marcado no Admin) */}
          {product.priceGuarantee && (
            <div className="price-guarantee">
              <span>🏆</span>
              <div>
                <strong>A menor taxa de Aracoiaba!</strong>
                <p>Cobrimos qualquer oferta de outra loja. Se achar mais barato, nós igualamos.</p>
              </div>
            </div>
          )}

          <div className="payment-methods">
            <span>💳 Cartão de Crédito</span>
            <span>💵 À vista (Dinheiro/Pix)</span>
          </div>

          <p className="description">{product.description}</p>

          {product.specs && (
            <div className="specs-box">
              <h4>Especificações:</h4>
              <ul>
                {product.specs.map((s, i) => <li key={i}>✓ {s}</li>)}
              </ul>
            </div>
          )}

          <div className="freight-calc">
            <h4>Calcular Frete e Prazo</h4>
            <div className="cep-input-group">
              <input placeholder="Digite seu CEP (ex: 62750-000)" value={cep} onChange={(e) => setCep(e.target.value)} maxLength={9} />
              <button className="btn-outline" onClick={calcFrete}>Calcular</button>
            </div>
            
            {freteMsg && (
              <div className={`freight-result-box ${freteTipo}`}>
                <p>{freteMsg}</p>
                {(freteTipo === "externo" || (freteTipo === "local" && !product.freeShipping)) && (
                  <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msgWhats)}`} target="_blank" rel="noreferrer" className="btn-whatsapp-small">
                    💬 Consultar Frete no WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button className="btn-buy-large" onClick={() => addItem(product)}>
              🛒 Adicionar ao Carrinho
            </button>
            <a className="btn-whatsapp" href={`https://wa.me/${settings.whatsapp}?text=Tenho%20interesse%20no%20${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer">
              💬 Comprar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

