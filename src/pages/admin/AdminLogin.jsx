import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/auth.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      await auth.login(email, senha);
      nav("/admin");
    } catch (err) {
      setErro("E-mail ou senha incorretos.");
    }
    setLoading(false);
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <h1><span className="logo-orange">Arlan</span><span className="logo-gold">cell</span> Admin</h1>
        <p>Acesso restrito</p>
        
        <label>E-mail</label>
        <input type="email" placeholder="admin@arlancell.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        
        <label>Senha</label>
        <input type="password" placeholder="Sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        
        {erro && <span className="erro">{erro}</span>}
        
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar no Painel"}
        </button>
      </form>
    </div>
  );
}
