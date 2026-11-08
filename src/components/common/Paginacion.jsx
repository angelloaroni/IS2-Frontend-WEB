export default function Paginacion({ paginacion, porPagina, cargando = false, nombre = 'registros', onCambiar }) {
  const { actual, total, paginas } = paginacion;
  const desde = total === 0 ? 0 : (actual - 1) * porPagina + 1;
  const hasta = Math.min(actual * porPagina, total);

  return (
    <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
      <div>{total > 0 ? `Mostrando ${desde}–${hasta} de ${total} ${nombre}` : 'Sin resultados'}</div>

      {paginas > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCambiar(actual - 1)}
            disabled={actual <= 1 || cargando}
            className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-gray-500 tabular-nums">
            Página {actual} de {paginas}
          </span>
          <button
            onClick={() => onCambiar(actual + 1)}
            disabled={actual >= paginas || cargando}
            className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
