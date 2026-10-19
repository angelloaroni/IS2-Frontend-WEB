const API = '/api';

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

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let respuesta;
  try {
    respuesta = await fetch(`${API}${path}`, { ...options, headers });
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }

  const json = await respuesta.json().catch(() => null);
  if (!respuesta.ok || json?.ok === false) {
    throw new Error(json?.mensaje || 'No se pudo completar la solicitud.');
  }
  return json?.data;
}

export function usuarioVista(usuario) {
  const nombre = String(usuario?.nombre || '').trim();
  return {
    id: usuario.id_user,
    nombre,
    codigo: usuario.cod_user,
    tipo: usuario.tipo,
    puntos: Number(usuario.puntos) || 0,
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
