#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$(cd "$ROOT/../resync-ai" && pwd)"
echo "Resync AI Desktop → $APP"
command -v node >/dev/null
command -v npm >/dev/null
cd "$APP"
npm install
npm run dev
