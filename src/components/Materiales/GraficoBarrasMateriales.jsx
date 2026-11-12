import { useEffect, useRef, useState } from 'react';
import { MATERIALES, etiquetaMaterial } from '../../api';
import { etiquetaMes } from '../../utils/fechas';
import { COLOR_MATERIAL, formatoKg } from '../Participacion/constantes';

const ALTO = 280;
const MARGEN = { arriba: 16, derecha: 8, abajo: 36, izquierda: 46 };

function pasoRedondo(maximo, divisiones) {
  const bruto = Math.max(maximo, 1) / divisiones;
  const potencia = 10 ** Math.floor(Math.log10(bruto));
  const n = bruto / potencia;
  const factor = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return factor * potencia;
}

function useAncho() {
  const ref = useRef(null);
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    if (!ref.current) return undefined;
    const obs = new ResizeObserver(([entrada]) => setAncho(entrada.contentRect.width));
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, ancho];
}

export default function GraficoBarrasMateriales({ meses, porTipoYPeriodo, material, onMaterial }) {
  const [ref, ancho] = useAncho();
  const [activo, setActivo] = useState(null);
  const tipos = material ? [material] : MATERIALES;

  const valor = (mes, tipo) => {
    const fila = porTipoYPeriodo.find((p) => p.periodo === mes && p.tipo === tipo);
    return Number(fila?.pesoKg) || 0;
  };

  const series = tipos.map((tipo) => ({
    tipo,
    color: COLOR_MATERIAL[tipo],
    valores: meses.map((mes) => valor(mes, tipo)),
  }));

  const maximo = Math.max(0, ...series.flatMap((s) => s.valores));
  const paso = pasoRedondo(maximo, 4);
  const tope = Math.max(paso, Math.ceil((maximo || paso) / paso) * paso);
  const marcas = Array.from({ length: Math.round(tope / paso) + 1 }, (_, i) => i * paso);

  const anchoPlot = Math.max(0, ancho - MARGEN.izquierda - MARGEN.derecha);
  const altoPlot = ALTO - MARGEN.arriba - MARGEN.abajo;
  const grupo = meses.length ? anchoPlot / meses.length : anchoPlot;
  const y = (v) => MARGEN.arriba + altoPlot - (v / tope) * altoPlot;
  const cadaCuanto = Math.max(1, Math.ceil(meses.length / Math.max(1, Math.floor(anchoPlot / 64))));

  const barra = (i, j) => {
    const hueco = Math.min(14, grupo * 0.18);
    const util = Math.max(4, grupo - hueco);
    const anchoBarra = util / series.length;
    const x = MARGEN.izquierda + i * grupo + hueco / 2 + j * anchoBarra;
    return { x, ancho: Math.max(2, anchoBarra - 3) };
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-extrabold text-gray-900">Kg por material y mes</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {material ? `${etiquetaMaterial(material)} · el gráfico muestra solo el material filtrado` : 'Comparación mensual de los tres materiales'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar material del gráfico">
          <button
            type="button"
            onClick={() => onMaterial('')}
            aria-pressed={material === ''}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
              material === '' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          {MATERIALES.map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => onMaterial(material === tipo ? '' : tipo)}
              aria-pressed={material === tipo}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                material === tipo ? 'bg-gray-50 border-gray-300 text-gray-900' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="w-2 h-2 rounded-[2px]" style={{ background: COLOR_MATERIAL[tipo] }} />
              {etiquetaMaterial(tipo)}
            </button>
          ))}
        </div>
      </div>

      <div ref={ref} className="relative w-full" style={{ height: ALTO }}>
        {ancho > 0 && (
          <svg width={ancho} height={ALTO} role="img" aria-label={resumen(meses, series)} className="block">
            {marcas.map((m) => (
              <g key={m}>
                <line
                  x1={MARGEN.izquierda}
                  x2={MARGEN.izquierda + anchoPlot}
                  y1={y(m)}
                  y2={y(m)}
                  stroke={m === 0 ? '#d1d5db' : '#f0f0ee'}
                />
                <text x={MARGEN.izquierda - 8} y={y(m)} dy="0.32em" textAnchor="end" className="fill-gray-400 text-[10px]">
                  {formatoKg(m)}
                </text>
              </g>
            ))}

            {meses.map((mes, i) =>
              i % cadaCuanto === 0 || i === meses.length - 1 ? (
                <text
                  key={mes}
                  x={MARGEN.izquierda + i * grupo + grupo / 2}
                  y={ALTO - 10}
                  textAnchor="middle"
                  className="fill-gray-400 text-[10px]"
                >
                  {etiquetaMes(mes, { corto: true })}
                </text>
              ) : null
            )}

            {series.map((serie, j) =>
              serie.valores.map((v, i) => {
                const b = barra(i, j);
                const alto = Math.max(0, y(0) - y(v));
                const clave = `${serie.tipo}-${meses[i]}`;
                const seleccionado = activo?.clave === clave;
                return (
                  <rect
                    key={clave}
                    x={b.x}
                    y={y(v)}
                    width={b.ancho}
                    height={alto}
                    rx="2"
                    fill={serie.color}
                    opacity={seleccionado ? 1 : 0.88}
                    onMouseEnter={() => setActivo({ clave, mes: meses[i], tipo: serie.tipo, valor: v, x: b.x + b.ancho / 2 })}
                    onMouseLeave={() => setActivo(null)}
                  />
                );
              })
            )}
          </svg>
        )}

        {activo && (
          <div
            className="absolute pointer-events-none bg-white border border-gray-200 shadow-lg rounded-xl px-3 py-2 text-xs w-40"
            style={{ left: Math.min(Math.max(activo.x - 80, 0), Math.max(0, ancho - 160)), top: 8 }}
          >
            <div className="text-[10px] text-gray-400">{etiquetaMes(activo.mes)}</div>
            <div className="font-semibold text-gray-800 mt-0.5">{etiquetaMaterial(activo.tipo)}</div>
            <div className="text-base font-extrabold text-gray-900 tabular-nums">{formatoKg(activo.valor)} kg</div>
          </div>
        )}
      </div>
    </section>
  );
}

function resumen(meses, series) {
  return series
    .map((s) => `${etiquetaMaterial(s.tipo)}: ${meses.map((mes, i) => `${etiquetaMes(mes, { corto: true })} ${formatoKg(s.valores[i])} kg`).join(', ')}`)
    .join('. ');
}
