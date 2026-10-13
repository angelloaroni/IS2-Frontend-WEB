export default function VerPremioModal({ premio, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold text-xl">
          🎁
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{premio.nombre}</h3>
        <p className="text-xs text-gray-500 mb-4">{premio.descripcion}</p>
        <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-1 text-left text-gray-600 mb-4">
          <div><strong>Puntos:</strong> {premio.puntos} pts</div>
          <div><strong>Stock:</strong> {premio.stock} unidades</div>
          <div><strong>Estado:</strong> {premio.estado}</div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-semibold"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}