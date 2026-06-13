import re
from urllib.parse import urlparse


TIPOS_MIEMBRO = {
    "estudiante-pregrado": "Estudiante pregrado",
    "estudiante-postgrado": "Estudiante postgrado",
    "funcionario": "Funcionario/a",
    "academico": "Académico/a",
}

CATEGORIAS_ACTIVIDAD = {
    "artistica": "Artística",
    "deportiva": "Deportiva",
    "tecnologica": "Tecnológica",
    "social": "Social",
    "recreativa": "Recreativa",
}

DIAS_SEMANA = {
    "lunes": "Lunes",
    "martes": "Martes",
    "miercoles": "Miércoles",
    "jueves": "Jueves",
    "viernes": "Viernes",
    "sabado": "Sábado",
    "domingo": "Domingo",
}

EXTENSIONES_PERMITIDAS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".mp4",
    ".mov",
    ".avi",
    ".webm",
}


def validar_nombre(valor, etiqueta):
    valor = (valor or "").strip()
    if not valor:
        return f"{etiqueta} es obligatorio"
    if len(valor) < 2:
        return f"{etiqueta} debe tener al menos 2 caracteres"
    if len(valor) > 60:
        return f"{etiqueta} no debe exceder 60 caracteres"
    if not re.fullmatch(r"[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'\-]+", valor):
        return f"{etiqueta} solo puede contener letras, espacios, apóstrofes y guiones"
    return None


def validar_correo(valor):
    valor = (valor or "").strip()
    if not valor:
        return "El correo es obligatorio"
    if len(valor) > 80:
        return "El correo no debe exceder 80 caracteres"
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]{2,}", valor):
        return "Formato de correo inválido (ej: nombre@dominio.cl)"
    return None


def validar_telegram(valor):
    valor = (valor or "").strip()
    if not valor:
        return "El usuario de Telegram es obligatorio"
    if not re.fullmatch(r"@[A-Za-z0-9_]{5,32}", valor):
        return "Debe empezar con @ y tener 5-32 letras, dígitos o guión bajo"
    return None


def validar_telefono(valor):
    valor = (valor or "").strip()
    if not valor:
        return "El teléfono es obligatorio"
    digitos = re.sub(r"\D", "", valor)
    if len(digitos) < 8 or len(digitos) > 15:
        return "El teléfono debe tener entre 8 y 15 dígitos"
    if not re.fullmatch(r"[\d\s+()\-]+", valor):
        return "Solo se permiten dígitos, espacios, +, - y paréntesis"
    return None


def validar_no_vacio(valor, etiqueta, maximo=120):
    valor = (valor or "").strip()
    if not valor:
        return f"{etiqueta} es obligatorio"
    if len(valor) > maximo:
        return f"{etiqueta} no debe exceder {maximo} caracteres"
    return None


def validar_semestre(valor):
    valor = (valor or "").strip()
    if not valor:
        return "El semestre es obligatorio"
    try:
        semestre = int(valor)
    except ValueError:
        return "Debe ser un número entero"
    if semestre < 1 or semestre > 14:
        return "Debe estar entre 1 y 14"
    return None


def validar_url(valor):
    valor = (valor or "").strip()
    if not valor:
        return "El enlace es obligatorio"
    if len(valor) > 300:
        return "El enlace no debe exceder 300 caracteres"
    partes = urlparse(valor)
    if partes.scheme not in ("http", "https") or not partes.netloc:
        return "Debe ser una URL válida que comience con http:// o https://"
    return None


def validar_hora_rango(inicio, fin):
    if not inicio:
        return "Hora de inicio obligatoria"
    if not fin:
        return "Hora de fin obligatoria"
    if not re.fullmatch(r"\d{2}:\d{2}", inicio) or not re.fullmatch(r"\d{2}:\d{2}", fin):
        return "Las horas deben usar el formato HH:MM"
    if inicio >= fin:
        return "La hora de inicio debe ser anterior a la hora de fin"
    return None


def horarios_se_traslapan(a, b):
    return a["dia"] == b["dia"] and a["hora_inicio"] < b["hora_fin"] and b["hora_inicio"] < a["hora_fin"]


def validar_comentario_nombre(valor):
    valor = (valor or "").strip()
    if not valor:
        return "El nombre es obligatorio"
    if len(valor) < 3:
        return "El nombre debe tener al menos 3 caracteres"
    if len(valor) > 80:
        return "El nombre no debe exceder 80 caracteres"
    return None


def validar_comentario_texto(valor):
    valor = (valor or "").strip()
    if not valor:
        return "El comentario es obligatorio"
    if len(valor) < 5:
        return "El comentario debe tener al menos 5 caracteres"
    if len(valor) > 300:
        return "El comentario no debe exceder 300 caracteres"
    return None
