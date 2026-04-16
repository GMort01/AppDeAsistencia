# API REST

Base URL típica: `http://localhost:3000/api` (desarrollo).

Prefijos reales en `server/src/index.js`:

- `/api/auth` — autenticación y registro
- `/api/clases` — gestión de clases
- `/api/asistencia` — registro de asistencia y consultas relacionadas con QR

---

## Autenticación — `/api/auth`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/register` | Registro de usuario (estudiante/profesor según body) |
| POST | `/login/profesor` | Login profesor |
| POST | `/login/estudiante` | Login estudiante (incluye validación de dispositivo) |
| POST | `/login-profesor` | Alias retrocompatible |
| POST | `/login-estudiante` | Alias retrocompatible |

**Login estudiante (ejemplo de body):**

```json
{
  "correo_institucional": "12345@universidad.edu",
  "password": "contraseña",
  "deviceId": "identificador-principal",
  "deviceIdSecundario": "opcional-legacy"
}
```

---

## Clases — `/api/clases`

Rutas en `server/src/routes/clasesRoutes.js`:

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/` | Crear clase (`nombre_clase`, `profesor_id`, `hora_inicio`, `hora_fin`, `fecha_clase` opcional) |
| GET | `/profesor/:profesorId` | Listar clases del profesor |
| PATCH | `/:claseId/estado` | Actualizar estado (asistencia abierta/cerrada, etc.) |
| DELETE | `/:claseId` | Eliminar clase |
| DELETE | `/dispositivo/:estudianteId` | Desvincular dispositivo de estudiante |

---

## Asistencia — `/api/asistencia`

Definidas en `server/src/routes/asistenciaRoutes.js`:

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/registrar` | Registrar asistencia (validación de dispositivo / token QR según implementación) |
| GET | `/qr-token/:claseId` | Obtener datos para generar/validar QR |
| GET | `/estudiante/:estudianteId/clases` | Clases del estudiante |
| GET | `/clase/:claseId` | Asistencias por clase |
| GET | `/clase/:claseId/hoy` | Asistencias del día por clase |

---

## Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Comprobación rápida de que el servidor responde |

---

## Ver también

- [[Modelo de datos]]
- [[Instalacion]]
