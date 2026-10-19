import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, cerrarSesion, getSesion, inicialesDe, usuarioVista } from '../api';
import EditarUsuarioModal from '../components/Usuarios/EditarUsuarioModal';
import EliminarUsuarioModal from '../components/Usuarios/EliminarUsuarioModal';
import HistorialUsuarioModal from '../components/Usuarios/HistoriaUsuarioModal';

export default function Usuarios() {
  const navigate = useNavigate();
  const sesion = getSesion();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const [modalEditar, setModalEditar] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [modalHistorial, setModalHistorial] = useState(null);

  const cargarUsuarios = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await api('/usuarios/listado');
      setUsuarios((data || []).map(usuarioVista));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((user) => {
    const texto = `${user.nombre} ${user.codigo} ${user.tipo}`.toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'Todos' || user.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const abrirHistorial = async (user) => {
    setModalHistorial(user);
    setHistorial([]);
    setCargandoHistorial(true);
    try {
      const data = await api(`/usuarios/${user.id}/historial?limite=100`);
      setHistorial(data?.registros || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleSaveEditar = async (datosActualizados) => {
    setError('');
    try {
      await api(`/usuarios/${modalEditar.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: datosActualizados.nombre,
          estado: datosActualizados.estado === 'Activo',
        }),
      });
      setModalEditar(null);
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmEliminar = async () => {
    setError('');
    try {
      await api(`/usuarios/${modalEliminar.id}`, { method: 'DELETE' });
      setModalEliminar(null);
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-[#f05a28] text-white transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Usuarios
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
            <span className="text-gray-900 font-semibold">Usuarios</span>
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
                Comunidad universitaria
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Administración de usuarios</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Consulta las cuentas registradas y mantén actualizada su información.
              </p>
            </div>

            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full self-start md:self-auto border border-emerald-100">
              {usuarios.length} usuarios registrados
            </span>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-800">
                El registro de usuarios se realiza desde la aplicación Android.
              </div>
              <div className="text-xs text-emerald-600">
                Este panel permite consultar historial, editar y borrar cuentas existentes.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Buscar por nombre, código o tipo"
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
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/70 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-6 font-semibold">Usuario</th>
                    <th className="py-3 px-4 font-semibold">Código</th>
                    <th className="py-3 px-4 font-semibold">Tipo</th>
                    <th className="py-3 px-4 font-semibold">Puntos</th>
                    <th className="py-3 px-4 font-semibold">Estado</th>
                    <th className="py-3 px-6 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {cargando && (
                    <tr>
                      <td colSpan="6" className="py-8 px-6 text-center text-gray-400">Cargando usuarios...</td>
                    </tr>
                  )}
                  {!cargando && usuariosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 px-6 text-center text-gray-400">No hay usuarios para mostrar.</td>
                    </tr>
                  )}
                  {usuariosFiltrados.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#fef2e8] text-[#f05a28] font-bold text-xs flex items-center justify-center shrink-0">
                            {user.iniciales}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{user.nombre}</div>
                            <div className="text-[11px] text-gray-400">{user.codigo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">{user.codigo}</td>
                      <td className="py-3.5 px-4 text-gray-500">{user.tipo}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{user.puntos.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            user.estado === 'Activo'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {user.estado}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* BOTÓN HISTORIAL */}
                          <button
                            onClick={() => abrirHistorial(user)}
                            title="Ver historial de reciclaje"
                            className="p-1.5 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 rounded-lg transition-colors border border-gray-100"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>

                          {/* BOTÓN EDITAR */}
                          <button
                            onClick={() => setModalEditar(user)}
                            title="Editar usuario"
                            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors border border-gray-100"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          {/* BOTÓN ELIMINAR */}
                          <button
                            onClick={() => setModalEliminar(user)}
                            title="Eliminar usuario"
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors border border-gray-100"
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
              <div>Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios</div>
              <div>Acciones: historial · editar · borrar</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2 pt-2">
            <div>Las cuentas se registran en la aplicación. Este panel consulta y actualiza las que ya existen.</div>
            <div>Universidad de Lima · Proyecto de reciclaje — Entorno de demostración - 2026</div>
          </div>
        </div>
      </main>

      {/* POPUPS / MODALES */}
      {modalHistorial && (
        <HistorialUsuarioModal
          usuario={modalHistorial}
          registros={historial}
          cargando={cargandoHistorial}
          onClose={() => setModalHistorial(null)}
        />
      )}

      {modalEditar && (
        <EditarUsuarioModal
          usuario={modalEditar}
          onClose={() => setModalEditar(null)}
          onSave={handleSaveEditar}
        />
      )}

      {modalEliminar && (
        <EliminarUsuarioModal
          usuario={modalEliminar}
          onClose={() => setModalEliminar(null)}
          onConfirm={handleConfirmEliminar}
        />
      )}
    </div>
  );
}