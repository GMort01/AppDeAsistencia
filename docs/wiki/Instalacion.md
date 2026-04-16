# Instalación y configuración

## Requisitos

- **Node.js** LTS (recomendado 20+)
- **npm**
- **MySQL** accesible (local o remoto) con base de datos creada según el esquema del proyecto
- Para la app: **Expo CLI** / **npx expo** y opcionalmente **Expo Go** en el teléfono

## Backend (`server/`)

```bash
cd server
npm install
```

### Variables de entorno (`server/.env`)

Crear `.env` en `server/` (no subir credenciales al repositorio). Ejemplo:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=smartattendance
DB_PORT=3306
PORT=3000
QR_SECRET=una_cadena_larga_secreta_para_firmar_QR
```

- **`QR_SECRET`**: usada en la lógica de tokens QR del controlador de asistencia (si no se define, existe un valor por defecto solo para desarrollo).

### Base de datos

1. Crear la base de datos (ej. `smartattendance`).
2. Ejecutar el script SQL adecuado según el motor que use el equipo (`database_schema.sql` para MySQL/MariaDB en el repositorio).

### Arranque

```bash
npm run dev
# o
npm start
```

Comprobar: `http://localhost:3000/` debe responder un mensaje de estado del servidor.

## App móvil (`Mobile/`)

```bash
cd Mobile
npm install
npx expo start -c
```

### URL del API (importante en red local)

La app resuelve sola la base `http://HOST:3000/api` en muchos casos (ver `Mobile/constants/api.ts`).

Si falla la conexión:

1. Crear `Mobile/.env` (ver `Mobile/.env.example` si existe):

```env
EXPO_PUBLIC_API_URL=http://TU_IPv4:3000/api
```

2. Sustituir `TU_IPv4` por la IP de la máquina donde corre el servidor (`ipconfig` en Windows, `ip addr` / `ifconfig` en Linux/macOS).
3. Reiniciar Metro con caché limpia: `npx expo start -c`.

### Dispositivo físico

El teléfono debe estar en la **misma red Wi‑Fi** que el PC que ejecuta el backend, salvo que el API esté expuesto en otra red/VPN.

### Firewall

Permitir conexiones entrantes al **puerto 3000** en el equipo servidor si el móvil no conecta.

## Ver también

- [[Arquitectura]]
- [[API REST]]
