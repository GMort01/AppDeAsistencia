# 📚 Smart Attendance - Sistema de Asistencia QR (MVP)

Este proyecto es una aplicación móvil desarrollada con **React Native** y **Expo** para la gestión de asistencia en entornos educativos mediante códigos QR dinámicos.

---

## 🚀 Avances del Proyecto (Entregable Actual)

En esta fase, se ha implementado la base funcional del sistema en ambos módulos (Profesor y Estudiante) con una base de datos temporal en memoria:

### 👤 Gestión de Roles
* Pantalla de bienvenida que permite alternar entre la vista de **Profesor (Admin)** y **Estudiante**.

### 👨‍🏫 Módulo del Profesor (HU1 & HU2)
* **Formulario de creación:** Registro de asignaturas con validación de campos obligatorios.
* **Listado dinámico:** Visualización de clases almacenadas en memoria mediante tarjetas.
* **Panel de control:** Vista de detalle por asignatura con capacidad de eliminar clases.
* **Generación de QR:** Creación de un código QR dinámico que contiene la información de la sesión (`ID_Clase + Fecha`).
* **Switch de Control:** Habilitación/deshabilitación de asistencia en tiempo real.

### 🎓 Módulo del Estudiante (HU3)
* **Interfaz de Identificación:** Formulario previo para ingreso de credenciales (**Nombre y Matrícula/ID**).
* **Escáner QR Funcional:** Integración de la cámara del dispositivo (`expo-camera`) para leer el código generado por el profesor.
* **Lógica de Registro:** El sistema extrae el ID del QR, busca la clase en memoria y añade al estudiante automáticamente a la lista de asistentes evitando duplicados.
* **Vista de Lectura:** Pantalla de confirmación donde el estudiante puede ver los detalles de la clase a la que ingresó y la lista de todos los compañeros presentes (resaltando su propio nombre).

---

## 🛠️ Tecnologías Utilizadas

* **React Native / Expo:** Framework principal para el desarrollo móvil.
* **TypeScript:** Para un tipado fuerte y reducción de errores en tiempo de ejecución.
* **Expo Camera:** Librería nativa para la habilitación del hardware de la cámara y lectura de códigos.
* **Hooks de React:** Uso de `useState` para manejar estados visuales, formularios y la persistencia en memoria.

---

## 📦 Instalación y Ejecución

Para correr este proyecto en tu máquina local, sigue estos pasos:

1. **Instalar dependencias:**
   `Terminal`
   npm install

2. **Instalar dependencias de cámara (si es necesario):**
   `Terminal`
   npx expo install expo-camera

3. **Iniciar el servidor de Expo:**
   `Terminal`
   npx expo start -c

4. **Visualización:**
   1. Escanea el código QR de la terminal con la app Expo Go en tu dispositivo físico (Recomendado para probar la cámara).

   2. Presiona `w` para abrir en el navegador web (Modo pruebas UI).

   3. Presiona `r` para recargar la app si realizas cambios.

## 📂 Estructura del Código
1. /app: Contiene el orquestador principal (index.tsx).

2. /components: Componentes visuales separados por responsabilidad (ProfesorView, EstudianteView, DetalleClaseView).

3. /models: Definición de interfaces de TypeScript y lógica de la "base de datos" temporal en memoria (clases.ts).

## 🔮 Futuras Mejoras (Próximos Pasos)
1. [ ] Conexión a Base de Datos (Firebase): Migrar la persistencia de memoria RAM temporal a Cloud Firestore para permitir que múltiples dispositivos se sincronicen en tiempo real. (Fase 3)

2. [ ] Autenticación de Usuarios: Login formal para no tener que escribir el nombre manualmente cada vez.

3. [ ] Geolocalización: Validación por GPS para asegurar la presencia en el aula física.

4. [ ] Reportes: Exportación de asistencias a formato CSV o Excel.

---