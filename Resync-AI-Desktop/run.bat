@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Resync AI — Desktop Setup
cd /d "%~dp0"

echo.
echo  ============================================================
echo   Resync AI Desktop Pack
echo   Checks Node.js + npm + Python, installs deps, starts dev
echo  ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo  [ERROR] Node.js not found. Install LTS from https://nodejs.org
  echo  Then re-run this file.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo  [ERROR] npm not found. Reinstall Node.js LTS including npm.
  pause
  exit /b 1
)

where python >nul 2>&1
if errorlevel 1 (
  where py >nul 2>&1
  if errorlevel 1 (
    echo  [WARN] Python not found. Optional for helper scripts — continuing.
    set "HAS_PYTHON=0"
  ) else (
    set "HAS_PYTHON=1"
    set "PY=py -3"
  )
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
)

if "!HAS_PYTHON!"=="1" (
  echo.
  echo  [0/4] Python environment check ...
  %PY% "%~dp0\06-scripts\check_env.py"
)

echo.
echo  [1/4] Installing npm dependencies in 01-website ...
cd /d "%~dp0\01-website"
if not exist package.json (
  echo  [ERROR] 01-website\package.json missing.
  pause
  exit /b 1
)
call npm install
if errorlevel 1 (
  echo  [ERROR] npm install failed.
  pause
  exit /b 1
)

echo.
echo  [2/4] Typecheck (optional soft check) ...
call npm run typecheck
if errorlevel 1 (
  echo  [WARN] Typecheck reported issues — continuing to start the site.
)

echo.
echo  [3/4] Opening static clean preview + investor deck in your browser ...
start "" "%~dp0\02-static-preview\index.html"
start "" "%~dp0\04-investor-slideshow\index.html"

echo.
echo  [4/4] Starting Next.js dev server (http://localhost:3000) ...
echo  Press Ctrl+C to stop when finished.
echo.
call npm run dev
set "EXITCODE=%ERRORLEVEL%"
cd /d "%~dp0"
echo.
echo  Dev server exited with code %EXITCODE%.
pause
exit /b %EXITCODE%
