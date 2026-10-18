import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext.jsx";

const cuponsParaTexto = (c) => Object.entries(c || {}).map(([k, v]) => `${k}=${v}`).join("\n");

export default function AdminSettings() {
  const { settings, settingsLoaded, updateSettings } = useCart();
  const [form, setForm] = useState(settings);
  const [cuponsTxt, setCuponsTxt] = useState(cuponsParaTexto(settings.cupons));
  const [saving, setSaving] = useState(false);

  // Quando as configurações chegam do banco, preenche o formulário
  useEffect(() => {
    setForm(settings);
    setCuponsTxt(cuponsParaTexto(settings.cupons));
  }, [settings]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function salvar(e) {
    e.preventDefault();
    if (!settingsLoaded) return;
    const cupons = {};
    cuponsTxt.split("\n").forEach((linha) => {
      const [k, v] = linha.split("=").map((s) => s.trim());
      if (k && v) cupons[k.toUpperCase()] = Number(v);
    });
    setSaving(true);
    try {
      await updateSettings({ ...form, cupons });
      alert("✅ Configurações salvas! Já valem para todos os clientes.");
    } catch (err) {
      alert("❌ Não foi possível salvar:\n" + err.message);
    }
    setSaving(false);
  }

  return (
    <div className="admin-page">
      <h1>⚙️ Configurações</h1>
      <form className="admin-form" onSubmit={salvar}>
        <h3>🖼️ Banner da Home</h3>
        <label>Título<input value={form.bannerTitle || ""} onChange={set("bannerTitle")} /></label>
        <label>Subtítulo<input value={form.bannerSubtitle || ""} onChange={set("bannerSubtitle")} /></label>
        <div className="form-row">
          <label>Preço (texto)<input value={form.bannerPrice || ""} onChange={set("bannerPrice")} placeholder="R$ 6.999,00" /></label>
          <label>URL da imagem<input value={form.bannerImage || ""} onChange={set("bannerImage")} placeholder="https://..." /></label>
        </div>
        <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #eee" }} />

        <h3>🎬 Anúncio da Semana (Vídeo)</h3>
        <label>URL do Vídeo (YouTube Embed)<input value={form.videoUrl || ""} onChange={set("videoUrl")} placeholder="https://www.youtube.com/embed/..." /></label>
        <label>Título do Vídeo<input value={form.videoTitulo || ""} onChange={set("videoTitulo")} /></label>
        <label>Subtítulo do Vídeo<input value={form.videoSubtitulo || ""} onChange={set("videoSubtitulo")} /></label>
        <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #eee" }} />

        <h3>🏪 Loja</h3>
        <label>Nome da loja<input value={form.nomeLoja || ""} onChange={set("nomeLoja")} /></label>
        <div className="form-row">
          <label>WhatsApp<input value={form.whatsapp || ""} onChange={set("whatsapp")} /></label>
          <label>E-mail<input value={form.email || ""} onChange={set("email")} /></label>
        </div>
        <label>Frete grátis acima de (R$)<input type="number" value={form.freteGratisAcima ?? 0} onChange={(e) => setForm({ ...form, freteGratisAcima: Number(e.target.value) })} /></label>

        <h3>🎟️ Cupons</h3>
        <textarea rows="3" value={cuponsTxt} onChange={(e) => setCuponsTxt(e.target.value)} placeholder="CODIGO=0.10" />

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving || !settingsLoaded}>
            {saving ? "Salvando..." : "💾 Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
