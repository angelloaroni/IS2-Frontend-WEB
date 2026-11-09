import { useEffect, useRef, useState } from 'react';

const ALTO = 240;
const MARGEN = { arriba: 14, derecha: 16, abajo: 28, izquierda: 40 };
const COLOR = '#f05a28';

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

export default function GraficoTendencia({ puntos, formato = (v) => v, nombreSerie }) {
  const [ref, ancho] = useAncho();
  const [activo, setActivo] = useState(null);

  const anchoPlot = Math.max(0, ancho - MARGEN.izquierda - MARGEN.derecha);
  const altoPlot = ALTO - MARGEN.arriba - MARGEN.abajo;
  const maximo = Math.max(...puntos.map((p) => p.valor), 0);
  const paso = pasoRedondo(maximo, 4);
  const tope = Math.max(paso, Math.ceil(maximo / paso) * paso);
  const marcas = Array.from({ length: Math.round(tope / paso) + 1 }, (_, i) => i * paso);

  const x = (i) => MARGEN.izquierda + (puntos.length <= 1 ? anchoPlot / 2 : (i / (puntos.length - 1)) * anchoPlot);
  const y = (v) => MARGEN.arriba + altoPlot - (v / tope) * altoPlot;

  const linea = puntos.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.valor)}`).join(' ');
  const area = puntos.length
    ? `${linea} L${x(puntos.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
    : '';

  const cadaCuanto = Math.max(1, Math.ceil(puntos.length / Math.max(1, Math.floor(anchoPlot / 70))));

  const alMover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - MARGEN.izquierda;
    const i = puntos.length <= 1 ? 0 : Math.round((px / anchoPlot) * (puntos.length - 1));
    setActivo(Math.min(puntos.length - 1, Math.max(0, i)));
  };

  const p = activo !== null ? puntos[activo] : null;
  const tooltipIzquierda = p ? Math.min(Math.max(x(activo) - 80, 0), Math.max(0, ancho - 160)) : 0;

  return (
    <div ref={ref} className="relative w-full" style={{ height: ALTO }}>
      {ancho > 0 && (
        <svg
          width={ancho}
          height={ALTO}
          role="img"
          aria-label={`${nombreSerie}: ${puntos.map((pt) => `${pt.etiqueta} ${formato(pt.valor)}`).join(', ')}`}
          onMouseMove={alMover}
          onMouseLeave={() => setActivo(null)}
          className="block"
        >
          <defs>
            <linearGradient id="relleno-tendencia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLOR} stopOpacity="0.18" />
              <stop offset="100%" stopColor={COLOR} stopOpacity="0" />
            </linearGradient>
          </defs>

          {marcas.map((m) => (
            <g key={m}>
              <line
                x1={MARGEN.izquierda}
                x2={MARGEN.izquierda + anchoPlot}
                y1={y(m)}
                y2={y(m)}
                stroke={m === 0 ? '#d1d5db' : '#f0f0ee'}
                strokeWidth="1"
              />
              <text x={MARGEN.izquierda - 8} y={y(m)} dy="0.32em" textAnchor="end" className="fill-gray-400 text-[10px]">
                {formato(m)}
              </text>
            </g>
          ))}

          {puntos.map((pt, i) =>
            i % cadaCuanto === 0 || i === puntos.length - 1 ? (
              <text
                key={pt.etiqueta}
                x={x(i)}
                y={ALTO - 8}
                textAnchor={i === 0 ? 'start' : i === puntos.length - 1 ? 'end' : 'middle'}
                className="fill-gray-400 text-[10px]"
              >
                {pt.etiqueta}
              </text>
            ) : null
          )}

          <path d={area} fill="url(#relleno-tendencia)" />
          <path d={linea} fill="none" stroke={COLOR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {puntos.length > 0 && activo === null && (
            <circle cx={x(puntos.length - 1)} cy={y(puntos[puntos.length - 1].valor)} r="4" fill={COLOR} stroke="#fff" strokeWidth="2" />
          )}

          {p && (
            <g pointerEvents="none">
              <line x1={x(activo)} x2={x(activo)} y1={MARGEN.arriba} y2={y(0)} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={x(activo)} cy={y(p.valor)} r="5" fill={COLOR} stroke="#fff" strokeWidth="2" />
            </g>
          )}

          <rect x={MARGEN.izquierda - 10} y={0} width={anchoPlot + 20} height={ALTO} fill="transparent" />
        </svg>
      )}

      {p && (
        <div
          className="absolute pointer-events-none bg-white border border-gray-200 shadow-lg rounded-xl px-3 py-2 text-xs w-40"
          style={{ left: tooltipIzquierda, top: Math.max(0, y(p.valor) - 78) }}
        >
          <div className="text-[10px] text-gray-400 font-medium">{p.detalle ?? p.etiqueta}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full" style={{ background: COLOR }} />
            <span className="text-gray-500">{nombreSerie}</span>
          </div>
          <div className="text-base font-extrabold text-gray-900 tabular-nums">{formato(p.valor)}</div>
        </div>
      )}
    </div>
  );
}
