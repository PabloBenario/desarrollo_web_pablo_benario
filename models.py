from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Region(db.Model):
    __tablename__ = "region"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)

    comunas = db.relationship("Comuna", back_populates="region", order_by="Comuna.nombre")


class Comuna(db.Model):
    __tablename__ = "comuna"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey("region.id"), nullable=False)

    region = db.relationship("Region", back_populates="comunas")
    miembros = db.relationship("Miembro", back_populates="comuna")


class Miembro(db.Model):
    __tablename__ = "miembro"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    apellido = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(25), nullable=True)
    telegram = db.Column(db.String(40), nullable=True)
    tipo = db.Column(db.String(40), nullable=False)
    semestre = db.Column(db.Integer, nullable=True)
    area = db.Column(db.String(120), nullable=True)
    curso = db.Column(db.String(120), nullable=True)
    fecha_registro = db.Column(db.DateTime, nullable=False)
    comuna_id = db.Column(db.Integer, db.ForeignKey("comuna.id"), nullable=False)

    comuna = db.relationship("Comuna", back_populates="miembros")
    actividades = db.relationship(
        "Actividad",
        back_populates="miembro",
        cascade="all, delete-orphan",
        order_by="Actividad.id",
    )

    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"

    @property
    def contacto(self):
        return self.telegram or self.telefono or ""


class Actividad(db.Model):
    __tablename__ = "actividad"

    id = db.Column(db.Integer, primary_key=True)
    miembro_id = db.Column(db.Integer, db.ForeignKey("miembro.id"), nullable=False)
    tipo = db.Column(db.String(40), nullable=False)
    nombre = db.Column(db.String(80), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    enlace = db.Column(db.String(300), nullable=False)

    miembro = db.relationship("Miembro", back_populates="actividades")
    horarios = db.relationship(
        "Horario",
        back_populates="actividad",
        cascade="all, delete-orphan",
        order_by="Horario.id",
    )
    fotos = db.relationship(
        "Foto",
        back_populates="actividad",
        cascade="all, delete-orphan",
        order_by="Foto.id",
    )


class Horario(db.Model):
    __tablename__ = "horario"

    id = db.Column(db.Integer, primary_key=True)
    actividad_id = db.Column(db.Integer, db.ForeignKey("actividad.id"), nullable=False)
    dia = db.Column(db.String(20), nullable=False)
    hora_inicio = db.Column(db.String(5), nullable=False)
    hora_fin = db.Column(db.String(5), nullable=False)

    actividad = db.relationship("Actividad", back_populates="horarios")


class Foto(db.Model):
    __tablename__ = "foto"

    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey("actividad.id"), nullable=False)

    actividad = db.relationship("Actividad", back_populates="fotos")
