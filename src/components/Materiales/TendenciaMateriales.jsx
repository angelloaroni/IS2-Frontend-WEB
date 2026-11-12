import { useState } from 'react';
import { etiquetaMaterial } from '../../api';
import { etiquetaMes, rangoMeses } from '../../utils/fechas';
import GraficoTendencia from '../Participacion/GraficoTendencia';
import { formatoEntero, formatoKg } from '../Participacion/constantes';

const METRICAS = {
  kg: { etiqueta: 'Kg', titulo: 'Kg reciclados', formato: formatoKg },
  residuos: { etiqueta: 'Residuos', titulo: 'Residuos registrados', formato: formatoEntero },
};

export default function TendenciaMateriales({ serie, material, periodoTexto }) {
  const [metrica, setMetrica] = useState('kg');
  const [verTabla, setVerTabla] = useState(false);
  const [mesActual] = rangoMeses(1).meses;
  const m = METRICAS[metrica];
  const alcance = material ? etiquetaMaterial(material) : 'todos los materiales';

  const puntos = serie.map((s) => ({
    etiqueta: etiquetaMes(s.mes, { corto: true }),
    detalle: `${etiquetaMes(s.mes)}${s.mes === mesActual ? ' (en curso)' : ''}`,
    valor: s[metrica],
  }));

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-extrabold text-gray-900">{m.titulo} por mes</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {periodoTexto} · {alcance}
            {serie.length > 1 && ` · ${etiquetaMes(mesActual)} aún está en curso`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex bg-gray-100 rounded-xl p-0.5 text-[11px] font-semibold" role="tablist" aria-label="Métrica del gráfico">
            {Object.entries(METRICAS).map(([clave, opcion]) => (
              <button
                key={clave}
                type="button"
                role="tab"
                aria-selected={metrica === clave}
                onClick={() => setMetrica(clave)}
                className={`px-3 py-1.5 rounded-[10px] transition-all ${
                  metrica === clave ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opcion.etiqueta}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setVerTabla(!verTabla)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-semibold text-gray-600 hover:bg-gray-50"
          >
            {verTabla ? 'Ver gráfico' : 'Ver tabla'}
          </button>
        </div>
      </div>

      {verTabla ? (
        <Tabla serie={serie} mesActual={mesActual} />
      ) : serie.length > 1 ? (
        <GraficoTendencia puntos={puntos} formato={m.formato} nombreSerie={m.titulo} />
      ) : (
        <div className="py-10 text-center">
          <div className="text-4xl font-extrabold text-gray-900 tabular-nums">{m.formato(serie[0]?.[metrica] ?? 0)}</div>
          <div className="text-xs text-gray-400 mt-1">
            {m.titulo.toLowerCase()} en {etiquetaMes(serie[0]?.mes)} · elige un periodo más largo para ver la tendencia
          </div>
        </div>
      )}
    </section>
  );
}

function Tabla({ serie, mesActual }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left">
        <thead className="text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <tr>
            <th className="py-2 pr-4 font-semibold">Mes</th>
            <th className="py-2 px-4 font-semibold text-right">Residuos</th>
            <th className="py-2 pl-4 font-semibold text-right">Kg</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 tabular-nums">
          {serie.map((s) => (
            <tr key={s.mes}>
              <td className="py-2 pr-4 text-gray-600">
                {etiquetaMes(s.mes)}
                {s.mes === mesActual && <span className="text-gray-400"> (en curso)</span>}
              </td>
              <td className="py-2 px-4 text-right font-semibold text-gray-900">{formatoEntero(s.residuos)}</td>
              <td className="py-2 pl-4 text-right text-gray-700">{formatoKg(s.kg)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
