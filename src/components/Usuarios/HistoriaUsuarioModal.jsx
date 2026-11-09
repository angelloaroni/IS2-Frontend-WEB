const ETIQUETAS = {
  plastico: 'Plástico',
  'papel/carton': 'Papel y cartón',
  organicos: 'Orgánicos',
  organico: 'Orgánicos',
};

function etiquetaTipo(tipo) {
  return ETIQUETAS[String(tipo || '').toLowerCase()] || tipo || 'Residuo';
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  const valor = new Date(`${String(fecha).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(valor.getTime())) return String(fecha);
  return valor.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function HistorialUsuarioModal({ usuario, registros = [], cargando = false, onClose }) {
  const totalEntregas = registros.length;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 font-bold transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">Historial de reciclaje</h3>
            <p className="text-xs text-gray-500">
              {usuario.nombre} · <span className="font-semibold text-gray-700">{usuario.codigo}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-2xl">
            <div className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">Total reciclado</div>
            <div className="text-base font-extrabold text-emerald-800 mt-0.5">{totalEntregas} entregas</div>
          </div>
          <div className="bg-[#fef2e8] border border-orange-100 p-3 rounded-2xl">
            <div className="text-[10px] text-[#f05a28] font-semibold uppercase tracking-wider">Puntos acumulados</div>
            <div className="text-base font-extrabold text-[#f05a28] mt-0.5">{usuario.puntos.toLocaleString()} pts</div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 pr-1 space-y-2.5 my-1">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">
            Últimas actividades registradas
          </div>

          {cargando && (
            <div className="p-4 text-xs text-gray-400 text-center">Cargando historial...</div>
          )}

          {!cargando && registros.length === 0 && (
            <div className="p-4 text-xs text-gray-400 text-center">Este usuario todavía no tiene entregas.</div>
          )}

          {registros.map((item) => (
            <div
              key={item.idHistorial}
              className="p-3 bg-gray-50/80 hover:bg-gray-100/80 rounded-2xl border border-gray-100 transition-colors flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-gray-900">{etiquetaTipo(item.residuo?.tipo)}</div>
                <div className="text-[10px] text-gray-400">Tacho {item.idTacho} · {Number(item.residuo?.peso || 0)} kg</div>
                <div className="text-[10px] text-gray-400">{formatearFecha(item.fecha)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
