(function () {
  if (typeof axios === "undefined") return;

  document.querySelectorAll(".comentarios-actividad").forEach(prepararSeccion);

  function prepararSeccion(seccion) {
    var url = "/api/actividades/" + seccion.dataset.actividadId + "/comentarios";
    var lista = seccion.querySelector(".lista-comentarios");
    var form = seccion.querySelector(".form-comentario");
    var mensaje = seccion.querySelector(".comentario-mensaje");
    var inputNombre = seccion.querySelector(".com-nombre");
    var inputTexto = seccion.querySelector(".com-texto");
    var errNombre = seccion.querySelector(".com-err-nombre");
    var errTexto = seccion.querySelector(".com-err-texto");

    function pintarComentario(c) {
      var li = document.createElement("li");
      li.textContent = c.fecha + " — " + c.nombre + ": " + c.texto;
      lista.appendChild(li);
    }

    function mostrarVacio() {
      var li = document.createElement("li");
      li.className = "sin-comentarios";
      li.textContent = "Aún no hay comentarios.";
      lista.appendChild(li);
    }

    async function cargar() {
      var resp = await axios.get(url);
      lista.innerHTML = "";
      if (resp.data.length === 0) {
        mostrarVacio();
      } else {
        resp.data.forEach(pintarComentario);
      }
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      mensaje.textContent = "";
      mensaje.className = "comentario-mensaje";

      var eNombre = validarComentarioNombre(inputNombre.value);
      var eTexto = validarComentarioTexto(inputTexto.value);
      errNombre.textContent = eNombre || "";
      errTexto.textContent = eTexto || "";
      if (eNombre || eTexto) return;

      try {
        var resp = await axios.post(url, { nombre: inputNombre.value, texto: inputTexto.value });
        var vacio = lista.querySelector(".sin-comentarios");
        if (vacio) vacio.remove();
        pintarComentario(resp.data.comentario);
        form.reset();
        mensaje.className = "comentario-mensaje mensaje-estado exito";
        mensaje.textContent = "Comentario agregado.";
      } catch (err) {
        var errores = (err.response && err.response.data && err.response.data.errores) || {};
        errNombre.textContent = errores.nombre || "";
        errTexto.textContent = errores.texto || "";
        mensaje.className = "comentario-mensaje mensaje-estado aviso";
        mensaje.textContent = "Revisa los errores del comentario.";
      }
    });

    cargar();
  }
})();
