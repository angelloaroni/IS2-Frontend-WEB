export const PERIODOS = [
  { meses: 1, etiqueta: 'Mes en curso' },
  { meses: 3, etiqueta: 'Últimos 3 meses' },
  { meses: 6, etiqueta: 'Últimos 6 meses' },
  { meses: 12, etiqueta: 'Últimos 12 meses' }
];
export const PERIODO_INICIAL = 6;

export const etiquetaPeriodo = (meses) => PERIODOS.find((p) => p.meses === meses)?.etiqueta ?? `${meses} meses`;

export const formatoEntero = (v) => Math.round(v).toLocaleString('es-PE');
export const formatoKg = (v) => v.toLocaleString('es-PE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const formatoPorcentaje = (v) => `${Math.round(v)}%`;

export const METRICAS = {
  residuos: { etiqueta: 'Residuos', titulo: 'Residuos registrados', formato: formatoEntero, usaMaterial: true },
  kg: { etiqueta: 'Kg', titulo: 'Kg reciclados', formato: formatoKg, usaMaterial: true },
  participantes: { etiqueta: 'Participantes', titulo: 'Usuarios participantes', formato: formatoEntero, usaMaterial: false },
  tasa: { etiqueta: 'Tasa', titulo: 'Tasa de participación', formato: formatoPorcentaje, usaMaterial: false }
};

export const COLOR_MATERIAL = {
  plastico: '#2a78d6',
  'papel/carton': '#eb6834',
  vidrio: '#1baf7a'
};
export const COLOR_OTROS = '#9ca3af';
