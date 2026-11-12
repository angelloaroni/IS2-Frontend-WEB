import { useCallback, useEffect, useState } from 'react';
import { rankingApi } from '../api';
import { horaActual, rangoMeses } from '../utils/fechas';

export default function useRanking({ periodo }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizado, setActualizado] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    const rango = rangoMeses(periodo);
    try {
      const respuesta = await rankingApi.obtener({ desde: rango.desde, hasta: rango.hasta });
      setDatos({
        top: respuesta?.top || [],
        totalUsuarios: Number(respuesta?.total_usuarios) || 0,
        criterio: respuesta?.criterio || 'puntos_ganados',
        meses: rango.meses,
      });
      setActualizado(horaActual());
    } catch (err) {
      setError(err.message || 'No se pudo cargar el ranking.');
      setDatos(null);
    }
    setCargando(false);
  }, [periodo]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { datos, cargando, error, actualizado, recargar: cargar };
}
