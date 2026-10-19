export default function EliminarUsuarioModal({ usuario, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-gray-600">
          ✕
        </button>

        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-1">¿Desactivar a este usuario?</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          La cuenta quedará inactiva y no podrá iniciar sesión.
        </p>

        <div className="bg-gray-50 p-3.5 rounded-2xl flex items-center gap-3 mb-4 border border-gray-100">
          <div className="w-9 h-9 rounded-full bg-[#fef2e8] text-[#f05a28] font-bold text-xs flex items-center justify-center shrink-0">
            {usuario.iniciales}
          </div>
          <div>
            <div className="font-bold text-xs text-gray-900">{usuario.nombre}</div>
            <div className="text-[11px] text-gray-400">
              {usuario.codigo} · {usuario.puntos.toLocaleString()} puntos
            </div>
            <div className="text-[11px] text-gray-400">{usuario.correo || usuario.tipo}</div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 p-3.5 rounded-2xl mb-5 text-xs text-red-700">
          <div className="font-bold mb-0.5">La cuenta deja de estar activa.</div>
          <div className="text-[11px] text-red-600 leading-snug">
            El historial y los puntos se conservan. Puedes volver a activar la cuenta desde editar.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-xs"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold text-xs"
          >
            Desactivar usuario
          </button>
        </div>
      </div>
    </div>
  );
}