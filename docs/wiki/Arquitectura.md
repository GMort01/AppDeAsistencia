# Arquitectura

## Vista de capas

```mermaid
flowchart TB
    subgraph Cliente["Cliente móvil / web (Expo)"]
        UI[Pantallas y componentes]
        API_CLIENT[constants/api.ts — URL y postJson]
    end

    subgraph Red["Red local / LAN"]
        HTTP[HTTP JSON]
    end

    subgraph Servidor["Backend Node.js"]
        EXP[Express]
        R_AUTH["/api/auth"]
        R_CLASES["/api/clases"]
        R_ASIST["/api/asistencia"]
        CTRL[Controladores]
    end

    subgraph Datos["Persistencia"]
        DB[(MySQL)]
    end

    UI --> API_CLIENT
    API_CLIENT --> HTTP
    HTTP --> EXP
    EXP --> R_AUTH
    EXP --> R_CLASES
    EXP --> R_ASIST
    R_AUTH --> CTRL
    R_CLASES --> CTRL
    R_ASIST --> CTRL
    CTRL --> DB
```

## Actores y sistemas

```mermaid
flowchart LR
    Prof[Profesor]
    Est[Estudiante]
    App[App Expo]
    API[API Express :3000]
    DB[(MySQL)]

    Prof --> App
    Est --> App
    App -->|HTTP JSON| API
    API -->|mysql2| DB
```

## Flujo de autenticación (resumen)

```mermaid
sequenceDiagram
    participant App as App móvil
    participant API as API /api/auth
    participant DB as Base de datos

    App->>API: POST /login/profesor o /login/estudiante
    API->>DB: Consulta usuario por correo
    DB-->>API: Filas usuario
    API->>API: bcrypt.compare(password)
    alt Estudiante
        API->>DB: Vincular dispositivo si aplica
    end
    API-->>App: JSON { usuario: { id, nombre, rol } }
```

## Flujo de asistencia por QR

```mermaid
sequenceDiagram
    participant Prof as Profesor (app)
    participant API as API
    participant Est as Estudiante (app)

    Prof->>API: Crear clase / obtener token QR según implementación
    Est->>API: POST /api/asistencia/registrar (clase, estudiante, token/dispositivo)
    API->>API: Validar clase, estudiante, dispositivo, anti-reuso token
    API-->>Est: Confirmación y lista de asistentes
```

## Estructura de carpetas (resumen)

| Ruta | Rol |
|------|-----|
| `Mobile/app/` | Entrada Expo Router (`index.tsx` — selección de rol) |
| `Mobile/components/` | Vistas: login, profesor, estudiante, detalle clase, registro |
| `Mobile/constants/api.ts` | Resolución de `API_URL` y `postJson` |
| `Mobile/utils/` | IDs de dispositivo, QR, exportación Excel (según rama) |
| `server/src/index.js` | App Express, conexión DB, rutas |
| `server/src/routes/` | Definición de rutas REST |
| `server/src/controllers/` | Lógica de negocio |

## Decisiones de diseño

1. **API bajo `/api`** para separar del health check `/`.
2. **CORS habilitado** para desarrollo con Expo en distintos hosts.
3. **Helmet** para cabeceras HTTP de seguridad básicas.
4. **Vínculo de dispositivo** en login de estudiante para reducir uso de cuentas en varios móviles (lógica en `authController` + `deviceId.ts`).
5. **URL del API en cliente**: prioridad `EXPO_PUBLIC_API_URL` → web `localhost` → IP de Metro (`hostUri`) → emulador Android `10.0.2.2`.

## Ver también

- [[Instalacion]]
- [[API REST]]
- [[Modelo de datos]]
