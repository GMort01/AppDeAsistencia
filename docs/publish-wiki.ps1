# Publica el contenido de docs/wiki/ en el repositorio Wiki de GitHub.
# Requisito: debe existir al menos una pagina en la Wiki (GitHub crea el repo .wiki.git).

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$WikiSource = Join-Path $RepoRoot "docs\wiki"
$WikiWork = Join-Path $RepoRoot "..\.wiki-work-AppDeAsistencia"
$WikiUrl = "https://github.com/GMort01/AppDeAsistencia.wiki.git"

if (-not (Test-Path $WikiSource)) {
    Write-Error "No se encuentra la carpeta: $WikiSource"
}

if (Test-Path $WikiWork) {
    Remove-Item -Recurse -Force $WikiWork
}

Write-Host "Clonando wiki..."
git clone $WikiUrl $WikiWork
if ($LASTEXITCODE -ne 0) {
    Write-Error "No se pudo clonar la wiki. Crea una pagina en GitHub > Wiki primero."
}

Copy-Item -Path (Join-Path $WikiSource "*") -Destination $WikiWork -Force

Set-Location $WikiWork
git add -A
$status = git status --porcelain
if ($status) {
    git commit -m "docs: actualizar documentacion (arquitectura, API, instalacion, modelo)"
}
Write-Host "Subiendo cambios..."
git push origin master
if ($LASTEXITCODE -ne 0) {
    Write-Host "Si falla por historiales distintos: git pull origin master --allow-unrelated-histories"
}

Set-Location (Split-Path -Parent $PSScriptRoot)
Write-Host "Listo."
