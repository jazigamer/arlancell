import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function VideoWidget() {
  const { settings } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Só mostra se tiver vídeo E se não for a URL padrão de mentirinha
  if (!settings.videoUrl || settings.videoUrl.includes("dQw4w9WgXcQ")) return null;

  return (
    <>
      <div className={`video-widget-mini ${isOpen ? "hidden" : ""}`} onClick={() => setIsOpen(true)}>
        <div className="video-mini-header">
          <span>🎬 Anúncio da Semana</span>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>✕</button>
        </div>
        <div className="video-mini-thumb">
          {/* Fundo escuro elegante. Não tenta mais puxar thumb quebrada */}
          <div className="video-placeholder">
             <div className="play-btn">▶</div>
          </div>
        </div>
        <div className="video-mini-footer">
          <strong>{settings.videoTitulo || "Veja o vídeo"}</strong>
          <small>Clique para expandir</small>
        </div>
      </div>

      {isOpen && (
        <div className="video-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h3>{settings.videoTitulo}</h3>
              <button onClick={() => setIsOpen(false)}>✕ Fechar</button>
            </div>
            <div className="video-modal-iframe">
              <iframe 
                src={settings.videoUrl} 
                title="Anúncio" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-modal-footer">
              <p>{settings.videoSubtitulo}</p>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="btn-primary">
                Comprar pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
