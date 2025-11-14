// pages/SensorDetalhe.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import TemperatureChart from "../components/TemperatureChart";

export default function SensorDetalhe() {
  const { nome } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    carregar();
    const interval = setInterval(carregar, 5000);
    return () => clearInterval(interval);
  }, [nome]);

  const carregar = async () => {
    try {
      const res = await api.get(`/sensores/${encodeURIComponent(nome)}`);
      setData({
        nome: nome,
        leituras: res.data || [],
      });
    } catch (err) {
      console.error("Erro carregar detalhe:", err);
    }
  };

  if (!data)
    return <div className="p-10 text-gray-400">Carregando...</div>;

  const leituras = data.leituras || [];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Sensor: {data.nome}
      </h1>

      {/* GRÁFICO */}
      <div className="bg-[#0b1220] border border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-white">
          Gráfico – Últimas Leituras
        </h2>
        <TemperatureChart data={leituras} />
      </div>

      {/* LISTA DE LEITURAS */}
      <div className="bg-[#0b1220] border border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3 text-white">
          Últimas Leituras
        </h2>

        {leituras.length === 0 ? (
          <p className="text-gray-400">Nenhuma leitura registrada.</p>
        ) : (
          <ul className="space-y-3 text-gray-200">
            {leituras.map((l) => (
              <li key={l._id} className="border-b border-gray-800 pb-2">
                <div className="font-medium">
                  {l.valor} {l.unidade || "°C"}
                </div>
                <div className="text-gray-400 text-sm">
                  {new Date(l.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
