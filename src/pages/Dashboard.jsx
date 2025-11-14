// pages/Dashboard.jsx
import TemperatureChart from "../components/TemperatureChart";
import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LastAlerts from "../components/LastAlerts"; // <-- NOVA VERSÃO

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [sensores, setSensores] = useState([]);

  // -----------------------------------------
  // Carregar sensores + usuário com polling
  // -----------------------------------------
  useEffect(() => {
    async function carregar() {
      try {
        const token = localStorage.getItem("token");

        const perfil = await api.get("/users/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsuario(perfil.data);

        const resSensores = await api.get("/sensores");
        setSensores(resSensores.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    carregar(); // primeira chamada

    const intervalo = setInterval(() => {
      carregar(); // polling
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // -----------------------------------------
  // TELA
  // -----------------------------------------
  return (
    <div className="flex h-screen bg-[#0d1117] text-white">

      {/* SIDEBAR */}
      <Sidebar usuario={usuario} />

      <div className="flex-1 ml-64">

        {/* NAVBAR */}
        <Navbar usuario={usuario} />

        {/* CONTEÚDO */}
        <main className="p-10 mt-20">

          {/* ------------------------------------ */}
          {/* CARDS DO TOPO */}
          {/* ------------------------------------ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

            <StatCard
              title="Máquinas Online"
              value={sensores.length}
              subtitle="Total online"
              color="#22c55e"
            />

            <StatCard
              title="Alertas"
              value={0}
              subtitle="Últimas 24h"
              color="#facc15"
            />

            <StatCard
              title="Críticos"
              value={0}
              subtitle="Ações urgentes"
              color="#ef4444"
            />

            <StatCard
              title="Disponibilidade"
              value="0%"
              subtitle="Último mês"
              color="#6366f1"
            />

          </div>

          {/* ------------------------------------ */}
          {/* GRÁFICO DE TEMPERATURA */}
          {/* ------------------------------------ */}
          <div className="mt-10">
            <TemperatureChart data={sensores} />
          </div>

          {/* ------------------------------------ */}
          {/* ÚLTIMOS ALERTAS (novo estilo) */}
          {/* ------------------------------------ */}
          <div className="mt-10">
            <LastAlerts />
          </div>

        </main>
      </div>
    </div>
  );
}
