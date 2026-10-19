export default function HistorialUsuarioModal({ usuario, onClose }) {
  // Datos de prueba para el historial de reciclaje
  const historialDemo = [
    {
      id: 101,
      fecha: '15 oct 2026 · 10:30 AM',
      material: 'Plástico PET',
      ubicacion: 'Pabellón W - Tacho 01',
      cantidad: '3 botellas (120g)',
      puntos: '+60 pts',
      icono: '♻️'
    },
    {
      id: 102,
      fecha: '12 oct 2026 · 04:15 PM',
      material: 'Latas de Aluminio',
      ubicacion: 'Pabellón V - Tacho 03',
      cantidad: '2 latas (80g)',
      puntos: '+40 pts',
      icono: '🥤'
    },
    {
      id: 103,
      fecha: '08 oct 2026 · 11:00 AM',
      material: 'Papel y Cartón',
      ubicacion: 'Biblioteca - Tacho 02',
      cantidad: '500g cuadernos',
      puntos: '+100 pts',
      icono: '📄'
    },
    {
      id: 104,
      fecha: '04 oct 2026 · 02:45 PM',
      material: 'Plástico PET',
      ubicacion: 'Pabellón A - Tacho 01',
      cantidad: '4 botellas (160g)',
      puntos: '+80 pts',
      icono: '♻️'
    }
  ];

  const totalEntregas = historialDemo.length;
  const totalPuntosHistorial = 280;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 font-bold transition-colors"
        >
          ✕
        </button>

        {/* Encabezado del modal */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">Historial de reciclaje</h3>
            <p className="text-xs text-gray-500">
              {usuario.nombres} {usuario.apellidos} · <span className="font-semibold text-gray-700">{usuario.codigo}</span>
            </p>
          </div>
        </div>

        {/* Resumen acumulado */}
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

        {/* Tabla / Lista de entregas con scroll */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-2.5 my-1">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">
            Últimas actividades registradas
          </div>

          {historialDemo.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-gray-50/80 hover:bg-gray-100/80 rounded-2xl border border-gray-100 transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="text-base bg-white w-8 h-8 rounded-xl flex items-center justify-center shadow-xs border border-gray-100">
                  {item.icono}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{item.material}</div>
                  <div className="text-[10px] text-gray-400">{item.ubicacion} · {item.cantidad}</div>
                  <div className="text-[10px] text-gray-400">{item.fecha}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 bg-emerald-100/80 text-emerald-700 font-bold text-[11px] rounded-full">
                  {item.puntos}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Botón inferior de cierre */}
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