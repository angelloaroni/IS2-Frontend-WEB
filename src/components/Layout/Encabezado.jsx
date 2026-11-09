import { MODO_DEMO, getSesion, inicialesDe } from '../../api';

export default function Encabezado({ titulo }) {
  const sesion = getSesion();

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <span>Administración</span>
        <span>&gt;</span>
        <span className="text-gray-900 font-semibold">{titulo}</span>
      </div>

      <div className="flex items-center gap-3">
        {MODO_DEMO && (
          <span
            title="Sin backend: los datos son simulados en el navegador y se reinician al recargar"
            className="bg-[#fef2e8] text-[#b9421a] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
          >
            Modo demo
          </span>
        )}
        <span className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Campus Lima
        </span>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#fef2e8] text-[#f05a28] font-bold text-xs flex items-center justify-center">
            {inicialesDe(sesion?.nombre)}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-gray-900 leading-tight">{sesion?.nombre || 'Administrador'}</div>
            <div className="text-[10px] text-gray-400 leading-tight">Administrador · {sesion?.cod_user}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
