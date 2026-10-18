import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import { formatBRL } from "../../utils/format.js";
export default function AdminProducts() {
  const { products, remove, removeMany, categories, loadError } = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("todos");
  const [selected, setSelected] = useState([]);
  const filtered = useMemo(() => products.filter((p) => (cat === "todos" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())), [products, q, cat]);

  function toggle(id) { setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]); }
  function toggleAll() { setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id)); }
  async function excluirSelecionados() {
    if (!confirm(`Excluir ${selected.length} produto(s)?`)) return;
    const ok = await removeMany(selected);
    if (ok) setSelected([]);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Produtos ({filtered.length})</h1>
        <Link to="/admin/produtos/novo" className="btn-primary">+ Novo produto</Link>
      </div>

      {loadError && <p className="erro">{loadError}</p>}

      <div className="admin-filters">
        <input placeholder="🔍 Buscar produto..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="todos">Todas categorias</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        {selected.length > 0 && (
          <button className="btn-small danger" onClick={excluirSelecionados}>🗑 Excluir {selected.length} selecionado(s)</button>
        )}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
            <th>Foto</th><th>Nome</th><th>Preço</th><th>Estoque</th><th>Categoria</th><th>Fotos</th><th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className={selected.includes(p.id) ? "row-selected" : ""}>
              <td><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} /></td>
              <td><img src={p.image} alt="" className="admin-thumb" /></td>
              <td><strong>{p.name}</strong><br /><small>{p.brand}</small></td>
              <td>{formatBRL(p.price)}</td>
              <td>{p.stock <= 3 ? <span className="stock-low">{p.stock} ⚠️</span> : p.stock}</td>
              <td>{categories.find((c) => c.id === p.category)?.label || p.category}</td>
              <td>{p.images?.length || 1} 📷</td>
              <td className="admin-actions">
                <Link to={`/admin/produtos/editar/${p.id}`} className="btn-small">✏️</Link>
                <button className="btn-small danger" onClick={() => { if (confirm(`Excluir ${p.name}?`)) remove(p.id); }}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
