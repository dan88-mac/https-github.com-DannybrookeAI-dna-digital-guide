#!/usr/bin/env bash
# Start Python hybrid matrix runner (port 8765) from repo root.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec "$ROOT/hybrid-matrix-runner/run.sh"
