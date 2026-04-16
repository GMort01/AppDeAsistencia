# Documentación del proyecto

Esta carpeta contiene el material de **wiki** en formato Markdown, listo para publicar en GitHub.

## Documento Word (normas APA 7.ª ed.)

Se puede generar un informe en **Word** (`.docx`) con estructura de trabajo estudiantil APA: portada, resumen, cuerpo por secciones, tablas y referencias.

```bash
cd docs
npm install
npm run build:apa
```

El archivo generado es **`SmartAttendance-Documentacion-APA.docx`**. Completa en la portada institución, curso y docente entre corchetes.

Para volver a generar tras editar `generate-apa-word.mjs`, ejecuta de nuevo `npm run build:apa`.

## Contenido

| Archivo en `docs/wiki/` | Uso en GitHub Wiki |
|-------------------------|-------------------|
| `Home.md` | Página principal de la wiki |
| `Arquitectura.md` | Página **Arquitectura** |
| `Instalacion.md` | Página **Instalacion** |
| `API-REST.md` | Página **API REST** |
| `Modelo-de-datos.md` | Página **Modelo de datos** |

Los enlaces internos `[[Nombre]]` son la sintaxis de wiki de GitHub y conectan entre páginas una vez subidas.

## Publicar en la Wiki del repositorio

### Paso 1 (obligatorio): crear la wiki en GitHub

GitHub **no crea** el repositorio `https://github.com/GMort01/AppDeAsistencia.wiki.git` hasta que exista **al menos una página**.

1. Abre el repo → pestaña **Wiki**.
2. **Create the first page** (o **New page**).
3. Título: por ejemplo `Home`, contenido cualquiera (una línea), **Save page**.

Sin este paso, `git clone` y `git push` a la wiki devuelven **Repository not found**.

### Paso 2: subir la documentación

**Opción A — script (Windows, PowerShell)** desde la raíz del proyecto:

```powershell
.\docs\publish-wiki.ps1
```

(Tienes que tener sesión `git` con permiso de push en el repo; si pide credenciales, usa un [Personal Access Token](https://github.com/settings/tokens) como contraseña.)

**Opción B — manual**

```bash
git clone https://github.com/GMort01/AppDeAsistencia.wiki.git
cd AppDeAsistencia.wiki
# Copia aquí los .md desde docs/wiki/ del repo principal (mismos nombres)
git add .
git commit -m "Documentación: arquitectura, API, instalación y modelo de datos"
git push origin master
```

> La wiki de GitHub suele usar la rama `master`; si tu wiki usa `main`, ajusta el comando.

**Opción C:** crear cada página a mano en la web y pegar el contenido de cada archivo de `docs/wiki/`.
