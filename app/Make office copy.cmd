@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Make office copy.ps1"
if errorlevel 1 pause
