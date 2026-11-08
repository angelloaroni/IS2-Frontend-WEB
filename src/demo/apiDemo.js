const TOKEN_DEMO = 'token-modo-demo';
const MATERIALES = ['plastico', 'papel/carton', 'organicos'];

let semilla = 2026;
const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647);

const NOMBRES = [
  'Lucía Torres', 'Diego Mendoza', 'Valeria Rojas', 'Mateo Salazar', 'Sofía Castro', 'Joaquín Paredes',
  'Camila Vargas', 'Sebastián Quispe', 'Antonella Ríos', 'Gabriel Huamán', 'Isabella Flores', 'Nicolás Chávez',
  'Mariana Gutiérrez', 'Thiago Ramírez', 'Renata Soto', 'Adrián Cárdenas', 'Daniela Espinoza', 'Fabricio Medina',
  'Ximena Aguilar', 'Rodrigo Navarro', 'Alessia Herrera', 'Martín Delgado', 'Luana Vega'
];

const usuarios = [
  { id_user: 1, cod_user: '00000001', nombre: 'Administrador', puntos: 0, tipo: 'admin', correo_institucional: 'admin@ulima.edu.pe', estado: true, contrasena: '123456' },
  ...NOMBRES.map((nombre, i) => ({
    id_user: i + 2,
    cod_user: String(20260001 + i),
    nombre,
    puntos: Math.round(azar() * 1500),
    tipo: 'usuario',
    correo_institucional: `${20260001 + i}@aloe.ulima.edu.pe`,
    estado: ![3, 11, 15].includes(i),
    contrasena: 'demo'
  }))
];

const diaIso = (fecha) => fecha.toISOString().slice(0, 10);
const actividad = [];
const hoy = new Date();
for (let d = 0; d < 420; d++) {
  const fecha = diaIso(new Date(hoy.getTime() - d * 86400000));
  for (const u of usuarios.filter((x) => x.tipo === 'usuario')) {
    if (azar() < 0.05 + 0.04 * (1 - d / 420)) {
      const peso = Math.round((0.1 + azar() * 1.2) * 100) / 100;
      actividad.push({ id_user: u.id_user, fecha, tipo: MATERIALES[Math.floor(azar() * 3)], peso, puntos_ganados: Math.round(peso * 40) });
    }
  }
}

const premios = [
  { id_premio: 1, nombre: 'Tomatodo ULima', descripcion: 'Botella reutilizable de 600 ml', costo: 500, stock: 12 },
  { id_premio: 2, nombre: 'Café gratis', descripcion: 'Un café en la cafetería central', costo: 150, stock: 0 },
  { id_premio: 3, nombre: 'Bolsa de tela', descripcion: 'Bolsa reutilizable con el logo del proyecto', costo: 300, stock: 25 }
];

const tachos = [
  { idTacho: 1, tipo: 'plastico', latitud: -12.0848, longitud: -76.9714, capacidad: false, porcentaje: 35 },
  { idTacho: 2, tipo: 'papel/carton', latitud: -12.0852, longitud: -76.9722, capacidad: true, porcentaje: 96 },
  { idTacho: 3, tipo: 'organicos', latitud: -12.0844, longitud: -76.9709, capacidad: false, porcentaje: null }
];

class ErrorDemo extends Error {
  constructor(mensaje, status) {
    super(mensaje);
    this.status = status;
  }
}

const exito = (data, status = 200) => ({ status, json: { ok: true, data, error: null } });
const fallo = (mensaje, status) => ({ status, json: { ok: false, data: null, mensaje } });

const sinContrasena = ({ contrasena: _omitida, ...resto }) => resto;

function soloCampos(objeto, permitidos, mensaje) {
  const extra = Object.keys(objeto).filter((k) => !permitidos.includes(k));
  if (extra.length) throw new ErrorDemo(`${mensaje}: ${extra.join(', ')}`, 400);
}

const fechaValida = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime());

function validarFiltros(q, permitirMaterial) {
  const permitidos = permitirMaterial ? ['desde', 'hasta', 'material'] : ['desde', 'hasta'];
  if (Object.keys(q).some((k) => !permitidos.includes(k))) throw new ErrorDemo('Los filtros incluyen campos no permitidos', 400);
  for (const campo of ['desde', 'hasta']) {
    if (q[campo] !== undefined && !fechaValida(q[campo])) throw new ErrorDemo(`${campo} debe ser una fecha YYYY-MM-DD válida`, 400);
  }
  if (q.desde && q.hasta && q.desde >= q.hasta) throw new ErrorDemo('desde debe ser anterior a hasta (exclusivo)', 400);
  if (q.material !== undefined && !MATERIALES.includes(q.material)) throw new ErrorDemo('El material no es válido', 400);
  return q;
}

const filtrarActividad = (f) =>
  actividad.filter((a) => (!f.desde || a.fecha >= f.desde) && (!f.hasta || a.fecha < f.hasta) && (!f.material || a.tipo === f.material));

function agrupar(lista, clave) {
  const grupos = new Map();
  for (const item of lista) {
    const k = clave(item);
    grupos.set(k, [...(grupos.get(k) || []), item]);
  }
  return [...grupos.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
}

const suma = (lista, campo) => Math.round(lista.reduce((s, a) => s + a[campo], 0) * 100) / 100;
const mes = (a) => a.fecha.slice(0, 7);

function buscarUsuario(id) {
  const usuario = usuarios.find((u) => u.id_user === Number(id));
  if (!usuario) throw new ErrorDemo('Usuario no encontrado', 404);
  return usuario;
}

function rutear(metodo, ruta, q, cuerpo) {
  if (metodo === 'GET' && ruta === '/usuarios/admin') {
    soloCampos(q, ['pagina', 'limite', 'q'], 'Parámetros no permitidos');
    const pagina = q.pagina === undefined ? 1 : Number(q.pagina);
    const limite = q.limite === undefined ? 20 : Number(q.limite);
    if (!Number.isSafeInteger(pagina) || pagina < 1) throw new ErrorDemo('pagina debe ser un entero positivo', 400);
    if (!Number.isSafeInteger(limite) || limite < 1 || limite > 100) throw new ErrorDemo('limite debe ser un entero entre 1 y 100', 400);
    const texto = (q.q || '').trim().toLowerCase();
    const lista = usuarios.filter((u) => !texto || u.nombre.toLowerCase().includes(texto) || u.cod_user.includes(texto));
    return exito({
      usuarios: lista.slice((pagina - 1) * limite, pagina * limite).map(sinContrasena),
      pagina: { actual: pagina, limite, total: lista.length, paginas: Math.ceil(lista.length / limite) }
    });
  }

  let m = /^\/usuarios\/admin\/(\d+)$/.exec(ruta);
  if (m && metodo === 'GET') return exito(sinContrasena(buscarUsuario(m[1])));
  if (m && metodo === 'PATCH') {
    const usuario = buscarUsuario(m[1]);
    soloCampos(cuerpo, ['nombre', 'estado'], 'No se permiten estos campos');
    if (!Object.keys(cuerpo).length) throw new ErrorDemo('Debe enviar al menos un campo permitido', 400);
    if ('nombre' in cuerpo) {
      if (typeof cuerpo.nombre !== 'string' || !cuerpo.nombre.trim()) throw new ErrorDemo('El nombre es obligatorio', 400);
      usuario.nombre = cuerpo.nombre.trim();
    }
    if ('estado' in cuerpo) {
      if (typeof cuerpo.estado !== 'boolean') throw new ErrorDemo('estado debe ser un valor booleano', 400);
      usuario.estado = cuerpo.estado;
    }
    return exito(sinContrasena(usuario));
  }

  m = /^\/usuarios\/(\d+)$/.exec(ruta);
  if (m && metodo === 'DELETE') {
    const usuario = buscarUsuario(m[1]);
    usuario.estado = false;
    return exito(sinContrasena(usuario));
  }

  if (ruta === '/premios' && metodo === 'GET') return exito(premios);
  if (ruta === '/premios' && metodo === 'POST') {
    soloCampos(cuerpo, ['nombre', 'descripcion', 'costo', 'stock'], 'Campos no permitidos');
    if (!String(cuerpo.nombre || '').trim()) throw new ErrorDemo('El nombre del premio es obligatorio', 400);
    if (!String(cuerpo.descripcion || '').trim()) throw new ErrorDemo('La descripción del premio es obligatoria', 400);
    if (!(Number(cuerpo.costo) > 0)) throw new ErrorDemo('El costo debe ser mayor a cero', 400);
    if (!Number.isSafeInteger(Number(cuerpo.stock)) || Number(cuerpo.stock) < 0) throw new ErrorDemo('El stock debe ser un entero mayor o igual a cero', 400);
    const nuevo = { id_premio: Math.max(0, ...premios.map((p) => p.id_premio)) + 1, ...cuerpo, costo: Number(cuerpo.costo), stock: Number(cuerpo.stock) };
    premios.push(nuevo);
    return exito(nuevo, 201);
  }

  if (ruta === '/tachos' && metodo === 'GET') return exito(tachos);

  if (ruta === '/dashboard/materiales' && metodo === 'GET') {
    const lista = filtrarActividad(validarFiltros(q, true));
    return exito({
      totalResiduos: lista.length,
      pesoTotalKg: suma(lista, 'peso'),
      porTipo: agrupar(lista, (a) => a.tipo).map(([tipo, l]) => ({ tipo, cantidad: l.length, pesoKg: suma(l, 'peso') })),
      porPeriodo: agrupar(lista, mes).map(([periodo, l]) => ({ periodo, totalResiduos: l.length, pesoTotalKg: suma(l, 'peso') })),
      porTipoYPeriodo: agrupar(lista, (a) => `${mes(a)}|${a.tipo}`).map(([clave, l]) => {
        const [periodo, tipo] = clave.split('|');
        return { periodo, tipo, cantidad: l.length, pesoKg: suma(l, 'peso') };
      })
    });
  }
  if (ruta === '/dashboard/participacion' && metodo === 'GET') {
    const elegibles = new Set(usuarios.filter((u) => u.tipo === 'usuario' && u.estado).map((u) => u.id_user));
    const lista = filtrarActividad(validarFiltros(q, false)).filter((a) => elegibles.has(a.id_user));
    const denominador = elegibles.size;
    const indicadores = (n) => ({ participantes: n, denominador, tasaPorcentaje: denominador ? (100 * n) / denominador : null });
    return exito({
      ...indicadores(new Set(lista.map((a) => a.id_user)).size),
      porPeriodo: agrupar(lista, mes).map(([periodo, l]) => ({ periodo, ...indicadores(new Set(l.map((a) => a.id_user)).size) }))
    });
  }

  if (ruta === '/ranking' && metodo === 'GET') {
    const filtros = validarFiltros(q, false);
    const lista = filtrarActividad(filtros);
    const filas = usuarios
      .filter((u) => u.tipo === 'usuario' && u.estado)
      .map((u) => {
        const propias = lista.filter((a) => a.id_user === u.id_user);
        const puntosGanados = suma(propias, 'puntos_ganados');
        return { id_user: u.id_user, nombre: u.nombre, puntos: puntosGanados, puntosGanados, cantidadResiduos: propias.length, pesoTotalKg: suma(propias, 'peso') };
      })
      .sort((a, b) => b.puntosGanados - a.puntosGanados || a.id_user - b.id_user);
    return exito({
      top: filas.slice(0, 10),
      total_usuarios: filas.length,
      usuario: null,
      criterio: 'puntos_ganados',
      periodo: { desde: filtros.desde ?? null, hasta: filtros.hasta ?? null }
    });
  }

  return fallo(`Ruta no disponible en el modo demo: ${metodo} ${ruta}`, 404);
}

export async function responderDemo(path, { method = 'GET', body, headers = {} } = {}) {
  await new Promise((r) => setTimeout(r, 150));

  const url = new URL(path, 'http://demo');
  const ruta = url.pathname;
  const q = Object.fromEntries(url.searchParams);
  const metodo = method.toUpperCase();

  try {
    const cuerpo = body ? JSON.parse(body) : {};

    if (metodo === 'POST' && ruta === '/auth/login') {
      if (!/^\d{8}$/.test(String(cuerpo.cod_user ?? ''))) throw new ErrorDemo('El cod_user debe tener exactamente 8 dígitos', 400);
      const usuario = usuarios.find((u) => u.cod_user === cuerpo.cod_user);
      if (!usuario || cuerpo['contraseña'] !== usuario.contrasena) throw new ErrorDemo('Credenciales inválidas', 401);
      if (!usuario.estado) throw new ErrorDemo('El usuario está inactivo', 401);
      return exito({ usuario: sinContrasena(usuario), token: TOKEN_DEMO });
    }

    const auth = /^Bearer\s+(\S+)$/i.exec(headers.Authorization || '');
    if (!auth) return fallo('Se requiere un token Bearer válido', 401);
    if (auth[1] !== TOKEN_DEMO) return fallo('Token inválido o expirado', 401);

    return rutear(metodo, ruta, q, cuerpo);
  } catch (error) {
    if (error instanceof ErrorDemo) return fallo(error.message, error.status);
    return fallo('Error interno dentro del servidor', 500);
  }
}
