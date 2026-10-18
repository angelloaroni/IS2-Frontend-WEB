import React from 'react';

/**
 * Componente Modal para visualizar los detalles de un premio del catálogo de ULima Recicla.
 * 
 * @param {Object} premio - Objeto con la información del premio a visualizar.
 * @param {Function} onClose - Función callback para cerrar el modal.
 */
export default function VerPremioModal({ premio, onClose }) {
  // Protección en caso de que no haya un premio seleccionado cargado
  if (!premio) return null;

  return (
    // Fondo oscuro translúcido con desenfoque suave (Overlay)
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      
      {/* Contenedor Flotante del Modal */}
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        
        {/* Botón de Cierre Superior (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors"
          title="Cerrar modal"
        >
          ✕
        </button>

        {/* Ícono de Vista / Ojo en Naranja Institucional */}
        <div className="w-10 h-10 bg-[#fef2e8] rounded-xl flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-[#f05a28]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>

        {/* Título y Subtítulo */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">Detalles del premio</h3>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          Información registrada en el catálogo para este incentivo.
        </p>

        {/* Tarjeta con los detalles del premio */}
        <div className="space-y-3 text-xs mb-6">
          
          {/* Ficha Principal de Identificación */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-base shrink-0 border border-emerald-100">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">{premio.nombre}</h4>
              <p className="text-gray-500 text-[11px]">{premio.descripcion}</p>
            </div>
          </div>

          {/* Cuadrícula de Atributos: Puntos y Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Puntos requeridos</span>
              <span className="text-sm font-extrabold text-[#f05a28]">{premio.puntos} pts</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Stock disponible</span>
              <span className="text-sm font-extrabold text-gray-800">{premio.stock} unidades</span>
            </div>
          </div>

          {/* Estado del Premio */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-600">Estado en catálogo</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                premio.estado === 'Activo'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {premio.estado}
            </span>
          </div>

          {/* Imagen Adjunta */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
            <span className="text-gray-400 font-semibold text-[11px]">Imagen:</span>
            <span className="text-gray-700 font-medium text-[11px] truncate">{premio.imagen || 'Sin imagen adjunta'}</span>
          </div>

        </div>

        {/* Botón de Cierre */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 font-semibold text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}