import { useCallback, useState } from 'react';
import { getSesion } from '../api';
import useUsuarios from '../hooks/useUsuarios';
import Sidebar from '../components/Layout/Sidebar';
import Encabezado from '../components/Layout/Encabezado';
import Aviso from '../components/common/Aviso';
import Paginacion from '../components/common/Paginacion';
import ResumenUsuarios from '../components/Usuarios/ResumenUsuarios';
import BuscadorUsuarios from '../components/Usuarios/BuscadorUsuarios';
import TablaUsuarios from '../components/Usuarios/TablaUsuarios';
import DetalleUsuarioModal from '../components/Usuarios/DetalleUsuarioModal';
import EditarUsuarioModal from '../components/Usuarios/EditarUsuarioModal';
import EliminarUsuarioModal from '../components/Usuarios/EliminarUsuarioModal';

const POR_PAGINA = 10;

export default function Usuarios() {
  const idPropio = getSesion()?.id_user;
  const u = useUsuarios({ porPagina: POR_PAGINA });

  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalDesactivar, setModalDesactivar] = useState(null);
  const [aviso, setAviso] = useState(null);
  const cerrarAviso = useCallback(() => setAviso(null), []);

  const guardarEdicion = async (cambios) => {
    const actualizado = await u.actualizar(modalEditar.id, cambios);
    setModalEditar(null);
    setAviso({ tipo: 'ok', texto: `Se actualizaron los datos de ${actualizado.nombre}.` });
  };

  const confirmarDesactivar = async () => {
    const user = modalDesactivar;
    setModalDesactivar(null);
    try {
      await u.desactivar(user.id);
      setAviso({ tipo: 'alerta', texto: `La cuenta de ${user.nombre} quedó inactiva.` });
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message });
    }
  };

  const reactivar = async (user) => {
    try {
      await u.reactivar(user.id);
      setAviso({ tipo: 'ok', texto: `La cuenta de ${user.nombre} se reactivó.` });
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f6f7f6] font-sans text-gray-800">
      <Sidebar activo="usuarios" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Encabezado titulo="Usuarios" />

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f05a28]">Comunidad universitaria</span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Administración de usuarios</h1>
            <p className="text-xs text-gray-500 mt-0.5">Consulta las cuentas registradas y mantén actualizada su información.</p>
          </div>

          <ResumenUsuarios total={u.paginacion.total} termino={u.termino} cargando={u.cargando} resumen={u.resumen} />

          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 text-xs">
            <div className="font-bold text-emerald-800">El registro de usuarios se realiza desde la aplicación Android.</div>
            <div className="text-emerald-600">
              Este panel permite consultar el detalle, editar el nombre y activar o desactivar cuentas existentes.
            </div>
          </div>

          {u.error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium flex items-center justify-between gap-3">
              <span>{u.error}</span>
              <button onClick={u.reintentar} className="font-semibold underline shrink-0">Reintentar</button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <BuscadorUsuarios valor={u.busqueda} onCambiar={u.setBusqueda} onActualizar={u.recargar} cargando={u.cargando} />
            <TablaUsuarios
              usuarios={u.usuarios}
              cargando={u.cargando}
              error={u.error}
              termino={u.termino}
              idPropio={idPropio}
              procesando={u.procesando}
              onVerDetalle={setModalDetalle}
              onEditar={setModalEditar}
              onDesactivar={setModalDesactivar}
              onReactivar={reactivar}
              onLimpiarBusqueda={() => u.setBusqueda('')}
            />
            <Paginacion paginacion={u.paginacion} porPagina={POR_PAGINA} cargando={u.cargando} nombre="usuarios" onCambiar={u.setPagina} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2 pt-2">
            <div>Desactivar una cuenta es una baja lógica: los puntos y el historial se conservan.</div>
            <div>Universidad de Lima · Proyecto de reciclaje — 2026</div>
          </div>
        </div>
      </main>

      <Aviso aviso={aviso} onCerrar={cerrarAviso} />

      {modalDetalle && (
        <DetalleUsuarioModal
          usuario={modalDetalle}
          onClose={() => setModalDetalle(null)}
          onEditar={(user) => {
            setModalDetalle(null);
            setModalEditar(user);
          }}
        />
      )}

      {modalEditar && (
        <EditarUsuarioModal
          usuario={modalEditar}
          esCuentaPropia={Number(modalEditar.id) === Number(idPropio)}
          onClose={() => setModalEditar(null)}
          onSave={guardarEdicion}
        />
      )}

      {modalDesactivar && (
        <EliminarUsuarioModal
          usuario={modalDesactivar}
          onClose={() => setModalDesactivar(null)}
          onConfirm={confirmarDesactivar}
        />
      )}
    </div>
  );
}
