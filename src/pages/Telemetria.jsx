import { useEffect, useRef, useState } from 'react';
import { etiquetaMaterial, tachosApi } from '../api';
import Sidebar from '../components/Layout/Sidebar';
import Encabezado from '../components/Layout/Encabezado';

const INTERVALO_ACTUALIZACION_MS = 5_000;

function tachoVista(tacho) {
  const porcentaje = tacho.porcentaje == null ? null : Number(tacho.porcentaje);
  const llenado = porcentaje == null
    ? (tacho.capacidad ? 100 : 0)
    : Math.min(100, Math.max(0, porcentaje));
  return {
    id: tacho.idTacho,
    etiqueta: `T-${String(tacho.idTacho).padStart(2, '0')}`,
    tipo: etiquetaMaterial(tacho.tipo),
    ubicacion: `${Number(tacho.latitud).toFixed(4)}, ${Number(tacho.longitud).toFixed(4)}`,
    llenado,
    sinLectura: porcentaje == null && tacho.capacidad !== true,
    lleno: tacho.capacidad === true,
  };
}

function horaActual() {
  return new Date().toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Telemetria() {
  const [tachos, setTachos] = useState([]);
  const [fechaUltimaActualizacion, setFechaUltimaActualizacion] = useState('');
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState('');
  const solicitudEnCurso = useRef(false);

  const cargarTachos = async ({ inicial = false } = {}) => {
    if (solicitudEnCurso.current) return;
    solicitudEnCurso.current = true;
    setActualizando(true);
    if (inicial) setCargando(true);
    setError('');
    try {
      const data = await tachosApi.listar();
      setTachos((data || []).map(tachoVista));
      setFechaUltimaActualizacion(horaActual());
    } catch (err) {
      setError(err.message);
    } finally {
      solicitudEnCurso.current = false;
      setActualizando(false);
      if (inicial) setCargando(false);
    }
  };

  useEffect(() => {
    cargarTachos({ inicial: true });
    const intervalo = setInterval(() => cargarTachos(), INTERVALO_ACTUALIZACION_MS);
    return () => clearInterval(intervalo);
  }, []);

  const totalTachos = tachos.length;
  const recoleccionCount = tachos.filter((t) => t.lleno || t.llenado >= 80).length;
  const sinLecturaCount = tachos.filter((t) => t.sinLectura).length;

  return (
    <div className="flex min-h-screen bg-[#f6f7f6] font-sans text-gray-800">
      <Sidebar activo="telemetria" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Encabezado titulo="Telemetría" />

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f05a28]">
                Monitoreo de tachos del campus
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Telemetría</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Batería, conexión y capacidad: una lectura clara de cada punto de reciclaje.
              </p>
            </div>

            <button
              onClick={() => cargarTachos()}
              disabled={actualizando}
              className="bg-[#f05a28] hover:bg-[#d94d1f] disabled:opacity-60 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-sm self-start md:self-auto"
            >
              <svg className={`w-4 h-4 ${actualizando ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {actualizando ? 'Actualizando…' : 'Actualizar'}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-emerald-800">
                Lecturas guardadas de los tachos activos
              </div>
              <div className="text-xs text-emerald-700 mt-0.5">
                {totalTachos} tachos · {recoleccionCount} requieren recolección · {sinLecturaCount} sin porcentaje
              </div>
            </div>
            <div className="text-xs text-gray-400 font-medium self-end sm:self-auto">
              {fechaUltimaActualizacion || 'Sin consulta'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cargando && (
              <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 text-center text-xs text-gray-400">
                Cargando tachos...
              </div>
            )}
            {!cargando && tachos.length === 0 && (
              <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 text-center text-xs text-gray-400">
                No hay tachos activos registrados.
              </div>
            )}
            {tachos.map((tacho) => {
              const requiereRecoleccion = tacho.lleno || tacho.llenado >= 80;

              return (
                <div key={tacho.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-extrabold text-gray-900">
                        {tacho.etiqueta} · {tacho.tipo}
                      </div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">
                        {tacho.ubicacion}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tacho.lleno
                          ? 'bg-[#fff6f0] text-[#f05a28]'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {tacho.lleno ? 'Lleno' : 'Con espacio'}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="relative w-16 h-20 bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden shrink-0 flex items-end p-1">
                      <div
                        style={{ height: `${tacho.llenado}%` }}
                        className={`w-full rounded-lg transition-all duration-500 ${
                          requiereRecoleccion ? 'bg-[#f05a28]' : 'bg-emerald-500'
                        }`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-3xl font-black ${requiereRecoleccion ? 'text-[#f05a28]' : 'text-emerald-600'}`}>
                          {tacho.llenado}%
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {tacho.sinLectura ? 'sin lectura de porcentaje' : 'de llenado'}
                        </span>
                      </div>

                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${tacho.llenado}%` }}
                          className={`h-full transition-all duration-500 ${
                            requiereRecoleccion ? 'bg-[#f05a28]' : 'bg-emerald-500'
                          }`}
                        />
                      </div>

                      <div className={`text-xs font-bold ${requiereRecoleccion ? 'text-[#f05a28]' : 'text-emerald-600'}`}>
                        {requiereRecoleccion ? 'Requiere recolección' : 'Capacidad disponible'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 font-medium">
                    Coordenadas del tacho activo
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2 pt-4 border-t border-gray-200/60">
            <div>
              Recolección desde 80% de llenado o cuando el tacho reporta capacidad llena.<br />
              Consulta automática al backend cada 5 segundos; también puedes actualizar manualmente.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
            <div>Universidad de Lima · Proyecto de reciclaje</div>
            <div>2026</div>
          </div>
        </div>
      </main>
    </div>
  );
}