package com.desarrolloweb.tarea4.web;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.desarrolloweb.tarea4.ActividadService;
import com.desarrolloweb.tarea4.dto.NotaResumen;
import com.desarrolloweb.tarea4.dto.ResultadoBusqueda;

/**
 * API REST usado por el JavaScript del cliente:
 *  - GET  /api/actividades/buscar?q=...     → resultados del buscador
 *  - POST /api/actividades/{id}/notas       → agrega una nota (1..7)
 */
@RestController
@RequestMapping("/api/actividades")
public class ApiController {

    private final ActividadService servicio;

    public ApiController(ActividadService servicio) {
        this.servicio = servicio;
    }

    @GetMapping("/buscar")
    public List<ResultadoBusqueda> buscar(@RequestParam(name = "q", required = false) String q) {
        return servicio.buscar(q);
    }

    @PostMapping("/{id}/notas")
    public ResponseEntity<?> agregarNota(@PathVariable Integer id,
                                         @RequestBody(required = false) Map<String, Object> cuerpo) {
        Object valor = cuerpo == null ? null : cuerpo.get("nota");

        // Solo se aceptan números enteros: un JSON 5.5 llega como Double y "5"
        // como String; únicamente un entero JSON llega como Integer.
        if (!(valor instanceof Integer)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "La nota debe ser un número entero entre 1 y 7."));
        }
        int nota = (Integer) valor;
        if (nota < 1 || nota > 7) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "La nota debe estar entre 1 y 7."));
        }

        Optional<NotaResumen> resumen = servicio.agregarNota(id, nota);
        if (resumen.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "La actividad no existe."));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(resumen.get());
    }
}
