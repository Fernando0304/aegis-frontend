export default function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-[#111827] border border-gray-700 rounded-xl p-5 shadow-md flex items-center gap-4">

      {/* Bolinha colorida */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
        style={{ backgroundColor: color }}
      >
        {value}
      </div>

      {/* Textos */}
      <div className="flex flex-col">
        <span className="text-gray-300 text-sm">{title}</span>
        <span className="text-white text-lg font-semibold">{subtitle}</span>
      </div>

    </div>
  );
}
