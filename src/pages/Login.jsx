import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODO_DEMO, authApi, guardarSesion } from '../api';

const ALIAS_USUARIO = { admin: '00000001' };

const USUARIO_INICIAL = import.meta.env.DEV ? 'admin' : '';
const PASSWORD_INICIAL = import.meta.env.DEV ? '123456' : '';

function codigoDeUsuario(texto) {
  const valor = texto.trim();
  return ALIAS_USUARIO[valor.toLowerCase()] ?? valor;
}

export default function Login() {
  const [usuario, setUsuario] = useState(USUARIO_INICIAL);
  const [password, setPassword] = useState(PASSWORD_INICIAL);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    try {
      const sesion = await authApi.login(codigoDeUsuario(usuario), password);

      if (String(sesion?.usuario?.tipo || '').toLowerCase() !== 'admin') {
        setError('Esta cuenta no tiene acceso de administrador.');
        return;
      }

      guardarSesion(sesion.usuario, sesion.token);
      navigate('/telemetria');
    } catch (err) {
      setError(err.message || 'Usuario o contraseña incorrectos.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 font-sans bg-white">

      <div className="bg-[#121c17] text-white p-8 lg:p-14 flex flex-col justify-between min-h-screen">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-[#f05a28] p-2.5 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">ULima Recicla</h2>
              <p className="text-xs text-gray-400">Universidad de Lima</p>
            </div>
          </div>

          <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            Universidad de Lima - Reciclaje
          </span>

          <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-4 leading-tight">
            Gestionamos hoy.<br />
            Transformamos mañana.
          </h1>

          <p className="text-gray-300 max-w-md text-sm lg:text-base mb-8">
            Un espacio para cuidar los recursos y acompañar el impacto de nuestra comunidad.
          </p>

          <div className="rounded-2xl overflow-hidden mb-8 border border-gray-800 shadow-2xl">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHSoKYnyOTyTtGtC0qnKTznw8IS0D-5C5M8_e306_Q9emY2e8zGM861HU&s=10" 
              alt="Campus Universidad de Lima" 
              className="w-full h-64 lg:h-72 object-cover"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center text-[10px]">✓</span>
              Comunidad
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center text-[10px]">✓</span>
              Circularidad
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center text-[10px]">✓</span>
              Impacto
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-500">
          Proyecto de reciclaje - Universidad de Lima - 2026
        </div>
      </div>

      <div className="bg-white p-8 lg:p-14 flex flex-col justify-between min-h-screen relative">
        <div className="flex justify-end">
          <span className="bg-[#fef2e8] text-[#f05a28] text-[11px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
            Solo Administradores
          </span>
        </div>

        <div className="max-w-md w-full mx-auto my-auto">
          <div className="w-12 h-12 bg-[#fef2e8] rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-[#f05a28]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenida al panel</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Ingresa con las credenciales proporcionadas por la coordinación del proyecto.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {MODO_DEMO && (
              <div className="p-3 bg-[#fff6f0] border border-[#fde2d1] text-[#b9421a] rounded-xl text-xs">
                <span className="font-bold">Modo demo activo.</span> No se usa el backend: entra con <b>admin</b> / <b>123456</b> y verás datos simulados.
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Usuario o código de administrador
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="admin o 00000001"
                  autoComplete="username"
                  maxLength={20}
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] focus:ring-1 focus:ring-[#f05a28] transition-all pr-10 text-gray-800"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#f05a28] focus:ring-1 focus:ring-[#f05a28] transition-all pr-10 text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {mostrarPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.682-.863c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-[#f05a28] hover:bg-[#d94d1f] disabled:opacity-70 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-orange-200"
            >
              {enviando ? 'Ingresando...' : 'Ingresar al panel'}
            </button>
          </form>

          <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">
              El acceso es asignado por la universidad. Si necesitas ayuda, contacta a la coordinación.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          Administración de ULima Recicla - Acceso autorizado
        </div>
      </div>

    </div>
  );
}
