[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('install', 'start', 'check', 'restore')]
    [string]$Action = 'check'
)

$ErrorActionPreference = 'Stop'
$SupportedBuilds = @(
    [pscustomobject]@{
        version = '26.707.9981.0'
        asarSha256 = 'E286D538971D7B4648692B244D80B0B1E9D227D29564275AD46F6653280D4094'
    },
    [pscustomobject]@{
        version = '26.715.2305.0'
        asarSha256 = 'D909924D6AE7A160AC78B88F01F9B16F079E6ABBE3F677427B752A411C6A3449'
    },
    [pscustomobject]@{
        version = '26.715.4045.0'
        asarSha256 = '4F81FE8CFADD0ECD1D55A46F4B101B1DB70ABBB372B63A0120218B1D868008A3'
    }
)
$SkillRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$Injector = Join-Path $SkillRoot 'payload\src\windows-injector.mjs'
$ShortcutPath = Join-Path ([Environment]::GetFolderPath('Programs')) 'Codex - Totoro Night.lnk'
$LegacyShortcutPath = Join-Path ([Environment]::GetFolderPath('Programs')) 'Codex - Wind Garden.lnk'
$RuntimePath = Join-Path $env:LOCALAPPDATA 'Codex Totoro Night\runtime.json'


function Get-CodexStatus {
    $package = Get-AppxPackage -Name 'OpenAI.Codex' -ErrorAction SilentlyContinue | Select-Object -First 1
    $node = Get-Command node -ErrorAction SilentlyContinue
    $appPath = if ($package) { Join-Path $package.InstallLocation 'app\ChatGPT.exe' } else { $null }
    $asarPath = if ($package) { Join-Path $package.InstallLocation 'app\resources\app.asar' } else { $null }
    $asarSha256 = if ($asarPath -and (Test-Path -LiteralPath $asarPath)) {
        (Get-FileHash -Algorithm SHA256 -LiteralPath $asarPath).Hash
    } else {
        $null
    }
    $assets = @(
        'payload\src\windows-injector.mjs',
        'payload\src\totoro-night.css',
        'payload\assets\totoro-night-full-canvas.webp',
        'payload\assets\totoro-night-sidebar-wash.webp',
        'payload\assets\totoro-pet-spritesheet.webp'
    )
    $missingAssets = @($assets | Where-Object { -not (Test-Path -LiteralPath (Join-Path $SkillRoot $_)) })
    $version = if ($package) { $package.Version.ToString() } else { $null }
    $supportedBuild = $SupportedBuilds | Where-Object { $_.version -eq $version } | Select-Object -First 1
    $supportedVersions = @($SupportedBuilds | ForEach-Object { $_.version })
    $runtime = if (Test-Path -LiteralPath $RuntimePath) {
        Get-Content -Raw -LiteralPath $RuntimePath | ConvertFrom-Json
    } else {
        $null
    }
    $runtimeActive = $false
    if ($runtime -and $runtime.port) {
        try {
            $null = Invoke-RestMethod -Uri "http://127.0.0.1:$($runtime.port)/json/version" -TimeoutSec 1
            $runtimeActive = $true
        } catch {
            $runtimeActive = $false
        }
    }

    [pscustomobject]@{
        compatible = [bool]($package -and $node -and $supportedBuild -and $asarSha256 -eq $supportedBuild.asarSha256 -and $missingAssets.Count -eq 0)
        packageInstalled = [bool]$package
        packageVersion = $version
        expectedVersion = if ($supportedBuild) { $supportedBuild.version } else { $supportedVersions -join ', ' }
        supportedVersions = $supportedVersions
        asarPath = $asarPath
        asarSha256 = $asarSha256
        expectedAsarSha256 = if ($supportedBuild) { $supportedBuild.asarSha256 } else { $null }
        nodePath = if ($node) { $node.Source } else { $null }
        missingAssets = $missingAssets
        shortcutPath = $ShortcutPath
        shortcutInstalled = Test-Path -LiteralPath $ShortcutPath
        themedSessionActive = $runtimeActive
        appPath = $appPath
    }
}


function Assert-Compatible($status) {
    if ($status.compatible) { return }
    $detail = @(
        "detected version=$($status.packageVersion)",
        "expected version=$($status.expectedVersion)",
        "detected ASAR=$($status.asarSha256)",
        "expected ASAR=$($status.expectedAsarSha256)",
        "missing assets=$($status.missingAssets -join ',')"
    ) -join '; '
    throw "Unsupported Codex Windows build or incomplete theme payload: $detail"
}


function Install-Shortcut($status) {
    Assert-Compatible $status
    Remove-Item -LiteralPath $LegacyShortcutPath -Force -ErrorAction SilentlyContinue
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($ShortcutPath)
    $shortcut.TargetPath = (Get-Command powershell.exe).Source
    $shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`" start"
    $shortcut.WorkingDirectory = $SkillRoot
    $shortcut.IconLocation = "$($status.appPath),0"
    $shortcut.Description = 'Launch Codex with the Totoro Night theme and pet'
    $shortcut.Save()
    Get-CodexStatus | ConvertTo-Json -Depth 4
}


function Start-ThemedCodex($status) {
    Assert-Compatible $status
    $active = @(Get-CimInstance Win32_Process | Where-Object {
        $_.Name -eq 'ChatGPT.exe' -and $_.ExecutablePath -eq $status.appPath
    })
    if ($active.Count -gt 0) {
        throw "Fully quit Codex before using the themed launcher; active PIDs: $($active.ProcessId -join ', ')"
    }

    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
    $listener.Start()
    $port = ([System.Net.IPEndPoint]$listener.LocalEndpoint).Port
    $listener.Stop()

    $injectorProcess = Start-Process -FilePath $status.nodePath -ArgumentList @(
        "`"$Injector`"", '--port', "$port"
    ) -WindowStyle Hidden -PassThru
    try {
        $appProcess = Start-Process -FilePath $status.appPath -ArgumentList @(
            '--remote-debugging-address=127.0.0.1',
            "--remote-debugging-port=$port"
        ) -PassThru
    } catch {
        Stop-Process -Id $injectorProcess.Id -Force -ErrorAction SilentlyContinue
        throw
    }

    $ready = $false
    for ($attempt = 0; $attempt -lt 30; $attempt += 1) {
        Start-Sleep -Milliseconds 500
        try {
            $null = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json/version" -TimeoutSec 1
            $ready = $true
            break
        } catch {}
    }
    if (-not $ready) {
        Stop-Process -Id $injectorProcess.Id -Force -ErrorAction SilentlyContinue
        throw 'Codex started, but its loopback debugging endpoint did not become ready; the official app was not modified.'
    }

    [pscustomobject]@{
        launched = $true
        appPid = $appProcess.Id
        injectorPid = $injectorProcess.Id
        port = $port
        officialPackageModified = $false
    } | ConvertTo-Json
}


function Restore-OfficialAppearance($status) {
    $helpers = @(Get-CimInstance Win32_Process | Where-Object {
        $_.Name -eq 'node.exe' -and $_.CommandLine -and $_.CommandLine.Contains($Injector)
    })
    foreach ($helper in $helpers) {
        Stop-Process -Id $helper.ProcessId -Force -ErrorAction SilentlyContinue
    }

    $removedLiveTheme = $false
    if ($status.themedSessionActive -and (Test-Path -LiteralPath $RuntimePath) -and $status.nodePath) {
        $runtime = Get-Content -Raw -LiteralPath $RuntimePath | ConvertFrom-Json
        & $status.nodePath $Injector --port $runtime.port --remove
        $removedLiveTheme = $LASTEXITCODE -eq 0
    }
    Remove-Item -LiteralPath $ShortcutPath, $LegacyShortcutPath -Force -ErrorAction SilentlyContinue

    [pscustomobject]@{
        restored = $true
        liveThemeRemoved = $removedLiveTheme
        shortcutRemoved = -not (Test-Path -LiteralPath $ShortcutPath)
        officialPackageModified = $false
    } | ConvertTo-Json
}


$status = Get-CodexStatus
switch ($Action) {
    'install' { Install-Shortcut $status }
    'start' { Start-ThemedCodex $status }
    'check' { $status | ConvertTo-Json -Depth 4 }
    'restore' { Restore-OfficialAppearance $status }
}
