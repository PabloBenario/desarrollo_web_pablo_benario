-- Datos de demostración (OPCIONAL) para la Tarea 4.
-- Inserta algunos miembros y actividades realistas para probar el buscador
-- y el resaltado sobre palabras reales. Solo agrega filas: no borra nada.
--
-- Cargar con:   mysql -u root tarea2 < datos-demo-tarea4.sql
-- (o con el usuario de la app: mysql -u cc5002 -pprogramacionweb tarea2 < datos-demo-tarea4.sql)
--
-- Las comunas se referencian por nombre para no depender de ids concretos.

USE `tarea2`;

START TRANSACTION;

-- --- Miembro 1: Diego (Providencia) -----------------------------------------
INSERT INTO miembro (nombre, apellido, email, telegram, tipo, semestre, fecha_registro, comuna_id)
VALUES ('Diego', 'Muñoz', 'diego.munoz@dcc.uchile.cl', '@diegomz', 'estudiante-pregrado', 6, NOW(),
        (SELECT id FROM comuna WHERE nombre = 'Providencia' LIMIT 1));
SET @diego := LAST_INSERT_ID();

INSERT INTO actividad (miembro_id, tipo, nombre, descripcion, enlace)
VALUES (@diego, 'deportiva', 'Fútbol recreativo', 'Pichangas abiertas los miércoles en la cancha del DCC.', 'https://dcc.uchile.cl/futbol');
SET @a := LAST_INSERT_ID();
INSERT INTO horario (actividad_id, dia, hora_inicio, hora_fin) VALUES (@a, 'miercoles', '18:00', '19:30');

INSERT INTO actividad (miembro_id, tipo, nombre, descripcion, enlace)
VALUES (@diego, 'recreativa', 'Noche de juegos de mesa', 'Catan, Carcassonne y más juegos de estrategia.', 'https://dcc.uchile.cl/juegos');
SET @a := LAST_INSERT_ID();
INSERT INTO horario (actividad_id, dia, hora_inicio, hora_fin) VALUES (@a, 'viernes', '19:00', '22:00');

-- --- Miembro 2: Ana (Ñuñoa) -------------------------------------------------
INSERT INTO miembro (nombre, apellido, email, telefono, tipo, curso, fecha_registro, comuna_id)
VALUES ('Ana', 'Rojas', 'ana.rojas@dcc.uchile.cl', '+56 9 1234 5678', 'academico', 'Bases de Datos', NOW(),
        (SELECT id FROM comuna WHERE nombre = 'Ñuñoa' LIMIT 1));
SET @ana := LAST_INSERT_ID();

INSERT INTO actividad (miembro_id, tipo, nombre, descripcion, enlace)
VALUES (@ana, 'tecnologica', 'Taller de Programación Web', 'Introducción práctica a HTML, CSS y JavaScript.', 'https://dcc.uchile.cl/taller-web');
SET @a := LAST_INSERT_ID();
INSERT INTO horario (actividad_id, dia, hora_inicio, hora_fin) VALUES (@a, 'martes', '15:00', '17:00');
INSERT INTO horario (actividad_id, dia, hora_inicio, hora_fin) VALUES (@a, 'jueves', '15:00', '17:00');

INSERT INTO actividad (miembro_id, tipo, nombre, descripcion, enlace)
VALUES (@ana, 'social', 'Club de Lectura', 'Nos juntamos a comentar un libro distinto cada mes.', 'https://dcc.uchile.cl/lectura');
SET @a := LAST_INSERT_ID();
INSERT INTO horario (actividad_id, dia, hora_inicio, hora_fin) VALUES (@a, 'lunes', '13:00', '14:00');

-- --- Miembro 3: Camila (Santiago) -------------------------------------------
INSERT INTO miembro (nombre, apellido, email, telefono, tipo, area, fecha_registro, comuna_id)
VALUES ('Camila', 'Soto', 'camila.soto@dcc.uchile.cl', '+56 2 2978 0000', 'funcionario', 'Calidad de Vida', NOW(),
        (SELECT id FROM comuna WHERE nombre = 'Santiago' LIMIT 1));
SET @camila := LAST_INSERT_ID();

INSERT INTO actividad (miembro_id, tipo, nombre, descripcion, enlace)
VALUES (@camila, 'artistica', 'Taller de Fotografía', 'Fundamentos de composición, luz y edición.', 'https://dcc.uchile.cl/fotografia');
SET @a := LAST_INSERT_ID();
INSERT INTO horario (actividad_id, dia, hora_inicio, hora_fin) VALUES (@a, 'miercoles', '16:00', '18:00');

COMMIT;
