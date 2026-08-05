#!/usr/bin/env bash
# Local helper mirroring how Vercel should build the Next.js app.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/resync-ai"
npm install
npm run build
echo "Build OK — output at resync-ai/.next"
