param([switch]$Elevated)
$ErrorActionPreference = 'Stop'
$loopAdmin = [Security.Principal.WindowsPrincipal]::new([Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $loopAdmin) {
  if ($Elevated) { throw 'Administrator access is required to allow incoming Wi-Fi connections.' }
  $loopArgs = '-NoProfile -ExecutionPolicy Bypass -File "' + $PSCommandPath + '" -Elevated'
  Start-Process powershell.exe -Verb RunAs -WindowStyle Hidden -ArgumentList $loopArgs
  exit
}
try {
  $loopBundledNode = Join-Path $PSScriptRoot 'runtime/node.exe'
  $loopInstalledNode = Get-Command node -ErrorAction SilentlyContinue
  $loopNode = if ($loopInstalledNode) { $loopInstalledNode.Source } elseif (Test-Path -LiteralPath $loopBundledNode) { $loopBundledNode } else { throw 'Loop runtime is missing.' }
  $loopLogDir = Join-Path $PSScriptRoot 'data/logs'
  New-Item -ItemType Directory -Path $loopLogDir -Force | Out-Null
  $loopRule = 'Loop-Clipboard-Local-WiFi-4317'
  $loopExisting = Get-NetFirewallRule -Name $loopRule -ErrorAction SilentlyContinue
  if ($loopExisting) { Remove-NetFirewallRule -Name $loopRule }
  New-NetFirewallRule -Name $loopRule -DisplayName 'Loop clipboard - local Wi-Fi and hotspot' -Description 'Allow Loop on TCP 4317 from the local subnet only.' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4317 -RemoteAddress LocalSubnet -Profile Private,Public -Program $loopNode | Out-Null
  'Wi-Fi connections enabled on TCP 4317 from the local subnet.' | Set-Content -LiteralPath (Join-Path $loopLogDir 'wifi-setup.log')
} catch {
  if ($loopLogDir) { $_.Exception.Message | Set-Content -LiteralPath (Join-Path $loopLogDir 'wifi-setup.log') }
  throw
}
