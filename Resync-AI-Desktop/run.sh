#!/usr/bin/env bash
# Resync AI Desktop Pack — Linux/macOS helper (mirrors run.bat)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "============================================================"
echo " Resync AI Desktop Pack"
echo "============================================================"

command -v node >/dev/null || { echo "Install Node.js LTS first"; exit 1; }
command -v npm >/dev/null || { echo "npm missing"; exit 1; }
echo "Node $(node -v) / npm $(npm -v)"
command -v python3 >/dev/null && python3 --version || echo "Python optional — skipping"

cd "$ROOT/01-website"
npm install
npm run typecheck || echo "Typecheck warnings — continuing"
npm run dev
