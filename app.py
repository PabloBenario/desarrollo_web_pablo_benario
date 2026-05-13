import math
import os
from datetime import datetime
from uuid import uuid4

from flask import Flask, abort, flash, redirect, render_template, request, url_for
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from werkzeug.utils import secure_filename

from models import Actividad, Comuna, Foto, Horario, Miembro, Region, db
from validators import (
    CATEGORIAS_ACTIVIDAD,
    DIAS_SEMANA,
    EXTENSIONES_PERMITIDAS,
    TIPOS_MIEMBRO,
    horarios_se_traslapan,
    validar_correo,
    validar_hora_rango,
    validar_no_vacio,
    validar_nombre,
    validar_semestre,
    validar_telegram,
    validar_telefono,
    validar_url,
)


app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL",
    "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2?charset=utf8mb4",
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.path.join(app.static_folder, "uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

db.init_app(app)
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


def texto(valor):
    return (valor or "").strip()


def datos_formulario_vacio():
    return {
        "tipo": "",
        "semestre": "",
        "area": "",
        "curso": "",
        "nombre": "",
        "apellido": "",
        "correo": "",
        "telegram": "",
        "telefono": "",
        "comuna_id": "",
        "actividades": [
            {
                "idx": 1,
                "nombre": "",
                "categoria": "",
                "descripcion": "",
                "enlace": "",
                "horarios": [{"dia": "", "hora_inicio": "", "hora_fin": ""}],
            }
        ],
    }


def recolectar_formulario(form):
    datos = datos_formulario_vacio()
    for campo in (
        "tipo",
        "semestre",
        "area",
        "curso",
        "nombre",
        "apellido",
        "correo",
        "telegram",
        "telefono",
        "comuna_id",
    ):
        datos[campo] = texto(form.get(campo))

    actividades = []
    indices = []
    for valor in form.getlist("actividad_indices"):
        try:
            indices.append(int(valor))
        except ValueError:
            continue

    for idx in indices:
        dias = form.getlist(f"act_{idx}_dia")
        inicios = form.getlist(f"act_{idx}_hora_inicio")
        fines = form.getlist(f"act_{idx}_hora_fin")
        total_horarios = max(len(dias), len(inicios), len(fines), 1)

        horarios = []
        for i in range(total_horarios):
            horarios.append(
                {
                    "dia": texto(dias[i] if i < len(dias) else ""),
                    "hora_inicio": texto(inicios[i] if i < len(inicios) else ""),
                    "hora_fin": texto(fines[i] if i < len(fines) else ""),
                }
            )

        actividades.append(
            {
                "idx": idx,
                "nombre": texto(form.get(f"act_{idx}_nombre")),
                "categoria": texto(form.get(f"act_{idx}_categoria")),
                "descripcion": texto(form.get(f"act_{idx}_descripcion")),
                "enlace": texto(form.get(f"act_{idx}_enlace")),
                "horarios": horarios,
            }
        )

    datos["actividades"] = actividades or datos["actividades"]
    return datos


def obtener_archivos(idx):
    return [archivo for archivo in request.files.getlist(f"act_{idx}_archivos") if archivo and archivo.filename]


def archivo_permitido(archivo):
    nombre = secure_filename(archivo.filename)
    extension = os.path.splitext(nombre)[1].lower()
    mimetype = archivo.mimetype or ""
    return extension in EXTENSIONES_PERMITIDAS and (
        mimetype.startswith("image/") or mimetype.startswith("video/")
    )


def validar_registro(datos):
    errores = {}
    tipo = datos["tipo"]
    es_estudiante = tipo in ("estudiante-pregrado", "estudiante-postgrado")

    if tipo not in TIPOS_MIEMBRO:
        errores["tipo"] = "Selecciona el tipo de miembro"

    error = validar_nombre(datos["nombre"], "Nombre")
    if error:
        errores["nombre"] = error

    error = validar_nombre(datos["apellido"], "Apellido")
    if error:
        errores["apellido"] = error

    error = validar_correo(datos["correo"])
    if error:
        errores["correo"] = error

    if es_estudiante:
        error = validar_telegram(datos["telegram"])
        if error:
            errores["telegram"] = error
    elif tipo in TIPOS_MIEMBRO:
        error = validar_telefono(datos["telefono"])
        if error:
            errores["telefono"] = error

    if es_estudiante:
        error = validar_semestre(datos["semestre"])
        if error:
            errores["semestre"] = error
    elif tipo == "funcionario":
        error = validar_no_vacio(datos["area"], "Área")
        if error:
            errores["area"] = error
    elif tipo == "academico":
        error = validar_no_vacio(datos["curso"], "Curso")
        if error:
            errores["curso"] = error

    try:
        comuna_id = int(datos["comuna_id"])
    except ValueError:
        comuna_id = None
    if not comuna_id or db.session.get(Comuna, comuna_id) is None:
        errores["comuna_id"] = "Selecciona una comuna válida"

    actividades = datos["actividades"]
    if len(actividades) < 1:
        errores["actividades"] = "Debe haber al menos una actividad"
    if len(actividades) > 5:
        errores["actividades"] = "Máximo 5 actividades por miembro"

    todos_horarios = []
    archivos_por_actividad = {}
    for posicion, actividad in enumerate(actividades, start=1):
        idx = actividad["idx"]
        prefijo = f"act_{idx}"

        if not actividad["nombre"]:
            errores[f"{prefijo}_nombre"] = "Nombre de actividad obligatorio"
        elif len(actividad["nombre"]) > 80:
            errores[f"{prefijo}_nombre"] = "Máximo 80 caracteres"

        if actividad["categoria"] not in CATEGORIAS_ACTIVIDAD:
            errores[f"{prefijo}_categoria"] = "Selecciona una categoría"

        if len(actividad["descripcion"]) > 300:
            errores[f"{prefijo}_descripcion"] = "Máximo 300 caracteres"

        error = validar_url(actividad["enlace"])
        if error:
            errores[f"{prefijo}_enlace"] = error

        archivos = obtener_archivos(idx)
        archivos_por_actividad[idx] = archivos
        if not archivos:
            errores[f"{prefijo}_archivos"] = "Debes adjuntar al menos un archivo"
        elif any(not archivo_permitido(archivo) for archivo in archivos):
            errores[f"{prefijo}_archivos"] = "Solo se permiten imágenes o videos"

        horarios_validos = []
        for horario in actividad["horarios"]:
            if horario["dia"] not in DIAS_SEMANA:
                errores[f"{prefijo}_horarios"] = "Completa día, inicio y fin en todos los horarios"
                continue

            error = validar_hora_rango(horario["hora_inicio"], horario["hora_fin"])
            if error:
                errores[f"{prefijo}_horarios"] = error
                continue

            horarios_validos.append(horario)
            todos_horarios.append({"idx": posicion, **horario})

        if not horarios_validos:
            errores.setdefault(f"{prefijo}_horarios", "Agrega al menos un horario válido")

    for i, horario_a in enumerate(todos_horarios):
        for horario_b in todos_horarios[i + 1 :]:
            if horarios_se_traslapan(horario_a, horario_b):
                if horario_a["idx"] == horario_b["idx"]:
                    errores["traslape"] = f"Hay horarios traslapados dentro de la actividad #{horario_a['idx']}"
                else:
                    errores["traslape"] = (
                        f"Traslape entre actividad #{horario_a['idx']} y #{horario_b['idx']}"
                    )
                return errores, archivos_por_actividad

    return errores, archivos_por_actividad


def guardar_registro(datos, archivos_por_actividad):
    guardados = []
    try:
        tipo = datos["tipo"]
        es_estudiante = tipo in ("estudiante-pregrado", "estudiante-postgrado")
        miembro = Miembro(
            nombre=datos["nombre"],
            apellido=datos["apellido"],
            email=datos["correo"],
            telefono=None if es_estudiante else datos["telefono"],
            telegram=datos["telegram"] if es_estudiante else None,
            tipo=tipo,
            semestre=int(datos["semestre"]) if es_estudiante else None,
            area=datos["area"] if tipo == "funcionario" else None,
            curso=datos["curso"] if tipo == "academico" else None,
            fecha_registro=datetime.now(),
            comuna_id=int(datos["comuna_id"]),
        )
        db.session.add(miembro)
        db.session.flush()

        for actividad_datos in datos["actividades"]:
            actividad = Actividad(
                miembro_id=miembro.id,
                tipo=actividad_datos["categoria"],
                nombre=actividad_datos["nombre"],
                descripcion=actividad_datos["descripcion"] or None,
                enlace=actividad_datos["enlace"],
            )
            db.session.add(actividad)
            db.session.flush()

            for horario in actividad_datos["horarios"]:
                db.session.add(
                    Horario(
                        actividad_id=actividad.id,
                        dia=horario["dia"],
                        hora_inicio=horario["hora_inicio"],
                        hora_fin=horario["hora_fin"],
                    )
                )

            for archivo in archivos_por_actividad.get(actividad_datos["idx"], []):
                nombre_seguro = secure_filename(archivo.filename)
                extension = os.path.splitext(nombre_seguro)[1].lower()
                nombre_guardado = f"{uuid4().hex}{extension}"
                ruta_absoluta = os.path.join(app.config["UPLOAD_FOLDER"], nombre_guardado)
                archivo.save(ruta_absoluta)
                guardados.append(ruta_absoluta)
                db.session.add(
                    Foto(
                        ruta_archivo=f"uploads/{nombre_guardado}",
                        nombre_archivo=archivo.filename[:300],
                        actividad_id=actividad.id,
                    )
                )

        db.session.commit()
    except Exception:
        db.session.rollback()
        for ruta in guardados:
            if os.path.exists(ruta):
                os.remove(ruta)
        raise


def regiones_con_comunas():
    return (
        Region.query.options(selectinload(Region.comunas))
        .order_by(Region.id)
        .all()
    )


def pagina_actual():
    try:
        pagina = int(request.args.get("page", "1"))
    except ValueError:
        pagina = 1
    return max(1, pagina)


@app.context_processor
def etiquetas_globales():
    return {
        "tipos_miembro": TIPOS_MIEMBRO,
        "categorias_actividad": CATEGORIAS_ACTIVIDAD,
        "dias_semana": DIAS_SEMANA,
    }


@app.route("/")
def index():
    total_miembros = db.session.query(func.count(Miembro.id)).scalar() or 0
    total_actividades = db.session.query(func.count(Actividad.id)).scalar() or 0
    promedio = round(total_actividades / total_miembros, 1) if total_miembros else 0
    ultimos = (
        Miembro.query.options(selectinload(Miembro.actividades))
        .order_by(Miembro.fecha_registro.desc())
        .limit(5)
        .all()
    )
    return render_template(
        "index.html",
        total_miembros=total_miembros,
        total_actividades=total_actividades,
        promedio=promedio,
        ultimos=ultimos,
        active="index",
    )


@app.route("/registro", methods=["GET", "POST"])
def registro():
    errores = {}
    datos = datos_formulario_vacio()
    if request.method == "POST":
        datos = recolectar_formulario(request.form)
        errores, archivos_por_actividad = validar_registro(datos)
        if not errores:
            try:
                guardar_registro(datos, archivos_por_actividad)
            except Exception:
                errores["general"] = "No se pudo guardar el registro. Revisa la base de datos e inténtalo nuevamente."
            else:
                flash("Registro guardado correctamente.", "exito")
                return redirect(url_for("index"))

    return render_template(
        "registro.html",
        datos=datos,
        errores=errores,
        regiones=regiones_con_comunas(),
        active="registro",
    )


@app.route("/miembros")
def miembros():
    pagina = pagina_actual()
    por_pagina = 5
    filtro_tipo = texto(request.args.get("tipo"))
    orden = texto(request.args.get("orden")) or "fecha"
    direccion = texto(request.args.get("dir")) or "desc"
    if direccion not in ("asc", "desc"):
        direccion = "desc"

    total_actividades = (
        db.session.query(func.count(Actividad.id))
        .filter(Actividad.miembro_id == Miembro.id)
        .correlate(Miembro)
        .scalar_subquery()
    )
    columnas_orden = {
        "nombre": Miembro.nombre,
        "tipo": Miembro.tipo,
        "correo": Miembro.email,
        "contacto": func.coalesce(Miembro.telegram, Miembro.telefono, ""),
        "actividades": total_actividades,
        "fecha": Miembro.fecha_registro,
    }
    columna = columnas_orden.get(orden, Miembro.fecha_registro)
    ordenamiento = columna.asc() if direccion == "asc" else columna.desc()

    consulta = Miembro.query.options(selectinload(Miembro.actividades))
    if filtro_tipo in TIPOS_MIEMBRO:
        consulta = consulta.filter(Miembro.tipo == filtro_tipo)
    consulta = consulta.order_by(ordenamiento, Miembro.id.desc())

    total = consulta.count()
    total_paginas = max(1, math.ceil(total / por_pagina))
    pagina = min(pagina, total_paginas)
    lista = consulta.offset((pagina - 1) * por_pagina).limit(por_pagina).all()
    return render_template(
        "miembros.html",
        miembros=lista,
        pagina=pagina,
        total_paginas=total_paginas,
        total=total,
        filtro_tipo=filtro_tipo if filtro_tipo in TIPOS_MIEMBRO else "",
        orden=orden if orden in columnas_orden else "fecha",
        direccion=direccion,
        active="miembros",
    )


@app.route("/miembros/<int:miembro_id>")
def detalle_miembro(miembro_id):
    miembro = (
        Miembro.query.options(
            selectinload(Miembro.comuna).selectinload(Comuna.region),
            selectinload(Miembro.actividades).selectinload(Actividad.horarios),
            selectinload(Miembro.actividades).selectinload(Actividad.fotos),
        )
        .filter(Miembro.id == miembro_id)
        .first()
    )
    if miembro is None:
        abort(404)
    return render_template("detalle_miembro.html", miembro=miembro, active="miembros")


@app.route("/estadisticas")
def estadisticas():
    total_miembros = db.session.query(func.count(Miembro.id)).scalar() or 0
    total_actividades = db.session.query(func.count(Actividad.id)).scalar() or 0
    promedio = round(total_actividades / total_miembros, 1) if total_miembros else 0

    por_tipo = {clave: 0 for clave in TIPOS_MIEMBRO}
    for tipo, total in db.session.query(Miembro.tipo, func.count(Miembro.id)).group_by(Miembro.tipo):
        if tipo in por_tipo:
            por_tipo[tipo] = total

    por_dia = {clave: 0 for clave in DIAS_SEMANA}
    for dia, total in db.session.query(Horario.dia, func.count(Horario.id)).group_by(Horario.dia):
        if dia in por_dia:
            por_dia[dia] = total

    return render_template(
        "estadisticas.html",
        total_miembros=total_miembros,
        total_actividades=total_actividades,
        promedio=promedio,
        por_tipo=por_tipo,
        por_dia=por_dia,
        active="estadisticas",
    )


if __name__ == "__main__":
    app.run(debug=True)
