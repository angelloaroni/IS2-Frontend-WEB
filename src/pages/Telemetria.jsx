import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesion, getSesion, inicialesDe } from '../api';

const TACHOS_INICIALES = [
  {
    id: 'T-01',
    tipo: 'Plástico',
    ubicacion: 'Pabellón A - Ingreso',
    conectado: true,
    llenado: 35,
    bateria: 88,
    ultimaLectura: '09:40'
  },
  {
    id: 'T-02',
    tipo: 'Papel',
    ubicacion: 'Biblioteca - Patio',
    conectado: true,
    llenado: 82,
    bateria: 62,
    ultimaLectura: '09:40'
  },
  {
    id: 'T-03',
    tipo: 'Vidrio',
    ubicacion: 'Pabellón B - Hall',
    conectado: true,
    llenado: 58,
    bateria: 19,
    ultimaLectura: '09:30'
  },
  {
    id: 'T-04',
    tipo: 'Plástico',
    ubicacion: 'Cafetería - Acceso',
    conectado: false,
    llenado: 91,
    bateria: 73,
    ultimaLectura: '09:18'
  }
];

export default function Telemetria() {
  const navigate = useNavigate();
  const sesion = getSesion();
  const [tachos, setTachos] = useState(TACHOS_INICIALES);
  const [fechaUltimaActualizacion, setFechaUltimaActualizacion] = useState('08 oct 2026 - 09:41');

  const totalTachos = tachos.length;
  const conectadosCount = tachos.filter((t) => t.conectado).length;
  const recoleccionCount = tachos.filter((t) => t.llenado >= 80).length;
  const bateriaBajaCount = tachos.filter((t) => t.bateria < 20).length;

  const handleActualizarDemo = () => {
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFechaUltimaActualizacion(`08 oct 2026 - ${horaFormateada}`);

    setTachos(
      tachos.map((t) => {
        if (!t.conectado) return t;
        const nuevoLlenado = Math.min(100, Math.max(10, t.llenado + Math.floor(Math.random() * 9) - 3));
        const nuevaBateria = Math.max(5, t.bateria - (Math.random() > 0.5 ? 1 : 0));
        return {
          ...t,
          llenado: nuevoLlenado,
          bateria: nuevaBateria,
          ultimaLectura: horaFormateada
        };
      })
    );
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

          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3 px-2">
            Administración
          </div>

          <nav className="space-y-1">
            <Link
              to="/GestorPremios"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Premios
            </Link>

            <Link
              to="/telemetria"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-[#f05a28] text-white transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              Telemetría
            </Link>

            <Link
              to="/usuarios"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Usuarios
            </Link>
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
            onClick={() => {
              cerrarSesion();
              navigate('/');
            }}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors w-full px-2 py-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>Administración</span>
            <span>&gt;</span>
            <span className="text-gray-900 font-semibold">Telemetría</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Campus Lima
            </span>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#fef2e8] text-[#f05a28] font-bold text-xs flex items-center justify-center">
                {inicialesDe(sesion?.nombre)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-gray-900 leading-tight">{sesion?.nombre || 'Administrador'}</div>
                <div className="text-[10px] text-gray-400 leading-tight">Administrador</div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f05a28]">
                Monitoreo de tachos del campus
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Telemetría</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Batería, conexión y capacidad: una lectura clara de cada punto de reciclaje.
              </p>
            </div>

            <button
              onClick={handleActualizarDemo}
              className="bg-[#f05a28] hover:bg-[#d94d1f] text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-sm self-start md:self-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar demo
            </button>
          </div>

          <div className="bg-[#fff6f0] border border-[#fde2d1] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#fde2d1] text-[#f05a28] rounded-xl flex items-center justify-center shrink-0 text-sm font-bold">
                🧪
              </div>
              <div>
                <div className="text-xs font-bold text-[#f05a28] tracking-wider uppercase">
                  Datos simulados - No es monitoreo en tiempo real
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  {totalTachos} tachos · {conectadosCount} conectados · {recoleccionCount} requieren recolección · {bateriaBajaCount} batería baja
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 font-medium self-end sm:self-auto">
              {fechaUltimaActualizacion}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tachos.map((tacho) => {
              const requiereRecoleccion = tacho.llenado >= 80;
              const esBateriaBaja = tacho.bateria < 20;

              return (
                <div key={tacho.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-extrabold text-gray-900">
                        {tacho.id} · {tacho.tipo}
                      </div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">
                        {tacho.ubicacion}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tacho.conectado
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {tacho.conectado ? 'Conectado' : 'Sin conexión'}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="relative w-16 h-20 bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden shrink-0 flex items-end p-1">
                      <div
                        style={{ height: `${tacho.llenado}%` }}
                        className={`w-full rounded-lg transition-all duration-500 ${
                          requiereRecoleccion ? 'bg-[#f05a28]' : 'bg-emerald-500'
                        }`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-3xl font-black ${requiereRecoleccion ? 'text-[#f05a28]' : 'text-emerald-600'}`}>
                          {tacho.llenado}%
                        </span>
                        <span className="text-xs text-gray-400 font-medium">de llenado</span>
                      </div>

                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${tacho.llenado}%` }}
                          className={`h-full transition-all duration-500 ${
                            requiereRecoleccion ? 'bg-[#f05a28]' : 'bg-emerald-500'
                          }`}
                        />
                      </div>

                      <div className={`text-xs font-bold ${requiereRecoleccion ? 'text-[#f05a28]' : 'text-emerald-600'}`}>
                        {requiereRecoleccion ? 'Requiere recolección' : 'Capacidad disponible'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <svg className={`w-4 h-4 ${esBateriaBaja ? 'text-red-500' : 'text-emerald-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className={`font-semibold ${esBateriaBaja ? 'text-red-500' : 'text-gray-600'}`}>
                        Batería {tacho.bateria}% {esBateriaBaja && '- Baja'}
                      </span>
                    </div>

                    <div className="text-gray-400 font-medium">
                      Última lectura: {tacho.ultimaLectura}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2 pt-4 border-t border-gray-200/60">
            <div>
              Umbrales de la demo: recolección desde 80% de llenado · batería baja por debajo de 20%.<br />
              Sin conexión: se conserva la última lectura disponible.
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 text-gray-500 font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
                Simulación
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
            <div>Universidad de Lima · Proyecto de reciclaje</div>
            <div>Entorno de demostración — 2026</div>
          </div>
        </div>
      </main>
    </div>
  );
}