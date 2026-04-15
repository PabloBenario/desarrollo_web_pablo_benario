/// <reference path="types.ts" />

// Utilidades compartidas entre páginas:
// navegación activa y funciones de validación reutilizables.

function marcarNavActivo(): void {
  const pagina = window.location.pathname.split("/").pop() || "index.html";
  const enlaces = document.querySelectorAll<HTMLAnchorElement>("nav a");
  enlaces.forEach((a) => {
    const href = a.getAttribute("href");
    if (href === pagina || (pagina === "" && href === "index.html")) {
      a.classList.add("activo");
    }
  });
}

function validarNombre(valor: string, etiqueta: string): string | null {
  const v = valor.trim();
  if (!v) return `${etiqueta} es obligatorio`;
  if (v.length < 2) return `${etiqueta} debe tener al menos 2 caracteres`;
  if (v.length > 60) return `${etiqueta} no debe exceder 60 caracteres`;
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(v)) {
    return `${etiqueta} solo puede contener letras, espacios, apóstrofes y guiones`;
  }
  return null;
}

function validarCorreo(valor: string): string | null {
  const v = valor.trim();
  if (!v) return "El correo es obligatorio";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regex.test(v)) return "Formato de correo inválido (ej: nombre@dominio.cl)";
  return null;
}

function validarTelegram(valor: string): string | null {
  const v = valor.trim();
  if (!v) return "El usuario de Telegram es obligatorio";
  const regex = /^@[a-zA-Z0-9_]{5,32}$/;
  if (!regex.test(v)) {
    return "Debe empezar con @ y tener 5-32 letras, dígitos o guión bajo";
  }
  return null;
}

function validarTelefono(valor: string): string | null {
  const v = valor.trim();
  if (!v) return "El teléfono es obligatorio";
  const digitos = v.replace(/[^\d]/g, "");
  if (digitos.length < 8 || digitos.length > 15) {
    return "El teléfono debe tener entre 8 y 15 dígitos";
  }
  if (!/^[\d\s+()\-]+$/.test(v)) {
    return "Solo se permiten dígitos, espacios, +, - y paréntesis";
  }
  return null;
}

function validarNoVacio(valor: string, etiqueta: string): string | null {
  if (!valor.trim()) return `${etiqueta} es obligatorio`;
  return null;
}

function validarSemestre(valor: string): string | null {
  const v = valor.trim();
  if (!v) return "El semestre es obligatorio";
  const n = Number(v);
  if (!Number.isInteger(n)) return "Debe ser un número entero";
  if (n < 1 || n > 14) return "Debe estar entre 1 y 14";
  return null;
}

function validarURL(valor: string): string | null {
  const v = valor.trim();
  if (!v) return "El enlace es obligatorio";
  const regex = /^https?:\/\/[^\s]+\.[^\s]+$/i;
  if (!regex.test(v)) return "Debe ser una URL válida que comience con http:// o https://";
  return null;
}

function validarHoraRango(inicio: string, fin: string): string | null {
  if (!inicio) return "Hora de inicio obligatoria";
  if (!fin) return "Hora de fin obligatoria";
  if (inicio >= fin) return "La hora de inicio debe ser anterior a la hora de fin";
  return null;
}

// Dos horarios se traslapan si coinciden en el día y sus rangos se solapan.
function horariosSeTraslapan(a: Horario, b: Horario): boolean {
  if (a.dia !== b.dia) return false;
  return a.horaInicio < b.horaFin && b.horaInicio < a.horaFin;
}

function mostrarError(id: string, mensaje: string | null): boolean {
  const el = document.getElementById(id);
  if (el) el.textContent = mensaje ?? "";
  return mensaje === null;
}

function limpiarErrores(form: HTMLFormElement): void {
  form.querySelectorAll("small.error").forEach((e) => {
    e.textContent = "";
  });
}

// Ejecutado automáticamente al cargar cualquier página (defer garantiza que el DOM ya está listo).
marcarNavActivo();
