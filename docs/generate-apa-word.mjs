/**
 * Genera SmartAttendance-Documentacion-APA.docx (normas APA 7.ª ed., formato trabajo estudiantil).
 * Ejecutar desde la carpeta docs: npm install && npm run build:apa
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  PageBreak,
  BorderStyle,
} from "docx";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Texto 12 pt (docx usa medios puntos) */
const PT12 = 24;

function t(text, bold = false, italics = false) {
  return new TextRun({ text, bold, italics, font: "Times New Roman", size: PT12 });
}

function p(children, opts = {}) {
  return new Paragraph({
    alignment: opts.align ?? AlignmentType.LEFT,
    spacing: { line: 480, after: 0, before: 0 },
    indent: opts.firstLine ? { firstLine: 720 } : undefined,
    children: typeof children === "string" ? [t(children)] : children,
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120, line: 480 },
    children: [t(text, true)],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 120, line: 480 },
    children: [t(text, true)],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100, line: 480 },
    children: [t(text, true)],
  });
}

function tableFromMatrix(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: rows.map(
      (cells) =>
        new TableRow({
          children: cells.map(
            (cell) =>
              new TableCell({
                width: { size: 100 / cells.length, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ spacing: { line: 276, after: 60 }, children: [t(String(cell))] })],
              })
          ),
        })
    ),
  });
}

const titlePage = [
  new Paragraph({ spacing: { before: 3600, after: 400 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 480, after: 0 },
    children: [new TextRun({ text: "Smart Attendance: documentación técnica del sistema de asistencia educativa con código QR", bold: true, font: "Times New Roman", size: PT12 })],
  }),
  new Paragraph({ spacing: { before: 4800, after: 200 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 480 },
    children: [t("Equipo de desarrollo AppDeAsistencia")],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 480 },
    children: [t("[Nombre de la institución — completar]")],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 480 },
    children: [t("[Código y nombre del curso — completar]")],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 480 },
    children: [t("[Nombre del docente — completar]")],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 480 },
    children: [t("15 de abril de 2026")],
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

const abstractSection = [
  h1("Resumen"),
  p([
    t("El presente documento reúne la documentación técnica del proyecto "),
    t("Smart Attendance", true, true),
    t(
      ", un sistema de control de asistencia educativa basado en códigos QR, con roles de profesor y estudiante. Se describe la arquitectura cliente-servidor (React Native/Expo y Node.js/Express), la instalación, los endpoints de la API REST, el modelo de datos y los flujos de autenticación y asistencia. El propósito es facilitar el mantenimiento del software y la incorporación de nuevos desarrolladores al repositorio público del proyecto."
    ),
  ], { firstLine: true }),
  p("Palabras clave: asistencia educativa, código QR, aplicación móvil, API REST, MySQL", { firstLine: true }),
  new Paragraph({ children: [new PageBreak()] }),
];

const introduccion = [
  h1("Introducción"),
  p([
    t("Smart Attendance es una aplicación para "),
    t("gestionar la asistencia", true),
    t(
      " en entornos educativos mediante códigos QR dinámicos. El cliente móvil se implementa con React Native y Expo; el backend expone una API REST construida con Node.js y Express, persistiendo información en MySQL. La documentación original se mantiene en la wiki del repositorio; este informe sintetiza ese contenido con formato académico (APA 7.ª edición)."
    ),
  ], { firstLine: true }),
  h2("Objetivos del producto"),
  p("• Permitir al profesor crear sesiones de clase, generar QR para asistencia y consultar o exportar listas de asistentes.", { firstLine: true }),
  p("• Permitir al estudiante registrarse, iniciar sesión (con vínculo a dispositivo) y registrar asistencia escaneando el QR.", { firstLine: true }),
  p("• Centralizar los datos en una base de datos accesible mediante la API.", { firstLine: true }),
  new Paragraph({ children: [new PageBreak()] }),
];

const arquitectura = [
  h1("Arquitectura del sistema"),
  h2("Vista por capas"),
  p("La Figura 1 describe la separación entre cliente móvil o web (Expo), la red local, el servidor Express con rutas bajo /api y la capa de persistencia MySQL.", { firstLine: true }),
  p([
    t("Figura 1", true),
    t(". Arquitectura por capas del sistema Smart Attendance."),
  ]),
  p(
    "Nota. Los diagramas originales en el repositorio están en sintaxis Mermaid; aquí se ofrece una descripción textual equivalente para compatibilidad con el procesador de textos.",
    { firstLine: true }
  ),
  p(
    "Flujo: las pantallas y componentes de la app utilizan constants/api.ts para resolver la URL base y realizar peticiones HTTP. El tráfico JSON llega a Express, que enruta hacia /api/auth, /api/clases y /api/asistencia. Los controladores ejecutan la lógica de negocio y acceden a la base mediante el conector mysql2.",
    { firstLine: true }
  ),
  h2("Actores y sistemas"),
  p("Profesores y estudiantes interactúan con la aplicación Expo. La aplicación se comunica por HTTP JSON con la API en el puerto 3000; el servidor utiliza mysql2 para MySQL.", { firstLine: true }),
  h2("Flujo de autenticación"),
  p(
    "La aplicación móvil envía POST a /api/auth (login de profesor o estudiante). El servidor consulta usuarios por correo institucional, valida la contraseña con bcrypt y, en el caso estudiante, puede vincular o verificar el dispositivo. La respuesta incluye id, nombre y rol del usuario.",
    { firstLine: true }
  ),
  h2("Flujo de asistencia por QR"),
  p(
    "El profesor crea o gestiona la clase y obtiene un token QR según la implementación. El estudiante envía POST a /api/asistencia/registrar con identificadores de clase, estudiante y validación de dispositivo o token. El servidor valida y registra la asistencia.",
    { firstLine: true }
  ),
  h2("Estructura de carpetas"),
  tableFromMatrix([
    ["Ruta", "Rol"],
    ["Mobile/app/", "Entrada Expo Router (selección de rol)"],
    ["Mobile/components/", "Vistas de login, profesor, estudiante, detalle, registro"],
    ["Mobile/constants/api.ts", "Resolución de API_URL y postJson"],
    ["Mobile/utils/", "IDs de dispositivo, QR, exportación según rama"],
    ["server/src/index.js", "Express, conexión a BD, rutas"],
    ["server/src/routes/", "Definición REST"],
    ["server/src/controllers/", "Lógica de negocio"],
  ]),
  h2("Decisiones de diseño"),
  p("1. Prefijo /api para separar el endpoint de salud /. 2. CORS habilitado para desarrollo con Expo. 3. Helmet para cabeceras de seguridad. 4. Vínculo de dispositivo en login de estudiante. 5. Prioridad de URL del API: variable EXPO_PUBLIC_API_URL, localhost en web, hostUri de Metro, 10.0.2.2 en emulador Android.", { firstLine: true }),
  new Paragraph({ children: [new PageBreak()] }),
];

const instalacion = [
  h1("Instalación y configuración"),
  h2("Requisitos"),
  p("Node.js LTS (recomendado 20+), npm, MySQL según database_schema.sql, Expo CLI o npx expo, y opcionalmente Expo Go en el dispositivo.", { firstLine: true }),
  h2("Backend (carpeta server)"),
  p("Ejecutar npm install en server/. Configurar server/.env sin subir credenciales al repositorio.", { firstLine: true }),
  tableFromMatrix([
    ["Variable", "Descripción"],
    ["DB_HOST", "Host de MySQL"],
    ["DB_USER", "Usuario"],
    ["DB_PASSWORD", "Contraseña"],
    ["DB_NAME", "Nombre de la base (ej. smartattendance)"],
    ["DB_PORT", "Puerto (ej. 3306)"],
    ["PORT", "Puerto del servidor HTTP (ej. 3000)"],
    ["QR_SECRET", "Secreto para firmar tokens QR"],
  ]),
  p("Crear la base de datos y ejecutar el script SQL. Arrancar con npm run dev o npm start. Verificar http://localhost:3000/.", { firstLine: true }),
  h2("Aplicación móvil (carpeta Mobile)"),
  p("npm install y npx expo start -c. Si falla la conexión, definir EXPO_PUBLIC_API_URL con la IPv4 del equipo que ejecuta el backend y reiniciar Metro.", { firstLine: true }),
  p("El teléfono debe estar en la misma red Wi-Fi que el servidor, salvo VPN o despliegue remoto. Abrir el firewall para el puerto 3000 si es necesario.", { firstLine: true }),
  new Paragraph({ children: [new PageBreak()] }),
];

const apiRest = [
  h1("API REST"),
  p("Base URL típica en desarrollo: http://localhost:3000/api. Prefijos: /api/auth, /api/clases, /api/asistencia.", { firstLine: true }),
  h2("Autenticación — /api/auth"),
  tableFromMatrix([
    ["Método", "Ruta", "Descripción"],
    ["POST", "/register", "Registro"],
    ["POST", "/login/profesor", "Login profesor"],
    ["POST", "/login/estudiante", "Login estudiante (dispositivo)"],
    ["POST", "/login-profesor", "Alias"],
    ["POST", "/login-estudiante", "Alias"],
  ]),
  p('Ejemplo de cuerpo JSON para login estudiante: correo_institucional, password, deviceId, deviceIdSecundario (opcional).', { firstLine: true }),
  h2("Clases — /api/clases"),
  tableFromMatrix([
    ["Método", "Ruta", "Descripción"],
    ["POST", "/", "Crear clase"],
    ["GET", "/profesor/:profesorId", "Listar por profesor"],
    ["PATCH", "/:claseId/estado", "Estado de asistencia"],
    ["DELETE", "/:claseId", "Eliminar clase"],
    ["DELETE", "/dispositivo/:estudianteId", "Desvincular dispositivo"],
  ]),
  h2("Asistencia — /api/asistencia"),
  tableFromMatrix([
    ["Método", "Ruta", "Descripción"],
    ["POST", "/registrar", "Registrar asistencia"],
    ["GET", "/qr-token/:claseId", "Token QR"],
    ["GET", "/estudiante/:estudianteId/clases", "Clases del estudiante"],
    ["GET", "/clase/:claseId", "Asistencias por clase"],
    ["GET", "/clase/:claseId/hoy", "Asistencias del día"],
  ]),
  h2("Salud del servidor"),
  tableFromMatrix([
    ["Método", "Ruta", "Descripción"],
    ["GET", "/", "Comprobación de disponibilidad"],
  ]),
  new Paragraph({ children: [new PageBreak()] }),
];

const modeloDatos = [
  h1("Modelo de datos"),
  p(
    "El esquema base está en database_schema.sql; migraciones al inicio del servidor pueden añadir columnas (clases), la tabla tokens_qr_usados y dispositivo_vinculado en usuarios.",
    { firstLine: true }
  ),
  h2("Entidades principales"),
  p(
    "USUARIOS: id, nombre completo, correo institucional, hash de contraseña, rol, id universitario, dispositivo vinculado. CLASES: id, nombre, profesor_id, código de acceso, horarios, fecha, asistencia abierta. ASISTENCIAS: estudiante_id, clase_id, fecha_hora. Relaciones: profesor posee clases; estudiante genera registros de asistencia por clase.",
    { firstLine: true }
  ),
  h2("Tabla auxiliar"),
  p("tokens_qr_usados almacena nonces para evitar reuso de tokens QR, con limpieza periódica.", { firstLine: true }),
  new Paragraph({ children: [new PageBreak()] }),
];

const referencias = [
  h1("Referencias"),
  p(
    [
      t("GMort01. (2026). "),
      t("AppDeAsistencia", false, true),
      t(" [Código fuente]. GitHub. "),
      t("https://github.com/GMort01/AppDeAsistencia", false, false),
    ],
    { firstLine: true }
  ),
  p(
    [
      t("American Psychological Association. (2020). "),
      t("Publication manual of the American Psychological Association", false, true),
      t(" (7th ed.). American Psychological Association."),
    ],
    { firstLine: true }
  ),
  p(
    [
      t("Expo. (s. f.). "),
      t("Expo documentation", false, true),
      t(". "),
      t("https://docs.expo.dev", false, false),
    ],
    { firstLine: true }
  ),
  p(
    [
      t("OpenJS Foundation. (s. f.). "),
      t("Node.js", false, true),
      t(". "),
      t("https://nodejs.org", false, false),
    ],
    { firstLine: true }
  ),
];

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Times New Roman",
          size: PT12,
        },
        paragraph: {
          spacing: { line: 480 },
        },
      },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: PT12, bold: true, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 120, line: 480 }, alignment: AlignmentType.CENTER },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: PT12, bold: true, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 120, line: 480 }, alignment: AlignmentType.LEFT },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: PT12, bold: true, font: "Times New Roman", italics: false },
        paragraph: { spacing: { before: 200, after: 100, line: 480 } },
      },
    ],
  },
  sections: [
    {
      properties: {},
      children: [
        ...titlePage,
        ...abstractSection,
        ...introduccion,
        ...arquitectura,
        ...instalacion,
        ...apiRest,
        ...modeloDatos,
        ...referencias,
      ],
    },
  ],
});

const outPath = path.join(__dirname, "SmartAttendance-Documentacion-APA.docx");
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buffer);
console.log("Generado:", outPath);
