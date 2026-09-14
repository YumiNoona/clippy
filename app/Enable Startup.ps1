$ErrorActionPreference = 'Stop'
$loopStartup = [Environment]::GetFolderPath('Startup')
$loopLinkPath = Join-Path $loopStartup 'Loop clipboard.lnk'
$loopShell = New-Object -ComObject WScript.Shell
$loopLink = $loopShell.CreateShortcut($loopLinkPath)
$loopLink.TargetPath = Join-Path $env:SystemRoot 'System32/WindowsPowerShell/v1.0/powershell.exe'
$loopLink.Arguments = '-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + (Join-Path $PSScriptRoot 'Start Loop.ps1') + '" -Background'
$loopLink.WorkingDirectory = $PSScriptRoot
$loopLink.WindowStyle = 7
$loopLink.Description = 'Start the Loop Wi-Fi clipboard quietly after Windows sign-in.'
$loopLink.Save()
Write-Host 'Loop will start quietly after you sign into Windows. Remove Loop clipboard from shell:startup to undo.'
