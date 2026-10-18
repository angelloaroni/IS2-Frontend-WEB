import { useState } from 'react';

/**
 * Componente Modal para editar un premio existente en el catálogo de ULima Recicla.
 * 
 * @param {Object} premio - Objeto con los datos actuales del premio seleccionado.
 * @param {Function} onClose - Función callback para cerrar el modal.
 * @param {Function} onSave - Función callback para guardar las modificaciones.
 */
export default function EditarPremioModal({ premio, onClose, onSave }) {
  // Inicializamos el estado local cargando las propiedades del premio recibido
  const [formData, setFormData] = useState({
    nombre: premio.nombre || '',
    descripcion: premio.descripcion || '',
    puntos: premio.puntos || '',
    stock: premio.stock || '',
    estado: premio.estado || 'Activo',
    imagen: premio.imagen || 'botella-reutilizable.png',
    imagenTamano: '180 KB'
  });

  // Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Enviamos el objeto con las modificaciones asegurando tipos de datos correctos
    onSave({
      ...premio, // Mantiene el ID original y otras propiedades
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      puntos: Math.max(0, Number(formData.puntos)),
      stock: Math.max(0, Number(formData.stock)),
      estado: formData.estado,
      imagen: formData.imagen
    });
  };

  // Manejador para cambiar la imagen seleccionada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tamanoKB = Math.round(file.size / 1024);
      setFormData({
        ...formData,
        imagen: file.name,
        imagenTamano: `${tamanoKB} KB`
      });
    }
  };

  return (
    // Fondo oscuro translúcido (Overlay)
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      
      {/* Contenedor Flotante del Modal */}
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        
        {/* Botón de Cierre (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors"
          title="Cerrar modal"
        >
          ✕
        </button>

        {/* Ícono Ilustrativo del Encabezado */}
        <div className="w-10 h-10 bg-[#fef2e8] rounded-xl flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-[#f05a28]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>

        {/* Título y Descripción dinámicos */}
        <h3 className="text-xl font-bold text-gray-900">Editar premio</h3>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          Actualiza la información de <span className="font-semibold text-gray-700">{premio.nombre}</span>. Los cambios se aplicarán al guardar.
        </p>

        {/* Formulario de Edición */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Campo: Nombre del premio */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Nombre del premio *</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28]"
            />
          </div>

          {/* Campo: Descripción */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Descripción *</label>
            <input
              type="text"
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28]"
            />
          </div>

          {/* Cuadrícula para Puntos y Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Puntos requeridos *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.puntos}
                onChange={(e) => setFormData({ ...formData, puntos: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Stock disponible *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28]"
              />
            </div>
          </div>

          {/* Selector de Estado */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Estado *</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] bg-white"
            >
              <option value="Activo">Activo</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>

          {/* Caja de Imagen Actual */}
          <div className="p-3 border border-gray-200 rounded-xl flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xs">
                📦
              </div>
              <div>
                <div className="font-semibold text-gray-800">{formData.imagen}</div>
                <div className="text-[10px] text-gray-400">Imagen actual · {formData.imagenTamano}</div>
              </div>
            </div>

            <label className="text-[#f05a28] font-bold text-[11px] hover:underline cursor-pointer">
              Cambiar
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#f05a28] text-white hover:bg-[#d94d1f] font-semibold transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}