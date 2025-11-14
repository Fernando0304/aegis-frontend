import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

// função auxiliar para transformar timestamp em "há x min"
function tempoRelativo(timestamp) {
  const diff = (Date.now() - new Date(timestamp)) / 1000; // segundos
  if (diff < 60) return "agora";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  return `há ${Math.floor(diff / 86400)} dias`;
}

// cores dos níveis
const nivelBadge = {
  critico: "bg-red-600 text-white",
  alerta: "bg-yellow-500 text-black",
  ok: "bg-green-600 text-white",
};

export default function LastAlerts() {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    carregar();
    const interval = setInterval(carregar, 8000);
    return () => clearInterval(interval);
  }, []);

  async function carregar() {
    try {
      const token = localStorage.getItem("token");

      const resposta = await api.get("/alertas?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const lista = resposta.data.alertas || [];
      setAlertas(lista);
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
      setAlertas([]);
    }
  }

  return (
    <div className="bg-[#111827] border border-gray-700 rounded-xl p-5 shadow-md">

      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-semibold text-lg">
          Alertas Ativos (5 mais recentes)
        </h2>

        <Link
          to="/alertas"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded text-white text-sm"
        >
          🔔 Ver todos
        </Link>
      </div>

      {/* Tabela */}
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-700">
            <th className="pb-2">Máquina</th>
            <th>Sensor Violado</th>
            <th>Severidade</th>
            <th>Tempo</th>
          </tr>
        </thead>

        <tbody>
          {alertas.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-4 text-gray-500 text-sm">
                Nenhum alerta ativo.
              </td>
            </tr>
          ) : (
            alertas.map((a) => (
              <tr key={a._id} className="border-b border-gray-800 text-sm">
                <td className="py-3 text-red-400 font-medium">{a.maquina}</td>

                <td className="py-3 text-gray-200">{a.sensor}</td>

                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${nivelBadge[a.nivel]}`}>
                    {a.nivel === "critico" && "Crítica"}
                    {a.nivel === "alerta" && "Média"}
                    {a.nivel === "ok" && "OK"}
                  </span>
                </td>

                <td className="py-3 text-gray-400">{tempoRelativo(a.timestamp)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
