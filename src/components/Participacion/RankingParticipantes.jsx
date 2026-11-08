import { formatoEntero, formatoKg } from './constantes';

export default function RankingParticipantes({ ranking, error, periodo }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 pb-4">
        <h2 className="text-sm font-extrabold text-gray-900">Usuarios más participativos</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">Top 10 por puntos ganados · {periodo} · todos los materiales</p>
      </div>

      {error ? (
        <div className="px-6 pb-6 text-xs text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50/70 text-gray-400 uppercase text-[10px] tracking-wider border-y border-gray-100">
              <tr>
                <th className="py-2.5 pl-6 pr-2 font-semibold w-10">#</th>
                <th className="py-2.5 px-3 font-semibold">Usuario</th>
                <th className="py-2.5 px-3 font-semibold text-right">Residuos</th>
                <th className="py-2.5 px-3 font-semibold text-right">Kg</th>
                <th className="py-2.5 pl-3 pr-6 font-semibold text-right">Puntos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 tabular-nums">
              {ranking.map((u, i) => (
                <tr key={u.id_user} className="hover:bg-gray-50/50">
                  <td className="py-2.5 pl-6 pr-2 font-extrabold text-gray-400">{i + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-gray-900">{u.nombre}</td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{formatoEntero(u.cantidadResiduos)}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{formatoKg(u.pesoTotalKg)}</td>
                  <td className="py-2.5 pl-3 pr-6 text-right text-gray-700">{formatoEntero(u.puntosGanados)}</td>
                </tr>
              ))}
              {ranking.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">Nadie registró reciclaje en este periodo.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
