(function () {
  var form = document.getElementById("form-registro");
  if (!form) return;

  var selectTipo = document.getElementById("tipo");
  var fsEstudiante = document.getElementById("datos-estudiante");
  var fsFuncionario = document.getElementById("datos-funcionario");
  var fsAcademico = document.getElementById("datos-academico");
  var lblTelegram = document.getElementById("label-telegram");
  var lblTelefono = document.getElementById("label-telefono");
  var listaActividades = document.getElementById("lista-actividades");
  var btnAgregarActividad = document.getElementById("btn-agregar-actividad");
  var mensaje = document.getElementById("mensaje-resultado");
  var LIMITE_ACTIVIDADES = 5;

  var DIAS = [
    ["lunes", "Lunes"],
    ["martes", "Martes"],
    ["miercoles", "Miércoles"],
    ["jueves", "Jueves"],
    ["viernes", "Viernes"],
    ["sabado", "Sábado"],
    ["domingo", "Domingo"]
  ];

  var CATEGORIAS = [
    ["artistica", "Artística"],
    ["deportiva", "Deportiva"],
    ["tecnologica", "Tecnológica"],
    ["social", "Social"],
    ["recreativa", "Recreativa"]
  ];

  var contadorActividad = Array.from(document.querySelectorAll(".actividad-bloque"))
    .reduce(function (maximo, bloque) {
      return Math.max(maximo, Number(bloque.dataset.idx || "0"));
    }, 0);

  function inputVal(id) {
    var el = document.getElementById(id);
    return el ? el.value : "";
  }

  function alternarCamposEspecificos() {
    var tipo = selectTipo.value;
    var esEstudiante = tipo === "estudiante-pregrado" || tipo === "estudiante-postgrado";
    fsEstudiante.hidden = !esEstudiante;
    fsFuncionario.hidden = tipo !== "funcionario";
    fsAcademico.hidden = tipo !== "academico";
    lblTelegram.hidden = !!tipo && !esEstudiante;
    lblTelefono.hidden = !tipo || esEstudiante;
  }

  function opciones(lista) {
    return lista.map(function (par) {
      return '<option value="' + par[0] + '">' + par[1] + '</option>';
    }).join("");
  }

  function crearFilaHorario(idx) {
    var fila = document.createElement("div");
    fila.className = "grupo-horario";
    fila.innerHTML = [
      '<label>Día',
      '<select class="h-dia" name="act_' + idx + '_dia">',
      '<option value="">--</option>',
      opciones(DIAS),
      '</select>',
      '</label>',
      '<label>Inicio',
      '<input type="time" class="h-inicio" name="act_' + idx + '_hora_inicio">',
      '</label>',
      '<label>Fin',
      '<input type="time" class="h-fin" name="act_' + idx + '_hora_fin">',
      '</label>',
      '<button type="button" class="boton secundario btn-eliminar-horario">-</button>'
    ].join("");
    prepararFilaHorario(fila);
    return fila;
  }

  function crearBloqueActividad() {
    contadorActividad += 1;
    var idx = contadorActividad;
    var section = document.createElement("article");
    section.className = "actividad-bloque";
    section.dataset.idx = String(idx);
    section.innerHTML = [
      '<input type="hidden" name="actividad_indices" value="' + idx + '">',
      '<header>',
      '<h3>Actividad #' + idx + '</h3>',
      '<button type="button" class="boton peligro btn-eliminar-actividad">Eliminar</button>',
      '</header>',
      '<label>Nombre <span class="requerido">*</span>',
      '<input type="text" class="act-nombre" name="act_' + idx + '_nombre" maxlength="80">',
      '<small class="error act-err-nombre"></small>',
      '</label>',
      '<label>Categoría <span class="requerido">*</span>',
      '<select class="act-categoria" name="act_' + idx + '_categoria">',
      '<option value="">-- Selecciona --</option>',
      opciones(CATEGORIAS),
      '</select>',
      '<small class="error act-err-categoria"></small>',
      '</label>',
      '<label>Descripción <span class="opcional">(opcional, máx. 300)</span>',
      '<textarea class="act-descripcion" name="act_' + idx + '_descripcion" maxlength="300"></textarea>',
      '<small class="error act-err-descripcion"></small>',
      '</label>',
      '<fieldset>',
      '<legend>Horarios <span class="requerido">*</span></legend>',
      '<div class="lista-horarios"></div>',
      '<button type="button" class="boton secundario btn-agregar-horario">+ Agregar horario</button>',
      '<small class="error act-err-horarios"></small>',
      '</fieldset>',
      '<label>Archivos (imagen o video) <span class="requerido">*</span>',
      '<input type="file" class="act-archivos" name="act_' + idx + '_archivos" multiple accept="image/*,video/*">',
      '<small class="error act-err-archivos"></small>',
      '</label>',
      '<label>Enlace a contenido propio <span class="requerido">*</span>',
      '<input type="url" class="act-enlace" name="act_' + idx + '_enlace" placeholder="https://...">',
      '<small class="error act-err-enlace"></small>',
      '</label>'
    ].join("");
    section.querySelector(".lista-horarios").appendChild(crearFilaHorario(idx));
    prepararBloqueActividad(section);
    return section;
  }

  function prepararFilaHorario(fila) {
    var btnEliminar = fila.querySelector(".btn-eliminar-horario");
    btnEliminar.addEventListener("click", function () {
      var padre = fila.parentElement;
      if (padre && padre.querySelectorAll(".grupo-horario").length > 1) {
        fila.remove();
      }
    });
  }

  function prepararBloqueActividad(bloque) {
    var idx = bloque.dataset.idx;
    var btnEliminarAct = bloque.querySelector(".btn-eliminar-actividad");
    var btnAgregarHor = bloque.querySelector(".btn-agregar-horario");

    bloque.querySelectorAll(".grupo-horario").forEach(prepararFilaHorario);

    btnEliminarAct.addEventListener("click", function () {
      var bloques = listaActividades.querySelectorAll(".actividad-bloque");
      if (bloques.length > 1) {
        bloque.remove();
        renumerarActividades();
      } else {
        document.getElementById("err-actividades").textContent = "Debe haber al menos una actividad";
      }
    });

    btnAgregarHor.addEventListener("click", function () {
      bloque.querySelector(".lista-horarios").appendChild(crearFilaHorario(idx));
    });
  }

  function renumerarActividades() {
    listaActividades.querySelectorAll(".actividad-bloque").forEach(function (bloque, i) {
      var titulo = bloque.querySelector("h3");
      if (titulo) titulo.textContent = "Actividad #" + (i + 1);
    });
  }

  function validarActividad(bloque, idxVisual, todosHorarios) {
    var nombreAct = bloque.querySelector(".act-nombre").value.trim();
    var categoria = bloque.querySelector(".act-categoria").value;
    var descripcion = bloque.querySelector(".act-descripcion").value;
    var archivosInput = bloque.querySelector(".act-archivos");
    var enlace = bloque.querySelector(".act-enlace").value;
    var ok = true;

    if (!nombreAct) {
      bloque.querySelector(".act-err-nombre").textContent = "Nombre de actividad obligatorio";
      ok = false;
    } else if (nombreAct.length > 80) {
      bloque.querySelector(".act-err-nombre").textContent = "Máximo 80 caracteres";
      ok = false;
    }

    if (!categoria) {
      bloque.querySelector(".act-err-categoria").textContent = "Selecciona una categoría";
      ok = false;
    }

    if (descripcion.length > 300) {
      bloque.querySelector(".act-err-descripcion").textContent = "Máximo 300 caracteres";
      ok = false;
    }

    var archivos = archivosInput.files;
    if (!archivos || archivos.length === 0) {
      bloque.querySelector(".act-err-archivos").textContent = "Debes adjuntar al menos un archivo";
      ok = false;
    } else {
      var invalido = Array.from(archivos).find(function (f) {
        return !f.type.startsWith("image/") && !f.type.startsWith("video/");
      });
      if (invalido) {
        bloque.querySelector(".act-err-archivos").textContent = "Solo se permiten imágenes o videos";
        ok = false;
      }
    }

    var errUrl = validarURL(enlace);
    if (errUrl) {
      bloque.querySelector(".act-err-enlace").textContent = errUrl;
      ok = false;
    }

    var mensajeHorario = "";
    bloque.querySelectorAll(".grupo-horario").forEach(function (fila) {
      var dia = fila.querySelector(".h-dia").value;
      var ini = fila.querySelector(".h-inicio").value;
      var fin = fila.querySelector(".h-fin").value;
      if (!dia || !ini || !fin) {
        mensajeHorario = "Completa día, inicio y fin en todos los horarios";
        return;
      }
      var errRango = validarHoraRango(ini, fin);
      if (errRango) {
        mensajeHorario = errRango;
        return;
      }
      todosHorarios.push({ h: { dia: dia, horaInicio: ini, horaFin: fin }, idx: idxVisual });
    });

    if (mensajeHorario) {
      bloque.querySelector(".act-err-horarios").textContent = mensajeHorario;
      ok = false;
    }

    return ok;
  }

  function detectarTraslapes(todosHorarios) {
    var errTras = document.getElementById("err-traslape");
    for (var i = 0; i < todosHorarios.length; i += 1) {
      for (var j = i + 1; j < todosHorarios.length; j += 1) {
        if (horariosSeTraslapan(todosHorarios[i].h, todosHorarios[j].h)) {
          var a = todosHorarios[i];
          var b = todosHorarios[j];
          errTras.textContent = a.idx === b.idx
            ? "Hay horarios traslapados dentro de la actividad #" + a.idx
            : "Traslape entre actividad #" + a.idx + " y #" + b.idx;
          return false;
        }
      }
    }
    errTras.textContent = "";
    return true;
  }

  function validar() {
    limpiarErrores(form);
    var ok = true;
    var tipo = selectTipo.value;
    var esEstudiante = tipo === "estudiante-pregrado" || tipo === "estudiante-postgrado";

    ok = mostrarError("err-nombre", validarNombre(inputVal("nombre"), "Nombre")) && ok;
    ok = mostrarError("err-apellido", validarNombre(inputVal("apellido"), "Apellido")) && ok;
    ok = mostrarError("err-correo", validarCorreo(inputVal("correo"))) && ok;
    ok = mostrarError("err-tipo", tipo ? null : "Selecciona el tipo de miembro") && ok;
    ok = mostrarError("err-comuna_id", inputVal("comuna_id") ? null : "Selecciona una comuna") && ok;

    if (esEstudiante) {
      ok = mostrarError("err-telegram", validarTelegram(inputVal("telegram"))) && ok;
      mostrarError("err-telefono", null);
    } else if (tipo) {
      ok = mostrarError("err-telefono", validarTelefono(inputVal("telefono"))) && ok;
      mostrarError("err-telegram", null);
    }

    if (esEstudiante) {
      ok = mostrarError("err-semestre", validarSemestre(inputVal("semestre"))) && ok;
    } else if (tipo === "funcionario") {
      ok = mostrarError("err-area", validarNoVacio(inputVal("area"), "Área")) && ok;
    } else if (tipo === "academico") {
      ok = mostrarError("err-curso", validarNoVacio(inputVal("curso"), "Curso")) && ok;
    }

    var bloques = Array.from(listaActividades.querySelectorAll(".actividad-bloque"));
    if (bloques.length < 1) {
      document.getElementById("err-actividades").textContent = "Debe haber al menos una actividad";
      ok = false;
    }
    if (bloques.length > LIMITE_ACTIVIDADES) {
      document.getElementById("err-actividades").textContent = "Máximo " + LIMITE_ACTIVIDADES + " actividades por miembro";
      ok = false;
    }

    var todosHorarios = [];
    bloques.forEach(function (bloque, i) {
      if (!validarActividad(bloque, i + 1, todosHorarios)) ok = false;
    });

    return ok && detectarTraslapes(todosHorarios);
  }

  selectTipo.addEventListener("change", alternarCamposEspecificos);
  alternarCamposEspecificos();

  listaActividades.querySelectorAll(".actividad-bloque").forEach(prepararBloqueActividad);
  renumerarActividades();

  btnAgregarActividad.addEventListener("click", function () {
    var errAct = document.getElementById("err-actividades");
    var count = listaActividades.querySelectorAll(".actividad-bloque").length;
    if (count >= LIMITE_ACTIVIDADES) {
      errAct.textContent = "Máximo " + LIMITE_ACTIVIDADES + " actividades por miembro";
      return;
    }
    errAct.textContent = "";
    listaActividades.appendChild(crearBloqueActividad());
    renumerarActividades();
  });

  form.addEventListener("submit", function (e) {
    mensaje.textContent = "";
    mensaje.className = "";
    if (!validar()) {
      e.preventDefault();
      mensaje.className = "mensaje-estado aviso";
      mensaje.textContent = "Revisa los errores indicados en el formulario.";
      var primerError = form.querySelector("small.error:not(:empty)");
      if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      mensaje.className = "mensaje-estado exito";
      mensaje.textContent = "Enviando registro...";
    }
  });
})();
