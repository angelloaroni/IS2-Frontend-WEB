import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../../api';

const ITEMS = [
  {
    key: 'premios',
    to: '/premios',
    label: 'Premios',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    key: 'telemetria',
    to: '/telemetria',
    label: 'Telemetría',
    icon: 'M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z'
  },
  {
    key: 'usuarios',
    to: '/usuarios',
    label: 'Usuarios',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    key: 'participacion',
    to: '/participacion',
    label: 'Participación',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    key: 'alertas',
    to: '/alertas',
    label: 'Alertas',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
  }
];

export default function Sidebar({ activo }) {
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
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

        <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3 px-2">
          Administración
        </div>

        <nav className="space-y-1">
          {ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              aria-current={activo === item.key ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activo === item.key ? 'bg-[#f05a28] text-white shadow-sm' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1b2721] p-4 rounded-2xl border border-white/5">
          <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h4 className="text-xs font-bold text-white mb-1">Un campus que transforma.</h4>
          <p className="text-[11px] text-gray-400">Proyecto de reciclaje<br />Universidad de Lima</p>
        </div>

        <button
          onClick={salir}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors w-full px-2 py-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
