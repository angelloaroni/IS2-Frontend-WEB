import { useEffect } from 'react';

const ESTILOS = {
  ok: { clase: 'bg-emerald-50 text-emerald-800 border-emerald-100', icono: '✓' },
  alerta: { clase: 'bg-[#fff6f0] text-[#b9421a] border-[#fde2d1]', icono: '!' },
  error: { clase: 'bg-red-50 text-red-700 border-red-200', icono: '!' }
};

export default function Aviso({ aviso, onCerrar, duracion = 4000 }) {
  useEffect(() => {
    if (!aviso) return undefined;
    const t = setTimeout(onCerrar, duracion);
    return () => clearTimeout(t);
  }, [aviso, onCerrar, duracion]);

  if (!aviso) return null;
  const estilo = ESTILOS[aviso.tipo] ?? ESTILOS.ok;

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-[60] max-w-sm flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-xs font-semibold border ${estilo.clase}`}
    >
      <span aria-hidden="true">{estilo.icono}</span>
      <span>{aviso.texto}</span>
      <button onClick={onCerrar} aria-label="Cerrar aviso" className="ml-2 opacity-60 hover:opacity-100">
        ✕
      </button>
    </div>
  );
}
