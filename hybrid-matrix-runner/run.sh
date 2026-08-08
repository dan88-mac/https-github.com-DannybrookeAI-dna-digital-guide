#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
if [[ ! -d .venv ]]; then
  python3 -m venv .venv
  . .venv/bin/activate
  pip install -q -r requirements.txt
else
  . .venv/bin/activate
fi
export PORT="${PORT:-8765}"
exec uvicorn hybrid_matrix.main:app --host 0.0.0.0 --port "$PORT"
