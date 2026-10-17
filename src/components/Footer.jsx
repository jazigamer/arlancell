export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-benefits">
        <div className="f-benefit"><span>📍</span><div><strong>Entrega Local</strong><p>Grátis* e no mesmo dia em Aracoiaba</p></div></div>
        <div className="f-benefit"><span>📦</span><div><strong>Entrega Rápida</strong><p>Para todo o Brasil via Correios</p></div></div>
        <div className="f-benefit"><span>💳</span><div><strong>Pagamento Facilitado</strong><p>Cartão em até 21x ou à vista</p></div></div>
        <div className="f-benefit"><span>🔧</span><div><strong>Assistência Técnica</strong><p>Conserto com garantia</p></div></div>
      </div>
      
      <div className="container footer-main">
        <div className="f-brand">
          <img src="/logo-full.png" alt="Arlancell" className="footer-logo-img" />
          <p style={{ marginTop: '12px' }}>© {new Date().getFullYear()} Arlancell. Todos os direitos reservados.</p>
        </div>
        <div className="f-links">
          <a href="#">Institucional</a>
          <a href="#">Dúvidas Frequentes</a>
          <a href="#">Política de Privacidade</a>
          <a href="#">Termos de Uso</a>
        </div>
        <div className="f-socials">
          <a href="#">📷</a><a href="#">📘</a><a href="#">▶️</a><a href="#">💬</a>
        </div>
      </div>
    </footer>
  );
}

