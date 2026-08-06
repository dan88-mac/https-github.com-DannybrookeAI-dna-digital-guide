# Resync AI — Desktop Pack (START HERE)

Clean, presentable setup for **Windows** (and macOS/Linux via `run.sh`).

## Folder map

| Folder / file | What it is |
|---------------|------------|
| **`run.bat`** | Checks Node + npm (+ Python if present), `npm install`, opens preview + slideshow, starts **`npm run dev`** |
| **`open-preview.bat`** | Instant **clean static site** (no install) — Koder-pack remodel UI |
| **`open-slideshow.bat`** | Investor / staff / developer showcase deck |
| **`open-contracts.bat`** | Full PDF contracts + review checklist |
| **`01-website/`** | Full Next.js SaaS (`resync-ai`) — production-shaped app |
| **`02-static-preview/`** | Offline SPA (same look: home, builder, multimodal, marketplace, agent) |
| **`03-contracts-pdf/`** | Partner PDFs, markdown sources, **last-look contract review** |
| **`04-investor-slideshow/`** | Vision, stack, scoring, comps, 5-year plan, automated SaaS model |
| **`05-guides/`** | Vercel, iPhone, deployment blueprint, next steps |
| **`resync-ai-iphone.zip`** | Phone/Koder zip of the static preview |

## Quick start (Windows)

1. Copy this whole **`Resync-AI-Desktop`** folder to your Desktop.
2. Double-click **`open-preview.bat`** to see the clean website immediately.
3. Double-click **`run.bat`** for the full Node stack (installs deps → http://localhost:3000).
4. Double-click **`open-slideshow.bat`** before investor / staff meetings.
5. Double-click **`open-contracts.bat`** to review PDFs + the checklist.

### Requirements for `run.bat`

- [Node.js LTS](https://nodejs.org) (includes npm)
- Optional: [Python 3](https://www.python.org) (detected; not required to run the site)

## Clean website builds

| Path | Audience |
|------|----------|
| `02-static-preview/index.html` | Fastest “what it looks like” — brand-first remodel |
| `01-website` + `npm run dev` | Full stack: App Router, builder, APIs, agent shell |
| Cloud | Vercel **Root Directory = `resync-ai`** (see `05-guides/VERCEL-DEPLOY.md`) |

## Contracts

- PDFs: `03-contracts-pdf/daniel-noel-mcgarry/` and `.../brooke-caroline-hunt/`
- Sources: `03-contracts-pdf/sources/`
- **Careful last look:** `03-contracts-pdf/review/CONTRACT-REVIEW-CHECKLIST.md`

These are **drafts for counsel review** — not signed instruments until a solicitor finalizes them.

## Investor deck

Open `04-investor-slideshow/index.html` (arrow keys / buttons). Covers purpose, vision, stack-from-the-ground-up, deployment readiness scores, live-category comps, illustrative economics, and a **5-year feature/revenue roadmap**.
