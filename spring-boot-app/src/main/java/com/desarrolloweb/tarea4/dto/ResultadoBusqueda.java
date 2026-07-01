package com.desarrolloweb.tarea4.dto;

/**
 * Un resultado del buscador, listo para enviarse como JSON al cliente.
 *
 * @param id            id de la actividad (para evaluarla)
 * @param miembro       nombre completo del miembro asociado
 * @param dias          días de la actividad, ya con etiqueta legible
 * @param tipo          tipo de actividad, ya con etiqueta legible
 * @param comuna        nombre de la comuna del miembro
 * @param nombre        nombre de la actividad
 * @param descripcion   descripción de la actividad
 * @param notaPromedio  promedio de las notas, o null si aún no tiene notas
 * @param notaCantidad  cantidad de notas registradas (contador)
 */
public record ResultadoBusqueda(
    Integer id,
    String miembro,
    String dias,
    String tipo,
    String comuna,
    String nombre,
    String descripcion,
    Double notaPromedio,
    long notaCantidad
) {
}
