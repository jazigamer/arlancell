import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext.jsx";
import { fileToDataURL } from "../../services/imageUpload.js";

const vazio = { name: "", category: "celulares", brand: "", price: 0, oldPrice: 0, images: [], stock: 0, freeShipping: false, featured: false, priceGuarantee: false, badge: "", description: "", specs: [] };

export default function AdminProductForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const { products, add, update, categories } = useProducts();
  const [form, setForm] = useState(vazio);
  const [specsTxt, setSpecsTxt] = useState("");
  const [loadingImg, setLoadingImg] = useState(false);
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (id) {
      const p = products.find((x) => x.id === Number(id));
      if (p) {
        setForm({ ...vazio, ...p, images: p.images?.length ? p.images : (p.image ? [p.image] : []) });
        setSpecsTxt((p.specs || []).join("\n"));
      }
    }
  }, [id, products]);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleFiles(files) {
    if (!files?.length) return;
    setLoadingImg(true);
    const novas = [];
    for (const f of Array.from(files)) {
      try { novas.push(await fileToDataURL(f)); } catch {}
    }
    setForm((f) => ({ ...f, images: [...f.images, ...novas] }));
    setLoadingImg(false);
  }

  function addUrl() {
    const url = prompt("Cole a URL da imagem (https://...)");
    if (url?.startsWith("http")) setForm((f) => ({ ...f, images: [...f.images, url] }));
  }
  function removerImg(i) { setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) })); }
  function moverPrincipal(i) {
    if (i === 0) return;
    setForm((f) => {
      const arr = [...f.images];
      const [img] = arr.splice(i, 1);
      return { ...f, images: [img, ...arr] };
    });
  }

  function submit(e) {
    e.preventDefault();
    if (form.images.length === 0) { alert("Adicione pelo menos uma foto!"); return; }
    const payload = {
      ...form,
      price: Number(form.price), oldPrice: Number(form.oldPrice) || null,
      stock: Number(form.stock),
      image: form.images[0],
      specs: specsTxt.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    if (id) update(Number(id), payload); else add(payload);
    nav("/admin/produtos");
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{id ? "Editar produto" : "Novo produto"}</h1>
        <button type="button" className="btn-ghost dark" onClick={() => nav("/admin/produtos")}>Voltar</button>
      </div>

      <form className="admin-form" onSubmit={submit}>
        <h3>📸 Fotos do produto</h3>
        <p className="muted">A primeira foto é a principal. Você pode adicionar várias (iPhone merece galeria completa! 😎)</p>

        {form.images.length > 0 && (
          <div className="img-gallery">
            {form.images.map((img, i) => (
              <div key={i} className={`img-thumb ${i === 0 ? "main" : ""}`}>
                <img src={img} alt="" />
                {i === 0 && <span className="img-main-badge">Principal</span>}
                <div className="img-actions">
                  {i !== 0 && <button type="button" onClick={() => moverPrincipal(i)} title="Tornar principal">⭐</button>}
                  <button type="button" onClick={() => removerImg(i)} title="Remover">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="upload-buttons">
          <button type="button" className="btn-upload" onClick={() => galleryRef.current?.click()}>
            🖼️ Escolher da galeria
          </button>
          <button type="button" className="btn-upload camera" onClick={() => cameraRef.current?.click()}>
            📷 Tirar foto agora
          </button>
          <button type="button" className="btn-upload url" onClick={addUrl}>
            🔗 Usar URL
          </button>
        </div>

        <input ref={galleryRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => handleFiles(e.target.files)} />

        {loadingImg && <p className="muted">⏳ Processando imagens...</p>}

        <h3>📝 Informações</h3>
        <label>Nome do produto<input value={form.name} onChange={(e) => set("name", e.target.value)} required /></label>
        <div className="form-row">
          <label>Categoria
            <select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label>Marca<input value={form.brand} onChange={(e) => set("brand", e.target.value)} /></label>
        </div>
        <div className="form-row">
          <label>Preço (R$)<input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required /></label>
          <label>Preço antigo (riscado)<input type="number" step="0.01" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} /></label>
        </div>
        <div className="form-row">
          <label>Estoque<input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} /></label>
          <label>Selo (opcional)<input value={form.badge || ""} onChange={(e) => set("badge", e.target.value)} placeholder="Oferta, Novo, Premium..." /></label>
        </div>
        <label>Descrição<textarea rows="3" value={form.description} onChange={(e) => set("description", e.target.value)} /></label>
        <label>Especificações (uma por linha)<textarea rows="5" value={specsTxt} onChange={(e) => setSpecsTxt(e.target.value)} /></label>
        <div className="check-row">
          <label><input type="checkbox" checked={form.freeShipping} onChange={(e) => set("freeShipping", e.target.checked)} /> Frete grátis</label>
          <label><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Destaque na home</label>
          <label style={{ color: 'var(--gold)', fontWeight: 'bold' }}><input type="checkbox" checked={form.priceGuarantee || false} onChange={(e) => set("priceGuarantee", e.target.checked)} /> 🏆 Garantia de Preço (Apenas para produtos caros)</label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">💾 Salvar produto</button>
          <button type="button" className="btn-ghost dark" onClick={() => nav("/admin/produtos")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}


