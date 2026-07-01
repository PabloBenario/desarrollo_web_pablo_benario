# ACTIVADCC · Tarea 4

Continúa las tareas previas (T1 → T2 → T3) del sistema de actividades
extraprogramáticas del DCC. La Tarea 4 agrega dos funcionalidades nuevas, ahora
sobre **Spring Boot** (Java 17+) con **JPA/Hibernate** para la base de datos y
**JavaScript asíncrono** (`fetch`) en el cliente:

1. **Buscador de actividades**
2. **Evaluación de actividades** con notas de 1 a 7.

Se mantiene un estilo simple. La aplicación usa la **misma base de
datos `tarea2`** de las tareas previas; solo se agrega una tabla
nueva, `nota`.

## Tarea 4

### Buscador de actividades

- Un único campo de texto. Al escribir **3 caracteres** la búsqueda se dispara
  **automáticamente** (con un pequeño *debounce* de 300 ms), sin botón.
- Busca actividades cuyo **nombre**, **descripción** o **nombre de la comuna**
  del miembro contengan el patrón (sin distinguir mayúsculas/minúsculas).
- Cada resultado muestra: **nombre del miembro**, **día(s)** de la actividad,
  **tipo**, **comuna**, **nombre** y **descripción**.
- **Destaca** (con `<mark>`) el texto que calza con el patrón buscado en el
  nombre, la descripción y la comuna.
- Si no hay resultados, muestra un mensaje apropiado.

### Notas (evaluación)

- Cada resultado incluye una **nota**: muestra `-` si la actividad aún no ha
  sido evaluada, junto a un contador de evaluaciones y un botón **"Evaluar"**.
- Al hacer clic en **"Evaluar"** aparece un selector para elegir una nota
  **entre 1 y 7**. Al seleccionarla, se guarda en la base de datos mediante una
  **llamada asíncrona** (`POST`).
- Solo se aceptan **números enteros entre 1 y 7** (validado en el cliente y,
  sobre todo, **en el servidor**).
- Al agregar la nota, el servidor **recalcula el promedio** y el cliente
  **actualiza en pantalla** el promedio y el **contador** de evaluaciones, todo
  sin recargar la página.
- Las notas viven en una **tabla nueva `nota`** (una fila por evaluación).

## Requisitos

- **JDK 17 o superior** (usé OpenJDK 25).
- **Maven** (`mvn`). Las dependencias se descargan solas la primera vez.
- **MySQL** con la base `tarea2` de las tareas previas (usuario `cc5002`).

## Puesta en marcha

### 1. Base de datos

La base `tarea2` es la misma de la Tarea 2/3. 

```bash
mysql -u root < ../t3/tarea2-row-data.sql      # crea el esquema tarea2
mysql -u root tarea2 < ../t3/region-comuna.sql  # carga regiones y comunas
```

Crea el usuario que pide el enunciado (usuario `cc5002`, clave
`programacionweb`, base `tarea2`, host `localhost`, puerto `3306`) si aún no
existe:

```bash
mysql -u root -e "CREATE USER IF NOT EXISTS 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';"
mysql -u root -e "GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost'; FLUSH PRIVILEGES;"
```

**Crea la tabla nueva de la Tarea 4** con el script provisto:

```bash
mysql -u root tarea2 < tabla-nota.sql
```

Carga datos de demostración realistas para probar el buscador:

```bash
mysql -u root tarea2 < datos-demo-tarea4.sql
```

### 2. Ejecutar la aplicación

```bash
cd spring-boot-app
mvn spring-boot:run
```

Luego abre **http://localhost:8080/** en el navegador.

Para empaquetar y correr el JAR en su lugar:

```bash
cd spring-boot-app
mvn clean package
java -jar target/tarea4-1.0.0.jar
```

## API (usado por el JavaScript del cliente)

| Método | Ruta                                 | Descripción                                                                                                                                                                              |
|--------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GET`  | `/api/actividades/buscar?q=<patrón>` | Devuelve un JSON con las actividades que calzan. Si el patrón tiene menos de 3 caracteres, devuelve `[]`.                                                                                |
| `POST` | `/api/actividades/{id}/notas`        | Agrega una nota. Cuerpo: `{"nota": 5}`. Responde `201` con `{notaPromedio, notaCantidad}` recalculados. Devuelve `400` si la nota no es un entero 1–7 y `404` si la actividad no existe. |

## Decisiones de diseño

### Simplicidad

Trato de evitar complejidad innecesaria. El
código es pequeño y de lectura directa:

- Una entidad JPA por tabla usada (`Actividad`, `Miembro`, `Comuna`, `Horario`,
  `Nota`); de las tablas que solo se leen se mapean únicamente las columnas
  necesarias.
- Dos repositorios (`ActividadRepository`, `NotaRepository`) con Spring Data.
- Un servicio (`ActividadService`) con la lógica del buscador y de las notas.
- Dos controladores: uno sirve la página (`PaginaController`) y otro es el API
  REST (`ApiController`).
- Una sola página (`buscador.html`) con un único `buscador.js` que hace todo el
  trabajo asíncrono.

### El buscador en el servidor

`ActividadRepository.buscar()` usa una consulta JPQL parametrizada con `LIKE`
sobre nombre, descripción y comuna, y trae de una vez el miembro y su comuna
(`JOIN FETCH`).


### El resaltado en el cliente

El texto se pinta escapando siempre el HTML (para evitar inyección) y envolviendo
las coincidencias del patrón en `<mark>`. Así, aunque una actividad tenga un
nombre con caracteres como `<` o `>`, no se ejecuta HTML/JS inyectado.

### Validación de la nota (cliente y servidor)

En el cliente el selector solo ofrece los valores 1–7. En el servidor se valida
estrictamente que la nota sea un **entero entre 1 y 7**: un `5.5` llega como
decimal y un `"5"` como texto, y ambos se rechazan con `400`. El promedio se
recalcula en el servidor y se devuelve para que el cliente lo muestre.

### Bibliotecas externas

No se usan bibliotecas externas en el cliente: basta `fetch` nativo, como
permite el enunciado. En el servidor, Spring Boot aporta MVC, Thymeleaf y JPA
(Hibernate); el driver es `mysql-connector-j`.

## Modelo de datos

Se reutiliza el modelo de las tareas previas (`region`, `comuna`, `miembro`,
`actividad`, `horario`, `foto`, `comentario`) y se agrega:

- **`nota`** — una nota entera por evaluación, asociada a una actividad
  (`actividad_id`). Se crea con `tabla-nota.sql`. El promedio que ve el usuario
  se calcula a partir de todas las filas de `nota` de esa actividad.

## Estructura del proyecto

```text
t4/
├── Enunciado Tarea 4.md
├── tabla-nota.sql              # crea la tabla nueva "nota"
├── datos-demo-tarea4.sql       # datos de demostración (opcional)
├── README.md
└── spring-boot-app/
    ├── pom.xml
    └── src/main/
        ├── java/com/desarrolloweb/tarea4/
        │   ├── Tarea4Application.java   # arranque de Spring Boot
        │   ├── Etiquetas.java           # etiquetas legibles (tipo/día)
        │   ├── ActividadService.java    # lógica de búsqueda y notas
        │   ├── model/                   # entidades JPA
        │   ├── repo/                    # repositorios Spring Data
        │   ├── dto/                     # objetos que se envían como JSON
        │   └── web/                     # controladores (página + API REST)
        └── resources/
            ├── application.properties   # puerto, Thymeleaf, datos de conexión
            ├── templates/buscador.html  # la página
            └── static/
                ├── css/styles.css
                └── js/buscador.js       # búsqueda y evaluación asíncronas
```

## Configuración de conexión

Por defecto la aplicación se conecta a:

```text
jdbc:mysql://localhost:3306/tarea2   (usuario cc5002 / clave programacionweb)
```

Se puede ajustar en `spring-boot-app/src/main/resources/application.properties`.
