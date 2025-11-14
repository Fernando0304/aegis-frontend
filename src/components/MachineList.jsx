import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function MachineList() {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/maquinas");
        setMachines(res.data);
      } catch (err) {
        console.error("Erro ao carregar máquinas:", err);
      }
    }

    load();
  }, []);

  const statusColor = (status) => {
    if (status === "critico") return "bg-red-500";
    if (status === "alerta") return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="p-4 text-white">
      <input
        type="text"
        placeholder="Buscar máquinas..."
        className="w-full mb-4 bg-[#0d1117] p-2 rounded border border-gray-700"
      />

      <h3 className="text-sm text-gray-400 mb-2">Máquinas</h3>

      <div className="space-y-2">
        {machines.map((m) => (
          <Link
            key={m._id}
            to={`/maquinas/${m._id}`}
            className="flex items-center justify-between bg-[#111827] hover:bg-[#1a2332] p-3 rounded-lg border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${statusColor(m.status)}`}></span>
              <span>{m.nome}</span>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full ${
                m.status === "critico"
                  ? "bg-red-600"
                  : m.status === "alerta"
                  ? "bg-yellow-500 text-black"
                  : "bg-green-600"
              }`}
            >
              {m.status === "critico"
                ? "Crítico"
                : m.status === "alerta"
                ? "Alerta"
                : "OK"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
