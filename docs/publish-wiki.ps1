# Publica el contenido de docs/wiki/ en el repositorio Wiki de GitHub.
# Requisito obligatorio: en GitHub ya debe existir al menos UNA página en la Wiki
# (pestaña Wiki → Create the first page → guardar). Sin eso, el clone/push falla con "Repository not found".

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$WikiSource = Join-Path $RepoRoot "docs\wiki"
$WikiWork = Join-Path $RepoRoot "..\.wiki-work-AppDeAsistencia"

if (-not (Test-Path $WikiSource)) {
    Write-Error "No se encuentra la carpeta: $WikiSource"
}

if (Test-Path $WikiWork) {
    Remove-Item -Recurse -Force $WikiWork
}
New-Item -ItemType Directory -Path $WikiWork | Out-Null
Copy-Item -Path (Join-Path $WikiSource "*") -Destination $WikiWork -Force

Set-Location $WikiWork
if (-not (Test-Path ".git")) {
    git init
    git add .
    git commit -m "docs: documentacion wiki (arquitectura, API, instalacion)"
}
git branch -M master 2>$null
git remote remove origin 2>$null
git remote add origin https://github.com/GMort01/AppDeAsistencia.wiki.git
Write-Host "Intentando push a la wiki..."
git push -u origin master

Write-Host "Listo. Si falla con 'Repository not found', crea primero una pagina en GitHub > Wiki y vuelve a ejecutar este script."
Set-Location $RepoRoot
