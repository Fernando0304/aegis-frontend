export default function Navbar({ usuario }) {
  return (
   
    <header className="fixed left-64 right-0 top-0 h-16 
  bg-[#111827] border-b border-gray-700 
  flex items-center justify-between px-10 
  z-50 shadow-lg">

      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

      {usuario && (
        <div className="flex items-center gap-3">
          <span className="text-gray-300">
            Olá,{" "}
            <span className="text-blue-400 font-bold">{usuario.nome}</span>
          </span>

          <img
            src="https://i.pravatar.cc/100"
            className="w-10 h-10 rounded-full border border-gray-600"
            alt="Avatar"
          />
        </div>
      )}
    </header>
  );
}
