export default function BuscadorUsuarios({ valor, onCambiar, onActualizar, cargando }) {
  return (
    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="relative w-full md:w-96">
        <input
          type="search"
          placeholder="Buscar por nombre o código de usuario"
          aria-label="Buscar usuarios"
          value={valor}
          maxLength={100}
          onChange={(e) => onCambiar(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] transition-all text-gray-800"
        />
        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button
        onClick={onActualizar}
        disabled={cargando}
        className="self-start md:self-auto px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      >
        {cargando ? 'Cargando…' : 'Actualizar'}
      </button>
    </div>
  );
}
