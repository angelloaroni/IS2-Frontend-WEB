import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, cerrarSesion, getSesion, inicialesDe, premioABody, premioVista } from '../api';
import AgregarPremioModal from '../components/GestorPremios/AgregarPremioModal';
import EditarPremioModal from '../components/GestorPremios/EditarPremioModal';
import EliminarPremioModal from '../components/GestorPremios/EliminarPremioModal';
import VerPremioModal from '../components/GestorPremios/VerPremioModal';

export default function Premios() {
  const navigate = useNavigate();
  const sesion = getSesion();
  const [premios, setPremios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [modalVer, setModalVer] = useState(null);

  const cargarPremios = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await api('/premios');
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
    await api('/premios', {
      method: 'POST',
      body: JSON.stringify(premioABody(nuevoPremio)),
    });
    setModalAgregar(false);
    await cargarPremios();
  };

  const handleSaveEditar = async (datosActualizados) => {
    setError('');
    await api(`/premios/${modalEditar.id}`, {
      method: 'PUT',
      body: JSON.stringify(premioABody(datosActualizados)),
    });
    setModalEditar(null);
    await cargarPremios();
  };

  const handleConfirmEliminar = async () => {
    setError('');
    try {
      await api(`/premios/${modalEliminar.id}`, { method: 'DELETE' });
      setModalEliminar(null);
      await cargarPremios();
    } catch (err) {
      setError(err.message);
      setModalEliminar(null);
    }
  };

  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#f6f7f6] font-sans text-gray-800">
      <aside className="w-64 bg-[#121c17] text-white flex flex-col justify-between p-5 min-h-screen shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-[#f05a28] p-2 rounded-xl">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">ULima Recicla</h2>
              <p className="text-[11px] text-gray-400">Universidad de Lima</p>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3 px-2">
            Administración
          </div>

          <nav className="space-y-1">
            <Link
              to="/premios"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-[#f05a28] text-white transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Premios
            </Link>

            <Link
              to="/telemetria"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              Telemetría
            </Link>

            <Link
              to="/usuarios"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Usuarios
            </Link>
            <Link
              to="/alertas"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Alertas
            </Link>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1b2721] p-4 rounded-2xl border border-white/5">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Un campus que transforma.</h4>
            <p className="text-[11px] text-gray-400">Proyecto de reciclaje<br />Universidad de Lima</p>
          </div>

          <button
            onClick={salir}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors w-full px-2 py-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>Administración</span>
            <span>&gt;</span>
            <span className="text-gray-900 font-semibold">Premios</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Campus Lima
            </span>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#fef2e8] text-[#f05a28] font-bold text-xs flex items-center justify-center">
                {inicialesDe(sesion?.nombre)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-gray-900 leading-tight">{sesion?.nombre || 'Administrador'}</div>
                <div className="text-[10px] text-gray-400 leading-tight">Administrador</div>
              </div>
            </div>
          </div>
        </header>

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
                            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setModalEditar(premio)}
                            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setModalEliminar(premio)}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
              <div>Acciones: ver · editar · eliminar</div>
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

      {modalEditar && (
        <EditarPremioModal
          premio={modalEditar}
          onClose={() => setModalEditar(null)}
          onSave={handleSaveEditar}
        />
      )}

      {modalEliminar && (
        <EliminarPremioModal
          premio={modalEliminar}
          onClose={() => setModalEliminar(null)}
          onConfirm={handleConfirmEliminar}
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