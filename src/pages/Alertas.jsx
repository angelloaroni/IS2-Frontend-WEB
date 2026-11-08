import Sidebar from '../components/Layout/Sidebar';
import Encabezado from '../components/Layout/Encabezado';
import { useAvisos } from '../components/AvisosLlenado';

function formatearFecha(fecha) {
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return '';
  return valor.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

export default function Alertas() {
  const { historial } = useAvisos();

  return (
    <div className="flex min-h-screen bg-[#f6f7f6] font-sans text-gray-800">
      <Sidebar activo="alertas" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Encabezado titulo="Alertas" />

        <div className="p-8 max-w-3xl w-full mx-auto space-y-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f05a28]">Avisos en pantalla</span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Alertas de llenado</h1>
            <p className="text-xs text-gray-500 mt-1">
              Cuando un tacho reporta que está lleno, el aviso aparece en la esquina superior derecha mientras usas el panel.
            </p>
          </div>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Recibidas en esta sesión</h2>
            </div>
            {historial.length === 0 && (
              <div className="px-6 py-8 text-xs text-gray-400">Todavía no llegó una alerta nueva de tacho lleno.</div>
            )}
            <ul className="divide-y divide-gray-100">
              {historial.map((aviso) => (
                <li key={aviso.id} className="px-6 py-4 text-xs">
                  <div className="font-bold text-gray-900">{aviso.titulo}</div>
                  <div className="text-gray-500 mt-1">{aviso.mensaje}</div>
                  <div className="text-[11px] text-gray-400 mt-1">{formatearFecha(aviso.recibido)} · {aviso.detalle}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
