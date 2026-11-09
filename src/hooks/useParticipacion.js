import { useCallback, useEffect, useState } from 'react';
import { MATERIALES, dashboardApi, rankingApi } from '../api';
import { horaActual, rangoMeses } from '../utils/fechas';

function composicion(porTipo = []) {
  const total = porTipo.reduce((acc, t) => acc + (Number(t.pesoKg) || 0), 0);
  const filas = MATERIALES.map((m) => {
    const fila = porTipo.find((t) => t.tipo === m);
    return { tipo: m, cantidad: Number(fila?.cantidad) || 0, pesoKg: Number(fila?.pesoKg) || 0 };
  });
  const otros = porTipo.filter((t) => !MATERIALES.includes(t.tipo));
  if (otros.length) {
    filas.push({
      tipo: 'otros',
      cantidad: otros.reduce((acc, t) => acc + (Number(t.cantidad) || 0), 0),
      pesoKg: otros.reduce((acc, t) => acc + (Number(t.pesoKg) || 0), 0)
    });
  }
  return filas.map((m) => ({ ...m, porcentaje: total ? (m.pesoKg / total) * 100 : 0 }));
}

const porMes = (filas = [], clave) => new Map(filas.map((f) => [f.periodo, Number(f[clave]) || 0]));

function serieMensual(meses, materiales, participacion) {
  const residuos = porMes(materiales.porPeriodo, 'totalResiduos');
  const kg = porMes(materiales.porPeriodo, 'pesoTotalKg');
  const participantes = porMes(participacion.porPeriodo, 'participantes');
  const tasa = porMes(participacion.porPeriodo, 'tasaPorcentaje');
  return meses.map((mes) => ({
    mes,
    residuos: residuos.get(mes) ?? 0,
    kg: kg.get(mes) ?? 0,
    participantes: participantes.get(mes) ?? 0,
    tasa: tasa.get(mes) ?? 0
  }));
}

export default function useParticipacion({ periodo, material }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [errorRanking, setErrorRanking] = useState('');
  const [actualizado, setActualizado] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    setErrorRanking('');
    const actual = rangoMeses(periodo);
    const anterior = rangoMeses(periodo, 1);
    const rango = ({ desde, hasta }) => ({ desde, hasta });
    const filtroMaterial = material || undefined;

    const [mat, matPrev, matTodos, par, parPrev, ranking] = await Promise.allSettled([
      dashboardApi.materiales({ ...rango(actual), material: filtroMaterial }),
      dashboardApi.materiales({ ...rango(anterior), material: filtroMaterial }),
      filtroMaterial ? dashboardApi.materiales(rango(actual)) : Promise.resolve(null),
      dashboardApi.participacion(rango(actual)),
      dashboardApi.participacion(rango(anterior)),
      rankingApi.obtener(rango(actual))
    ]);

    const fallo = [mat, par].find((r) => r.status === 'rejected');
    if (fallo) {
      setError(fallo.reason?.message || 'No se pudieron cargar los indicadores.');
      setDatos(null);
    } else {
      const valor = (r) => (r.status === 'fulfilled' ? r.value : null);
      setDatos({
        serie: serieMensual(actual.meses, mat.value, par.value),
        materiales: mat.value,
        materialesPrevio: valor(matPrev),
        composicion: composicion((matTodos.value ?? mat.value)?.porTipo),
        participacion: par.value,
        participacionPrevia: valor(parPrev),
        ranking: (valor(ranking)?.top || []).filter((u) => u.cantidadResiduos > 0)
      });
      if (ranking.status === 'rejected') setErrorRanking(ranking.reason?.message || 'No se pudo cargar el ranking.');
      setActualizado(horaActual());
    }
    setCargando(false);
  }, [periodo, material]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { datos, cargando, error, errorRanking, actualizado, recargar: cargar };
}
