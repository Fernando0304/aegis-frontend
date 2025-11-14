import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [forcaSenha, setForcaSenha] = useState(0);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // -----------------------------------
  //          FORÇA DA SENHA
  // -----------------------------------
  const verificarForcaSenha = (senhaDigitada) => {
    let score = 0;

    if (senhaDigitada.length >= 6) score++;
    if (/[A-Z]/.test(senhaDigitada)) score++;
    if (/[0-9]/.test(senhaDigitada)) score++;
    if (/[^A-Za-z0-9]/.test(senhaDigitada)) score++;

    setForcaSenha(score);
  };

  // -----------------------------------
  //            REGISTRO
  // -----------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setMensagem("❌ As senhas não coincidem.");
      return;
    }

    try {
      const res = await api.post("/users/register", {
        nome,
        email,
        senha,
        confirmarSenha,
      });

      setMensagem("✅ Usuário registrado com sucesso! Redirecionando...");
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (err) {
      console.error("Erro ao registrar:", err);
      setMensagem("❌ Erro ao registrar usuário.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-xl shadow-xl w-96 text-white"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Criar Conta
        </h1>

        {/* NOME */}
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700"
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700"
          required
        />

        {/* SENHA */}
        <div className="relative">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              verificarForcaSenha(e.target.value);
            }}
            className="w-full p-3 mb-1 rounded bg-gray-700 pr-12"
            required
          />

          {/* BOTÃO MOSTRAR/OCULTAR SENHA */}
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
          >
            {mostrarSenha ? "🙈" : "👁️"}
          </button>
        </div>

        {/* DICAS DE SENHA */}
        <p className="text-xs text-gray-400 mb-2">
          A senha deve conter:<br />
          • Mínimo 6 caracteres<br />
          • Letra maiúscula<br />
          • Número<br />
          • Símbolo (!, @, #, etc.)
        </p>

        {/* BARRA DE FORÇA */}
        <div className="h-2 w-full bg-gray-600 rounded mb-4">
          <div
            className={`h-full rounded transition-all ${
              forcaSenha === 0
                ? "w-0"
                : forcaSenha === 1
                ? "w-1/4 bg-red-500"
                : forcaSenha === 2
                ? "w-2/4 bg-orange-500"
                : forcaSenha === 3
                ? "w-3/4 bg-yellow-400"
                : "w-full bg-green-500"
            }`}
          ></div>
        </div>

        {/* CONFIRMAR SENHA */}
        <div className="relative">
          <input
            type={mostrarConfirmarSenha ? "text" : "password"}
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full p-3 mb-6 rounded bg-gray-700 pr-12"
            required
          />

          {/* BOTÃO MOSTRAR/OCULTAR CONFIRMAR SENHA */}
          <button
            type="button"
            onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
          >
            {mostrarConfirmarSenha ? "🙈" : "👁️"}
          </button>
        </div>

        {/* BOTÃO DESABILITADO SE SENHA FOR FRACA */}
        <button
          type="submit"
          disabled={forcaSenha < 3}
          className={`w-full p-3 rounded font-semibold transition-colors
            ${
              forcaSenha < 3
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }
          `}
        >
          Criar Conta
        </button>

        {/* MENSAGEM DE ERRO OU SUCESSO */}
        {mensagem && (
          <p className="mt-4 text-center text-sm text-gray-300">{mensagem}</p>
        )}

        {/* LINK PARA LOGIN */}
        <p className="mt-4 text-center text-sm">
          Já tem conta?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}
