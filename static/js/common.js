function marcarNavActivo() {
  var path = window.location.pathname;
  var enlaces = document.querySelectorAll("nav a");
  enlaces.forEach(function (a) {
    if (a.getAttribute("href") === path) {
      a.classList.add("activo");
    }
  });
}

function validarNombre(valor, etiqueta) {
  var v = valor.trim();
  if (!v) return etiqueta + " es obligatorio";
  if (v.length < 2) return etiqueta + " debe tener al menos 2 caracteres";
  if (v.length > 60) return etiqueta + " no debe exceder 60 caracteres";
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(v)) {
    return etiqueta + " solo puede contener letras, espacios, apóstrofes y guiones";
  }
  return null;
}

function validarCorreo(valor) {
  var v = valor.trim();
  if (!v) return "El correo es obligatorio";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
    return "Formato de correo inválido (ej: nombre@dominio.cl)";
  }
  return null;
}

function validarTelegram(valor) {
  var v = valor.trim();
  if (!v) return "El usuario de Telegram es obligatorio";
  if (!/^@[a-zA-Z0-9_]{5,32}$/.test(v)) {
    return "Debe empezar con @ y tener 5-32 letras, dígitos o guión bajo";
  }
  return null;
}

function validarTelefono(valor) {
  var v = valor.trim();
  if (!v) return "El teléfono es obligatorio";
  var digitos = v.replace(/[^\d]/g, "");
  if (digitos.length < 8 || digitos.length > 15) {
    return "El teléfono debe tener entre 8 y 15 dígitos";
  }
  if (!/^[\d\s+()\-]+$/.test(v)) {
    return "Solo se permiten dígitos, espacios, +, - y paréntesis";
  }
  return null;
}

function validarNoVacio(valor, etiqueta) {
  if (!valor.trim()) return etiqueta + " es obligatorio";
  return null;
}

function validarSemestre(valor) {
  var v = valor.trim();
  var n = Number(v);
  if (!v) return "El semestre es obligatorio";
  if (!Number.isInteger(n)) return "Debe ser un número entero";
  if (n < 1 || n > 14) return "Debe estar entre 1 y 14";
  return null;
}

function validarURL(valor) {
  var v = valor.trim();
  if (!v) return "El enlace es obligatorio";
  if (!/^https?:\/\/[^\s]+\.[^\s]+$/i.test(v)) {
    return "Debe ser una URL válida que comience con http:// o https://";
  }
  return null;
}

function validarHoraRango(inicio, fin) {
  if (!inicio) return "Hora de inicio obligatoria";
  if (!fin) return "Hora de fin obligatoria";
  if (inicio >= fin) return "La hora de inicio debe ser anterior a la hora de fin";
  return null;
}

function horariosSeTraslapan(a, b) {
  return a.dia === b.dia && a.horaInicio < b.horaFin && b.horaInicio < a.horaFin;
}

function mostrarError(id, mensaje) {
  var el = document.getElementById(id);
  if (el) el.textContent = mensaje || "";
  return mensaje === null;
}

function limpiarErrores(form) {
  form.querySelectorAll("small.error").forEach(function (e) {
    e.textContent = "";
  });
}

marcarNavActivo();
