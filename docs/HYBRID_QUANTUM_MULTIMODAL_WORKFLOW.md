# Hybrid quantumised multimodal web workflow

Technical blueprint for the **Hybrid Matrix Runner** integrated with **Resync AI** (`/hybrid-workflow`). Covers built implementations, assembly-line procedures, Python libraries, Azure PowerShell, security masking, find-me GPS beeper, live canvas telemetry, and a **50-task Cursor runner AI methodology**.

---

## System architecture

```mermaid
flowchart TB
  subgraph frontend [Next.js frontend]
    Canvas[MatrixCanvas 60fps]
    Beeper[Find-me beeper]
    Term[Runner terminal CLI]
    SSE[SSE client]
  end
  subgraph edge [Next API]
    Stream[/api/hybrid/stream]
    Exec[/api/hybrid/execute]
    FindMe[/api/hybrid/find-me]
  end
  subgraph python [Hybrid Matrix Runner FastAPI]
    AL[assembly_line]
    FR[function_registry]
    PS[PowerShell subprocess]
    PATH[path_simulator]
  end
  subgraph azure [Azure optional]
    KV[Key Vault mask]
    App[App Service deploy]
  end
  Canvas --> SSE --> Stream
  Term --> Exec
  Beeper --> FindMe
  Stream --> AL
  Exec --> AL
  AL --> FR
  AL --> PATH
  FR --> PS
  App --> python
  KV --> PS
```

---

## Structured assembly line (step-by-step)

Each run receives **UTC ISO-8601 timestamps** and **epochMs** on every module event via `stamp_module()`.

| Step | Module ID | Runtime | Function call | Purpose |
|------|-----------|---------|---------------|---------|
| 0 | `assembly` | python | — | Emit `start` / `complete` envelope |
| 1 | `mod-geo` | python | `geo.resolve` | Merge browser GPS + host resolver |
| 2 | `mod-security` | python | `security.scrub` | Mask keys/tokens before logging |
| 3 | `mod-domains` | www | `web.domains.connector` | Domain analytics ingress |
| 4 | `mod-fetch` | python | `python.http.fetch` | Scrape sample + content folder tag |
| 5 | `mod-ps` | powershell | `powershell.echo` | Azure/Microsoft bridge hop |
| *parallel* | `path_simulator` | python | `build_path_trace` | Fiber/satellite/CDN hop SSE events |
| *parallel* | `find_me` | python | `find_me.ping` | GPS dot beeper after each step |

**Procedure to run locally**

1. `chmod +x scripts/run-hybrid-matrix.sh && ./scripts/run-hybrid-matrix.sh`
2. `cd resync-ai && cp .env.example .env.local` — set `HYBRID_MATRIX_RUNNER_URL`
3. `npm install && npm run dev`
4. Open `/hybrid-workflow` → **Run live pipeline** or terminal command `run`
5. Optional: `python hybrid-matrix-runner/cli.py run -v --lat <lat> --lng <lng>`

**Procedure to deploy Python runner on Azure**

1. `Connect-AzAccount`
2. `./hybrid-matrix-runner/azure/Deploy-HybridMatrixRunner.ps1 -ResourceGroup rg-resync -AppName resync-hybrid-matrix`
3. Set Vercel env `HYBRID_MATRIX_RUNNER_URL` to App Service URL
4. `./hybrid-matrix-runner/azure/Invoke-MatrixTelemetry.ps1 -ExecutionId <uuid> -RunnerUrl https://...`

---

## Built implementations catalog

Source of truth: `hybrid-matrix-runner/hybrid_matrix/built_implementations.json` (mirrored in `resync-ai/lib/hybrid/builtImplementations.json`).

| ID | Name | Runtime | Libraries |
|----|------|---------|-----------|
| impl-001 | FastAPI pipeline host | python | fastapi, uvicorn, pydantic |
| impl-002 | Assembly line orchestrator | python | asyncio |
| impl-003 | Geolocation merge | python | geopy, socket |
| impl-004 | Secret scrubber | python | cryptography, hmac |
| impl-005 | Domain connector | www | next, fetch |
| impl-006 | HTTP scrape fetch | python | httpx |
| impl-007 | PowerShell bridge | powershell | Microsoft.PowerShell.Core |
| impl-008 | Path trace simulator | python | random |
| impl-009 | Find-me GPS beeper | python | uuid, hmac |
| impl-010 | Next.js SSE proxy | www | next/server |
| impl-011 | WebGL matrix canvas | www | webgl canvas |
| impl-012 | OpenAI tool runtime | python | openai |
| impl-013 | Supabase telemetry | www | @supabase/supabase-js |
| impl-014 | Azure Key Vault mask | powershell | Az.KeyVault |
| impl-015 | Azure deploy web app | powershell | Az.Websites |
| impl-016 | JSON transform | python | json |
| impl-017 | React Flow builder | www | @xyflow/react |
| impl-018 | Stripe billing gate | www | stripe |
| impl-019 | Cursor agent overview | www | openai |
| impl-020 | Module catalog | www | typescript |

API: `GET /api/hybrid/implementations` or Python `GET /api/implementations`.

---

## Security & defence

- **Scrubbing**: `security.scrub` / `scrubHybridPayload` mask API keys, bearer tokens, and sensitive dict keys before SSE or JSON responses.
- **Find-me HMAC**: `HYBRID_FIND_ME_SECRET` signs beeper tokens (`sign_find_me_token`).
- **Azure**: `Secure-KeyVaultMask.ps1` never prints raw secrets — only masked form.
- **Production**: Terminate TLS at edge; restrict runner to private network or mTLS; rotate secrets; never commit `.env.local`.

---

## 50-task Cursor runner AI methodology

Planned tasks for geological mapped **reallowing** (network path + geo alignment) and live operator oversight. Status: **foundation shipped** in this PR for tasks marked `[built]`.

| # | Task | Layer | Status |
|---|------|-------|--------|
| 1 | Define hybrid execution UUID contract | schema | [built] |
| 2 | UTC timestamp stamping per module | python | [built] |
| 3 | FastAPI health + CORS | python | [built] |
| 4 | Assembly line step sequencer | python | [built] |
| 5 | SSE streaming execute endpoint | python | [built] |
| 6 | Next.js SSE proxy route | www | [built] |
| 7 | Local fallback assembly line | www | [built] |
| 8 | Path hop simulator (fiber/satellite) | python | [built] |
| 9 | Matrix canvas 60fps render loop | www | [built] |
| 10 | Client IP capture on edge | www | [built] |
| 11 | Browser geolocation hook | www | [built] |
| 12 | Find-me ping API | python/www | [built] |
| 13 | Find-me frontend beeper UI | www | [built] |
| 14 | Runner terminal CLI UX | www | [built] |
| 15 | Built implementations JSON catalog | data | [built] |
| 16 | Implementations list API | www | [built] |
| 17 | Function registry invoke | python | [built] |
| 18 | httpx scrape module | python | [built] |
| 19 | PowerShell echo bridge | python/ps | [built] |
| 20 | Domain connector module | python | [built] |
| 21 | Secret scrub module | python | [built] |
| 22 | Geo resolve module | python | [built] |
| 23 | CLI `run` / `call` / `list` | python | [built] |
| 24 | `run.sh` venv bootstrap | ops | [built] |
| 25 | Azure deploy script | powershell | [built] |
| 26 | Azure telemetry invoke script | powershell | [built] |
| 27 | Key Vault mask script | powershell | [built] |
| 28 | Vitest hybrid unit tests | www | [built] |
| 29 | Pytest assembly line tests | python | [built] |
| 30 | Nav link to Matrix page | www | [built] |
| 31 | Wire runner URL env var | ops | [built] |
| 32 | Persist hops to Supabase telemetry | www | planned |
| 33 | Redis-backed find-me registry | python | planned |
| 34 | Real traceroute / MTR integration | python | planned |
| 35 | MaxMind GeoIP enrichment | python | planned |
| 36 | WAF rate limit on hybrid APIs | www | planned |
| 37 | OAuth gate for execute | www | planned |
| 38 | Stripe credit check before run | www | planned |
| 39 | Agent chat auto-summary post-run | www | planned |
| 40 | 3D Three.js node globe | www | planned |
| 41 | 4K render export snapshot | www | planned |
| 42 | WebSocket dual-feed with SSE | www | planned |
| 43 | Kubernetes sidecar runner | ops | planned |
| 44 | Azure Functions PS-only hops | powershell | planned |
| 45 | Virus scan hook on scrape bytes | python | planned |
| 46 | Content folder indexer to Supabase | www | planned |
| 47 | Multimodal module auto-pairing | www | planned |
| 48 | Builder drag-drop export to assembly JSON | www | planned |
| 49 | Enterprise audit log export | ops | planned |
| 50 | Cursor agent playbook markdown sync | docs | planned |

---

## Function calling environment

Registered calls (Python runner): `geo.resolve`, `security.scrub`, `web.domains.connector`, `python.http.fetch`, `python.transform.json_parse`, `powershell.echo`.

Extend via `@register("name")` in `hybrid_matrix/function_registry.py`.

---

## Real-time telemetry fields

Each `path_hop` event includes: `hop`, `from`, `to`, `nodeType`, `latencyMs`, `frequencyHz`, `telemetryUtc`.

Each assembly step includes: `moduleId`, `event` (`step_start` | `step_complete`), `timestampUtc`, `runtime`, `functionCall`, scrubbed `output`.

---

## Related Resync AI modules

- Builder canvas: `components/builder/NodeBoard.tsx`
- Multimodal catalog: `/multimodal`
- Telemetry API: `/api/telemetry/log`
- Agent overview: `/api/agent/chat`
