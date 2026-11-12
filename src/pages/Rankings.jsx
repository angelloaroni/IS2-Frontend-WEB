import { useMemo, useState } from 'react';
import useRanking from '../hooks/useRanking';
import Sidebar from '../components/Layout/Sidebar';
import Encabezado from '../components/Layout/Encabezado';
import { PERIODOS, PERIODO_INICIAL, etiquetaPeriodo, formatoEntero, formatoKg } from '../components/Participacion/constantes';
import { etiquetaMes, rangoMeses } from '../utils/fechas';

const CRITERIOS = {
  puntos_ganados: 'Puntos ganados en el periodo',
};

const MEDALLAS = ['bg-[#f6e7b2] text-[#8a6a12]', 'bg-gray-200 text-gray-600', 'bg-[#f3d7c4] text-[#8a4b2a]'];

export default function Rankings() {
  const [periodo, setPeriodo] = useState(PERIODO_INICIAL);
  const [busqueda, setBusqueda] = useState('');
  const { datos, cargando, error, actualizado, recargar } = useRanking({ periodo });

  const ranking = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    const filas = datos?.top || [];
    if (!texto) return filas;
    return filas.filter((u) => String(u.nombre || '').toLowerCase().includes(texto));
  }, [datos, busqueda]);

  const hayFiltros = periodo !== PERIODO_INICIAL || busqueda !== '';

  return (
    <div className="flex min-h-screen bg-[#f6f7f6] font-sans text-gray-800">
      <Sidebar activo="rankings" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Encabezado titulo="Rankings" />

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f05a28]">HU12 · Administración</span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Panel de gestión de rankings</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Consulta el ranking del campus, elige uno de los periodos disponibles y filtra a los participantes.
              </p>
            </div>
            <button
              type="button"
              onClick={recargar}
              disabled={cargando}
              className="bg-[#f05a28] hover:bg-[#d94d1f] disabled:opacity-60 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-sm self-start md:self-auto"
            >
              <svg className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {cargando ? 'Actualizando…' : 'Actualizar ranking'}
            </button>
          </div>

          <section>
            <h2 className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">Periodos disponibles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {PERIODOS.map((p) => {
                const rango = rangoMeses(p.meses);
                const activo = periodo === p.meses;
                const desde = etiquetaMes(rango.meses[0]);
                const hasta = etiquetaMes(rango.meses[rango.meses.length - 1]);
                return (
                  <button
                    key={p.meses}
                    type="button"
                    onClick={() => setPeriodo(p.meses)}
                    aria-pressed={activo}
                    className={`text-left rounded-2xl border p-4 transition-all ${
                      activo ? 'bg-[#121c17] text-white border-[#121c17] shadow-sm' : 'bg-white border-gray-100 text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-extrabold">{p.etiqueta}</div>
                    <div className={`text-[11px] mt-1 ${activo ? 'text-gray-300' : 'text-gray-400'}`}>
                      {desde} – {hasta}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col lg:flex-row lg:items-end gap-3">
            <label className="block flex-1">
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Buscar en el ranking</span>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre del participante"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] text-gray-700"
              />
            </label>
            <div className="flex items-center justify-between lg:justify-end gap-4 lg:pl-4 lg:border-l border-gray-100 lg:pb-1">
              <div className="text-[11px] text-gray-400 leading-tight">
                Actualizado<br />
                <span className="font-semibold text-gray-600">{actualizado || '—'}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPeriodo(PERIODO_INICIAL);
                  setBusqueda('');
                }}
                disabled={!hayFiltros}
                className="text-xs font-semibold text-[#f05a28] hover:underline disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
              >
                Restablecer
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center justify-between gap-3">
              <div>
                <div className="font-bold">No se pudo cargar el ranking</div>
                <div className="mt-0.5">{error}</div>
              </div>
              <button type="button" onClick={recargar} className="font-semibold underline shrink-0">Reintentar</button>
            </div>
          )}

          {!datos && cargando && !error && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-xs text-gray-400">Cargando ranking…</div>
          )}

          {datos && (
            <div className={`space-y-6 transition-opacity ${cargando ? 'opacity-60' : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Resumen etiqueta="Periodo activo" valor={etiquetaPeriodo(periodo)} nota={rangoTexto(datos.meses)} />
                <Resumen etiqueta="Criterio" valor={CRITERIOS[datos.criterio] || datos.criterio} nota="Definido por el servicio de ranking" />
                <Resumen etiqueta="Usuarios considerados" valor={formatoEntero(datos.totalUsuarios)} nota={`Top ${datos.top.length} visible en el panel`} />
              </div>

              <Podio filas={(datos.top || []).filter((u) => u.cantidadResiduos > 0).slice(0, 3)} />

              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 pb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-gray-900">Ranking del periodo</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {etiquetaPeriodo(periodo)} · {CRITERIOS[datos.criterio] || datos.criterio}
                      {busqueda.trim() ? ` · filtro “${busqueda.trim()}”` : ''}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {ranking.length} {ranking.length === 1 ? 'fila' : 'filas'}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50/70 text-gray-400 uppercase text-[10px] tracking-wider border-y border-gray-100">
                      <tr>
                        <th className="py-2.5 pl-6 pr-2 font-semibold w-14">Puesto</th>
                        <th className="py-2.5 px-3 font-semibold">Usuario</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Residuos</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Kg</th>
                        <th className="py-2.5 pl-3 pr-6 font-semibold text-right">Puntos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 tabular-nums">
                      {ranking.map((u) => {
                        const puesto = datos.top.findIndex((fila) => fila.id_user === u.id_user) + 1;
                        return (
                          <tr key={u.id_user} className="hover:bg-gray-50/50">
                            <td className="py-2.5 pl-6 pr-2">
                              <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-[11px] font-extrabold ${MEDALLAS[puesto - 1] || 'bg-gray-50 text-gray-400'}`}>
                                {puesto}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-bold text-gray-900">{u.nombre}</td>
                            <td className="py-2.5 px-3 text-right text-gray-700">{formatoEntero(u.cantidadResiduos || 0)}</td>
                            <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{formatoKg(u.pesoTotalKg || 0)}</td>
                            <td className="py-2.5 pl-3 pr-6 text-right text-gray-700">{formatoEntero(u.puntosGanados || 0)}</td>
                          </tr>
                        );
                      })}
                      {ranking.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-gray-400">
                            {busqueda.trim() ? 'Ningún participante del ranking coincide con la búsqueda.' : 'Nadie registró reciclaje en este periodo.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          <div className="text-[11px] text-gray-400 pt-4 border-t border-gray-200/60">
            El ranking considera usuarios activos y ordena por puntos ganados con residuos del periodo elegido. Los inactivos quedan fuera.
          </div>
        </div>
      </main>
    </div>
  );
}

function rangoTexto(meses = []) {
  if (!meses.length) return '';
  return `${etiquetaMes(meses[0])} – ${etiquetaMes(meses[meses.length - 1])}`;
}

function Resumen({ etiqueta, valor, nota }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{etiqueta}</div>
      <div className="text-lg font-extrabold text-gray-900 mt-1">{valor}</div>
      {nota && <div className="text-[11px] text-gray-500 mt-1">{nota}</div>}
    </div>
  );
}

function Podio({ filas }) {
  if (!filas.length) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-xs text-gray-400">
        Todavía no hay participantes con reciclaje en este periodo.
      </section>
    );
  }
  const orden = [filas[1], filas[0], filas[2]].filter(Boolean);
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-sm font-extrabold text-gray-900">Primeros puestos</h2>
      <p className="text-[11px] text-gray-400 mt-0.5 mb-5">Los tres usuarios con más puntos en el periodo seleccionado.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        {orden.map((u) => {
          const puesto = filas.findIndex((fila) => fila.id_user === u.id_user) + 1;
          return (
            <div
              key={u.id_user}
              className={`rounded-2xl border border-gray-100 p-4 ${
                puesto === 1 ? 'order-1 sm:order-2 sm:-translate-y-2 bg-[#fff8f4]' : puesto === 2 ? 'order-2 sm:order-1 bg-gray-50/60' : 'order-3 bg-gray-50/60'
              }`}
            >
              <div className={`inline-flex w-8 h-8 items-center justify-center rounded-full text-xs font-extrabold ${MEDALLAS[puesto - 1]}`}>
                {puesto}
              </div>
              <div className="font-extrabold text-gray-900 mt-3">{u.nombre}</div>
              <div className="text-2xl font-extrabold text-gray-900 tabular-nums mt-1">{formatoEntero(u.puntosGanados || 0)}</div>
              <div className="text-[11px] text-gray-400">puntos · {formatoKg(u.pesoTotalKg || 0)} kg</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
