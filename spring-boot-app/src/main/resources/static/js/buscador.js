/*
 * Buscador de actividades + evaluación (Tarea 4).
 * Todo se hace con llamadas asíncronas (fetch) al API REST de Spring Boot.
 */
(function () {
  "use strict";

  var MIN = 3;            // mínimo de caracteres para buscar
  var ESPERA = 300;       // ms de espera (debounce) antes de disparar la búsqueda

  var input = document.getElementById("q");
  var estado = document.getElementById("estado");
  var resultados = document.getElementById("resultados");

  var temporizador = null;
  var contador = 0;       // para descartar respuestas obsoletas

  input.addEventListener("input", function () {
    clearTimeout(temporizador);
    estado.className = "";
    var q = input.value.trim();

    if (q.length === 0) {
      estado.textContent = "";
      resultados.innerHTML = "";
      return;
    }
    if (q.length < MIN) {
      resultados.innerHTML = "";
      estado.textContent = "Escribe al menos " + MIN + " caracteres para buscar.";
      return;
    }
    temporizador = setTimeout(function () { buscar(q); }, ESPERA);
  });

  async function buscar(q) {
    var id = ++contador;
    estado.textContent = "Buscando…";
    try {
      var resp = await fetch("/api/actividades/buscar?q=" + encodeURIComponent(q));
      var datos = await resp.json();
      if (id !== contador) return;           // llegó tarde: hay una búsqueda más nueva
      mostrarResultados(datos, q);
    } catch (e) {
      if (id !== contador) return;
      resultados.innerHTML = "";
      estado.textContent = "Ocurrió un error al buscar. Intenta nuevamente.";
    }
  }

  function mostrarResultados(datos, q) {
    resultados.innerHTML = "";
    if (!datos.length) {
      estado.className = "estado-vacio";
      estado.textContent = "No se encontraron actividades para «" + q + "».";
      return;
    }
    estado.className = "";
    estado.textContent = datos.length === 1
      ? "1 actividad encontrada."
      : datos.length + " actividades encontradas.";
    datos.forEach(function (r) { resultados.appendChild(tarjeta(r, q)); });
  }

  // ---- Construcción de una tarjeta de resultado ---------------------------

  function tarjeta(r, q) {
    var art = document.createElement("article");
    art.className = "resultado";

    var titulo = document.createElement("h3");
    titulo.innerHTML = resaltar(r.nombre, q);   // nombre: campo buscado -> se destaca
    art.appendChild(titulo);

    var dl = document.createElement("dl");
    fila(dl, "Miembro", texto(r.miembro));
    fila(dl, "Día", texto(r.dias || "—"));
    fila(dl, "Tipo", texto(r.tipo));
    fila(dl, "Comuna", resaltar(r.comuna, q));                 // comuna: campo buscado
    fila(dl, "Descripción", r.descripcion ? resaltar(r.descripcion, q) : "—"); // descripción: campo buscado
    art.appendChild(dl);

    art.appendChild(bloqueNota(r));
    return art;
  }

  // Agrega un par <dt>/<dd>. "valorHtml" ya viene como HTML seguro (escapado).
  function fila(dl, etiqueta, valorHtml) {
    var dt = document.createElement("dt");
    dt.textContent = etiqueta;
    var dd = document.createElement("dd");
    dd.innerHTML = valorHtml;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  // ---- Bloque de nota / evaluación ----------------------------------------

  function bloqueNota(r) {
    var bloque = document.createElement("div");
    bloque.className = "nota-bloque";

    var etiqueta = document.createElement("span");
    etiqueta.appendChild(document.createTextNode("Nota: "));
    var valor = document.createElement("span");
    valor.className = "nota-valor";
    etiqueta.appendChild(valor);

    var contadorSpan = document.createElement("span");
    contadorSpan.className = "nota-contador";

    var boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Evaluar";

    var select = crearSelectNotas();
    select.hidden = true;

    var error = document.createElement("span");
    error.className = "nota-error";
    error.hidden = true;

    bloque.appendChild(etiqueta);
    bloque.appendChild(contadorSpan);
    bloque.appendChild(boton);
    bloque.appendChild(select);
    bloque.appendChild(error);

    // Estado inicial con los datos del resultado.
    pintarNota(valor, contadorSpan, r.notaPromedio, r.notaCantidad);

    // Al hacer clic en "Evaluar" se muestra el selector de nota.
    boton.addEventListener("click", function () {
      error.hidden = true;
      boton.hidden = true;
      select.hidden = false;
      select.value = "";
      select.focus();
    });

    // Al seleccionar una nota se envía de forma asíncrona.
    select.addEventListener("change", async function () {
      if (select.value === "") return;
      var nota = parseInt(select.value, 10);
      error.hidden = true;
      select.disabled = true;
      try {
        var resp = await fetch("/api/actividades/" + r.id + "/notas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nota: nota })
        });
        var datos = await resp.json();
        if (!resp.ok) {
          error.textContent = datos.error || "No se pudo guardar la nota.";
          error.hidden = false;
          return;
        }
        // Recalcular en pantalla el promedio y el contador con lo que devuelve el servidor.
        pintarNota(valor, contadorSpan, datos.notaPromedio, datos.notaCantidad);
        select.hidden = true;
        boton.hidden = false;
      } catch (e) {
        error.textContent = "Ocurrió un error al guardar la nota.";
        error.hidden = false;
      } finally {
        select.disabled = false;
      }
    });

    return bloque;
  }

  function crearSelectNotas() {
    var select = document.createElement("select");
    select.className = "select-nota";
    select.setAttribute("aria-label", "Selecciona una nota entre 1 y 7");
    var vacia = new Option("Nota…", "");
    vacia.disabled = true;
    vacia.selected = true;
    select.add(vacia);
    for (var n = 1; n <= 7; n++) {
      select.add(new Option(n, n));
    }
    return select;
  }

  // Muestra el promedio ("-" si no hay notas) y el contador de evaluaciones.
  function pintarNota(valor, contadorSpan, promedio, cantidad) {
    if (promedio === null || promedio === undefined) {
      valor.textContent = "-";
    } else {
      valor.textContent = Number(promedio).toFixed(1);
    }
    if (!cantidad) {
      contadorSpan.textContent = "(sin evaluaciones)";
    } else {
      contadorSpan.textContent = cantidad === 1
        ? "(1 evaluación)"
        : "(" + cantidad + " evaluaciones)";
    }
  }

  // ---- Utilidades: escapado y resaltado seguros ---------------------------

  function texto(valor) {
    return escaparHtml(valor == null ? "" : String(valor));
  }

  function escaparHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function escaparRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Devuelve HTML seguro con el patrón envuelto en <mark>. Todo el texto se
  // escapa; solo se insertan las etiquetas <mark> que controla este código.
  function resaltar(valor, patron) {
    var s = valor == null ? "" : String(valor);
    if (!s) return "";
    if (!patron) return escaparHtml(s);

    var re = new RegExp(escaparRegex(patron), "gi");
    var salida = "";
    var ultimo = 0;
    var m;
    while ((m = re.exec(s)) !== null) {
      salida += escaparHtml(s.slice(ultimo, m.index));
      salida += "<mark>" + escaparHtml(m[0]) + "</mark>";
      ultimo = m.index + m[0].length;
      if (m.index === re.lastIndex) re.lastIndex++;  // evita bucles con coincidencias vacías
    }
    salida += escaparHtml(s.slice(ultimo));
    return salida;
  }
})();
