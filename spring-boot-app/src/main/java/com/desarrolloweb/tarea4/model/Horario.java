package com.desarrolloweb.tarea4.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Horario de una actividad. La Tarea 4 solo usa el "día" para mostrarlo
 * en los resultados del buscador.
 */
@Entity
@Table(name = "horario")
public class Horario {

    @Id
    private Integer id;

    private String dia;

    @ManyToOne
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;

    public Integer getId() { return id; }
    public String getDia() { return dia; }
    public Actividad getActividad() { return actividad; }
}
