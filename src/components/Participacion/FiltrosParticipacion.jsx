import { MATERIALES, etiquetaMaterial } from '../../api';
import { PERIODOS } from './constantes';

export default function FiltrosParticipacion({ periodo, material, actualizado, hayFiltros, onPeriodo, onMaterial, onRestablecer }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col lg:flex-row lg:items-end gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        <Filtro etiqueta="Periodo" valor={periodo} onChange={(v) => onPeriodo(Number(v))}>
          {PERIODOS.map((p) => (
            <option key={p.meses} value={p.meses}>{p.etiqueta}</option>
          ))}
        </Filtro>
        <Filtro etiqueta="Material" valor={material} onChange={onMaterial}>
          <option value="">Todos los materiales</option>
          {MATERIALES.map((m) => (
            <option key={m} value={m}>{etiquetaMaterial(m)}</option>
          ))}
        </Filtro>
      </div>
      <div className="flex items-center justify-between lg:justify-end gap-4 lg:pl-4 lg:border-l border-gray-100 lg:pb-1">
        <div className="text-[11px] text-gray-400 leading-tight">
          Actualizado<br />
          <span className="font-semibold text-gray-600">{actualizado || '—'}</span>
        </div>
        <button
          onClick={onRestablecer}
          disabled={!hayFiltros}
          className="text-xs font-semibold text-[#f05a28] hover:underline disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
        >
          Restablecer
        </button>
      </div>
    </div>
  );
}

function Filtro({ etiqueta, valor, onChange, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">{etiqueta}</span>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] text-gray-700 bg-white"
      >
        {children}
      </select>
    </label>
  );
}
