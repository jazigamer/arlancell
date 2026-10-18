import { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { storage } from "../../services/storage.js";
export default function AdminSettings() {
  const { settings, updateSettings } = useCart();
  const [form, setForm] = useState(settings);
  const [cuponsTxt, setCuponsTxt] = useState(Object.entries(settings.cupons || {}).map(([k, v]) => `${k}=${v}`).join("\n"));
  
  function salvar(e) {
    e.preventDefault();
    const cupons = {};
    cuponsTxt.split("\n").forEach((linha) => {
      const [k, v] = linha.split("=").map((s) => s.trim());
      if (k && v) cupons[k.toUpperCase()] = Number(v);
    });
    updateSettings({ ...form, cupons });
    alert("✅ Configurações salvas!");
  }
  function resetar() {
    if (!confirm("Resetar TODOS os dados?")) return;
    localStorage.clear();
    location.reload();
  }
  
  return (
    <div className="admin-page">
      <h1>⚙️ Configurações</h1>
      <form className="admin-form" onSubmit={salvar}>
        <h3>🎬 Anúncio da Semana (Vídeo)</h3>
        <label>URL do Vídeo (YouTube Embed)<input value={form.videoUrl || ""} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." /></label>
        <label>Título do Vídeo<input value={form.videoTitulo || ""} onChange={(e) => setForm({ ...form, videoTitulo: e.target.value })} /></label>
        <label>Subtítulo do Vídeo<input value={form.videoSubtitulo || ""} onChange={(e) => setForm({ ...form, videoSubtitulo: e.target.value })} /></label>
        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
        
        <h3>🏪 Loja</h3>
        <label>Nome da loja<input value={form.nomeLoja} onChange={(e) => setForm({ ...form, nomeLoja: e.target.value })} /></label>
        <div className="form-row">
          <label>WhatsApp<input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></label>
          <label>E-mail<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        </div>
        <label>Frete grátis acima de (R$)<input type="number" value={form.freteGratisAcima} onChange={(e) => setForm({ ...form, freteGratisAcima: Number(e.target.value) })} /></label>
        
        <h3>🎟️ Cupons</h3>
        <textarea rows="3" value={cuponsTxt} onChange={(e) => setCuponsTxt(e.target.value)} placeholder="CODIGO=0.10" />
        
        <h3>🔐 Segurança</h3>
        <label>Senha do admin<input type="text" value={form.senhaAdmin} onChange={(e) => setForm({ ...form, senhaAdmin: e.target.value })} /></label>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">💾 Salvar Alterações</button>
          <button type="button" className="btn-small danger" onClick={resetar}>⚠️ Resetar Sistema</button>
        </div>
      </form>
    </div>
  );
}

