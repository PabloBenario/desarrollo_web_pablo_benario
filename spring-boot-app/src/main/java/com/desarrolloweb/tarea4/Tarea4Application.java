package com.desarrolloweb.tarea4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada de la aplicación Spring Boot de la Tarea 4.
 * Levanta Tomcat embebido, autoconfigura Thymeleaf y JPA (Hibernate),
 * y conecta con la misma base de datos "tarea2" de las tareas previas.
 */
@SpringBootApplication
public class Tarea4Application {

    public static void main(String[] args) {
        SpringApplication.run(Tarea4Application.class, args);
    }
}
