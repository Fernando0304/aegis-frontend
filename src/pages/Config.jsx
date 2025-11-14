import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Config() {
  const [usuario, setUsuario] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
  });

  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/users/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuario(res.data);
      setForm((prev) => ({
        ...prev,
        nome: res.data.nome,
        email: res.data.email,
      }));
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    }
  }

  async function salvarAlteracoes() {
    try {
      setMensagem("");

      const token = localStorage.getItem("token");

      const res = await api.put(
        "/users/update",
        {
          nome: form.nome,
          email: form.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (form.senhaAtual && form.novaSenha) {
        await api.put(
          "/users/update-password",
          {
            senhaAtual: form.senhaAtual,
            novaSenha: form.novaSenha,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setMensagem("Alterações salvas com sucesso!");

      carregarUsuario();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setMensagem("Erro ao salvar alterações.");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <Sidebar usuario={usuario} />

      <div className="flex-1 ml-64">
        <Navbar usuario={usuario} />

        <main className="p-10 mt-20 max-w-2xl mx-auto">

          <h1 className="text-3xl font-bold mb-8">Configurações da Conta</h1>

          <div className="bg-[#111827] border border-gray-700 p-8 rounded-xl">

            {/* NOME */}
            <label className="block text-gray-300 mb-1">Nome</label>
            <input
              type="text"
              className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-4"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            {/* EMAIL */}
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-4"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {/* SENHA ATUAL */}
            <label className="block text-gray-300 mb-1">Senha Atual</label>
            <input
              type="password"
              className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-4"
              placeholder="Deixe vazio para não alterar"
              value={form.senhaAtual}
              onChange={(e) => setForm({ ...form, senhaAtual: e.target.value })}
            />

            {/* NOVA SENHA */}
            <label className="block text-gray-300 mb-1">Nova Senha</label>
            <input
              type="password"
              className="w-full bg-[#0d1117] border border-gray-700 p-2 rounded mb-6"
              placeholder="Deixe vazio para não alterar"
              value={form.novaSenha}
              onChange={(e) => setForm({ ...form, novaSenha: e.target.value })}
            />

            {/* BOTÃO SALVAR */}
            <button
              onClick={salvarAlteracoes}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-semibold"
            >
              Salvar Alterações
            </button>

            {mensagem && (
              <p className="text-center text-sm text-gray-300 mt-4">
                {mensagem}
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
