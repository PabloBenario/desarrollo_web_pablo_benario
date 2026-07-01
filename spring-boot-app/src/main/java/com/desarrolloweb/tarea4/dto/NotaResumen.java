package com.desarrolloweb.tarea4.dto;

/**
 * Resumen de las notas de una actividad tras agregar una nueva nota.
 * Se devuelve al cliente para que recalcule lo que muestra en pantalla.
 *
 * @param notaPromedio promedio actualizado (null si no hay notas)
 * @param notaCantidad contador actualizado de notas
 */
public record NotaResumen(
    Double notaPromedio,
    long notaCantidad
) {
}
