import EstadoBadge from './EstadoBadge';

const ICONOS = {
  ver: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  editar: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
  desactivar: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
  reactivar: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
};

const TONOS = {
  naranja: 'hover:bg-[#fef2e8] hover:text-[#f05a28]',
  verde: 'hover:bg-emerald-50 hover:text-emerald-600',
  gris: 'hover:bg-gray-100 hover:text-gray-600',
  rojo: 'hover:bg-red-50 hover:text-red-500'
};

export default function TablaUsuarios({
  usuarios,
  cargando,
  error,
  termino,
  idPropio,
  procesando,
  onVerDetalle,
  onEditar,
  onDesactivar,
  onReactivar,
  onLimpiarBusqueda
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-gray-50/70 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100">
          <tr>
            <th className="py-3 px-6 font-semibold">Usuario / Correo</th>
            <th className="py-3 px-4 font-semibold">Código</th>
            <th className="py-3 px-4 font-semibold">Tipo</th>
            <th className="py-3 px-4 font-semibold text-right">Puntos</th>
            <th className="py-3 px-4 font-semibold">Estado</th>
            <th className="py-3 px-6 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-gray-100 text-gray-700 transition-opacity ${cargando ? 'opacity-50' : ''}`}>
          {usuarios.map((user) => (
            <FilaUsuario
              key={user.id}
              user={user}
              propia={Number(user.id) === Number(idPropio)}
              ocupado={procesando === user.id}
              onVerDetalle={onVerDetalle}
              onEditar={onEditar}
              onDesactivar={onDesactivar}
              onReactivar={onReactivar}
            />
          ))}

          {!cargando && usuarios.length === 0 && !error && (
            <tr>
              <td colSpan={6} className="py-12 text-center">
                <div className="text-sm font-bold text-gray-700">
                  {termino ? 'No se encontraron usuarios' : 'Todavía no hay cuentas registradas'}
                </div>
                {termino && (
                  <button onClick={onLimpiarBusqueda} className="mt-2 text-xs font-semibold text-[#f05a28] hover:underline">
                    Limpiar búsqueda
                  </button>
                )}
              </td>
            </tr>
          )}
          {cargando && usuarios.length === 0 && (
            <tr>
              <td colSpan={6} className="py-10 text-center text-gray-400">Cargando usuarios…</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function FilaUsuario({ user, propia, ocupado, onVerDetalle, onEditar, onDesactivar, onReactivar }) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="py-3.5 px-6">
        <button onClick={() => onVerDetalle(user)} className="flex items-center gap-3 text-left group" title="Ver detalle">
          <div className="w-9 h-9 rounded-full bg-[#fef2e8] text-[#f05a28] font-bold text-xs flex items-center justify-center shrink-0">
            {user.iniciales}
          </div>
          <div>
            <div className="font-bold text-gray-900 group-hover:text-[#f05a28] transition-colors">
              {user.nombre}
              {propia && <span className="ml-1.5 text-[10px] font-semibold text-gray-400">(tú)</span>}
            </div>
            <div className="text-[11px] text-gray-400">{user.correo || 'Sin correo'}</div>
          </div>
        </button>
      </td>
      <td className="py-3.5 px-4 font-semibold text-gray-800 tabular-nums">{user.codigo}</td>
      <td className="py-3.5 px-4">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
            user.tipo === 'admin' ? 'bg-[#fef2e8] text-[#b9421a]' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {user.tipo === 'admin' ? 'Admin' : 'Usuario'}
        </span>
      </td>
      <td className="py-3.5 px-4 font-bold text-gray-900 text-right tabular-nums">{user.puntos.toLocaleString('es-PE')}</td>
      <td className="py-3.5 px-4">
        <EstadoBadge activo={user.activo} />
      </td>
      <td className="py-3.5 px-6 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <BotonAccion titulo="Ver detalle" tono="naranja" icono={ICONOS.ver} onClick={() => onVerDetalle(user)} />
          <BotonAccion titulo="Editar usuario" tono="gris" icono={ICONOS.editar} onClick={() => onEditar(user)} />
          {user.activo ? (
            <BotonAccion
              titulo={propia ? 'No puedes desactivar tu propia cuenta' : 'Desactivar cuenta'}
              tono="rojo"
              icono={ICONOS.desactivar}
              disabled={propia || ocupado}
              onClick={() => onDesactivar(user)}
            />
          ) : (
            <BotonAccion
              titulo="Reactivar cuenta"
              tono="verde"
              icono={ICONOS.reactivar}
              disabled={ocupado}
              onClick={() => onReactivar(user)}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

function BotonAccion({ titulo, onClick, icono, tono, disabled = false }) {
  return (
    <button
      onClick={onClick}
      title={titulo}
      aria-label={titulo}
      disabled={disabled}
      className={`p-1.5 text-gray-400 rounded-lg transition-colors border border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400 ${TONOS[tono]}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={icono} />
      </svg>
    </button>
  );
}
