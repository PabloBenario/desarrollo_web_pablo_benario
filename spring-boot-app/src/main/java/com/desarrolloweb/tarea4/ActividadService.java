package com.desarrolloweb.tarea4;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.desarrolloweb.tarea4.dto.NotaResumen;
import com.desarrolloweb.tarea4.dto.ResultadoBusqueda;
import com.desarrolloweb.tarea4.model.Actividad;
import com.desarrolloweb.tarea4.model.Nota;
import com.desarrolloweb.tarea4.repo.ActividadRepository;
import com.desarrolloweb.tarea4.repo.NotaRepository;

/**
 * Lógica del buscador de actividades y de las notas (evaluaciones).
 * Es transaccional para poder leer las relaciones perezosas (horarios y
 * notas) mientras arma los resultados que se envían al cliente.
 */
@Service
public class ActividadService {

    /** Mínimo de caracteres para disparar la búsqueda, como pide el enunciado. */
    public static final int MIN_CARACTERES = 3;

    private final ActividadRepository actividades;
    private final NotaRepository notas;

    public ActividadService(ActividadRepository actividades, NotaRepository notas) {
        this.actividades = actividades;
        this.notas = notas;
    }

    /**
     * Busca actividades por nombre, descripción o comuna. Devuelve una
     * lista vacía si el patrón tiene menos de {@link #MIN_CARACTERES}.
     */
    @Transactional(readOnly = true)
    public List<ResultadoBusqueda> buscar(String patron) {
        String q = patron == null ? "" : patron.trim();
        if (q.length() < MIN_CARACTERES) {
            return List.of();
        }
        return actividades.buscar(q).stream()
            .map(this::aResultado)
            .collect(Collectors.toList());
    }

    private ResultadoBusqueda aResultado(Actividad a) {
        String dias = a.getHorarios().stream()
            .map(h -> Etiquetas.dia(h.getDia()))
            .distinct()
            .collect(Collectors.joining(", "));

        return new ResultadoBusqueda(
            a.getId(),
            a.getMiembro().getNombreCompleto(),
            dias,
            Etiquetas.categoria(a.getTipo()),
            a.getMiembro().getComuna().getNombre(),
            a.getNombre(),
            a.getDescripcion() == null ? "" : a.getDescripcion(),
            promedio(a.getNotas()),
            a.getNotas().size()
        );
    }

    /**
     * Agrega una nota a una actividad y devuelve el resumen recalculado.
     * Devuelve {@link Optional#empty()} si la actividad no existe.
     * La nota debe ser un entero entre 1 y 7 (se valida antes de llamar).
     */
    @Transactional
    public Optional<NotaResumen> agregarNota(Integer actividadId, int valor) {
        Optional<Actividad> actividad = actividades.findById(actividadId);
        if (actividad.isEmpty()) {
            return Optional.empty();
        }
        notas.save(new Nota(actividad.get(), valor));

        List<Nota> todas = notas.findByActividadId(actividadId);
        return Optional.of(new NotaResumen(promedio(todas), todas.size()));
    }

    /** Promedio de notas redondeado a un decimal, o null si no hay notas. */
    private Double promedio(List<Nota> lista) {
        if (lista.isEmpty()) {
            return null;
        }
        double media = lista.stream().mapToInt(Nota::getNota).average().orElse(0);
        return Math.round(media * 10.0) / 10.0;
    }
}
