// components/SensorModal.jsx
import { useState, useEffect } from "react";

export default function SensorModal({ open, onClose, onSave, sensor }) {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [unidade, setUnidade] = useState("°C");

  useEffect(() => {
    if (sensor) {
      setNome(sensor.nome);
      setValor(sensor.valor);
      setUnidade(sensor.unidade || "°C");
    } else {
      setNome("");
      setValor("");
      setUnidade("°C");
    }
  }, [sensor]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-[#111827] p-6 rounded-xl w-96 border border-gray-700 shadow-lg">
        
        <h2 className="text-xl font-bold text-white mb-4">
          {sensor ? "Editar Sensor" : "Novo Sensor"}
        </h2>

        <div className="space-y-3 text-white">

          <div>
            <label className="text-sm text-gray-300">Nome</label>
            <input
              className="w-full mt-1 p-2 bg-[#0b1220] border border-gray-600 rounded"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Valor inicial</label>
            <input
              type="number"
              className="w-full mt-1 p-2 bg-[#0b1220] border border-gray-600 rounded"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Unidade</label>
            <input
              className="w-full mt-1 p-2 bg-[#0b1220] border border-gray-600 rounded"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            onClick={() => onSave({ nome, valor, unidade })}
          >
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
}
