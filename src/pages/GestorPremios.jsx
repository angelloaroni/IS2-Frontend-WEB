import { useEffect, useState } from 'react';
import { premioABody, premioVista, premiosApi } from '../api';
import Sidebar from '../components/Layout/Sidebar';
import Encabezado from '../components/Layout/Encabezado';
import AgregarPremioModal from '../components/GestorPremios/AgregarPremioModal';
import VerPremioModal from '../components/GestorPremios/VerPremioModal';

export default function Premios() {
  const [premios, setPremios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalVer, setModalVer] = useState(null);

  const cargarPremios = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await premiosApi.listar();
      setPremios((data || []).map(premioVista));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPremios();
  }, []);

  const premiosFiltrados = premios.filter((item) => {
    const coincideNombre = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'Todos' || item.estado === filtroEstado;
    return coincideNombre && coincideEstado;
  });

  const totalCatalog = premios.length;
  const totalActivos = premios.filter((p) => p.estado === 'Activo').length;
  const totalUnidades = premios.reduce((acc, p) => acc + Number(p.stock), 0);

  const handleSaveAgregar = async (nuevoPremio) => {
    setError('');
    await premiosApi.crear(premioABody(nuevoPremio));
    setModalAgregar(false);
    await cargarPremios();
  };

  return (
    <div className="flex min-h-screen bg-[#f6f7f6] font-sans text-gray-800">
      <Sidebar activo="premios" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Encabezado titulo="Premios" />

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f05a28]">
                Incentivos para una comunidad sostenible
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Gestión de premios</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Consulta y administra los premios del proyecto de reciclaje.
              </p>
            </div>

            <button
              onClick={() => setModalAgregar(true)}
              className="bg-[#f05a28] hover:bg-[#d94d1f] text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-sm self-start md:self-auto"
            >
              <span className="text-base font-bold">+</span> Agregar premio
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-[#fef2e8] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#f05a28]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">{totalCatalog}</div>
                <div className="text-xs text-gray-400 font-medium">Premios en catálogo</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-[#fef2e8] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#f05a28]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">{totalActivos}</div>
                <div className="text-xs text-gray-400 font-medium">Premios activos</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-[#fef2e8] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#f05a28]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">{totalUnidades}</div>
                <div className="text-xs text-gray-400 font-medium">Unidades disponibles</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Buscar por nombre de premio"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] transition-all text-gray-800"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full md:w-48 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] text-gray-600 bg-white"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Agotado">Agotado</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/70 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-6 font-semibold">Premio</th>
                    <th className="py-3 px-4 font-semibold">Puntos</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold">Estado</th>
                    <th className="py-3 px-6 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {cargando && (
                    <tr>
                      <td colSpan="5" className="py-8 px-6 text-center text-gray-400">Cargando premios...</td>
                    </tr>
                  )}
                  {!cargando && premiosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 px-6 text-center text-gray-400">No hay premios para mostrar.</td>
                    </tr>
                  )}
                  {premiosFiltrados.map((premio) => (
                    <tr key={premio.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{premio.nombre}</div>
                            <div className="text-[11px] text-gray-400">{premio.descripcion}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{premio.puntos} pts</td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{premio.stock} unidades</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            premio.estado === 'Activo'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {premio.estado}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setModalVer(premio)}
                            title="Ver premio"
                            aria-label="Ver premio"
                            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <div>Mostrando {premiosFiltrados.length} de {premios.length} premios</div>
              <div>Editar y eliminar premios: pendiente en el backend</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2 pt-2">
            <div>El catálogo se guarda en la base de datos del proyecto.</div>
            <div>Universidad de Lima · Proyecto de reciclaje — 2026</div>
          </div>
        </div>
      </main>

      {modalAgregar && (
        <AgregarPremioModal
          onClose={() => setModalAgregar(false)}
          onSave={handleSaveAgregar}
        />
      )}

      {modalVer && (
        <VerPremioModal
          premio={modalVer}
          onClose={() => setModalVer(null)}
        />
      )}
    </div>
  );
}