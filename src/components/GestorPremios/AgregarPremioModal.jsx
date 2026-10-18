import { useState } from 'react';

/**
 * Componente Modal para agregar un nuevo premio al catálogo de ULima Recicla.
 * 
 * @param {Function} onClose - Función callback para cerrar el modal.
 * @param {Function} onSave - Función callback para guardar el objeto premio.
 */
export default function AgregarPremioModal({ onClose, onSave }) {
  // Estado inicial que combina los datos estáticos de la maqueta con soporte dinámico
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    puntos: '',
    stock: '',
    estado: 'Activo',
    imagenNombre: 'cubiertos-bambu.png', // Valor estático por defecto según prototipo
    imagenTamano: '240 KB'
  });

  // Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Emitimos el nuevo objeto garantizando valores numéricos no negativos
    onSave({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      puntos: Math.max(0, Number(formData.puntos)),
      stock: Math.max(0, Number(formData.stock)),
      estado: formData.estado,
      imagen: formData.imagenNombre
    });
  };

  // Permite seleccionar un nuevo archivo o conservar el valor estático por defecto
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tamanoKB = Math.round(file.size / 1024);
      setFormData({
        ...formData,
        imagenNombre: file.name,
        imagenTamano: `${tamanoKB} KB`
      });
    }
  };

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

        {/* Ícono Ilustrativo del Encabezado */}
        <div className="w-10 h-10 bg-[#fef2e8] rounded-xl flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-[#f05a28]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>

        {/* Título y Descripción del Formulario */}
        <h3 className="text-xl font-bold text-gray-900">Agregar premio</h3>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          Completa los datos del nuevo premio. Los campos marcados con * son obligatorios.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Campo: Nombre del premio */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Nombre del premio *</label>
            <input
              type="text"
              required
              placeholder="Set de cubiertos reutilizables"
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
              placeholder="Bambú · Incluye estuche de tela"
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
                placeholder="600"
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
                placeholder="40"
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

          {/* Caja de Imagen Adjunta (Soporta valor estático por defecto y selección de archivo) */}
          <div className="p-3 border border-gray-200 rounded-xl flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xs">
                🍴
              </div>
              <div>
                <div className="font-semibold text-gray-800">{formData.imagenNombre}</div>
                <div className="text-[10px] text-gray-400">Imagen adjunta · {formData.imagenTamano}</div>
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
              Agregar premio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}