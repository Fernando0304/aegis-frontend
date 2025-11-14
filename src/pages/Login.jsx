import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/users/login", { email, senha });
      localStorage.setItem("token", res.data.token);
      setMensagem("✅ Login realizado com sucesso!");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

    } catch (err) {
      console.error("Erro no login:", err);
      setMensagem("❌ Email ou senha inválidos.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-96 text-white"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Login AEGIS
        </h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors p-3 rounded-lg font-semibold"
        >
          Entrar
        </button>

        {mensagem && (
          <p className="mt-4 text-center text-sm text-gray-300">{mensagem}</p>
        )}

        {/* 🔥 LINK DE CRIAR CONTA */}
        <p className="mt-4 text-center text-sm text-gray-300">
          Não tem conta?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Criar agora
          </Link>
        </p>
      </form>
    </div>
  );
}
