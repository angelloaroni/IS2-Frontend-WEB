import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesion, getSesion } from '../api';
import { useAvisos } from '../components/AvisosLlenado';

function formatearFecha(fecha) {
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return '';
  return valor.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

export default function Alertas() {
  const navigate = useNavigate();
  const sesion = getSesion();
  const { historial } = useAvisos();

  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#f6f7f6] font-sans text-gray-800">
      <aside className="w-64 bg-[#121c17] text-white flex flex-col justify-between p-5 min-h-screen shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-[#f05a28] p-2 rounded-xl">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">ULima Recicla</h2>
              <p className="text-[11px] text-gray-400">Universidad de Lima</p>
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3 px-2">Administración</div>
          <nav className="space-y-1">
            <Link to="/premios" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition-all">
              Premios
            </Link>
            <Link to="/telemetria" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition-all">
              Telemetría
            </Link>
            <Link to="/usuarios" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition-all">
              Usuarios
            </Link>
            <Link to="/alertas" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-[#f05a28] text-white transition-all shadow-sm">
              Alertas
            </Link>
          </nav>
        </div>
        <button onClick={salir} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors w-full px-2 py-1">
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>Administración</span>
            <span>&gt;</span>
            <span className="text-gray-900 font-semibold">Alertas</span>
          </div>
          <div className="text-xs font-bold text-gray-900">{sesion?.nombre || 'Administrador'}</div>
        </header>

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
