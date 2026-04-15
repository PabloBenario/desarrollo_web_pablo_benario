// Tipos centrales del sistema ACTIVADCC.

type TipoMiembro =
  | "estudiante-pregrado"
  | "estudiante-postgrado"
  | "funcionario"
  | "academico";

type CategoriaActividad =
  | "artistica"
  | "deportiva"
  | "tecnologica"
  | "social"
  | "recreativa";

type DiaSemana =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

interface Horario {
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

interface Actividad {
  nombre: string;
  categoria: CategoriaActividad;
  descripcion?: string;
  horarios: Horario[];
  archivos: string[];
  enlace: string;
}

interface DatosEstudiante {
  semestre: number;
}

interface DatosFuncionario {
  area: string;
}

interface DatosAcademico {
  curso: string;
}

interface Miembro {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telegram?: string;
  telefono?: string;
  tipo: TipoMiembro;
  datosEstudiante?: DatosEstudiante;
  datosFuncionario?: DatosFuncionario;
  datosAcademico?: DatosAcademico;
  actividades: Actividad[];
}

const ETIQUETAS_TIPO: Record<TipoMiembro, string> = {
  "estudiante-pregrado": "Estudiante pregrado",
  "estudiante-postgrado": "Estudiante postgrado",
  funcionario: "Funcionario/a",
  academico: "Académico/a",
};

const ETIQUETAS_CATEGORIA: Record<CategoriaActividad, string> = {
  artistica: "Artística",
  deportiva: "Deportiva",
  tecnologica: "Tecnológica",
  social: "Social",
  recreativa: "Recreativa",
};

const ETIQUETAS_DIA: Record<DiaSemana, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

const LIMITE_ACTIVIDADES = 5;
