import { Link } from "react-router-dom";
export default function NotFound() {
  return <section className="container section not-found"><h1>404</h1><p>Página não encontrada 😕</p><Link to="/" className="btn-primary">Voltar</Link></section>;
}
