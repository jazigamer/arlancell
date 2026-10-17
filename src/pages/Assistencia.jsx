import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function Assistencia() {
  const { settings } = useCart();
  const [form, setForm] = useState({ nome: "", modelo: "", defeito: "", cep: "" });
  const [isAracoiaba, setIsAracoiaba] = useState(false);

  function handleCep(e) {
    const val = e.target.value;
    setForm({ ...form, cep: val });
    const num = val.replace(/\D/g, "");
    setIsAracoiaba(num === "62750000");
  }

  function enviarWhats(e) {
    e.preventDefault();
    const msg = `Olá! Preciso de Assistência Técnica.\n\n*Nome:* ${form.nome}\n*Aparelho:* ${form.modelo}\n*Defeito:* ${form.defeito}\n*CEP:* ${form.cep}\n\n*Buscar em casa?* ${isAracoiaba ? "SIM (Aracoiaba)" : "Não / Outra cidade"}`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <section className="container section">
      <div className="assistencia-header">
        <h1>🔧 Assistência Técnica Especializada</h1>
        <p>Conserto de iPhone e Android com garantia e peças de qualidade.</p>
      </div>

      <div className="assistencia-grid">
        <div className="assistencia-info">
          <h2>Como funciona?</h2>
          <ul className="steps-list">
            <li><strong>1. Diagnóstico:</strong> Avaliamos o problema do seu aparelho.</li>
            <li><strong>2. Orçamento:</strong> Enviamos o valor e o prazo pelo WhatsApp.</li>
            <li><strong>3. Conserto:</strong> Usamos peças premium com garantia.</li>
            <li><strong>4. Entrega:</strong> Devolvemos o aparelho funcionando perfeitamente.</li>
          </ul>

          <div className="busca-aparelho-box">
            <h3>📍 Você mora em Aracoiaba?</h3>
            <p>Se o seu CEP for <strong>62750-000</strong>, nós <strong>buscamos o seu aparelho na sua casa</strong> sem custo!</p>
          </div>
        </div>

        <form className="assistencia-form" onSubmit={enviarWhats}>
          <h3>Solicitar Orçamento</h3>
          <label>Seu Nome<input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></label>
          <label>Modelo do Aparelho<input required placeholder="Ex: iPhone 13, Galaxy S22..." value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} /></label>
          <label>Qual o problema?<textarea required rows="3" value={form.defeito} onChange={(e) => setForm({ ...form, defeito: e.target.value })} /></label>
          
          <label>Seu CEP<input required placeholder="62750-000" value={form.cep} onChange={handleCep} maxLength={9} /></label>
          {isAracoiaba && <span className="cep-ok">✅ Elegível para buscar em casa!</span>}

          <button type="submit" className="btn-primary">Solicitar via WhatsApp</button>
        </form>
      </div>
    </section>
  );
}

