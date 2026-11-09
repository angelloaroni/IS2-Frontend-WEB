import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../api';

const AvisosContext = createContext({ historial: [] });

const ETIQUETAS_TIPO = {
  plastico: 'Plástico',
  'papel/carton': 'Papel y cartón',
  organicos: 'Orgánicos',
  organico: 'Orgánicos',
};

function estaLleno(tacho) {
  return tacho?.capacidad === true;
}

function describir(tacho) {
  const tipo = ETIQUETAS_TIPO[String(tacho.tipo || '').toLowerCase()] || tacho.tipo || 'Sin tipo';
  return {
    idTacho: tacho.idTacho,
    titulo: `Tacho T-${String(tacho.idTacho).padStart(2, '0')} lleno`,
    mensaje: `El tacho de ${tipo} reportó que está lleno.`,
    detalle: `${Number(tacho.latitud).toFixed(4)}, ${Number(tacho.longitud).toFixed(4)}`,
  };
}

export function useAvisos() {
  return useContext(AvisosContext);
}

export default function AvisosLlenado({ children }) {
  const [avisos, setAvisos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const conocidos = useRef(null);
  const timers = useRef(new Map());

  const cerrar = (id) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setAvisos((actual) => actual.filter((aviso) => aviso.id !== id));
  };

  const mostrar = (tacho) => {
    const id = `${tacho.idTacho}-${Date.now()}`;
    const aviso = { id, recibido: new Date().toISOString(), ...describir(tacho) };
    setAvisos((actual) => [aviso, ...actual].slice(0, 4));
    setHistorial((actual) => [aviso, ...actual]);
    const timer = setTimeout(() => cerrar(id), 7000);
    timers.current.set(id, timer);
  };

  useEffect(() => {
    let activo = true;

    const consultar = async () => {
      try {
        const data = await api('/tachos');
        if (!activo) return;
        const lista = Array.isArray(data) ? data : [];
        const llenos = new Set(lista.filter(estaLleno).map((tacho) => tacho.idTacho));

        if (conocidos.current) {
          lista.filter((tacho) => estaLleno(tacho) && !conocidos.current.has(tacho.idTacho)).forEach(mostrar);
        }
        conocidos.current = llenos;
      } catch {
      }
    };

    consultar();
    const intervalo = setInterval(consultar, 2500);
    return () => {
      activo = false;
      clearInterval(intervalo);
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <AvisosContext.Provider value={{ historial }}>
      {children}
      <div className="fixed top-4 right-4 z-[70] flex w-[min(100%-2rem,360px)] flex-col gap-3 pointer-events-none">
        {avisos.map((aviso) => (
          <article
            key={aviso.id}
            className="aviso-entrar pointer-events-auto flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_12px_40px_rgba(15,23,42,0.18)]"
          >
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f05a28] text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900">{aviso.titulo}</h3>
                <button
                  type="button"
                  onClick={() => cerrar(aviso.id)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Cerrar aviso"
                >
                  ✕
                </button>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-600">{aviso.mensaje}</p>
              <p className="mt-1 text-[11px] text-gray-400">Ahora · {aviso.detalle}</p>
            </div>
          </article>
        ))}
      </div>
    </AvisosContext.Provider>
  );
}
