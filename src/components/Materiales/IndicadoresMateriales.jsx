import { etiquetaMaterial } from '../../api';
import { formatoEntero, formatoKg } from '../Participacion/constantes';

export default function IndicadoresMateriales({ actual, previo, material }) {
  const lider = [...(actual.porTipo || [])].sort((a, b) => (b.pesoKg || 0) - (a.pesoKg || 0))[0];
  const promedio = actual.totalResiduos ? actual.pesoTotalKg / actual.totalResiduos : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Indicador etiqueta="Kg reciclados" valor={formatoKg(actual.pesoTotalKg)} actual={actual.pesoTotalKg} previo={previo?.pesoTotalKg} />
      <Indicador etiqueta="Residuos registrados" valor={formatoEntero(actual.totalResiduos)} actual={actual.totalResiduos} previo={previo?.totalResiduos} />
      <Indicador
        etiqueta="Kg por residuo"
        valor={formatoKg(promedio)}
        actual={promedio}
        previo={previo?.totalResiduos ? previo.pesoTotalKg / previo.totalResiduos : null}
        nota={material ? etiquetaMaterial(material) : 'Promedio de todos los materiales'}
      />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Material con más peso</div>
        <div className="text-2xl font-extrabold text-gray-900 mt-1">
          {material ? etiquetaMaterial(material) : lider?.pesoKg ? etiquetaMaterial(lider.tipo) : 'Sin datos'}
        </div>
        <div className="text-[11px] text-gray-500 mt-2">
          {material
            ? `${formatoKg(actual.pesoTotalKg)} kg en el periodo filtrado`
            : lider?.pesoKg
              ? `${formatoKg(lider.pesoKg)} kg · ${formatoEntero(lider.cantidad)} residuos`
              : 'No hay residuos en este periodo'}
        </div>
      </div>
    </div>
  );
}

function Indicador({ etiqueta, valor, actual, previo, nota }) {
  let variacion = null;
  let texto = '';
  if (previo != null && actual != null) {
    if (previo === 0) {
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
            </span>
            <span className="text-gray-400">vs. periodo anterior</span>
          </>
        )}
      </div>
      {nota && <div className="text-[11px] text-gray-500 mt-1.5">{nota}</div>}
    </div>
  );
}
