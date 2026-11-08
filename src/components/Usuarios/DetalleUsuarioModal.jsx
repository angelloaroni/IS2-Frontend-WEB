import { useEffect, useState } from 'react';
import { usuarioVista, usuariosApi } from '../../api';
import EstadoBadge from './EstadoBadge';

export default function DetalleUsuarioModal({ usuario: resumen, onClose, onEditar }) {
  const [usuario, setUsuario] = useState(resumen);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    usuariosApi
      .obtener(resumen.id)
      .then((data) => vigente && setUsuario(usuarioVista(data)))
      .catch((err) => vigente && setError(err.message))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [resumen.id]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-usuario-titulo"
      >
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 font-bold">
          ✕
        </button>

        <div className="flex items-center gap-4 mb-5 pr-8">
          <div className="w-14 h-14 rounded-2xl bg-[#fef2e8] text-[#f05a28] font-extrabold text-lg flex items-center justify-center shrink-0">
            {usuario.iniciales}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 id="detalle-usuario-titulo" className="text-xl font-bold text-gray-900 leading-tight">{usuario.nombre}</h3>
              <EstadoBadge activo={usuario.activo} />
            </div>
            <p className="text-xs text-gray-500 truncate">{usuario.correo || 'Sin correo institucional registrado'}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
            No se pudo actualizar el detalle: {error}
          </div>
        )}

        <div className={`grid grid-cols-2 gap-3 text-xs mb-5 transition-opacity ${cargando ? 'opacity-60' : ''}`}>
          <Dato etiqueta="Código de usuario" valor={usuario.codigo} />
          <Dato etiqueta="Tipo de cuenta" valor={usuario.tipo === 'admin' ? 'Administrador' : 'Usuario'} />
          <Dato etiqueta="Puntos disponibles" valor={`${usuario.puntos.toLocaleString('es-PE')} pts`} destacado />
          <Dato etiqueta="ID interno" valor={`#${usuario.id}`} />
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-[11px] text-gray-500 mb-5">
          {usuario.activo
            ? 'Cuenta activa: puede iniciar sesión, registrar reciclaje y canjear premios.'
            : 'Cuenta inactiva: no puede iniciar sesión ni registrar reciclaje hasta que se reactive. Sus puntos se conservan.'}
        </div>

        <div className="flex justify-end gap-2 text-xs">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold">
            Cerrar
          </button>
          <button
            onClick={() => onEditar(usuario)}
            className="px-4 py-2.5 rounded-xl bg-[#f05a28] text-white hover:bg-[#d94d1f] font-semibold"
          >
            Editar usuario
          </button>
        </div>
      </div>
    </div>
  );
}

function Dato({ etiqueta, valor, destacado = false }) {
  return (
    <div className={`rounded-2xl p-3 border min-w-0 ${destacado ? 'bg-[#fff6f0] border-[#fde2d1]' : 'bg-gray-50 border-gray-100'}`}>
      <div className="text-[10px] text-gray-400 font-medium">{etiqueta}</div>
      <div className="font-bold text-gray-900 mt-0.5 truncate" title={valor}>{valor}</div>
    </div>
  );
}
