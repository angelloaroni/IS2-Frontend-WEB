const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];

export function mesActualLima(fecha = new Date()) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit' })
      .formatToParts(fecha)
      .map(({ type, value }) => [type, value])
  );
  return { anio: Number(partes.year), mes: Number(partes.month) };
}

function desplazarMes({ anio, mes }, delta) {
  const total = anio * 12 + (mes - 1) + delta;
  return { anio: Math.floor(total / 12), mes: (total % 12) + 1 };
}

const claveMes = ({ anio, mes }) => `${anio}-${String(mes).padStart(2, '0')}`;
const primerDia = (m) => `${claveMes(m)}-01`;

export function rangoMeses(cantidad, atras = 0, referencia = mesActualLima()) {
  const ultimo = desplazarMes(referencia, -cantidad * atras);
  const primero = desplazarMes(ultimo, -(cantidad - 1));
  const meses = Array.from({ length: cantidad }, (_, i) => claveMes(desplazarMes(primero, i)));
  return { desde: primerDia(primero), hasta: primerDia(desplazarMes(ultimo, 1)), meses };
}

export function etiquetaMes(clave, { corto = false } = {}) {
  const [anio, mes] = String(clave).split('-').map(Number);
  if (!anio || !mes) return clave;
  return corto ? `${MESES[mes - 1]} ${String(anio).slice(2)}` : `${MESES[mes - 1]} ${anio}`;
}

export function horaActual() {
  return new Date().toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
