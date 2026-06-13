# ACTIVADCC · Tarea 3

Aplicación web desarrollada con **Flask**, **SQLAlchemy** y **MySQL**. La Tarea 3
continúa la Tarea 2 (que a su vez continúa el prototipo de la Tarea 1): permite
registrar miembros de la comunidad DCC junto con sus actividades, revisar el
listado de miembros, consultar estadísticas y **comentar las actividades**.

La interfaz está escrita en español y mantiene un diseño simple, directo y
funcional, sin agregar complejidad innecesaria.

> La entrega de la Tarea 3 vive en la rama `Tarea 3` del repositorio.

## Novedades de la Tarea 3

- **Estadísticas con 3 gráficos** generados en el cliente. Los datos se obtienen
  con una llamada asíncrona (`axios`, sobre `fetch`) a `GET /api/estadisticas` y
  se dibujan con Chart.js:
  1. **Líneas** — miembros registrados por día.
  2. **Torta** — total de actividades por tipo.
  3. **Barras** — total de actividades por comuna (solo comunas con miembros).

  Al final de la pantalla hay un enlace para volver a la portada.
- **Comentarios por actividad.** En el detalle del miembro, bajo cada actividad
  se muestran el listado de comentarios y un formulario para agregar uno nuevo,
  todo en la misma página. El alta y el listado usan llamadas asíncronas
  (`axios`) contra `GET`/`POST /api/actividades/<id>/comentarios`. El nombre del
  comentarista es obligatorio (3–80 caracteres) y el texto es obligatorio
  (mínimo 5). Las reglas se validan en el cliente y nuevamente en el servidor
  antes de insertar en la tabla `comentario`.

## Funcionalidades implementadas

- **Portada**: muestra un mensaje de bienvenida, enlaces principales,
  indicadores generales y los últimos 5 miembros registrados.
- **Registro de miembro y actividades**: formulario con validaciones en
  JavaScript y validación equivalente en el servidor antes de guardar.
- **Listado de miembros**: tabla paginada de 5 miembros por página, con filtro
  por tipo, ordenamiento por columna y enlace al detalle.
- **Detalle de miembro**: muestra datos personales, comuna, actividades,
  horarios, archivos subidos y enlaces.
- **Estadísticas**: indicadores simples y 3 gráficos (líneas, torta y barras)
  generados con Chart.js a partir de datos pedidos por `fetch`/`axios` a la URL
  `/api/estadisticas`.
- **Comentarios**: en el detalle del miembro, cada actividad muestra inline su
  listado de comentarios y un formulario para agregar uno nuevo mediante
  llamadas asíncronas.

## Decisiones de diseño

### Decisiones de la Tarea 3

- **Comentarios inline en el detalle del miembro.** El listado y el formulario de
  cada actividad se muestran en la misma página, bajo la actividad, sin pasos de
  navegación extra. Es lo más directo y el código más simple: el JS recorre todas
  las secciones de comentarios de la página y atiende cada formulario por separado.
- **Una sola URL para los gráficos.** `GET /api/estadisticas` devuelve los 3
  conjuntos de datos en un único JSON (`{labels, data}` por gráfico). El cliente
  hace una sola llamada asíncrona y dibuja los 3 gráficos.
- **Validación en cliente y servidor.** Los comentarios se validan en el
  navegador para dar retroalimentación rápida y se vuelven a validar en Flask
  antes de insertar. Si el servidor rechaza el dato, responde `400` con los
  errores y el formulario queda visible para corregir.
- **Entradas maliciosas.** Las consultas e inserciones usan SQLAlchemy
  parametrizado (sin SQL armado a mano) y los IDs de la URL son `<int:...>`. Los
  comentarios se pintan en el cliente con `textContent` (no `innerHTML`), por lo
  que no se ejecuta HTML/JS inyectado.

### Librerías externas

Ambas se cargan por CDN solo en las páginas que las usan y son de uso libre:

- **Chart.js 4** (licencia MIT) — dibuja los gráficos de estadísticas.
- **axios 1.7** (licencia MIT) — realiza las llamadas asíncronas (`GET`/`POST`)
  para estadísticas y comentarios.

No se agregan dependencias de Python nuevas (`requirements.txt` se mantiene).

### Continuidad con Tarea 1

La prioridad fue preservar el comportamiento del prototipo de Tarea 1. Por eso
el formulario mantiene:

- distintos tipos de miembro: estudiante de pregrado, estudiante de postgrado,
  funcionario/a y académico/a;
- datos específicos según el tipo de miembro;
- entre 1 y 5 actividades por miembro;
- múltiples horarios por actividad;
- múltiples archivos por actividad;
- enlace a contenido propio por actividad.

### Modelo de datos

El modelo base considera las tablas `region`, `comuna`, `miembro`,
`actividad` y `foto`. Se ajustó de forma mínima para acomodar las decisiones de
Tarea 1:

- `miembro` incluye `apellido`, `tipo`, `telegram`, `semestre`, `area` y
  `curso`.
- `telefono` puede ser nulo, porque estudiantes usan Telegram.
- `actividad` representa una actividad lógica y guarda su categoría, nombre,
  descripción y enlace.
- Se agregó la tabla `horario`, porque una actividad puede tener varios
  horarios.
- `foto` no guarda el archivo binario, solo la ruta y el nombre original del
  archivo subido.
- `comentario` (Tarea 3) guarda el nombre del comentarista, el texto, la fecha y
  la actividad asociada. Se crea con el script `tabla-comentario.sql`.

Los archivos subidos se guardan en:

```text
static/uploads/
```

La base de datos solo guarda metadatos, por ejemplo `uploads/archivo.png`.

### Validaciones

Se mantienen validaciones en JavaScript para entregar retroalimentación rápida
al usuario. Además, las mismas reglas importantes se validan nuevamente en
Flask antes de insertar en la base de datos.

Esto incluye:

- nombre y apellido;
- correo;
- Telegram o teléfono según tipo de miembro;
- semestre, área o curso según corresponda;
- comuna válida;
- cantidad de actividades;
- nombre, categoría, descripción y enlace de cada actividad;
- horarios completos, rangos válidos y sin traslapes;
- archivos de tipo imagen o video.

### Simplicidad del código

El proyecto evita estructuras más grandes como blueprints, app factories o
migraciones automáticas. Para esta tarea se priorizó que el flujo fuera fácil de
leer:

- `app.py`: rutas, consultas principales, validación del formulario y guardado.
- `models.py`: modelos SQLAlchemy.
- `validators.py`: funciones de validación.
- `templates/`: páginas Jinja.
- `static/`: CSS, JavaScript y archivos subidos.

## Estructura del proyecto

```text
t3/
├── app.py
├── models.py
├── validators.py
├── requirements.txt
├── tarea2-row-data.sql
├── region-comuna.sql
├── tabla-comentario.sql
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── registro.html
│   ├── miembros.html
│   ├── detalle_miembro.html
│   └── estadisticas.html
└── static/
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── common.js
    │   ├── registro.js
    │   ├── listado.js
    │   ├── comentarios.js
    │   └── estadisticas.js
    └── uploads/
```

## Cómo ejecutar

### 1. Crear entorno virtual e instalar dependencias

Desde la carpeta `t2/`:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Crear la base de datos

Si MySQL fue instalado con Homebrew, normalmente se puede entrar con el usuario
`root` sin contraseña:

```bash
mysql -u root
```

Para crear el esquema actual de la tarea y cargar regiones/comunas:

```bash
mysql -u root < tarea2-row-data.sql
mysql -u root tarea2 < region-comuna.sql
mysql -u root tarea2 < tabla-comentario.sql
```

El archivo `tarea2-row-data.sql` crea la base `tarea2` desde cero. Si ya existe,
la elimina primero con `DROP SCHEMA IF EXISTS tarea2`. El script
`tabla-comentario.sql` agrega la tabla `comentario` que usa la Tarea 3.

### 3. Crear el usuario usado por la aplicación

El enunciado pide usar:

```text
usuario: cc5002
clave: programacionweb
base: tarea2
host: localhost
puerto: 3306
```

Para crear ese usuario y darle permisos:

```bash
mysql -u root -e "CREATE USER IF NOT EXISTS 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';"
mysql -u root -e "ALTER USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';"
mysql -u root -e "GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost'; FLUSH PRIVILEGES;"
```

Para comprobar que funciona:

```bash
mysql -u cc5002 -pprogramacionweb tarea2 -e "SHOW TABLES;"
```

Deberían aparecer tablas como:

```text
region
comuna
miembro
actividad
horario
foto
comentario
```

### 4. Ejecutar Flask

Con el entorno virtual activo:

```bash
flask --app app run --debug
```

Luego abrir:

```text
http://127.0.0.1:5000
```

## Configuración de conexión

Por defecto la aplicación usa esta conexión:

```text
mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2?charset=utf8mb4
```

Si se quiere usar otra configuración, se puede definir la variable de entorno
`DATABASE_URL`:

```bash
DATABASE_URL="mysql+pymysql://usuario:clave@localhost:3306/tarea2?charset=utf8mb4" flask --app app run --debug
```

## Notas finales

- Los HTML no se generan como archivos estáticos: Flask los renderiza
  dinámicamente desde `templates/`.
- Los archivos subidos quedan en `static/uploads/`.
- El servidor de desarrollo de Flask es solo para pruebas locales.
- Para reiniciar la base de datos, basta con volver a ejecutar
  `tarea2-row-data.sql`, luego `region-comuna.sql` y luego
  `tabla-comentario.sql`.
