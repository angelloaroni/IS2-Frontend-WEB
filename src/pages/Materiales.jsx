import { useState } from 'react';
import { etiquetaMaterial } from '../api';
import useMateriales from '../hooks/useMateriales';
import Sidebar from '../components/Layout/Sidebar';
import Encabezado from '../components/Layout/Encabezado';
import FiltrosParticipacion from '../components/Participacion/FiltrosParticipacion';
import ComposicionMateriales from '../components/Participacion/ComposicionMateriales';
import IndicadoresMateriales from '../components/Materiales/IndicadoresMateriales';
import TendenciaMateriales from '../components/Materiales/TendenciaMateriales';
import GraficoBarrasMateriales from '../components/Materiales/GraficoBarrasMateriales';
import { PERIODO_INICIAL, etiquetaPeriodo } from '../components/Participacion/constantes';

export default function Materiales() {
  const [periodo, setPeriodo] = useState(PERIODO_INICIAL);
  const [material, setMaterial] = useState('');
  const { datos, cargando, error, actualizado, recargar } = useMateriales({ periodo, material });
  const textoPeriodo = etiquetaPeriodo(periodo);

  return (
    <div className="flex min-h-screen bg-[#f6f7f6] font-sans text-gray-800">
      <Sidebar activo="materiales" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Encabezado titulo="Materiales" />

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f05a28]">HU16 · Materiales reciclados</span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Dashboard de materiales reciclados</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Peso y cantidad por material. Los gráficos se actualizan al cambiar el periodo o el material.
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
              {cargando ? 'Actualizando…' : 'Actualizar dashboard'}
            </button>
          </div>

          <FiltrosParticipacion
            periodo={periodo}
            material={material}
            actualizado={actualizado}
            hayFiltros={periodo !== PERIODO_INICIAL || material !== ''}
            onPeriodo={setPeriodo}
            onMaterial={setMaterial}
            onRestablecer={() => {
              setPeriodo(PERIODO_INICIAL);
              setMaterial('');
            }}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center justify-between gap-3">
              <div>
                <div className="font-bold">No se pudo cargar el dashboard</div>
                <div className="mt-0.5">{error}</div>
              </div>
              <button type="button" onClick={recargar} className="font-semibold underline shrink-0">Reintentar</button>
            </div>
          )}

          {!datos && cargando && !error && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-xs text-gray-400">Cargando materiales…</div>
          )}

          {datos && (
            <div className={`space-y-6 transition-opacity ${cargando ? 'opacity-60' : ''}`}>
              <IndicadoresMateriales actual={datos.actual} previo={datos.previo} material={material} />
              <TendenciaMateriales serie={datos.serie} material={material} periodoTexto={textoPeriodo} />
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-3">
                  <GraficoBarrasMateriales
                    meses={datos.meses}
                    porTipoYPeriodo={material ? datos.actual.porTipoYPeriodo || [] : datos.porTipoYPeriodo}
                    material={material}
                    onMaterial={setMaterial}
                  />
                </div>
                <div className="xl:col-span-2">
                  <ComposicionMateriales
                    composicion={datos.composicion}
                    material={material}
                    periodo={textoPeriodo}
                    onMaterial={setMaterial}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-gray-400 gap-2 pt-4 border-t border-gray-200/60">
            <div>
              {textoPeriodo} · {material ? etiquetaMaterial(material) : 'todos los materiales'}.<br />
              La variación compara con el periodo anterior de la misma duración. Meses en hora de Lima.
            </div>
            <div>Universidad de Lima · Proyecto de reciclaje — 2026</div>
          </div>
        </div>
      </main>
    </div>
  );
}
