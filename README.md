# ACTIVADCC · Tarea 1


## Cómo ejecutar

Basta con abrir index.html en el navegador. Como se puede ver los
archivos Javascript fueron generados a partir de Typescript, esta
decision fue tomada porque en typescript es mas facil desarrollar
interfaces y partir diseñando los datos en base a las interfaces que
provee.

De todas formas el Javascript compilado es practicamente igual al
Typescript asi que es entendible.

Si se quiere compilar nuevamente para probar, basta con hacer

1. **Compilar TypeScript** desde la raíz del directorio `t1/`:

   ```bash
   tsc
   ```

   Esto genera los archivos `.js` dentro de `js/` usando la configuración de
   `tsconfig.json` (`target: ES2020`, `strict: true`).

2. **Abrir** `index.html` directamente con un navegador (doble click o
   arrastrarlo a una pestaña). Las cuatro páginas (`index`, `registro`,
   `listado`, `estadisticas`) se enlazan entre sí mediante el navbar.


## Estructura de archivos

```
t1/
├── index.html            Portada
├── registro.html         Formulario de registro + actividades
├── listado.html          Tabla con filtros, ordenamiento y paginación
├── estadisticas.html     Gráficos (torta y tendencia)
├── css/
│   └── styles.css        Estilos compartidos
├── ts/                   Código TypeScript fuente
│   ├── types.ts          Interfaces y etiquetas constantes
│   ├── common.ts         Validaciones y utilidades de navegación
│   ├── datos.ts          Dataset estático (10 miembros inventados)
│   ├── registro.ts       Lógica del formulario y validaciones
│   ├── listado.ts        Render de tabla, filtro, orden y paginación
│   └── estadisticas.ts   Generación de gráficos con Chart.js
├── js/                   Salida compilada (generada por `tsc`)
├── tsconfig.json         Configuración de TypeScript
└── README.md             Este archivo
```

## Decisiones de diseño

### Datos identificados y de contacto

Para identificar a un miembro se piden **nombre, apellido, tipo** y un dato
específico según el tipo (semestre, área o curso). Como **datos de contacto**
se solicita el **correo institucional** y, según el tipo, **Telegram** (para
estudiantes) o **teléfono** (para funcionario/académico). Esta separación se
documenta así:


| Propósito      | Campos                                                                                     |
|----------------|--------------------------------------------------------------------------------------------|
| Identificación | nombre, apellido, tipo; semestre (estudiante), área (funcionario/a) o curso (académico/a) |
| Contacto       | correo electrónico; Telegram para estudiantes o teléfono para funcionario/académico        |

### Tipos de miembro

Son 4: `estudiante-pregrado`, `estudiante-postgrado`, `funcionario`,
`academico`. Cada tipo habilita un campo específico en el formulario:
**semestre** para estudiantes (pre y postgrado), **área** para funcionario/a
y **curso que imparte** para académico/a. Los fieldsets inactivos se ocultan
con el atributo `hidden` y no se validan, de modo que cambiar el tipo limpia
la sección que no corresponde.

### Registro en una única página

El formulario de registro pide tanto los datos del miembro como al
menos una actividad en una misma página.  Tras un registro exitoso se
muestra un mensaje y se redirige automáticamente a `listado.html`.

### Actividades múltiples

Cada miembro puede registrar **entre 1 y 5 actividades**.

Cada actividad puede tener varios **horarios** (par `{día, hora
inicio, hora fin}`). Se permite agregar y eliminar horarios
dinámicamente y se valida que los rangos sean consistentes (inicio <
fin) y que no existan **traslapes** entre horarios de una misma
persona (ni dentro de la misma actividad ni entre actividades
distintas).

Cada actividad exige además **al menos un archivo** (imagen o video) y un
**enlace** a contenido propio.

### Validaciones en JavaScript

No se usa el atributo `required`. Todas las validaciones están en
`ts/common.ts` y `ts/registro.ts`. Al enviar el formulario se limpian los
errores previos y se evalúan todos los campos; los mensajes aparecen inline
debajo del campo respectivo.

Reglas implementadas:

| Campo                   | Regla                                                                              |
|-------------------------|------------------------------------------------------------------------------------|
| Nombre/Apellido         | 2–60 caracteres, solo letras (incluye acentos y ñ), espacios, apóstrofes o guiones |
| Correo                  | Regex `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`                                              |
| Telegram (estudiantes)  | `@` seguido de 5–32 caracteres alfanuméricos o `_`                                 |
| Teléfono (func./acad.)  | Entre 8 y 15 dígitos; admite `+`, `-`, paréntesis y espacios                       |
| Tipo                    | Selección obligatoria                                                              |
| Semestre (estudiantes)  | Entero entre 1 y 14                                                                |
| Área (funcionario/a)    | No vacío                                                                           |
| Curso (académico/a)     | No vacío                                                                           |
| Nombre actividad        | 1–80 caracteres                                                                    |
| Categoría actividad     | Selección obligatoria                                                              |
| Horario                 | `hora inicio < hora fin`, día obligatorio                                          |
| Traslape                | No puede haber dos horarios del mismo miembro que coincidan en día y se solapen    |
| Archivos                | Al menos uno, tipo `image/*` o `video/*`                                           |
| Enlace                  | URL válida con esquema `http://` o `https://`                                      |

### Listado

El listado renderiza el dataset estático definido en `ts/datos.ts` (10
miembros con 1–3 actividades cada uno). Ofrece:

- **Filtro por tipo** vía `<select>`. Re-renderiza la tabla y resetea a la
  primera página.
- **Ordenamiento** por click en cualquier encabezado. Se muestran íconos
  `⇅ / ↑ / ↓` junto a cada columna para indicar la dirección activa.
- **Paginación** de 5 filas por página con botones Anterior/Siguiente e
  indicador de página actual.
- **Detalle expandible** al hacer click en una fila se muestra los
  datos específicos del miembro y el listado completo de sus
  actividades con horarios, archivos y enlace.

### Estadísticas

Se usan dos gráficos generados con **Chart.js** (cargado por
CDN). (las librerias estan permitidas segun un comentario del profesor
en el foro). Los datos provienen del mismo dataset estático que
alimenta el listado, lo que mantiene coherencia entre ambas vistas:

- **Torta:** distribución de miembros por tipo.
- **Tendencia (línea):** cantidad de horarios de actividad reportados por día
  de la semana.

Además se incluye un pequeño resumen de indicadores (total de miembros, total
de actividades y promedio).

### HTML semántico

Se usan `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`,
`<fieldset>`, `<legend>`, `<label>`, `<table>` con `<caption>`, `<thead>`,
`<tbody>`. 

### CSS

Un único archivo `css/styles.css`.

### TypeScript sin bundler

Se compila con `module: none`, lo que deja cada `.ts` como un script global.
Cada página carga los archivos en el orden apropiado con `defer`, por ejemplo
`listado.html`:

```html
<script src="js/types.js" defer></script>
<script src="js/common.js" defer></script>
<script src="js/datos.js" defer></script>
<script src="js/listado.js" defer></script>
```

De este modo `MIEMBROS`, `ETIQUETAS_*` y las funciones de validación son
globales y quedan disponibles para los scripts por página.

