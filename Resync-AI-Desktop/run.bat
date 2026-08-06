@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Resync AI — Desktop Setup
cd /d "%~dp0"

echo.
echo  ============================================================
echo   Resync AI Desktop Pack
echo   Launches canonical ..\resync-ai (not a duplicate copy)
echo  ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo  [ERROR] Node.js not found. Install LTS from https://nodejs.org
  pause
  exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
  echo  [ERROR] npm not found.
  pause
  exit /b 1
)

where python >nul 2>&1
if errorlevel 1 (
  set "HAS_PYTHON=0"
) else (
  set "HAS_PYTHON=1"
  set "PY=python"
)

echo  [OK] Node:
node -v
echo  [OK] npm:
npm -v

if "!HAS_PYTHON!"=="1" (
  echo  [OK] Python:
  %PY% --version
  if exist "%~dp0\06-scripts\check_env.py" %PY% "%~dp0\06-scripts\check_env.py"
)

set "APP=%~dp0..\resync-ai"
if not exist "%APP%\package.json" (
  echo  [ERROR] Expected Next app at %APP%
  echo  Keep Resync-AI-Desktop next to the resync-ai folder in the repo.
  pause
  exit /b 1
)

echo.
echo  Opening static preview + partner vault + slideshow ...
start "" "%~dp0\02-static-preview\index.html"
start "" "%~dp0\partners\index.html"
if exist "%~dp0\04-investor-slideshow\index.html" start "" "%~dp0\04-investor-slideshow\index.html"

echo.
echo  Installing deps + starting Next.js on http://localhost:3000 ...
cd /d "%APP%"
call npm install
if errorlevel 1 (
  echo  [ERROR] npm install failed.
  pause
  exit /b 1
)
call npm run dev
pause
