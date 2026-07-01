package com.desarrolloweb.tarea4.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.desarrolloweb.tarea4.model.Actividad;

public interface ActividadRepository extends JpaRepository<Actividad, Integer> {

    /**
     * Busca actividades cuyo nombre, descripción o comuna del miembro
     * contengan el patrón (sin distinguir mayúsculas/minúsculas).
     * Se traen de una vez el miembro y su comuna (JOIN FETCH) para
     * mostrarlos sin consultas extra.
     */
    @Query("""
        SELECT DISTINCT a FROM Actividad a
        JOIN FETCH a.miembro m
        JOIN FETCH m.comuna c
        WHERE LOWER(a.nombre)      LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(c.nombre)      LIKE LOWER(CONCAT('%', :q, '%'))
        ORDER BY a.id
        """)
    List<Actividad> buscar(@Param("q") String q);
}
