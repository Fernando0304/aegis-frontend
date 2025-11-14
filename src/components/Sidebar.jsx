import { Link } from "react-router-dom";

export default function Sidebar({ usuario }) {
  return (
    <aside
      className="w-64 h-screen bg-gray-800 text-white p-6 flex flex-col 
                 border-r border-gray-700 fixed left-0 top-0 z-30"
    >
      <h2 className="text-2xl font-bold mb-10 text-blue-400">AEGIS</h2>

      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="block p-2 rounded hover:bg-gray-700 transition"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/sensores"
              className="block p-2 rounded hover:bg-gray-700 transition"
            >
              Sensores
            </Link>
          </li>

          <li>
            <Link
              to="/alertas"
              className="block p-2 rounded hover:bg-gray-700 transition"
            >
              Alertas
            </Link>
          </li>
        </ul>
      </nav>

      {/* Usuário + Logout */}
      <div className="mt-6">
        {usuario && (
          <p className="text-gray-400 mb-3">
            Logado como:<br />
            <span className="text-blue-400 font-semibold">{usuario.nome}</span>
          </p>
        )}

        <button
          className="w-full bg-red-600 hover:bg-red-700 p-2 rounded-md transition"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
