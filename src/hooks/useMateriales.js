import { useCallback, useEffect, useState } from 'react';
import { MATERIALES, dashboardApi } from '../api';
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
      pesoKg: otros.reduce((acc, t) => acc + (Number(t.pesoKg) || 0), 0),
    });
  }
  return filas.map((m) => ({ ...m, porcentaje: total ? (m.pesoKg / total) * 100 : 0 }));
}

function serieMensual(meses, porPeriodo = []) {
  return meses.map((mes) => {
    const fila = porPeriodo.find((p) => p.periodo === mes);
    return {
      mes,
      residuos: Number(fila?.totalResiduos) || 0,
      kg: Number(fila?.pesoTotalKg) || 0,
    };
  });
}

export default function useMateriales({ periodo, material }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizado, setActualizado] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    const actual = rangoMeses(periodo);
    const anterior = rangoMeses(periodo, 1);
    const filtro = material || undefined;

    try {
      const [mat, matPrev, matTodos] = await Promise.all([
        dashboardApi.materiales({ desde: actual.desde, hasta: actual.hasta, material: filtro }),
        dashboardApi.materiales({ desde: anterior.desde, hasta: anterior.hasta, material: filtro }),
        filtro
          ? dashboardApi.materiales({ desde: actual.desde, hasta: actual.hasta })
          : Promise.resolve(null),
      ]);
      const base = matTodos ?? mat;
      setDatos({
        actual: mat,
        previo: matPrev,
        composicion: composicion(base.porTipo),
        serie: serieMensual(actual.meses, mat.porPeriodo),
        meses: actual.meses,
        porTipoYPeriodo: base.porTipoYPeriodo || [],
      });
      setActualizado(horaActual());
    } catch (err) {
      setError(err.message || 'No se pudo cargar el dashboard de materiales.');
      setDatos(null);
    }
    setCargando(false);
  }, [periodo, material]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { datos, cargando, error, actualizado, recargar: cargar };
}
