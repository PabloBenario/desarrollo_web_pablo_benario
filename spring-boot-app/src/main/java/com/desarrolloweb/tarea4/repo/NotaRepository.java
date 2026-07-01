package com.desarrolloweb.tarea4.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desarrolloweb.tarea4.model.Nota;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    /** Todas las notas de una actividad (para recalcular promedio y contador). */
    List<Nota> findByActividadId(Integer actividadId);
}
