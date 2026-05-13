# ACTIVADCC · Tarea 2

Aplicación web desarrollada con **Flask**, **SQLAlchemy** y **MySQL** para la
Tarea 2 de Desarrollo de Aplicaciones Web. El proyecto continúa el prototipo de
la Tarea 1: permite registrar miembros de la comunidad DCC junto con sus
actividades, revisar el listado de miembros y consultar estadísticas generales.

## Funcionalidades implementadas

- **Portada**: muestra un mensaje de bienvenida, enlaces principales,
  indicadores generales y los últimos 5 miembros registrados.
- **Registro de miembro y actividades**: formulario con validaciones en
  JavaScript y validación equivalente en el servidor antes de guardar.
- **Listado de miembros**: tabla paginada de 5 miembros por página, con filtro
  por tipo, ordenamiento por columna y enlace al detalle.
- **Detalle de miembro**: muestra datos personales, comuna, actividades,
  horarios, archivos subidos y enlaces.
- **Estadísticas**: muestra indicadores simples y gráficos generados con
  Chart.js a partir de datos guardados en la base de datos.

## Decisiones de diseño

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

### Estructura del código

- `app.py`: rutas, consultas principales, validación del formulario y guardado.
- `models.py`: modelos SQLAlchemy.
- `validators.py`: funciones de validación.
- `templates/`: páginas Jinja.
- `static/`: CSS, JavaScript y archivos subidos.

## Estructura del proyecto

```text
t2/
├── app.py
├── models.py
├── validators.py
├── requirements.txt
├── tarea2-row-data.sql
├── region-comuna.sql
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
    │   └── estadisticas.js
    └── uploads/
```

## Cómo ejecutar

### 1. Crear entorno virtual e instalar dependencias

Desde la carpeta `.`:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Crear la base de datos

```bash
mysql -u root
```

Para crear el esquema actual de la tarea y cargar regiones/comunas:

```bash
mysql -u root < tarea2-row-data.sql
mysql -u root tarea2 < region-comuna.sql
```

El archivo `tarea2-row-data.sql` crea la base `tarea2` desde cero. Si ya existe,
la elimina primero con `DROP SCHEMA IF EXISTS tarea2`.

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
