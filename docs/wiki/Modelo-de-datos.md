# Modelo de datos

El proyecto incluye scripts SQL en la raíz de `server/` (por ejemplo `database_schema.sql` para MySQL). Las tablas evolucionan con **migraciones aplicadas al arranque** en `server/src/index.js` (columnas extra en `clases`, tabla `tokens_qr_usados`, `dispositivo_vinculado` en `usuarios`, etc.).

## Diagrama entidad-relación (conceptual)

```mermaid
erDiagram
    USUARIOS ||--o{ CLASES : "profesor_id"
    CLASES ||--o{ ASISTENCIAS : "clase_id"
    USUARIOS ||--o{ ASISTENCIAS : "estudiante_id"

    USUARIOS {
        int id PK
        string nombre_completo
        string correo_institucional UK
        string password_hash
        string rol
        string id_universitario UK
        string dispositivo_vinculado
    }

    CLASES {
        int id PK
        string nombre_clase
        int profesor_id FK
        string codigo_acceso
        string hora_inicio
        string hora_fin
        string fecha_clase
        bool asistencia_abierta
    }

    ASISTENCIAS {
        int id PK
        int estudiante_id FK
        int clase_id FK
        datetime fecha_hora
    }
```

## Tabla auxiliar (anti-reuso QR)

- **`tokens_qr_usados`**: almacena nonces de uso único del QR según la lógica del `asistenciaController`, con limpieza periódica.

## Notas

- Los tipos exactos (`INT`, `VARCHAR`, etc.) dependen del script SQL aplicado.
- El **vínculo de dispositivo** en estudiantes usa `usuarios.dispositivo_vinculado` y los IDs enviados desde la app (`deviceId`).

## Ver también

- [[API REST]]
- [[Arquitectura]]
