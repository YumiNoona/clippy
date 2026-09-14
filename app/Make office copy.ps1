$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$loopProject = Split-Path -Parent $PSScriptRoot
$loopTempParent = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
$loopStage = Join-Path $loopTempParent ('loop-export-' + [Guid]::NewGuid().ToString('N'))
$loopDownloads = Join-Path ([Environment]::GetFolderPath('UserProfile')) 'Downloads'
New-Item -ItemType Directory -Force -Path $loopDownloads | Out-Null
$loopZip = Join-Path $loopDownloads ('Loop-Windows-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.zip')
try {
  $loopPayload = Join-Path $loopStage 'Loop'
  $loopAppCopy = Join-Path $loopPayload 'app'
  New-Item -ItemType Directory -Path $loopAppCopy -Force | Out-Null
  foreach ($loopName in @('Open Loop.vbs','How to use.html')) {
    Copy-Item -LiteralPath (Join-Path $loopProject $loopName) -Destination $loopPayload
  }
  $loopFiles = @('server.mjs','sync-model.mjs','ui.css','QuickClipboard.cs','app.js','clipsync.html','sw.js','manifest.webmanifest','icon.svg','icon.ico','icon-192.png','icon-512.png','apple-touch-icon.png','package.json','package-lock.json','DEVELOPMENT.md','Start Loop.ps1','Loop Status.ps1','Loop Tray.ps1','Enable Wi-Fi.cmd','Enable Wi-Fi.ps1','Enable Startup.cmd','Enable Startup.ps1','Make office copy.cmd','Make office copy.ps1')
  foreach ($loopName in $loopFiles) { Copy-Item -LiteralPath (Join-Path $PSScriptRoot $loopName) -Destination $loopAppCopy }
  foreach ($loopName in @('node_modules','runtime','fonts')) { Copy-Item -LiteralPath (Join-Path $PSScriptRoot $loopName) -Destination (Join-Path $loopAppCopy $loopName) -Recurse }
  [IO.Compression.ZipFile]::CreateFromDirectory($loopStage, $loopZip, [IO.Compression.CompressionLevel]::Optimal, $false)
  Write-Host "Office copy ready: $loopZip"
} finally {
  $loopResolvedStage = [IO.Path]::GetFullPath($loopStage)
  if (-not $loopResolvedStage.StartsWith($loopTempParent, [StringComparison]::OrdinalIgnoreCase) -or (Split-Path -Leaf $loopResolvedStage) -notmatch '^loop-export-[a-f0-9]{32}$') { throw 'Refusing cleanup outside the temporary export folder.' }
  if (Test-Path -LiteralPath $loopResolvedStage) { Remove-Item -LiteralPath $loopResolvedStage -Recurse -Force }
}

