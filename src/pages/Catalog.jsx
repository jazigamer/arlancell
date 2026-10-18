import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductSkeleton from "../components/ProductSkeleton.jsx";

export default function Catalog() {
  const { products, categories, loading } = useProducts();
  const [params] = useSearchParams();
  const [cat, setCat] = useState(params.get("cat") || "todos");
  const [q, setQ] = useState(params.get("q") || "");
  const [sort, setSort] = useState("relevancia");
  const [priceMax, setPriceMax] = useState(10000);

  useEffect(() => {
    setCat(params.get("cat") || "todos");
    setQ(params.get("q") || "");
  }, [params]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => (cat === "todos" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()) && p.price <= priceMax);
    if (sort === "menor") list.sort((a, b) => a.price - b.price);
    if (sort === "maior") list.sort((a, b) => b.price - a.price);
    if (sort === "nome") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, cat, q, sort, priceMax]);

  return (
    <section className="container section">
      <div className="catalog-header">
        <h1>Catálogo</h1>
      </div>
      
      <div className="catalog-controls">
        <div className="catalog-search-row">
          <input className="search-input" placeholder="🔍 Buscar produto..." value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="catalog-sort">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="relevancia">Ordenar por: Relevância</option>
              <option value="menor">Menor Preço</option>
              <option value="maior">Maior Preço</option>
              <option value="nome">Nome A-Z</option>
            </select>
          </div>
        </div>

        <div className="catalog-filters">
          <div className="chips">
            <button className={`cat-chip ${cat === "todos" ? "active" : ""}`} onClick={() => setCat("todos")}>Todos</button>
            {categories.map((c) => <button key={c.id} className={`cat-chip ${cat === c.id ? "active" : ""}`} onClick={() => setCat(c.id)}>{c.icon} {c.label}</button>)}
          </div>
          <div className="price-filter">
            <span>Até R$ {priceMax}</span>
            <input type="range" min="100" max="10000" step="100" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {!loading && <p className="results-count">{filtered.length} produto(s) encontrado(s)</p>}
      
      {loading ? (
        <ProductSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <p className="empty">😕 Nenhum produto encontrado.</p>
      ) : (
        <div className="grid">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </section>
  );
}
