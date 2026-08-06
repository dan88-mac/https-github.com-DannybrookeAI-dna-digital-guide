# Vercel — one-time setup (fully ready)

Your app lives in **`resync-ai/`**. Production **`main`** must include that folder (not README-only).

## Required: Root Directory = `resync-ai`

Vercel marks this repo as a monorepo. Preview/production builds fail **or show a raw “Index of /” file listing** if the project Root Directory is empty (repo root) or Output Directory points at build artifacts.

1. [Vercel Dashboard](https://vercel.com/dashboard) → your project → **Settings** → **General**.
2. **Root Directory** → **Edit** → enter `resync-ai` → **Save**.
3. Clear any custom **Output Directory** override (leave empty so Next.js controls `.next`).
4. Framework Preset: **Next.js**.
5. Redeploy the latest Deployment (or push a new commit).

After this, install logs should show plain `npm install` (no `--prefix`), and Next.js is detected correctly.

**Prefer the dashboard Root Directory** over relying only on the legacy root [`vercel.json`](vercel.json) `builds` entry. Keep Root Directory = `resync-ai` even if `vercel.json` exists.

Root `vercel.json` includes a `builds` fallback pointing at `resync-ai/package.json` when Root Directory cannot be changed — but dashboard Root Directory is the reliable fix.

## Symptom: “Index of /” (`.rsc`, `_next`, folder names)

That screen is **not** the Resync UI. Vercel (or another host) is listing static files instead of running the Next.js server.

| Cause | Fix |
|-------|-----|
| Root Directory empty / wrong | Set to **`resync-ai`** |
| Output Directory set to `.`, `out`, or `resync-ai` | Clear it (Next.js default) |
| Project created as **Other / static** | Recreate or switch Framework to **Next.js** |
| You only need a phone preview | Use **`resync-ai-iphone.zip`** / [`koder-pack/`](koder-pack/) — no Vercel required |

Static Netlify preview of the offline pack: `https://deploy-preview-4--a-syncai.netlify.app`

## Environment Variables

**Settings** → **Environment Variables** — add (Production, Preview, Development):

| Variable | Value (first deploy) |
|----------|------------------------|
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL, e.g. `https://your-project.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | From [Supabase](https://supabase.com) → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server only) |

Optional later: `OPENAI_API_KEY`, `STRIPE_*`.

Do **not** rely on placeholder URLs in `vercel.json` — configure real values in the dashboard.

## Production branch

**Settings** → **Git** → **Production Branch:** `main`, then **Redeploy**.

## Option B — New import (Deploy button)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdan88-mac%2Fhttps-github.com-DannybrookeAI-dna-digital-guide&project-name=dna-digital-guide&root-directory=resync-ai&env=NEXT_PUBLIC_APP_URL&envDescription=Your%20production%20URL%20(update%20after%20first%20deploy)&env=NEXT_PUBLIC_SUPABASE_URL&env=NEXT_PUBLIC_SUPABASE_ANON_KEY)

## After deploy

- Home: `/`
- Health check: `/api/health`
- Supabase SQL: run files in `resync-ai/supabase/migrations/` in order.

Full walkthrough: [resync-ai/DEPLOY-FROM-GITHUB.md](resync-ai/DEPLOY-FROM-GITHUB.md)

## iPhone without Vercel

Download [`resync-ai-iphone.zip`](resync-ai-iphone.zip) → Files → unzip → open in **Koder** (`index.html` → Preview). See [`koder-pack/README.md`](koder-pack/README.md).

## Local verify

```bash
bash scripts/vercel-build.sh
# or: cd resync-ai && npm install && npm run build
```
