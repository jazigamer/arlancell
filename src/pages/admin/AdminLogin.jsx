import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/auth.js";
export default function AdminLogin() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const nav = useNavigate();
  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={(e) => { e.preventDefault(); if (auth.login(senha)) nav("/admin"); else setErro("Senha incorreta"); }}>
        <h1><span className="logo-orange">Arlan</span><span className="logo-gold">cell</span> Admin</h1>
        <p>Acesso restrito</p>
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} autoFocus />
        {erro && <span className="erro">{erro}</span>}
        <button className="btn-primary" type="submit">Entrar</button>
        <small>Senha padrão: arlan2024</small>
      </form>
    </div>
  );
}
