@echo off
setlocal
cd /d "%~dp0"
echo Opening clean static website preview (no Node required)...
start "" "%~dp0\02-static-preview\index.html"
