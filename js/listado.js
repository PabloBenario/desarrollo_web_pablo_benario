"use strict";
/// <reference path="types.ts" />
/// <reference path="datos.ts" />
/// <reference path="common.ts" />
// Listado de miembros: filtro por tipo, ordenamiento por columna y paginación.
// Al hacer click en una fila se despliega el detalle con sus actividades.
(function () {
    const tbody = document.getElementById("tbody-miembros");
    const filtroTipo = document.getElementById("filtro-tipo");
    const btnPrev = document.getElementById("pag-prev");
    const btnNext = document.getElementById("pag-next");
    const pagInfo = document.getElementById("pag-info");
    const detalleCont = document.getElementById("detalle-miembro");
    const ths = Array.from(document.querySelectorAll("th.ordenable"));
    const POR_PAGINA = 5;
    let paginaActual = 1;
    let columna = "nombre";
    let direccion = "asc";
    let filtro = "";
    function obtenerValor(m, col) {
        switch (col) {
            case "nombre":
                return (m.nombre + " " + m.apellido).toLowerCase();
            case "tipo":
                return ETIQUETAS_TIPO[m.tipo];
            case "correo":
                return m.correo.toLowerCase();
            case "contacto":
                return (m.telegram ?? m.telefono ?? "").toLowerCase();
            case "actividades":
                return m.actividades.length;
            default:
                return "";
        }
    }
    function filtradosOrdenados() {
        let arr = MIEMBROS.slice();
        if (filtro)
            arr = arr.filter((m) => m.tipo === filtro);
        arr.sort((a, b) => {
            const va = obtenerValor(a, columna);
            const vb = obtenerValor(b, columna);
            if (va < vb)
                return direccion === "asc" ? -1 : 1;
            if (va > vb)
                return direccion === "asc" ? 1 : -1;
            return 0;
        });
        return arr;
    }
    function escapar(s) {
        return s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
    function renderizar() {
        const arr = filtradosOrdenados();
        const totalPags = Math.max(1, Math.ceil(arr.length / POR_PAGINA));
        if (paginaActual > totalPags)
            paginaActual = totalPags;
        const inicio = (paginaActual - 1) * POR_PAGINA;
        const pagina = arr.slice(inicio, inicio + POR_PAGINA);
        tbody.innerHTML = "";
        if (pagina.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="5" style="text-align:center; color:#7f8c8d;">No hay miembros que coincidan con el filtro.</td>`;
            tbody.appendChild(tr);
        }
        else {
            pagina.forEach((m) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
          <td>${escapar(m.nombre)} ${escapar(m.apellido)}</td>
          <td>${ETIQUETAS_TIPO[m.tipo]}</td>
          <td>${escapar(m.correo)}</td>
          <td>${escapar(m.telegram ?? m.telefono ?? "")}</td>
          <td>${m.actividades.length}</td>
        `;
                tr.setAttribute("tabindex", "0");
                tr.addEventListener("click", () => mostrarDetalle(m));
                tr.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        mostrarDetalle(m);
                    }
                });
                tbody.appendChild(tr);
            });
        }
        pagInfo.textContent = `Página ${paginaActual} de ${totalPags} · ${arr.length} miembros`;
        btnPrev.disabled = paginaActual <= 1;
        btnNext.disabled = paginaActual >= totalPags;
        ths.forEach((th) => {
            th.classList.remove("activo");
            const icono = th.querySelector(".icono-orden");
            if (icono)
                icono.textContent = "⇅";
            if (th.dataset.col === columna) {
                th.classList.add("activo");
                if (icono)
                    icono.textContent = direccion === "asc" ? "↑" : "↓";
            }
        });
    }
    function mostrarDetalle(m) {
        let info = "";
        if (m.datosEstudiante) {
            info = `<p><strong>Semestre:</strong> ${m.datosEstudiante.semestre}</p>`;
        }
        else if (m.datosFuncionario) {
            info = `<p><strong>Área:</strong> ${escapar(m.datosFuncionario.area)}</p>`;
        }
        else if (m.datosAcademico) {
            info = `<p><strong>Curso:</strong> ${escapar(m.datosAcademico.curso)}</p>`;
        }
        const actividadesHtml = m.actividades
            .map((a) => `
      <article class="detalle-actividad">
        <h4>${escapar(a.nombre)} <small>(${ETIQUETAS_CATEGORIA[a.categoria]})</small></h4>
        ${a.descripcion ? `<p>${escapar(a.descripcion)}</p>` : ""}
        <p><strong>Horarios:</strong></p>
        <ul>
          ${a.horarios
            .map((h) => `<li>${ETIQUETAS_DIA[h.dia]} de ${h.horaInicio} a ${h.horaFin}</li>`)
            .join("")}
        </ul>
        <p><strong>Archivos:</strong> ${a.archivos.map(escapar).join(", ")}</p>
        <p><strong>Enlace:</strong> <a href="${escapar(a.enlace)}" target="_blank" rel="noopener">${escapar(a.enlace)}</a></p>
      </article>`)
            .join("");
        const contacto = m.telegram
            ? `<strong>Telegram:</strong> ${escapar(m.telegram)}`
            : `<strong>Teléfono:</strong> ${escapar(m.telefono ?? "")}`;
        detalleCont.innerHTML = `
      <h3>${escapar(m.nombre)} ${escapar(m.apellido)}</h3>
      <p><strong>Tipo:</strong> ${ETIQUETAS_TIPO[m.tipo]}</p>
      <p><strong>Correo:</strong> ${escapar(m.correo)} · ${contacto}</p>
      ${info}
      <h4>Actividades (${m.actividades.length})</h4>
      ${actividadesHtml}
      <p><button type="button" class="boton secundario" id="btn-cerrar-detalle">Cerrar detalle</button></p>
    `;
        detalleCont.hidden = false;
        const cerrar = document.getElementById("btn-cerrar-detalle");
        if (cerrar)
            cerrar.addEventListener("click", () => (detalleCont.hidden = true));
        detalleCont.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    ths.forEach((th) => {
        th.addEventListener("click", () => {
            const col = th.dataset.col || "";
            if (col === columna) {
                direccion = direccion === "asc" ? "desc" : "asc";
            }
            else {
                columna = col;
                direccion = "asc";
            }
            paginaActual = 1;
            renderizar();
        });
    });
    filtroTipo.addEventListener("change", () => {
        filtro = filtroTipo.value;
        paginaActual = 1;
        renderizar();
    });
    btnPrev.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizar();
        }
    });
    btnNext.addEventListener("click", () => {
        paginaActual++;
        renderizar();
    });
    renderizar();
})();
