# 📚 Smart Attendance - Sistema de Asistencia QR (MVP)

Este proyecto es una aplicación móvil desarrollada con **React Native** y **Expo** para la gestión de asistencia en entornos educativos mediante códigos QR dinámicos.

---

## 🚀 Avances del Proyecto (Entregable Actual)

En esta fase, se ha implementado la base funcional del sistema siguiendo los principios de **Arquitectura Limpia (Clean Architecture)**:

### 👤 Gestión de Roles
* Pantalla de bienvenida que permite alternar entre la vista de **Profesor (Admin)** y **Estudiante**.

### 👨‍🏫 Módulo del Profesor (HU1)
* **Formulario de creación:** Registro de asignaturas con validación de campos obligatorios.
* **Listado dinámico:** Visualización de clases almacenadas en memoria mediante tarjetas.
* **Panel de control:** Vista de detalle por asignatura para gestión individual.

### 🎓 Módulo del Estudiante (HU3)
* **Interfaz de registro:** Formulario para ingreso de credenciales (**ID y Celular**).
* **Validación:** Espacio preparado para la lógica de registro de asistencia.

### 🔐 Seguridad y Control (HU2 & HU6)
* **Botón Flotante (FAB):** Acceso rápido para la generación del código QR.
* **Switch de Control:** Habilitación/deshabilitación de asistencia en tiempo real por parte del docente.
* **Tokens Dinámicos:** Lógica basada en `ID_Clase + Fecha` para evitar el fraude con capturas de pantalla de días anteriores.

---

## 🛠️ Tecnologías Utilizadas

* **React Native / Expo:** Framework principal para el desarrollo móvil.
* **TypeScript:** Para un tipado fuerte y reducción de errores en tiempo de ejecución.
* **Expo Router:** Para la navegación basada en archivos.
* **Hooks de React:** Uso de `useState` para manejar la navegación interna y la persistencia en memoria.

---

## 📦 Instalación y Ejecución

Para correr este proyecto en tu máquina local, sigue estos pasos:

1. **Instalar dependencias:**
   1. Terminal: `npm install`
2. Iniciar el servidor de Expo:
   1. Terminal: `npx expo start`
3. Visualización:
   1. Escanea el código QR con la app Expo Go en tu dispositivo móvil.
   2. Presiona `w` para abrir en el navegador.
   3. Presiona `r` para recargar si realizas cambios.

## 📂 Estructura del Código
1. /app: Contiene el orquestador principal (index.tsx).

2. /components: Componentes visuales separados por responsabilidad (ProfesorView, EstudianteView, DetalleClaseView).

3. /models: Definición de interfaces y "base de datos" temporal en memoria (clases.ts, estudiantes.ts).

## 🔮 Futuras Mejoras
1. [ ] Conexión a Base de Datos: Integración con Firebase o Supabase para persistencia real.

2. [ ] Escaneo de QR: Implementación de la cámara física usando expo-barcode-scanner.

3. [ ] Geolocalización: Validación por GPS para asegurar la presencia en el aula física.

4. [ ] Reportes: Exportación de asistencias en formato CSV o PDF.