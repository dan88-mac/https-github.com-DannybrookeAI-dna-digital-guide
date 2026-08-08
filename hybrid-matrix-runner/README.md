# Hybrid Matrix Runner

Python FastAPI service for the **hybrid quantumised multimodal workflow**: assembly-line execution, live SSE telemetry, geolocation merge, find-me scrape beeper, path-hop simulation (fiber/CDN/satellite), and registered function calls bridging **Python**, **PowerShell**, and **www** runtimes.

## Quick start

```bash
cd hybrid-matrix-runner
chmod +x run.sh
./run.sh
# API: http://0.0.0.0:8765/health
```

## CLI

```bash
cd hybrid-matrix-runner
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
python cli.py list
python cli.py run -v --lat -33.86 --lng 151.20
python cli.py call geo.resolve --context '{}'
```

## Resync AI frontend

Set `HYBRID_MATRIX_RUNNER_URL=http://127.0.0.1:8765` in `resync-ai/.env.local`, run `./run.sh`, then open [http://localhost:3000/hybrid-workflow](http://localhost:3000/hybrid-workflow).

Without the Python runner, Next.js uses an **in-process fallback** assembly line.

## Azure PowerShell

See `azure/Deploy-HybridMatrixRunner.ps1`, `Invoke-MatrixTelemetry.ps1`, and `Secure-KeyVaultMask.ps1`.

## Tests

```bash
pytest tests/
```

Full methodology (50 tasks) and assembly procedures: [../docs/HYBRID_QUANTUM_MULTIMODAL_WORKFLOW.md](../docs/HYBRID_QUANTUM_MULTIMODAL_WORKFLOW.md).
