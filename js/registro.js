"use strict";
/// <reference path="types.ts" />
/// <reference path="common.ts" />
// Lógica del formulario de registro de miembros y sus actividades.
(function () {
    const form = document.getElementById("form-registro");
    const selectTipo = document.getElementById("tipo");
    const fsEstudiante = document.getElementById("datos-estudiante");
    const fsFuncionario = document.getElementById("datos-funcionario");
    const fsAcademico = document.getElementById("datos-academico");
    const lblTelegram = document.getElementById("label-telegram");
    const lblTelefono = document.getElementById("label-telefono");
    const listaActividades = document.getElementById("lista-actividades");
    const btnAgregarActividad = document.getElementById("btn-agregar-actividad");
    const mensaje = document.getElementById("mensaje-resultado");
    let contadorActividad = 0;
    const DIAS = [
        ["lunes", "Lunes"],
        ["martes", "Martes"],
        ["miercoles", "Miércoles"],
        ["jueves", "Jueves"],
        ["viernes", "Viernes"],
        ["sabado", "Sábado"],
        ["domingo", "Domingo"],
    ];
    // Obtiene el valor de un input por su ID.
    function inputVal(id) {
        return document.getElementById(id).value;
    }
    // Muestra u oculta los campos específicos según el tipo de miembro seleccionado.
    function alternarCamposEspecificos() {
        const tipo = selectTipo.value;
        const esEstudiante = tipo === "estudiante-pregrado" || tipo === "estudiante-postgrado";
        fsEstudiante.hidden = !esEstudiante;
        fsFuncionario.hidden = tipo !== "funcionario";
        fsAcademico.hidden = tipo !== "academico";
        // Telegram para estudiantes; teléfono para funcionarios/académicos.
        lblTelegram.hidden = !!tipo && !esEstudiante;
        lblTelefono.hidden = !tipo || esEstudiante;
    }
    selectTipo.addEventListener("change", alternarCamposEspecificos);
    alternarCamposEspecificos();
    // Crea una fila de horario (día + hora inicio + hora fin + botón eliminar).
    function crearFilaHorario() {
        const fila = document.createElement("article");
        fila.className = "grupo-horario";
        const opciones = DIAS.map(([v, t]) => `<option value="${v}">${t}</option>`).join("");
        fila.innerHTML = `
      <label>Día
        <select class="h-dia">
          <option value="">--</option>
          ${opciones}
        </select>
      </label>
      <label>Inicio
        <input type="time" class="h-inicio" />
      </label>
      <label>Fin
        <input type="time" class="h-fin" />
      </label>
      <button type="button" class="boton secundario btn-eliminar-horario">−</button>
    `;
        const btnEliminar = fila.querySelector(".btn-eliminar-horario");
        btnEliminar.addEventListener("click", () => {
            const padre = fila.parentElement;
            if (padre && padre.querySelectorAll(".grupo-horario").length > 1) {
                fila.remove();
            }
        });
        return fila;
    }
    // Crea el bloque completo de una actividad con sus campos y botones.
    function crearBloqueActividad() {
        contadorActividad++;
        const idx = contadorActividad;
        const section = document.createElement("article");
        section.className = "actividad-bloque";
        section.dataset.idx = String(idx);
        section.innerHTML = `
      <header>
        <h4>Actividad #${idx}</h4>
        <button type="button" class="boton peligro btn-eliminar-actividad">Eliminar</button>
      </header>
      <label>Nombre <span class="requerido">*</span>
        <input type="text" class="act-nombre" maxlength="80" />
        <small class="error act-err-nombre"></small>
      </label>
      <label>Categoría <span class="requerido">*</span>
        <select class="act-categoria">
          <option value="">-- Selecciona --</option>
          <option value="artistica">Artística</option>
          <option value="deportiva">Deportiva</option>
          <option value="tecnologica">Tecnológica</option>
          <option value="social">Social</option>
          <option value="recreativa">Recreativa</option>
        </select>
        <small class="error act-err-categoria"></small>
      </label>
      <label>Descripción <span class="opcional">(opcional, máx. 300)</span>
        <textarea class="act-descripcion" maxlength="300"></textarea>
      </label>
      <fieldset>
        <legend>Horarios <span class="requerido">*</span></legend>
        <section class="lista-horarios"></section>
        <button type="button" class="boton secundario btn-agregar-horario">+ Agregar horario</button>
        <small class="error act-err-horarios"></small>
      </fieldset>
      <label>Archivos (imagen o video) <span class="requerido">*</span>
        <input type="file" class="act-archivos" multiple accept="image/*,video/*" />
        <small class="error act-err-archivos"></small>
      </label>
      <label>Enlace a contenido propio <span class="requerido">*</span>
        <input type="url" class="act-enlace" placeholder="https://..." />
        <small class="error act-err-enlace"></small>
      </label>
    `;
        const listaHorarios = section.querySelector(".lista-horarios");
        listaHorarios.appendChild(crearFilaHorario());
        const btnEliminarAct = section.querySelector(".btn-eliminar-actividad");
        btnEliminarAct.addEventListener("click", () => {
            const bloques = listaActividades.querySelectorAll(".actividad-bloque");
            if (bloques.length > 1) {
                section.remove();
                renumerarActividades();
            }
            else {
                const errAct = document.getElementById("err-actividades");
                errAct.textContent = "Debe haber al menos una actividad";
                window.setTimeout(() => (errAct.textContent = ""), 3000);
            }
        });
        const btnAgregarHor = section.querySelector(".btn-agregar-horario");
        btnAgregarHor.addEventListener("click", () => {
            listaHorarios.appendChild(crearFilaHorario());
        });
        return section;
    }
    function renumerarActividades() {
        const bloques = listaActividades.querySelectorAll(".actividad-bloque");
        bloques.forEach((b, i) => {
            const h4 = b.querySelector("h4");
            if (h4)
                h4.textContent = `Actividad #${i + 1}`;
        });
    }
    listaActividades.appendChild(crearBloqueActividad());
    btnAgregarActividad.addEventListener("click", () => {
        const errAct = document.getElementById("err-actividades");
        const count = listaActividades.querySelectorAll(".actividad-bloque").length;
        if (count >= LIMITE_ACTIVIDADES) {
            errAct.textContent = `Máximo ${LIMITE_ACTIVIDADES} actividades por miembro`;
            return;
        }
        errAct.textContent = "";
        listaActividades.appendChild(crearBloqueActividad());
    });
    // Valida los campos de una actividad y acumula sus horarios en todosHorarios.
    // Devuelve false si encuentra algún error.
    function validarActividad(bloque, idx, todosHorarios) {
        const nombreAct = bloque.querySelector(".act-nombre").value.trim();
        const categoria = bloque.querySelector(".act-categoria").value;
        const archivosInput = bloque.querySelector(".act-archivos");
        const enlace = bloque.querySelector(".act-enlace").value;
        const errNombre = bloque.querySelector(".act-err-nombre");
        const errCategoria = bloque.querySelector(".act-err-categoria");
        const errArchivos = bloque.querySelector(".act-err-archivos");
        const errEnlace = bloque.querySelector(".act-err-enlace");
        const errHorarios = bloque.querySelector(".act-err-horarios");
        let ok = true;
        if (!nombreAct) {
            errNombre.textContent = "Nombre de actividad obligatorio";
            ok = false;
        }
        else if (nombreAct.length > 80) {
            errNombre.textContent = "Máximo 80 caracteres";
            ok = false;
        }
        if (!categoria) {
            errCategoria.textContent = "Selecciona una categoría";
            ok = false;
        }
        const archivos = archivosInput.files;
        if (!archivos || archivos.length === 0) {
            errArchivos.textContent = "Debes adjuntar al menos un archivo";
            ok = false;
        }
        else {
            const invalido = Array.from(archivos).find((f) => !f.type.startsWith("image/") && !f.type.startsWith("video/"));
            if (invalido) {
                errArchivos.textContent = "Solo se permiten imágenes o videos";
                ok = false;
            }
        }
        const errUrl = validarURL(enlace);
        if (errUrl) {
            errEnlace.textContent = errUrl;
            ok = false;
        }
        const filas = Array.from(bloque.querySelectorAll(".grupo-horario"));
        let mensajeHorario = "";
        filas.forEach((fila) => {
            const dia = fila.querySelector(".h-dia").value;
            const ini = fila.querySelector(".h-inicio").value;
            const fin = fila.querySelector(".h-fin").value;
            if (!dia || !ini || !fin) {
                mensajeHorario = "Completa día, inicio y fin en todos los horarios";
                return;
            }
            const errRango = validarHoraRango(ini, fin);
            if (errRango) {
                mensajeHorario = errRango;
                return;
            }
            todosHorarios.push({ h: { dia, horaInicio: ini, horaFin: fin }, idx });
        });
        if (mensajeHorario) {
            errHorarios.textContent = mensajeHorario;
            ok = false;
        }
        return ok;
    }
    // Detecta traslapes entre todos los horarios del formulario (de todas las actividades).
    function detectarTraslapes(todosHorarios) {
        const errTras = document.getElementById("err-traslape");
        for (let i = 0; i < todosHorarios.length; i++) {
            for (let j = i + 1; j < todosHorarios.length; j++) {
                if (horariosSeTraslapan(todosHorarios[i].h, todosHorarios[j].h)) {
                    const a = todosHorarios[i];
                    const b = todosHorarios[j];
                    errTras.textContent =
                        a.idx === b.idx
                            ? `Hay horarios traslapados dentro de la actividad #${a.idx}`
                            : `Traslape entre actividad #${a.idx} y #${b.idx}`;
                    return false;
                }
            }
        }
        errTras.textContent = "";
        return true;
    }
    // Valida todos los campos del formulario. Devuelve true solo si todo es correcto.
    function validar() {
        limpiarErrores(form);
        let ok = true;
        const tipo = selectTipo.value;
        const esEstudiante = tipo === "estudiante-pregrado" || tipo === "estudiante-postgrado";
        // Campos comunes del miembro
        ok = mostrarError("err-nombre", validarNombre(inputVal("nombre"), "Nombre")) && ok;
        ok = mostrarError("err-apellido", validarNombre(inputVal("apellido"), "Apellido")) && ok;
        ok = mostrarError("err-correo", validarCorreo(inputVal("correo"))) && ok;
        ok = mostrarError("err-tipo", tipo ? null : "Selecciona el tipo de miembro") && ok;
        // Contacto: telegram para estudiantes, teléfono para los demás
        if (esEstudiante) {
            ok = mostrarError("err-telegram", validarTelegram(inputVal("telegram"))) && ok;
            mostrarError("err-telefono", null);
        }
        else if (tipo) {
            ok = mostrarError("err-telefono", validarTelefono(inputVal("telefono"))) && ok;
            mostrarError("err-telegram", null);
        }
        // Campos específicos según tipo
        if (esEstudiante) {
            ok = mostrarError("err-semestre", validarSemestre(inputVal("semestre"))) && ok;
        }
        else if (tipo === "funcionario") {
            ok = mostrarError("err-area", validarNoVacio(inputVal("area"), "Área")) && ok;
        }
        else if (tipo === "academico") {
            ok = mostrarError("err-curso", validarNoVacio(inputVal("curso"), "Curso")) && ok;
        }
        // Actividades
        const bloques = Array.from(listaActividades.querySelectorAll(".actividad-bloque"));
        const todosHorarios = [];
        bloques.forEach((bloque, i) => {
            if (!validarActividad(bloque, i + 1, todosHorarios))
                ok = false;
        });
        return ok && detectarTraslapes(todosHorarios);
    }
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        mensaje.textContent = "";
        mensaje.className = "";
        if (validar()) {
            mensaje.className = "mensaje-estado exito";
            mensaje.textContent = "¡Registro exitoso! Redirigiendo al listado...";
            mensaje.scrollIntoView({ behavior: "smooth", block: "center" });
            window.setTimeout(() => {
                window.location.href = "listado.html";
            }, 2500);
        }
        else {
            mensaje.className = "mensaje-estado aviso";
            mensaje.textContent = "Revisa los errores indicados en el formulario.";
            const primerError = form.querySelector("small.error:not(:empty)");
            if (primerError)
                primerError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
})();
