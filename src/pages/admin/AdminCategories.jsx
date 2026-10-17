import { useState } from "react";
import { useProducts } from "../../context/ProductsContext.jsx";
export default function AdminCategories() {
  const { categories, addCategory, updateCategory, removeCategory } = useProducts();
  const [novo, setNovo] = useState({ label: "", icon: "🏷️" });
  function adicionar(e) {
    e.preventDefault();
    if (!novo.label) return;
    addCategory(novo);
    setNovo({ label: "", icon: "🏷️" });
  }
  return (
    <div className="admin-page">
      <h1>Categorias ({categories.length})</h1>
      <form className="admin-form" onSubmit={adicionar} style={{ marginBottom: 24 }}>
        <h3>Nova categoria</h3>
        <div className="form-row">
          <label>Nome<input value={novo.label} onChange={(e) => setNovo({ ...novo, label: e.target.value })} required /></label>
          <label>Emoji<input value={novo.icon} onChange={(e) => setNovo({ ...novo, icon: e.target.value })} maxLength={2} /></label>
        </div>
        <button className="btn-primary" type="submit">+ Adicionar</button>
      </form>
      <table className="admin-table">
        <thead><tr><th>Emoji</th><th>Nome</th><th>ID</th><th></th></tr></thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td style={{ fontSize: "1.5rem" }}>{c.icon}</td>
              <td><input defaultValue={c.label} onBlur={(e) => updateCategory(c.id, { label: e.target.value })} /></td>
              <td><code>{c.id}</code></td>
              <td><button className="btn-small danger" onClick={() => { if (confirm("Excluir?")) removeCategory(c.id); }}>🗑</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
