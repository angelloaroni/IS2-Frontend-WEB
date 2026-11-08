import { useCallback, useEffect, useState } from 'react';
import { dashboardApi, usuarioVista, usuariosApi } from '../api';
import { rangoMeses } from '../utils/fechas';

const PAGINACION_VACIA = { actual: 1, total: 0, paginas: 0 };

export default function useUsuarios({ porPagina = 10 } = {}) {
  const [usuarios, setUsuarios] = useState([]);
  const [paginacion, setPaginacion] = useState(PAGINACION_VACIA);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [termino, setTermino] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [resumen, setResumen] = useState(null);
  const [procesando, setProcesando] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setTermino(busqueda.trim().slice(0, 100));
      setPagina(1);
    }, 350);
    return () => clearTimeout(t);
  }, [busqueda]);

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const data = await usuariosApi.listar({ pagina, limite: porPagina, q: termino || undefined });
      setUsuarios((data?.usuarios || []).map(usuarioVista));
      setPaginacion(data?.pagina || PAGINACION_VACIA);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [pagina, porPagina, termino]);

  const cargarResumen = useCallback(async () => {
    try {
      const { desde, hasta } = rangoMeses(1);
      setResumen(await dashboardApi.participacion({ desde, hasta }));
    } catch {
      setResumen(null);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  const recargar = useCallback(() => Promise.all([cargarUsuarios(), cargarResumen()]), [cargarUsuarios, cargarResumen]);

  const conUsuario = async (id, accion) => {
    setProcesando(id);
    try {
      const resultado = await accion();
      await recargar();
      return resultado;
    } finally {
      setProcesando(null);
    }
  };

  const actualizar = (id, cambios) =>
    conUsuario(id, async () => usuarioVista(await usuariosApi.actualizar(id, cambios)));

  const desactivar = (id) => conUsuario(id, () => usuariosApi.desactivar(id));

  const reactivar = (id) => actualizar(id, { estado: true });

  return {
    usuarios,
    paginacion,
    setPagina,
    busqueda,
    setBusqueda,
    termino,
    cargando,
    error,
    resumen,
    procesando,
    recargar,
    reintentar: cargarUsuarios,
    actualizar,
    desactivar,
    reactivar
  };
}
