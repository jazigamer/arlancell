import { useState, useEffect } from "react";
import { listLeads, removeLead, clearLeads } from "../../services/leads.js";
export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try { setLeads(await listLeads()); }
    catch (e) { alert("Erro ao carregar leads:\n" + e.message); }
    setLoading(false);
  }
  useEffect(() => { carregar(); }, []);

  function copiarJSON() { navigator.clipboard.writeText(JSON.stringify(leads, null, 2)); alert("✅ JSON copiado!"); }
  function copiarCSV() {
    const header = "nome,email,telefone,origem,createdAt";
    const rows = leads.map((l) => [l.nome || "", l.email || "", l.telefone || "", l.origem || "", l.createdAt].map((v) => `"${v}"`).join(","));
    navigator.clipboard.writeText([header, ...rows].join("\n"));
    alert("✅ CSV copiado!");
  }
  async function remover(id) {
    if (!confirm("Remover?")) return;
    try { await removeLead(id); await carregar(); } catch (e) { alert("Erro ao remover:\n" + e.message); }
  }
  async function limpar() {
    if (!confirm("Apagar TODOS?")) return;
    try { await clearLeads(); await carregar(); } catch (e) { alert("Erro ao apagar:\n" + e.message); }
  }
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Leads ({leads.length})</h1>
        <div className="admin-actions">
          <button className="btn-small" onClick={copiarCSV}>📋 CSV</button>
          <button className="btn-small" onClick={copiarJSON}>📋 JSON</button>
          <button className="btn-small danger" onClick={limpar}>🗑 Limpar</button>
        </div>
      </div>
      {loading ? <p className="muted">Carregando...</p> : leads.length === 0 ? <p className="muted">Nenhum lead ainda.</p> : (
        <table className="admin-table">
          <thead><tr><th>Nome</th><th>E-mail</th><th>WhatsApp</th><th>Origem</th><th>Data</th><th></th></tr></thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td>{l.nome || "—"}</td><td>{l.email}</td><td>{l.telefone || "—"}</td><td>{l.origem}</td>
                <td>{new Date(l.createdAt).toLocaleString("pt-BR")}</td>
                <td><button className="btn-small danger" onClick={() => remover(l.id)}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
