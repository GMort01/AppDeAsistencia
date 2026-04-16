# Smart Attendance — Wiki

Sistema de **control de asistencia educativa** con **código QR**, roles **profesor** y **estudiante**, aplicación móvil (**React Native / Expo**) y API REST (**Node.js / Express**).

## Contenido

| Página | Descripción |
|--------|-------------|
| [[Arquitectura]] | Vista general, capas, diagramas y flujos |
| [[Instalacion]] | Requisitos, variables de entorno y ejecución |
| [[API REST]] | Endpoints del backend |
| [[Modelo de datos]] | Tablas y relaciones |

## Objetivos del producto

- Permitir al **profesor** crear sesiones de clase, generar **QR** para asistencia y consultar/exportar listas.
- Permitir al **estudiante** **registrarse**, **iniciar sesión** (con vínculo a dispositivo) y **registrar asistencia** escaneando el QR.
- Centralizar datos en una **base de datos** accesible por la API.

## Repositorio

Código fuente: [GMort01/AppDeAsistencia](https://github.com/GMort01/AppDeAsistencia)

**Base de datos:** el backend de esta rama está pensado para **MySQL/MariaDB** (también puede estar **en la nube** si el proveedor ofrece MySQL). Si usáis **PostgreSQL** (p. ej. Neon), hace falta otra variante del servidor; ver [[Instalacion]].

---

*Documentación generada para el equipo de desarrollo. Mantener alineada con la rama `main`.*
