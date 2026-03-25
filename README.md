📚 Smart Attendance - Sistema de Asistencia QR (MVP)
Este proyecto es una aplicación móvil desarrollada con React Native y Expo para la gestión de asistencia en entornos educativos mediante códigos QR dinámicos.

🚀 Avances del Proyecto (Entregable Actual)
En esta fase, se ha implementado la base funcional del sistema siguiendo los principios de Arquitectura Limpia (Clean Architecture):

Gestión de Roles: Pantalla de bienvenida que permite alternar entre la vista de Profesor (Admin) y Estudiante.

Módulo del Profesor (HU1): * Formulario de creación de asignaturas con validación de campos.

Listado dinámico de clases almacenadas en memoria.

Panel de control por asignatura (Detalle de Clase).

Módulo del Estudiante (HU3): * Interfaz para ingreso de credenciales (ID y Celular).

Espacio para validación de registros.

Seguridad y Control (HU2 & HU6):

Implementación de un Botón Flotante (FAB) para la generación de QR.

Switch de habilitación/deshabilitación de asistencia en tiempo real.

Lógica de tokens dinámicos basada en ID_Clase + Fecha para evitar fraude con fotos de días anteriores.

🛠️ Tecnologías Utilizadas
React Native / Expo: Framework principal para el desarrollo móvil.

TypeScript: Para un tipado fuerte y reducción de errores en tiempo de ejecución.

Expo Router: Para la navegación basada en archivos.

Estado de React: Uso de useState para manejar la navegación interna y la persistencia en memoria.

📦 Instalación y Ejecución
Para correr este proyecto en tu máquina local, sigue estos pasos:
1. Instalar dependencias:
   'npm install'
2. Iniciar el servidor de Expo:
   'npx expo start'
3. Visualización:
   1. Escanea el código QR con la app Expo Go en tu dispositivo móvil.
   2. Presiona w para abrir en el navegador.
   3. Presiona r para recargar si realizas cambios.

📂 Estructura del Código
1. /app: Contiene el orquestador principal (index.tsx).

2. /components: Componentes visuales separados por responsabilidad (ProfesorView, EstudianteView, DetalleClaseView).

3. /models: Definición de interfaces y "base de datos" temporal en memoria (clases.ts, estudiantes.ts).

## 🚀 Futuras Mejoras
- [ ] Conexión a Base de Datos (Firebase/Supabase).
- [ ] Escaneo de QR mediante cámara física (`expo-barcode-scanner`).
- [ ] Validación por Geolocalización para asegurar presencia en el aula.
- [ ] Exportación de reportes de asistencia en formato CSV/PDF.