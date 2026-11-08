export default function ResumenUsuarios({ total, termino, cargando, resumen }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Tarjeta
        etiqueta={termino ? 'Coinciden con la búsqueda' : 'Cuentas registradas'}
        valor={cargando && !total ? '—' : total.toLocaleString('es-PE')}
        nota={termino ? `“${termino}”` : 'Incluye administradores'}
      />
      <Tarjeta
        etiqueta="Usuarios activos"
        punto="bg-emerald-500"
        valor={resumen ? resumen.denominador.toLocaleString('es-PE') : '—'}
        nota="Cuentas de tipo usuario habilitadas"
      />
      <Tarjeta
        etiqueta="Reciclaron este mes"
        valor={resumen ? resumen.participantes.toLocaleString('es-PE') : '—'}
        nota={
          resumen?.tasaPorcentaje != null
            ? `${Math.round(resumen.tasaPorcentaje)}% de los usuarios activos`
            : 'Sin datos de participación'
        }
      />
    </div>
  );
}

function Tarjeta({ etiqueta, valor, nota, punto }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-gray-400">
        {punto && <span className={`w-1.5 h-1.5 rounded-full ${punto}`} />}
        {etiqueta}
      </div>
      <div className="text-2xl font-extrabold text-gray-900 mt-1 tabular-nums">{valor}</div>
      {nota && <div className="text-[11px] text-gray-400 mt-0.5 truncate">{nota}</div>}
    </div>
  );
}
