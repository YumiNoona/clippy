$ErrorActionPreference = 'Stop'
$loopRoot = $PSScriptRoot
$loopPort = if ($env:PORT) { [int]$env:PORT } else { 4317 }
$loopTrayLock = [Threading.Mutex]::new($false, "Local\LoopTray-$loopPort")
$loopTrayOwned = $false
try { $loopTrayOwned = $loopTrayLock.WaitOne(0) } catch [Threading.AbandonedMutexException] { $loopTrayOwned = $true }
if (-not $loopTrayOwned) { $loopTrayLock.Dispose(); exit }
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type 'using System; using System.Runtime.InteropServices; public static class LoopNativeIcon { [DllImport("user32.dll")] public static extern bool DestroyIcon(IntPtr icon); }'
. (Join-Path $loopRoot 'Loop Status.ps1')
[Windows.Forms.Application]::EnableVisualStyles()
Add-Type -Path (Join-Path $loopRoot 'QuickClipboard.cs') -ReferencedAssemblies System.Windows.Forms,System.Drawing,System.Web.Extensions
$loopQuick = [LoopQuickWindow]::new($loopRoot,$loopPort)
$loopCapture = [LoopClipboardCapture]::new($loopRoot,$loopPort)
$loopHotkey = [LoopHotkey]::new()
$loopHotkey.add_Pressed({ $loopQuick.TogglePanel() })
function New-LoopDot([Drawing.Color]$Color) {
  $bitmap = [Drawing.Bitmap]::new(32,32)
  $graphics = [Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $brush = [Drawing.SolidBrush]::new($Color)
  $graphics.FillEllipse($brush,3,3,26,26)
  $graphics.DrawEllipse([Drawing.Pens]::White,3,3,26,26)
  $handle = $bitmap.GetHicon()
  $icon = [Drawing.Icon]::FromHandle($handle).Clone()
  [LoopNativeIcon]::DestroyIcon($handle) | Out-Null
  $brush.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
  return $icon
}
$loopGreen = New-LoopDot ([Drawing.Color]::FromArgb(61,220,132))
$loopRed = New-LoopDot ([Drawing.Color]::FromArgb(255,92,92))
$loopTray = [Windows.Forms.NotifyIcon]::new()
$loopMenu = [Windows.Forms.ContextMenuStrip]::new()
$loopMenu.Font = $loopQuick.Font
$loopQuickAction = $loopMenu.Items.Add('Quick clipboard     Ctrl+Alt+V')
$loopQuickAction.add_Click({ $loopQuick.TogglePanel() })
$loopCaptureAction = $loopMenu.Items.Add('Automatically capture copies')
$loopCaptureAction.CheckOnClick = $true
$loopCaptureAction.Checked = $true
$loopCaptureAction.add_CheckedChanged({ $loopCapture.Enabled = $loopCaptureAction.Checked })
$loopCaptureStatus = $loopMenu.Items.Add('Auto capture on'); $loopCaptureStatus.Enabled = $false
$loopMenu.add_Opening({ $loopCaptureStatus.Text = $loopCapture.Status })
if (-not $loopHotkey.Registered) { $loopQuickAction.Text = 'Quick clipboard (shortcut unavailable)' }
$loopLabel = $loopMenu.Items.Add('Checking Clippy...'); $loopLabel.Enabled = $false
$loopMenu.Items.Add([Windows.Forms.ToolStripSeparator]::new()) | Out-Null
$loopOpen = $loopMenu.Items.Add('Open Clippy')
$loopStart = $loopMenu.Items.Add('Start Clippy')
$loopStop = $loopMenu.Items.Add('Stop Clippy')
$loopHelp = $loopMenu.Items.Add('How to use')
$loopHide = $loopMenu.Items.Add('Hide tray icon (keep Clippy running)')
$loopTray.ContextMenuStrip = $loopMenu
$loopTray.Icon = $loopRed; $loopTray.Text = 'Clippy - checking'; $loopTray.Visible = $true
$script:loopLastStatus = ''
function Update-LoopTray {
  $status = Get-LoopStatus -Port $loopPort
  $loopTray.Icon = if ($status -eq 'Running') { $loopGreen } else { $loopRed }
  $loopTray.Text = "Clippy - $status"; $loopLabel.Text = "Clippy is $($status.ToLower())"
  $loopStart.Enabled = $status -eq 'Stopped'; $loopStop.Enabled = $status -eq 'Running'
  if ($script:loopLastStatus -ne $status) {
    $loopTray.BalloonTipTitle = "Loop - $status"
    $loopTray.BalloonTipText = if ($status -eq 'Running') { 'Ready for Wi-Fi sharing. Double-click the green tray icon to open Loop.' } elseif ($status -eq 'Stopped') { 'Loop is stopped. Right-click this icon and choose Start Loop.' } else { "Port $loopPort is in use. Open Loop for details." }
    $loopTray.ShowBalloonTip(4000); $script:loopLastStatus = $status
  }
}
function Open-LoopWindow {
  $argsText = '-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + (Join-Path $loopRoot 'Start Loop.ps1') + '" -NoTray'
  Start-Process powershell.exe -ArgumentList $argsText -WindowStyle Hidden
}
$loopOpen.add_Click({ Open-LoopWindow }); $loopTray.add_DoubleClick({ Open-LoopWindow })
$loopStart.add_Click({
  $argsText = '-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + (Join-Path $loopRoot 'Start Loop.ps1') + '" -Background -NoTray'
  Start-Process powershell.exe -ArgumentList $argsText -WindowStyle Hidden
})
$loopStop.add_Click({
  try {
    $key = (Get-Content -LiteralPath (Join-Path $loopRoot 'data/access-key.txt') -Raw).Trim()
    $request = [Net.HttpWebRequest]::Create("http://127.0.0.1:$loopPort/api/stop")
    $request.Proxy = $null; $request.Method = 'POST'; $request.ContentLength = 0; $request.Timeout = 3000
    $request.Headers.Add('Authorization','Bearer ' + $key)
    $response = $request.GetResponse(); $response.Dispose(); Update-LoopTray
  } catch { [Windows.Forms.MessageBox]::Show('Loop could not be stopped. Try again.', 'Loop') | Out-Null }
})
$loopHelp.add_Click({ Start-Process (Join-Path (Split-Path -Parent $loopRoot) 'How to use.html') })
$loopHide.add_Click({ [Windows.Forms.Application]::Exit() })
$loopTimer = [Windows.Forms.Timer]::new(); $loopTimer.Interval = 3000
$loopTimer.add_Tick({ Update-LoopTray })
try { Update-LoopTray; $loopTimer.Start(); [Windows.Forms.Application]::Run() }
finally {
  $loopCapture.Dispose(); $loopTimer.Stop(); $loopTimer.Dispose(); $loopTray.Visible = $false; $loopTray.Dispose()
  $loopMenu.Dispose(); $loopGreen.Dispose(); $loopRed.Dispose(); $loopHotkey.Dispose(); $loopQuick.Dispose()
  $loopTrayLock.ReleaseMutex(); $loopTrayLock.Dispose()
}
