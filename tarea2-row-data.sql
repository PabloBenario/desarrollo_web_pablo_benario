-- Esquema base para Tarea 2.
-- Cargar este archivo primero y luego region-comuna.sql.

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS `tarea2`;
CREATE SCHEMA IF NOT EXISTS `tarea2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tarea2`;

CREATE TABLE `region` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE `comuna` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(200) NOT NULL,
  `region_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comuna_region_idx` (`region_id`),
  CONSTRAINT `fk_comuna_region`
    FOREIGN KEY (`region_id`)
    REFERENCES `region` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE `miembro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `apellido` VARCHAR(255) NOT NULL,
  `email` VARCHAR(80) NOT NULL,
  `telefono` VARCHAR(25) NULL,
  `telegram` VARCHAR(40) NULL,
  `tipo` VARCHAR(40) NOT NULL,
  `semestre` INT NULL,
  `area` VARCHAR(120) NULL,
  `curso` VARCHAR(120) NULL,
  `fecha_registro` DATETIME NOT NULL,
  `comuna_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_miembro_comuna_idx` (`comuna_id`),
  CONSTRAINT `fk_miembro_comuna`
    FOREIGN KEY (`comuna_id`)
    REFERENCES `comuna` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE `actividad` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `miembro_id` INT NOT NULL,
  `tipo` VARCHAR(40) NOT NULL,
  `nombre` VARCHAR(80) NOT NULL,
  `descripcion` TEXT NULL,
  `enlace` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_actividad_miembro_idx` (`miembro_id`),
  CONSTRAINT `fk_actividad_miembro`
    FOREIGN KEY (`miembro_id`)
    REFERENCES `miembro` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE `horario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `actividad_id` INT NOT NULL,
  `dia` VARCHAR(20) NOT NULL,
  `hora_inicio` VARCHAR(5) NOT NULL,
  `hora_fin` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_horario_actividad_idx` (`actividad_id`),
  CONSTRAINT `fk_horario_actividad`
    FOREIGN KEY (`actividad_id`)
    REFERENCES `actividad` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE `foto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ruta_archivo` VARCHAR(300) NOT NULL,
  `nombre_archivo` VARCHAR(300) NOT NULL,
  `actividad_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_foto_actividad_idx` (`actividad_id`),
  CONSTRAINT `fk_foto_actividad`
    FOREIGN KEY (`actividad_id`)
    REFERENCES `actividad` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
