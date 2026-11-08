-- Crea (o restablece) la cuenta de administrador predeterminada del panel web.
--
--   Usuario en el login: admin   (el frontend lo traduce al código 00000001)
--   Contraseña:          123456
--
-- Ejecutar una vez en la base del backend (IS2-backend), después de schema.sql y seed.sql:
--   psql -U <usuario_postgres> -d tachin_verde -f docs/crear-admin.sql
--
-- La contraseña se escribe en texto plano solo aquí: el backend acepta contraseñas sin
-- hash y las convierte a bcrypt automáticamente en el primer inicio de sesión
-- (usuario.service.js → validarUsuario). Es una cuenta para desarrollo:
-- cambia la contraseña antes de usarla en un entorno real.

-- seed.sql inserta id_user a mano; se alinea la secuencia para no chocar con esos ids.
SELECT setval(
  pg_get_serial_sequence('public.usuario', 'id_user'),
  GREATEST((SELECT COALESCE(MAX(id_user), 0) FROM public.usuario), 1)
);

INSERT INTO public.usuario (cod_user, nombre, puntos, tipo, contrasena, estado)
VALUES ('00000001', 'Administrador', 0, 'admin', '123456', TRUE)
ON CONFLICT (cod_user) DO UPDATE
SET tipo = 'admin',
    contrasena = '123456',
    estado = TRUE;
