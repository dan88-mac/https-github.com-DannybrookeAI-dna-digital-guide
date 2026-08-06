# Resync AI

Production SaaS for **self-healing workflows**, community templates, Stripe billing, and Next.js code export.

## Quick start

```bash
cd resync-ai
cp .env.example .env.local
# Fill Supabase, Stripe, OpenAI keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

See [VERCEL-DEPLOY.md](../VERCEL-DEPLOY.md) for production deployment.

**Cloud agents, local dev, and optional remote PC access:** [../docs/CLOUD-LOCAL-REMOTE-ACCESS-GUIDE.md](../docs/CLOUD-LOCAL-REMOTE-ACCESS-GUIDE.md)

## Deploy

1. **Vercel** — set root directory to `resync-ai`, add env vars from `.env.example`.
2. **Supabase** — run migrations in `supabase/migrations/`.
3. **Stripe** — configure products/prices; set webhook to `/api/stripe/webhook`.

## Purpose-driven growth features

- **Template gallery** — reuse and return for every launch
- **Community waitlist** — `/api/community/waitlist`
- **Mission & resources** — retention content on `/about`, `/resources`, `/community`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke tests |

See [docs/RESYNC_AI_MASTER_DEPLOYMENT_BLUEPRINT.md](../docs/RESYNC_AI_MASTER_DEPLOYMENT_BLUEPRINT.md) for full architecture.
