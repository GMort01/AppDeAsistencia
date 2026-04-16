# Documentación del proyecto

Esta carpeta contiene el material de **wiki** en formato Markdown, listo para publicar en GitHub.

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

1. En GitHub: **Wiki** → *Create the first page* (si está vacía), o clonar el repo de la wiki.
2. Clonar la wiki (sustituye la URL si usas SSH):

   ```bash
   git clone https://github.com/GMort01/AppDeAsistencia.wiki.git
   cd AppDeAsistencia.wiki
   ```

3. Copiar los `.md` desde `docs/wiki/` de este repositorio a la carpeta clonada (mismos nombres de archivo).
4. Commit y push:

   ```bash
   git add .
   git commit -m "Documentación: arquitectura, API, instalación y modelo de datos"
   git push origin master
   ```

   > Algunas wikis usan la rama `master`, otras `main`; GitHub muestra la rama activa en la pestaña Wiki.

Alternativa manual: crear cada página en la interfaz web de la wiki y pegar el contenido de cada archivo.
