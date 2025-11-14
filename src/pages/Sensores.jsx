import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import SensorModal from "../components/SensorModal";

export default function Sensores() {
  const [sensores, setSensores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sensorEditando, setSensorEditando] = useState(null);

  useEffect(() => {
    carregarSensores();
    const intervalo = setInterval(carregarSensores, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const carregarSensores = async () => {
    try {
      const res = await api.get("/sensores");
      setSensores(res.data);
    } catch (err) {
      console.error("Erro ao buscar sensores:", err);
    }
  };

  const abrirNovo = () => {
    setSensorEditando(null);
    setModalOpen(true);
  };

  const abrirEdicao = (sensor) => {
    setSensorEditando(sensor);
    setModalOpen(true);
  };

  const salvarSensor = async (dados) => {
    try {
      if (sensorEditando) {
        // EDITAR
        await api.put(`/sensores/${sensorEditando._id}`, dados);
      } else {
        // NOVO
        await api.post("/sensores", dados);
      }

      setModalOpen(false);
      carregarSensores();
    } catch (err) {
      console.error("Erro ao salvar sensor:", err);
    }
  };

  const deletar = async (id) => {
    if (!confirm("Deseja realmente excluir este sensor?")) return;

    try {
      await api.delete(`/sensores/${id}`);
      carregarSensores();
    } catch (err) {
      console.error("Erro ao excluir sensor:", err);
    }
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-2xl font-bold text-white mb-6">Sensores</h1>

      {/* Botão adicionar */}
      <button
        onClick={abrirNovo}
        className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        + Adicionar Sensor
      </button>

      {/* Tabela */}
      <div className="bg-[#0b1220] border border-gray-700 rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="py-3 px-4">Nome</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Atualização</th>
                <th className="py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {sensores.map((s) => (
                <tr key={s._id} className="border-t border-gray-800">
                  <td className="py-4 px-4">{s.nome}</td>
                  <td className="py-4 px-4">{s.valor} {s.unidade}</td>
                  <td className="py-4 px-4">{new Date(s.timestamp).toLocaleString()}</td>
                  <td className="py-4 px-4 flex gap-3">
                    <button
                      onClick={() => abrirEdicao(s)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deletar(s._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                    >
                      Excluir
                    </button>
                    <Link
                      to={`/sensores/${encodeURIComponent(s.nome)}`}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white"
                    >
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <SensorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={salvarSensor}
        sensor={sensorEditando}
      />
    </div>
  );
}
