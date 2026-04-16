# Instalación y configuración

## Requisitos

- **Node.js** LTS (recomendado 20+)
- **npm**
- **Base de datos compatible con el backend actual** (ver siguiente sección)
- Para la app: **Expo CLI** / **npx expo** y opcionalmente **Expo Go** en el teléfono

## Base de datos: ¿MySQL local o “la nube”?

El código del servidor en esta rama usa el paquete **`mysql2`** y consultas en dialecto **MySQL/MariaDB** (`database_schema.sql`, migraciones con `ENGINE=InnoDB`, etc.). Por eso la wiki habla de **MySQL**: es el **motor que el programa espera hoy**, no obliga a que el servidor físico esté en tu PC.

| Situación | ¿Funciona con este código? |
|-----------|----------------------------|
| MySQL o MariaDB en **tu máquina** (`localhost`) | Sí. `DB_HOST=localhost`. |
| MySQL/MariaDB **en la nube** (RDS, Azure Database for MySQL, PlanetScale en modo MySQL, etc.) | Sí. Pon en `.env` el **host, usuario, contraseña y puerto** que te da el proveedor (suele ser distinto de 3306 o requiere SSL según el servicio). |
| **PostgreSQL** en la nube (p. ej. **Neon**) | **No** con este backend tal cual: Neon es otro motor. Haría falta usar el cliente `pg`, otro esquema SQL y adaptar controladores. Si el equipo ya usa Neon, o bien migran el servidor a PostgreSQL, o bien usan una base **MySQL** en la nube para alinear con `mysql2`. |

En resumen: **“tener MySQL”** en la documentación significa **usar ese tipo de base con este repositorio**; una BD en la nube **sí sirve** si es **MySQL/MariaDB compatible**. Si vuestra nube es solo **Postgres**, la wiki no puede decir “solo pega la URL de Neon” sin cambiar el código del `server/`.

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
