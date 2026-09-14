Option Explicit
Dim files, shell, folder, launcher, command
Set files = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
folder = files.GetParentFolderName(WScript.ScriptFullName)
launcher = files.BuildPath(folder, "app\Start Loop.ps1")
If Not files.FileExists(launcher) Then
  MsgBox "Keep Open Loop and the app folder together, then try again.", 48, "Loop"
  WScript.Quit 1
End If
command = "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File " & Chr(34) & launcher & Chr(34)
shell.Run command, 0, False
