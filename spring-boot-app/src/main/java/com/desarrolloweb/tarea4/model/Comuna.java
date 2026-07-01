package com.desarrolloweb.tarea4.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Comuna del miembro. Se usa para poder buscar actividades por el
 * nombre de la comuna del miembro asociado.
 */
@Entity
@Table(name = "comuna")
public class Comuna {

    @Id
    private Integer id;

    private String nombre;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
}
