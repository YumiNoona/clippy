param([switch]$Background, [switch]$NoTray)
$ErrorActionPreference = 'Stop'
$loopRoot = $PSScriptRoot
. (Join-Path $loopRoot 'Loop Status.ps1')
$loopPort = if ($env:PORT) { [int]$env:PORT } else { 4317 }
$loopUrl = "http://localhost:$loopPort"
$loopLogDir = Join-Path $loopRoot 'data/logs'
New-Item -ItemType Directory -Path $loopLogDir -Force | Out-Null
$loopLaunchLock = [Threading.Mutex]::new($false, "Local\LoopLauncher-$loopPort")
$loopOwnLock = $false
try {
  try { $loopOwnLock = $loopLaunchLock.WaitOne(15000) } catch [Threading.AbandonedMutexException] { $loopOwnLock = $true }
  if (-not $loopOwnLock) { throw 'Loop is already starting. Please try again in a moment.' }
  $loopStatus = Get-LoopStatus -Port $loopPort
  if ($loopStatus -eq 'Port busy') { throw "Port $loopPort is occupied by another app or an older Loop process. Close that process and open Loop again." }
  if ($loopStatus -ne 'Running') {
    $loopBundledNode = Join-Path $loopRoot 'runtime/node.exe'
    $loopInstalledNode = Get-Command node -ErrorAction SilentlyContinue
    $loopNode = if ($loopInstalledNode) { $loopInstalledNode.Source } elseif (Test-Path -LiteralPath $loopBundledNode) { $loopBundledNode } else { throw 'Loop runtime is missing. Keep the app folder intact.' }
    $loopChild = Start-Process -FilePath $loopNode -ArgumentList @('server.mjs') -WorkingDirectory $loopRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $loopLogDir 'server.log') -RedirectStandardError (Join-Path $loopLogDir 'error.log')
    $loopReady = $false
    for ($loopAttempt = 0; $loopAttempt -lt 30; $loopAttempt++) {
      Start-Sleep -Milliseconds 250
      if ((Get-LoopStatus -Port $loopPort) -eq 'Running') { $loopReady = $true; break }
      if ($loopChild.HasExited) { break }
    }
    if (-not $loopReady) {
      $loopReason = (Get-Content -LiteralPath (Join-Path $loopLogDir 'error.log') -Tail 5 -ErrorAction SilentlyContinue) -join "`n"
      if (-not $loopReason) { $loopReason = 'The local server did not become ready. Check antivirus or firewall restrictions.' }
      throw "Loop could not start.`n`n$loopReason"
    }
  }
  if (-not $NoTray) {
    $loopTrayArgs = '-NoProfile -STA -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + (Join-Path $loopRoot 'Loop Tray.ps1') + '"'
    Start-Process powershell.exe -ArgumentList $loopTrayArgs -WindowStyle Hidden
  }
  if (-not $Background) { Start-Process $loopUrl }
} catch {
  $_.Exception.Message | Set-Content -LiteralPath (Join-Path $loopLogDir 'launcher-error.log')
  if (-not $Background) {
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, 'Loop - not started', 'OK', 'Error') | Out-Null
  }
  exit 1
} finally {
  if ($loopOwnLock) { $loopLaunchLock.ReleaseMutex() }
  $loopLaunchLock.Dispose()
}
