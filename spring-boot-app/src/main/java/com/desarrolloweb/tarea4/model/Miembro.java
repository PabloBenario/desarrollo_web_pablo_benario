package com.desarrolloweb.tarea4.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Miembro de la comunidad DCC. La Tarea 4 solo lee su nombre, apellido
 * y comuna para mostrarlos en los resultados del buscador, por eso se
 * mapean únicamente esas columnas.
 */
@Entity
@Table(name = "miembro")
public class Miembro {

    @Id
    private Integer id;

    private String nombre;
    private String apellido;

    @ManyToOne
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public Comuna getComuna() { return comuna; }

    /** Nombre completo, como en las tareas previas. */
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
}
