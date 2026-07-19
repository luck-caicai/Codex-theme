[CmdletBinding()]
param(
    [string]$InstallRoot = (Join-Path $HOME '.codex\skills'),
    [switch]$SkipLauncher
)

$ErrorActionPreference = 'Stop'
if ($env:OS -ne 'Windows_NT') {
    throw 'This installer supports Windows only.'
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
$Source = Join-Path $RepoRoot 'skill\codex-totoro-theme'
$SourceLauncher = Join-Path $Source 'scripts\windows-theme.ps1'
$required = @(
    'SKILL.md',
    'agents\openai.yaml',
    'scripts\windows-theme.ps1',
    'payload\src\windows-injector.mjs',
    'payload\src\totoro-night.css',
    'payload\assets\totoro-night-full-canvas.webp',
    'payload\assets\totoro-night-sidebar-wash.webp',
    'payload\assets\totoro-pet-spritesheet.webp'
)

foreach ($relative in $required) {
    if (-not (Test-Path -LiteralPath (Join-Path $Source $relative))) {
        throw "Incomplete Totoro skill source: missing $relative"
    }
}

if (-not $SkipLauncher) {
    $preflight = (& $SourceLauncher check | Out-String) | ConvertFrom-Json
    if (-not $preflight.compatible) {
        throw "This Codex build is not supported. Detected version=$($preflight.packageVersion), ASAR=$($preflight.asarSha256); expected version=$($preflight.expectedVersion), ASAR=$($preflight.expectedAsarSha256)."
    }
}

$null = New-Item -ItemType Directory -Path $InstallRoot -Force
$InstallRoot = (Resolve-Path -LiteralPath $InstallRoot).Path
$Destination = Join-Path $InstallRoot 'codex-totoro-theme'
$Staging = Join-Path $InstallRoot ('.codex-totoro-theme-install-' + [guid]::NewGuid().ToString('N'))
$Backup = Join-Path $InstallRoot ('.codex-totoro-theme-backup-' + [guid]::NewGuid().ToString('N'))
$HadExisting = Test-Path -LiteralPath $Destination

try {
    Copy-Item -LiteralPath $Source -Destination $Staging -Recurse
    foreach ($relative in $required) {
        if (-not (Test-Path -LiteralPath (Join-Path $Staging $relative))) {
            throw "Staged Totoro skill is incomplete: missing $relative"
        }
    }

    if ($HadExisting) {
        Move-Item -LiteralPath $Destination -Destination $Backup
    }
    Move-Item -LiteralPath $Staging -Destination $Destination
    if ($HadExisting) {
        Remove-Item -LiteralPath $Backup -Recurse -Force
    }
} catch {
    Remove-Item -LiteralPath $Staging -Recurse -Force -ErrorAction SilentlyContinue
    if ((-not (Test-Path -LiteralPath $Destination)) -and (Test-Path -LiteralPath $Backup)) {
        Move-Item -LiteralPath $Backup -Destination $Destination
    }
    throw
}

if ($SkipLauncher) {
    [pscustomobject]@{
        installed = $true
        skillPath = $Destination
        launcherInstalled = $false
    } | ConvertTo-Json
    exit 0
}

$launcher = (& (Join-Path $Destination 'scripts\windows-theme.ps1') install | Out-String) | ConvertFrom-Json
[pscustomobject]@{
    installed = $true
    skillPath = $Destination
    launcherInstalled = $launcher.shortcutInstalled
    shortcutPath = $launcher.shortcutPath
    compatible = $launcher.compatible
    officialPackageModified = $false
} | ConvertTo-Json
