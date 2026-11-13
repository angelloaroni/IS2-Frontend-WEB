const API = import.meta.env.VITE_API_URL || '/api';

export const MODO_DEMO = import.meta.env.DEV && import.meta.env.VITE_MODO_DEMO === 'true';

export function getToken() {
  return sessionStorage.getItem('token');
}

export function getSesion() {
  const raw = sessionStorage.getItem('usuario');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function guardarSesion(usuario, token) {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('usuario', JSON.stringify(usuario));
}

export function cerrarSesion() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('usuario');
}

export function inicialesDe(nombre) {
  const partes = String(nombre || '').trim().split(/\s+/).filter(Boolean);
  const letras = `${partes[0]?.[0] || ''}${partes[1]?.[0] || ''}`;
  return (letras || 'A').toUpperCase();
}

function conQuery(path, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') query.set(clave, String(valor));
  });
  const texto = query.toString();
  return texto ? `${path}?${texto}` : path;
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let status;
  let json;
  if (MODO_DEMO) {
    const { responderDemo } = await import('./demo/apiDemo.js');
    ({ status, json } = await responderDemo(path, { ...options, headers }));
  } else {
    let respuesta;
    try {
      respuesta = await fetch(`${API}${path}`, { ...options, headers });
    } catch {
      throw new Error('No se pudo conectar con el servidor.');
    }
    status = respuesta.status;
    json = await respuesta.json().catch(() => null);
  }

  if (status === 401 && token) {
    cerrarSesion();
    window.location.replace('/');
    throw new Error(json?.mensaje || 'Tu sesión expiró. Vuelve a iniciar sesión.');
  }

  if (!json && status >= 502 && status <= 504) {
    const error = new Error('No se pudo conectar con el backend. Verifica que esté encendido en http://localhost:3000.');
    error.status = status;
    throw error;
  }

  if (status < 200 || status >= 300 || json?.ok === false) {
    const error = new Error(json?.mensaje || 'No se pudo completar la solicitud.');
    error.status = status;
    throw error;
  }
  return json?.data;
}

const enviar = (method, body) => ({ method, body: JSON.stringify(body) });

export const authApi = {
  login: (codUser, contrasena) => api('/auth/login', enviar('POST', { cod_user: codUser, contraseña: contrasena })),
};

export const usuariosApi = {
  listar: ({ pagina = 1, limite = 20, q } = {}) => api(conQuery('/usuarios/admin', { pagina, limite, q })),
  obtener: (id) => api(`/usuarios/admin/${id}`),
  actualizar: (id, cambios) => api(`/usuarios/admin/${id}`, enviar('PATCH', cambios)),
  desactivar: (id) => api(`/usuarios/${id}`, { method: 'DELETE' }),
};

export const premiosApi = {
  listar: () => api('/premios'),
  crear: (datos) => api('/premios', enviar('POST', datos)),
  actualizar: (id, datos) => api(`/premios/${id}`, enviar('PUT', datos)),
};

export const tachosApi = {
  listar: () => api('/tachos'),
};

export const dashboardApi = {
  materiales: ({ desde, hasta, material } = {}) => api(conQuery('/dashboard/materiales', { desde, hasta, material })),
  participacion: ({ desde, hasta } = {}) => api(conQuery('/dashboard/participacion', { desde, hasta })),
};

export const rankingApi = {
  obtener: ({ desde, hasta } = {}) => api(conQuery('/ranking', { desde, hasta })),
};

export const MATERIALES = ['plastico', 'papel/carton', 'vidrio'];

const ETIQUETAS_MATERIAL = {
  plastico: 'Plástico',
  'papel/carton': 'Papel y cartón',
  vidrio: 'Vidrio',
  organicos: 'Orgánicos',
  organico: 'Orgánicos',
};

export function etiquetaMaterial(tipo) {
  return ETIQUETAS_MATERIAL[String(tipo || '').toLowerCase()] || tipo || 'Sin tipo';
}

export function usuarioVista(usuario) {
  const nombre = String(usuario?.nombre || '').trim();
  return {
    id: usuario.id_user,
    nombre,
    codigo: usuario.cod_user,
    correo: usuario.correo_institucional || '',
    tipo: String(usuario.tipo || '').toLowerCase(),
    puntos: Number(usuario.puntos) || 0,
    activo: usuario.estado === true,
    estado: usuario.estado ? 'Activo' : 'Inactivo',
    iniciales: inicialesDe(nombre),
  };
}

export function premioVista(premio) {
  const stock = Number(premio.stock) || 0;
  return {
    id: premio.id_premio,
    nombre: premio.nombre,
    descripcion: premio.descripcion,
    puntos: Number(premio.costo) || 0,
    stock,
    estado: stock > 0 ? 'Activo' : 'Agotado',
  };
}

export function premioABody(datos) {
  const agotado = datos.estado === 'Agotado';
  return {
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    costo: Number(datos.puntos),
    stock: agotado ? 0 : Number(datos.stock),
  };
}
