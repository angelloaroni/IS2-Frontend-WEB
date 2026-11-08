import { formatoEntero, formatoKg, formatoPorcentaje } from './constantes';

export default function IndicadoresParticipacion({ materiales: mat, materialesPrevio: matPrev, participacion: par, participacionPrevia: parPrev, filtraMaterial }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Indicador etiqueta="Residuos registrados" valor={formatoEntero(mat.totalResiduos)} actual={mat.totalResiduos} previo={matPrev?.totalResiduos} />
      <Indicador etiqueta="Kg reciclados" valor={formatoKg(mat.pesoTotalKg)} actual={mat.pesoTotalKg} previo={matPrev?.pesoTotalKg} />
      <Indicador
        etiqueta="Usuarios participantes"
        valor={formatoEntero(par.participantes)}
        actual={par.participantes}
        previo={parPrev?.participantes}
        nota={`de ${formatoEntero(par.denominador)} usuarios activos${filtraMaterial ? ' · todos los materiales' : ''}`}
      />
      <Indicador
        etiqueta="Tasa de participación"
        valor={par.tasaPorcentaje == null ? '—' : formatoPorcentaje(par.tasaPorcentaje)}
        actual={par.tasaPorcentaje}
        previo={parPrev?.tasaPorcentaje}
        enPuntos
        nota={filtraMaterial ? 'Considera todos los materiales' : undefined}
      />
    </div>
  );
}

function Indicador({ etiqueta, valor, actual, previo, nota, enPuntos = false }) {
  let variacion = null;
  let texto = '';
  if (previo != null && actual != null) {
    if (enPuntos) {
      variacion = actual - previo;
      texto = `${Math.abs(Math.round(variacion))} pp`;
    } else if (previo === 0) {
      variacion = actual > 0 ? Infinity : 0;
      texto = actual > 0 ? 'nuevo' : '0%';
    } else {
      variacion = ((actual - previo) / previo) * 100;
      texto = `${Math.abs(Math.round(variacion))}%`;
    }
  }
  const sube = variacion !== null && variacion > 0.5;
  const baja = variacion !== null && variacion < -0.5;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{etiqueta}</div>
      <div className="text-3xl font-extrabold text-gray-900 mt-1 tabular-nums">{valor}</div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] flex-wrap">
        {variacion === null ? (
          <span className="text-gray-400">Sin datos del periodo anterior</span>
        ) : (
          <>
            <span
              className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md ${
                sube ? 'bg-emerald-50 text-emerald-700' : baja ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span aria-hidden="true">{sube ? '▲' : baja ? '▼' : '■'}</span>
              {texto}
              <span className="sr-only">{sube ? 'más' : baja ? 'menos' : 'sin cambio'}</span>
            </span>
            <span className="text-gray-400">vs. periodo anterior</span>
          </>
        )}
      </div>
      {nota && <div className="text-[11px] text-gray-500 mt-1.5">{nota}</div>}
    </div>
  );
}
