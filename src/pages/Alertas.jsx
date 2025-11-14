import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";

export default function Alertas() {
  const [usuario, setUsuario] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const [filtros, setFiltros] = useState({
    maquina: "",
    sensor: "",
    status: "",
    periodo: "",
    busca: "",
    page: 1,
    limit: 10,
  });

  const [total, setTotal] = useState(0);
  const [ativos, setAtivos] = useState(0);
  const [paginas, setPaginas] = useState(1);

  // Carregar usuário
  useEffect(() => {
    async function carregarUsuario() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/users/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsuario(res.data);
      } catch (err) {
        console.error("Erro carregar usuário:", err);
      }
    }

    carregarUsuario();
  }, []);

  // Buscar alertas + polling
  useEffect(() => {
    carregarAlertas();

    const intervalo = setInterval(() => {
      carregarAlertas();
    }, 15000);

    return () => clearInterval(intervalo);
  }, [filtros]);

  async function carregarAlertas() {
    try {
      setLoading(true);
      setErro(null);

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get("/alertas", {
        headers,
        params: filtros,
      });

      const data = res.data || {};
      setAlertas(data.alertas || []);
      setTotal(data.total || 0);
      setAtivos(data.ativos || 0);
      setPaginas(data.paginas || 1);
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
      setErro(
        error.response?.data?.erro ||
          error.response?.data?.message ||
          error.message ||
          "Erro desconhecido"
      );
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  }

  function limparFiltros() {
    setFiltros({
      maquina: "",
      sensor: "",
      status: "",
      periodo: "",
      busca: "",
      page: 1,
      limit: 10,
    });
  }

  // Exportar Excel
  function exportarExcel() {
    const dados = alertas.map((a) => ({
      ID: a._id,
      Máquina: a.maquina,
      Sensor: a.sensor,
      Status: a.nivel,
      Valor: a.valor,
      Data: new Date(a.timestamp).toLocaleString("pt-BR"),
    }));

    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alertas");

    XLSX.writeFile(wb, "alertas.xlsx");
  }

  return (
    <div className="flex h-screen bg-[#0d1117] text-white">
      <Sidebar usuario={usuario} />

      <div className="flex-1 ml-64">
        <Navbar usuario={usuario} />

        <main className="p-10 mt-20">
          <h1 className="text-3xl font-bold mb-6">Todos os Alertas</h1>

          {/* FILTROS */}
          <div className="bg-[#111827] p-6 rounded-lg border border-gray-700 mb-6">

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

              {/* Máquina */}
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm mb-1">Máquina</label>
                <select
                  className="bg-[#0d1117] border border-gray-700 p-2 rounded"
                  value={filtros.maquina}
                  onChange={(e) =>
                    setFiltros({ ...filtros, maquina: e.target.value, page: 1 })
                  }
                >
                  <option value="">Todas</option>
                  <option value="Máquina AEGIS">Máquina AEGIS</option>
                </select>
              </div>

              {/* Sensor */}
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm mb-1">Sensor</label>
                <select
                  className="bg-[#0d1117] border border-gray-700 p-2 rounded"
                  value={filtros.sensor}
                  onChange={(e) =>
                    setFiltros({ ...filtros, sensor: e.target.value, page: 1 })
                  }
                >
                  <option value="">Todos</option>
                  <option value="Sensor Ambiente AEGIS">Sensor Ambiente AEGIS</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm mb-1">Status</label>
                <select
                  className="bg-[#0d1117] border border-gray-700 p-2 rounded"
                  value={filtros.status}
                  onChange={(e) =>
                    setFiltros({ ...filtros, status: e.target.value, page: 1 })
                  }
                >
                  <option value="">Todos</option>
                  <option value="alerta">Alerta</option>
                  <option value="critico">Crítico</option>
                  <option value="ok">OK</option>
                </select>
              </div>

              {/* Período */}
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm mb-1">Período</label>
                <select
                  className="bg-[#0d1117] border border-gray-700 p-2 rounded"
                  value={filtros.periodo}
                  onChange={(e) =>
                    setFiltros({ ...filtros, periodo: e.target.value, page: 1 })
                  }
                >
                  <option value="">Todos</option>
                  <option value="hoje">Hoje</option>
                  <option value="ontem">Ontem</option>
                  <option value="7dias">Últimos 7 dias</option>
                  <option value="30dias">Últimos 30 dias</option>
                </select>
              </div>

              {/* Busca */}
              <div className="flex flex-col">
                <label className="text-gray-400 text-sm mb-1">Buscar</label>
                <input
                  type="text"
                  placeholder="Buscar por máquina ou sensor..."
                  className="bg-[#0d1117] border border-gray-700 p-2 rounded"
                  value={filtros.busca}
                  onChange={(e) =>
                    setFiltros({ ...filtros, busca: e.target.value, page: 1 })
                  }
                />
              </div>

            </div>

            {/* BOTÕES */}
            <div className="flex justify-between mt-6">
              
              <button
                onClick={exportarExcel}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
              >
                Exportar Excel
              </button>

              <div className="flex gap-3">
                <button
                  onClick={limparFiltros}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
                >
                  Limpar
                </button>

                <button
                  onClick={() => carregarAlertas()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
                >
                  Aplicar
                </button>
              </div>
            </div>

          </div>

          {/* KPIs */}
          <div className="flex gap-6 mb-6">
            <div className="bg-[#111827] p-5 rounded-lg border border-gray-700 w-64">
              <p className="text-gray-400 text-sm">Total de Alertas</p>
              <p className="text-3xl font-bold mt-1">{total}</p>
            </div>

            <div className="bg-[#111827] p-5 rounded-lg border border-gray-700 w-64">
              <p className="text-gray-400 text-sm">Alertas Ativos</p>
              <p className="text-3xl font-bold mt-1 text-yellow-400">{ativos}</p>
            </div>
          </div>

          {/* TABELA */}
          <div className="bg-[#111827] p-5 rounded-lg border border-gray-700">
            {erro && (
              <div className="bg-red-800 p-3 rounded mb-4 text-red-200">{erro}</div>
            )}

            {loading ? (
              <p className="text-gray-400">Carregando alertas...</p>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                      <th className="py-3">ID</th>
                      <th>Máquina</th>
                      <th>Sensor</th>
                      <th>Status</th>
                      <th>Hora</th>
                    </tr>
                  </thead>

                  <tbody>
                    {alertas.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-gray-400">Nenhum alerta encontrado.</td>
                      </tr>
                    ) : (
                      alertas.map((a) => (
                        <tr key={a._id} className="border-b border-gray-800">
                          <td className="py-3 text-gray-300">#{String(a._id).slice(-6)}</td>
                          <td>{a.maquina}</td>
                          <td>{a.sensor}</td>
                          <td>
                            {a.nivel === "alerta" && <span className="text-yellow-400">● Alerta</span>}
                            {a.nivel === "critico" && <span className="text-red-500">● Crítico</span>}
                            {a.nivel === "ok" && <span className="text-green-400">● OK</span>}
                          </td>
                          <td className="text-gray-400">
                            {new Date(a.timestamp).toLocaleString("pt-BR")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Paginação */}
                <div className="flex justify-between mt-5 text-gray-300">
                  <button
                    disabled={filtros.page <= 1}
                    onClick={() =>
                      setFiltros({ ...filtros, page: filtros.page - 1 })
                    }
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  <p>Página {filtros.page} de {paginas}</p>

                  <button
                    disabled={filtros.page >= paginas}
                    onClick={() =>
                      setFiltros({ ...filtros, page: filtros.page + 1 })
                    }
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </div>
              </>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
