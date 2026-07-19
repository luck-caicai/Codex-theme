[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot
$Source = Join-Path $RepoRoot 'skill\codex-totoro-theme'
$Output = Join-Path $RepoRoot 'output\codex-totoro-theme.skill'
$TempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('codex-totoro-package-' + [guid]::NewGuid().ToString('N'))
$ZipPath = [System.IO.Path]::ChangeExtension($Output, '.zip')

if (-not (Test-Path -LiteralPath (Join-Path $Source 'SKILL.md'))) {
    throw 'Totoro skill source is incomplete.'
}

try {
    $null = New-Item -ItemType Directory -Path $TempRoot -Force
    $null = New-Item -ItemType Directory -Path (Split-Path -Parent $Output) -Force
    Copy-Item -LiteralPath $Source -Destination (Join-Path $TempRoot 'codex-totoro-theme') -Recurse
    Remove-Item -LiteralPath $ZipPath, $Output -Force -ErrorAction SilentlyContinue
    Compress-Archive -LiteralPath (Join-Path $TempRoot 'codex-totoro-theme') -DestinationPath $ZipPath -CompressionLevel Optimal
    Move-Item -LiteralPath $ZipPath -Destination $Output

    [pscustomobject]@{
        packaged = $true
        path = $Output
        bytes = (Get-Item -LiteralPath $Output).Length
        sha256 = (Get-FileHash -LiteralPath $Output -Algorithm SHA256).Hash
    } | ConvertTo-Json
} finally {
    Remove-Item -LiteralPath $TempRoot -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $ZipPath -Force -ErrorAction SilentlyContinue
}
