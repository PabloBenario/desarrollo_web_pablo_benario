package com.desarrolloweb.tarea4.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Sirve la página del buscador. Toda la interacción (búsqueda y notas)
 * ocurre luego con JavaScript de forma asíncrona contra el API REST.
 */
@Controller
public class PaginaController {

    @GetMapping("/")
    public String buscador() {
        return "buscador";
    }
}
