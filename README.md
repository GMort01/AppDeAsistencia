# SmartAttendance

SmartAttendance es una solución de control de asistencia académica basada en códigos QR dinámicos. El proyecto combina una aplicación móvil construida con Expo y React Native con un backend en Node.js + Express conectado a MySQL.

Su objetivo es permitir que un profesor cree clases, abra o cierre la asistencia, genere un QR temporal y consulte quiénes asistieron, mientras que el estudiante puede autenticarse, escanear el QR y ver la lista de compañeros presentes.

## Características principales

- Autenticación separada para profesor y estudiante.
- Creación, listado y eliminación de clases por profesor.
- Horario y fecha de clase persistidos en base de datos.
- Apertura y cierre de asistencia por clase.
- Generación de QR dinámico con expiración corta.
- Validación de firma del QR y control anti-replay.
- Registro de asistencia con prevención de duplicados por estudiante y clase.
- Vinculación de cuenta a un dispositivo para endurecer el acceso del estudiante.
- Vista de compañeros presentes dentro de cada clase.
- Lista de clases ya registradas por el estudiante para reingresar sin reescanear el QR.
- Exportación a Excel de los asistentes del día para el profesor.

## Arquitectura del proyecto

El repositorio está dividido en dos módulos principales:

- Mobile: aplicación Expo / React Native.
- server: API REST con Express y conexión a MySQL.

Flujo general:

1. El profesor inicia sesión y crea una clase.
2. El backend guarda la clase y sus metadatos en MySQL.
3. El profesor abre la asistencia y la app genera un QR temporal.
4. El estudiante inicia sesión, escanea el QR y la app registra la asistencia en el backend.
5. El backend valida el token, la vigencia, el dispositivo y persiste la asistencia.
6. Profesor y estudiante pueden consultar en tiempo real quiénes están presentes.

## Tecnologías utilizadas

### Mobile

- Expo 54
- React Native 0.81
- React 19
- TypeScript
- expo-camera
- expo-secure-store
- expo-application
- react-native-qrcode-svg
- xlsx

### Backend

- Node.js
- Express 5
- mysql2
- bcryptjs
- helmet
- cors
- dotenv
- nodemon

### Base de datos

- MySQL / MariaDB

## Estructura del repositorio

```text
SmartAttendance/
├── Mobile/
│   ├── app/
│   ├── components/
│   ├── constants/
│   ├── controllers/
│   ├── models/
│   └── utils/
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   └── database_schema.sql
└── README.md
```

## Requisitos previos

- Node.js 18 o superior recomendado.
- npm.
- MySQL local ejecutándose.
- Expo Go en dispositivo móvil si se quiere probar cámara real.
- Misma red local entre el teléfono y la PC cuando se usen APIs locales.

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd SmartAttendance
```

### 2. Instalar dependencias del móvil

```bash
cd Mobile
npm install
```

### 3. Instalar dependencias del backend

```bash
cd ../server
npm install
```

## Configuración de la base de datos

### 1. Crear la base de datos

```sql
CREATE DATABASE smartattendance;
USE smartattendance;
```

### 2. Importar el esquema base

Ejecuta el contenido de:

- server/database_schema.sql

Ese script crea las tablas principales:

- usuarios
- clases
- sesiones_clase
- asistencias

### 3. Migraciones automáticas

Al iniciar el servidor, la aplicación intenta agregar automáticamente estas estructuras si aún no existen:

- columnas `hora_inicio`, `hora_fin`, `fecha_clase` y `asistencia_abierta` en `clases`
- tabla `tokens_qr_usados`
- columna `dispositivo_vinculado` en `usuarios`

Esto permite arrancar el proyecto sin rehacer manualmente toda la base cuando se añaden mejoras recientes.

## Variables de entorno del backend

Primero copia la plantilla incluida:

```bash
cd server
copy .env.example .env
```

Luego ajusta los valores reales en `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=smartattendance
DB_PORT=3306
QR_SECRET=un_secreto_largo_y_privado
```

Notas:

- `QR_SECRET` se usa para firmar los tokens QR dinámicos.
- No conviene subir este archivo al repositorio.

## Configuración de la API en el móvil

La URL base del backend se define en:

- Mobile/constants/api.ts

Ejemplo para pruebas en red local:

```ts
export const API_URL = 'http://192.168.1.2:3000/api';
```

Recomendaciones:

- Si pruebas desde un teléfono físico, usa la IP local de tu PC.
- Si pruebas desde el mismo equipo en web, puedes usar `http://localhost:3000/api`.
- Si cambia tu IP, actualiza ese archivo.

## Ejecución del proyecto

### Levantar el backend

```bash
cd server
npm run dev
```

Salida esperada:

```text
🚀 Servidor corriendo en http://localhost:3000
✅ Conexión exitosa a MySQL Local
```

### Levantar la app móvil

```bash
cd Mobile
npx expo start -c
```

Opciones de ejecución:

- Escanear el QR de Expo Go para usar un teléfono real.
- Presionar `w` para abrir en navegador.
- Presionar `a` para Android si hay emulador.
- Presionar `i` para iOS si el entorno lo permite.

## Flujo funcional

### Profesor

- Inicia sesión con su cuenta.
- Crea clases con nombre, hora de inicio, hora final y fecha.
- Consulta su listado de clases.
- Abre y cierra asistencia por clase.
- Genera un QR temporal desde el detalle de la clase.
- Exporta a Excel los asistentes del día.
- Elimina clases respetando la propiedad del profesor.

### Estudiante

- Inicia sesión con ID universitario y contraseña basada en celular según la lógica actual del proyecto.
- Escanea el QR del profesor.
- Registra la asistencia si el token sigue vigente y la validación del backend es correcta.
- Ve la lista de compañeros presentes.
- Puede volver a entrar a una clase ya registrada desde la lista `Mis clases registradas` sin reescanear.

## Seguridad implementada actualmente

- QR firmado con HMAC.
- Vigencia corta del token QR.
- Prevención de reutilización del mismo token.
- Prevención de duplicados de asistencia por estudiante y clase.
- Asociación de cuenta del estudiante con un dispositivo.
- Restricción de clases por profesor para evitar accesos cruzados.

## Endpoints principales

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login/estudiante`
- `POST /api/auth/login/profesor`

### Clases

- `POST /api/clases`
- `GET /api/clases/profesor/:profesorId`
- `PATCH /api/clases/:claseId/estado`
- `DELETE /api/clases/:claseId`

### Asistencia

- `POST /api/asistencia/registrar`
- `GET /api/asistencia/qr-token/:claseId`
- `GET /api/asistencia/clase/:claseId`
- `GET /api/asistencia/clase/:claseId/hoy`
- `GET /api/asistencia/estudiante/:estudianteId/clases`

## Archivos importantes

### Mobile

- Mobile/components/ProfesorView.tsx: vista principal del profesor.
- Mobile/components/DetalleClaseView.tsx: detalle de clase, QR y exportación.
- Mobile/components/EstudianteView.tsx: escaneo QR, lista de presentes y clases registradas.
- Mobile/controllers/asistenciaController.ts: consumo de endpoints de asistencia.
- Mobile/utils/qrGenerator.tsx: generación y actualización de QR dinámico.
- Mobile/utils/exportExcel.tsx: exportación de asistentes a Excel.

### Backend

- server/src/index.js: arranque del servidor, conexión a MySQL y migraciones.
- server/src/controllers/authController.js: autenticación.
- server/src/controllers/asistenciaController.js: registro, validación QR y consultas.
- server/src/controllers/clasesController.js: CRUD de clases y estado.
- server/src/routes/: definición de rutas REST.

## Solución de problemas

### La app muestra `Network request failed`

Revisa lo siguiente:

- El backend está encendido.
- La IP de `Mobile/constants/api.ts` coincide con la IP actual de la PC.
- El teléfono y la PC están en la misma red.
- El puerto `3000` no está bloqueado por el firewall.

Prueba rápida en el navegador del teléfono:

```text
http://TU_IP_LOCAL:3000/
```

Si no responde, el problema es de conectividad de red.

### El QR expira o no registra

- Verifica que la clase esté abierta.
- Asegúrate de escanear el QR vigente.
- Revisa que el backend tenga correctamente configurado `QR_SECRET`.

### No se reflejan cambios recientes en Expo

Ejecuta:

```bash
npx expo start -c
```

## Estado actual del proyecto

El proyecto ya funciona como un MVP avanzado con persistencia real en MySQL, control de roles, QR dinámico, exportación a Excel y mecanismos básicos de endurecimiento de seguridad.

Todavía hay margen para evolucionarlo hacia una versión de producción con:

- JWT de sesión formal.
- recuperación de cuenta y cambio de dispositivo administrado desde UI.
- auditoría de accesos.
- geolocalización o validaciones por red local.
- pruebas automatizadas.
- despliegue cloud del backend y base de datos.

## Licencia

Este proyecto no define una licencia explícita por ahora. Si se va a distribuir o publicar, conviene agregar una licencia formal.