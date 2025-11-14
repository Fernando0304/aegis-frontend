import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function TemperatureHistory({ data }) {
  // Formatando timestamps
  const chartData = data.map((item) => ({
    valor: item.valor,
    tempo: new Date(item.timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <div className="bg-[#0b1220] border border-gray-700 rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        Histórico de Temperatura
      </h2>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis dataKey="tempo" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#3b82f6", strokeWidth: 1, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
