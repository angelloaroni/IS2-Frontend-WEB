export default function EstadoBadge({ activo }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
        activo ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${activo ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  );
}
