-- SmartAttendance: esquema de base de datos + datos iniciales
-- Este archivo se puede usar para crear la base de datos en MySQL/MariaDB.
-- Instrucciones:
-- 1) Crear la base de datos si no existe: CREATE DATABASE smartattendance;
-- 2) Seleccionar la base de datos: USE smartattendance;
-- 3) Ejecutar este script.

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS asistencias;
DROP TABLE IF EXISTS sesiones_clase;
DROP TABLE IF EXISTS clases;
DROP TABLE IF EXISTS usuarios;

-- Tabla de usuarios (profesores y estudiantes)
CREATE TABLE usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre_completo VARCHAR(100) NOT NULL,
  correo_institucional VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('profesor','estudiante') NOT NULL,
  id_universitario VARCHAR(20) NOT NULL,
  dispositivo_vinculado VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY correo_institucional (correo_institucional),
  UNIQUE KEY id_universitario (id_universitario),
  UNIQUE KEY dispositivo_vinculado (dispositivo_vinculado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de clases
CREATE TABLE clases (
  id INT NOT NULL AUTO_INCREMENT,
  nombre_clase VARCHAR(100) NOT NULL,
  profesor_id INT DEFAULT NULL,
  codigo_acceso VARCHAR(10) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY codigo_acceso (codigo_acceso),
  KEY profesor_id (profesor_id),
  CONSTRAINT clases_ibfk_1 FOREIGN KEY (profesor_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de sesiones de clase activas
CREATE TABLE sesiones_clase (
  id INT NOT NULL AUTO_INCREMENT,
  clase_id INT DEFAULT NULL,
  token_actual VARCHAR(255) NOT NULL,
  expira_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY clase_id (clase_id),
  CONSTRAINT sesiones_clase_ibfk_1 FOREIGN KEY (clase_id) REFERENCES clases (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla de asistencias registradas
CREATE TABLE asistencias (
  id INT NOT NULL AUTO_INCREMENT,
  estudiante_id INT DEFAULT NULL,
  clase_id INT DEFAULT NULL,
  fecha_hora TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  dispositivo_usado VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY estudiante_id (estudiante_id),
  KEY clase_id (clase_id),
  CONSTRAINT asistencias_ibfk_1 FOREIGN KEY (estudiante_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT asistencias_ibfk_2 FOREIGN KEY (clase_id) REFERENCES clases (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Datos iniciales de ejemplo
INSERT INTO usuarios (id, nombre_completo, correo_institucional, password_hash, rol, id_universitario, dispositivo_vinculado, created_at) VALUES
  (1, 'Manuel Morales Martinez', '406384@universidad.edu', '$2b$10$EMeEmm6P7aJvKRmfZ6isiODjdJHlQmA549QjODYM8zEjK1K7mKpjS', 'estudiante', '406384', NULL, '2026-04-15 08:39:32'),
  (2, 'Manuel Martínez Mora', '606060@universidad.edu', '$2b$10$H0eSywSFsCX0O.IYrjLFcevQs13GVEVZ1O.ReTdvGx2jdysrlDa36', 'profesor', '606060', NULL, '2026-04-15 10:01:52');

SET FOREIGN_KEY_CHECKS = 1;

