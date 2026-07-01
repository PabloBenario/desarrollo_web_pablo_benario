package com.desarrolloweb.tarea4;

import java.util.Map;

/**
 * Etiquetas legibles para los códigos guardados en la base de datos,
 * iguales a las usadas en las tareas previas (categorías de actividad y
 * días de la semana). Se usan para mostrar textos amigables al usuario.
 */
public final class Etiquetas {

    private Etiquetas() {
    }

    private static final Map<String, String> CATEGORIAS = Map.of(
        "artistica",   "Artística",
        "deportiva",   "Deportiva",
        "tecnologica", "Tecnológica",
        "social",      "Social",
        "recreativa",  "Recreativa"
    );

    private static final Map<String, String> DIAS = Map.of(
        "lunes",     "Lunes",
        "martes",    "Martes",
        "miercoles", "Miércoles",
        "jueves",    "Jueves",
        "viernes",   "Viernes",
        "sabado",    "Sábado",
        "domingo",   "Domingo"
    );

    public static String categoria(String codigo) {
        if (codigo == null) return "";
        return CATEGORIAS.getOrDefault(codigo, codigo);
    }

    public static String dia(String codigo) {
        if (codigo == null) return "";
        return DIAS.getOrDefault(codigo, codigo);
    }
}
