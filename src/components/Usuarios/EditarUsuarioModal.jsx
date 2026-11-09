import { useState } from 'react';

export default function EditarUsuarioModal({ usuario, esCuentaPropia = false, onClose, onSave }) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [activo, setActivo] = useState(usuario.activo);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [intentoGuardar, setIntentoGuardar] = useState(false);

  const nombreLimpio = nombre.trim();
  const errorNombre = !nombreLimpio ? 'El nombre es obligatorio.' : '';

  const cambios = {};
  if (nombreLimpio !== usuario.nombre) cambios.nombre = nombreLimpio;
  if (activo !== usuario.activo) cambios.estado = activo;
  const hayCambios = Object.keys(cambios).length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIntentoGuardar(true);
    if (errorNombre || !hayCambios) return;
    setGuardando(true);
    setError('');
    try {
      await onSave(cambios);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative" role="dialog" aria-modal="true">
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-5 top-5 text-gray-400 hover:text-gray-600">
          ✕
        </button>

        <div className="w-10 h-10 bg-[#fef2e8] rounded-xl flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-[#f05a28]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900">Editar usuario</h3>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          Actualiza el nombre o el estado de {usuario.nombre}.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <DatoBloqueado etiqueta="Código" valor={usuario.codigo} />
            <DatoBloqueado etiqueta="Correo" valor={usuario.correo || 'Sin correo'} />
          </div>

          <div>
            <label htmlFor="editar-nombre" className="block font-semibold text-gray-700 mb-1">Nombre *</label>
            <input
              id="editar-nombre"
              type="text"
              maxLength={255}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none ${
                intentoGuardar && errorNombre
                  ? 'border-red-300 focus:border-red-400'
                  : 'border-gray-200 focus:border-[#f05a28]'
              }`}
            />
            {intentoGuardar && errorNombre && <p className="text-[11px] text-red-500 mt-1">{errorNombre}</p>}
          </div>

          <div>
            <label htmlFor="editar-estado" className="block font-semibold text-gray-700 mb-1">Estado de la cuenta *</label>
            <select
              id="editar-estado"
              value={activo ? 'Activo' : 'Inactivo'}
              onChange={(e) => setActivo(e.target.value === 'Activo')}
              disabled={esCuentaPropia}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            {esCuentaPropia && (
              <p className="text-[11px] text-gray-400 mt-1">No puedes desactivar tu propia cuenta.</p>
            )}
            {!esCuentaPropia && usuario.activo && !activo && (
              <p className="text-[11px] text-[#b9421a] mt-1">La cuenta perderá el acceso de inmediato, incluso con sesión abierta.</p>
            )}
          </div>

          <div className="text-[11px] text-gray-400">
            Los cambios no modifican sus {usuario.puntos.toLocaleString('es-PE')} puntos ni su historial de reciclaje.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !hayCambios}
              title={hayCambios ? undefined : 'No hay cambios por guardar'}
              className="px-4 py-2.5 rounded-xl bg-[#f05a28] text-white hover:bg-[#d94d1f] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DatoBloqueado({ etiqueta, valor }) {
  return (
    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 min-w-0">
      <div className="text-[10px] text-gray-400 font-medium">{etiqueta} · No editable</div>
      <div className="text-xs font-bold text-gray-900 mt-0.5 truncate" title={valor}>{valor}</div>
    </div>
  );
}
