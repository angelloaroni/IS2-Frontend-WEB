import { useState } from 'react';

export default function EditarUsuarioModal({ usuario, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    estado: usuario.estado
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-gray-600">
          ✕
        </button>

        <div className="w-10 h-10 bg-[#fef2e8] rounded-xl flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-[#f05a28]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900">Editar usuario</h3>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          Actualiza los datos de {usuario.nombres} {usuario.apellidos}. Su código de usuario se conserva.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-gray-400 font-medium">Código de usuario · No editable</div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">{usuario.codigo}</div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Nombres *</label>
              <input
                type="text"
                required
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Apellidos *</label>
              <input
                type="text"
                required
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Correo universitario *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] pr-9"
              />
              <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Estado de la cuenta *</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] bg-white"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="text-[11px] text-gray-400">
            Los cambios de perfil no modifican sus {usuario.puntos.toLocaleString()} puntos ni las entregas registradas.
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
              className="px-4 py-2.5 rounded-xl bg-[#f05a28] text-white hover:bg-[#d94d1f] font-semibold"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}