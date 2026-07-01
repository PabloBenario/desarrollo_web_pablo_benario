package com.desarrolloweb.tarea4.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Actividad extraprogramática. Es la entidad central del buscador:
 * se busca por su nombre y descripción (y por la comuna de su miembro),
 * y sus notas se promedian para mostrar la evaluación.
 */
@Entity
@Table(name = "actividad")
public class Actividad {

    @Id
    private Integer id;

    private String tipo;
    private String nombre;
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "miembro_id")
    private Miembro miembro;

    @OneToMany(mappedBy = "actividad", fetch = FetchType.LAZY)
    private List<Horario> horarios = new ArrayList<>();

    @OneToMany(mappedBy = "actividad", fetch = FetchType.LAZY)
    private List<Nota> notas = new ArrayList<>();

    public Integer getId() { return id; }
    public String getTipo() { return tipo; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public Miembro getMiembro() { return miembro; }
    public List<Horario> getHorarios() { return horarios; }
    public List<Nota> getNotas() { return notas; }
}
