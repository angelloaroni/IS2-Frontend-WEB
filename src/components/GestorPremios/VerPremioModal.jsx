import React from 'react';

/**
 * Componente Modal de solo lectura para visualizar los detalles de un premio.
 * 
 * @param {Object} premio - Objeto con los datos del premio a mostrar (nombre, descripcion, puntos, stock, estado).
 * @param {Function} onClose - Función callback para cerrar el modal.
 */
export default function VerPremioModal({ premio, onClose }) {
  // Validación de seguridad: Evita errores si el premio no está definido
  if (!premio) return null;

  return (
    // Capa de fondo oscuro translúcido (Overlay)
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      
      {/* Contenedor Flotante del Modal (Minimalista y centrado) */}
      <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl relative text-center">
        
        {/* Botón de Cierre (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors"
          title="Cerrar modal"
        >
          ✕
        </button>

        {/* Ícono Ilustrativo del Premio */}
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold text-xl border border-emerald-100">
          🎁
        </div>

        {/* Título y Descripción del Premio */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{premio.nombre}</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">{premio.descripcion}</p>

        {/* Caja Resumen con los Detalles */}
        <div className="bg-gray-50 p-3.5 rounded-2xl text-xs space-y-1.5 text-left text-gray-600 mb-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-500">Puntos:</span>
            <span className="font-bold text-[#f05a28]">{premio.puntos} pts</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-500">Stock:</span>
            <span className="font-bold text-gray-800">{premio.stock} unidades</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-500">Estado:</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                premio.estado === 'Activo'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {premio.estado}
            </span>
          </div>
        </div>

        {/* Botón para Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-semibold transition-colors"
        >
          Cerrar
        </button>

      </div>
    </div>
  );
}