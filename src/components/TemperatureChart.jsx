import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function TemperatureChart({ data }) {

  // Formata o timestamp para hora/minuto
  const formatHora = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-[#111827] border border-gray-700 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Temperatura - Últimas Leituras</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatHora}
            stroke="#9ca3af"
          />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            labelFormatter={(value) => formatHora(value)}
            formatter={(value) => [`${value}°C`, "Temperatura"]}
            contentStyle={{
              backgroundColor: "#1f2937",
              borderColor: "#4b5563",
              color: "#fff",
            }}
          />

          <Line
            type="monotone"
            dataKey="valor"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
