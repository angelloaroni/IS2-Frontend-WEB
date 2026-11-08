import { MATERIALES, etiquetaMaterial } from '../../api';
import { COLOR_MATERIAL, COLOR_OTROS, formatoEntero, formatoKg } from './constantes';

const nombre = (tipo) => (tipo === 'otros' ? 'Otros' : etiquetaMaterial(tipo));
const color = (tipo) => COLOR_MATERIAL[tipo] ?? COLOR_OTROS;

export default function ComposicionMateriales({ composicion, material, periodo, onMaterial }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-sm font-extrabold text-gray-900">Kg reciclados por material</h2>
      <p className="text-[11px] text-gray-400 mt-0.5 mb-5">{periodo} · haz clic en un material para filtrar</p>

      <div
        className="flex h-4 w-full gap-[2px] rounded-[4px] overflow-hidden bg-gray-100"
        role="img"
        aria-label={composicion.map((m) => `${nombre(m.tipo)} ${Math.round(m.porcentaje)}%`).join(', ')}
      >
        {composicion.filter((m) => m.pesoKg > 0).map((m) => (
          <div
            key={m.tipo}
            title={`${nombre(m.tipo)}: ${formatoKg(m.pesoKg)} kg (${Math.round(m.porcentaje)}%)`}
            className="h-full transition-opacity"
            style={{ width: `${m.porcentaje}%`, background: color(m.tipo), opacity: !material || material === m.tipo ? 1 : 0.25 }}
          />
        ))}
      </div>

      <ul className="mt-5 divide-y divide-gray-50">
        {composicion.map((m) => {
          const filtrable = MATERIALES.includes(m.tipo);
          const seleccionado = material === m.tipo;
          return (
            <li key={m.tipo}>
              <button
                onClick={() => filtrable && onMaterial(seleccionado ? '' : m.tipo)}
                disabled={!filtrable}
                aria-pressed={seleccionado}
                className={`w-full flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl text-xs text-left transition-colors ${
                  seleccionado ? 'bg-gray-50' : 'hover:bg-gray-50'
                } ${material && !seleccionado ? 'opacity-50' : ''} disabled:cursor-default`}
              >
                <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: color(m.tipo) }} />
                <span className="font-semibold text-gray-800 flex-1">{nombre(m.tipo)}</span>
                <span className="text-gray-400 tabular-nums">{formatoEntero(m.cantidad)} residuos</span>
                <span className="w-20 text-right font-bold text-gray-900 tabular-nums">{formatoKg(m.pesoKg)} kg</span>
                <span className="w-10 text-right text-gray-500 tabular-nums">{Math.round(m.porcentaje)}%</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
