# Deploy Resync AI from GitHub (iPhone-friendly)

Use this when you only have your **iPhone** — no local laptop required.

## 1. One-time: connect GitHub → Vercel

1. On iPhone, open **[vercel.com](https://vercel.com)** → Sign up with **GitHub**.
2. **Add New Project** → import your GitHub repo that contains the `resync-ai` folder.
3. Set **Root Directory** to: `resync-ai` (required).
4. Framework: **Next.js** (auto-detected).
5. Add **Environment Variables** (minimum to build & run):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g. `https://resync-ai-xxx.vercel.app`) — update after first deploy |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — Supabase settings |
| `OPENAI_API_KEY` | Optional until runtime heal is tested |
| `STRIPE_SECRET_KEY` | Optional until billing is tested |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional |
| `STRIPE_WEBHOOK_SECRET` | After Stripe webhook setup |

6. Tap **Deploy**. Every **push to GitHub** redeploys automatically.

## 2. Supabase (database + auth) — mobile browser

1. **[supabase.com](https://supabase.com)** → New project (region: **Sydney** for NSW).
2. **SQL Editor** → run migrations in order:
   - `resync-ai/supabase/migrations/20260805000000_init_schema.sql`
   - `resync-ai/supabase/migrations/20260805000001_rls_and_functions.sql`
3. Copy **Project URL** and **anon key** into Vercel env vars.

## 3. Test the live site

- Home: `/`
- Community: `/community`
- Templates: `/templates`
- Builder: `/builder` (sign in when Supabase auth is configured)
- Health: `/api/health`

## 4. Custom domain (later)

Vercel → Project → **Domains** → add e.g. `resync.ai` or `.com.au` when registered.

## 5. Cursor Cloud Agent

Push to branch `cursor/resync-ai-full-build-86ce` or `main` after merge; Vercel rebuilds from GitHub without a laptop.

**Full map (cloud ↔ GitHub ↔ Vercel ↔ optional Windows PC):** [../docs/CLOUD-LOCAL-REMOTE-ACCESS-GUIDE.md](../docs/CLOUD-LOCAL-REMOTE-ACCESS-GUIDE.md)

Cloud agent VMs use [.cursor/environment.json](../.cursor/environment.json) for `npm install` and `npm run dev` in `resync-ai/`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Vercel | Confirm root directory = `resync-ai` |
| Auth redirect errors | Set `NEXT_PUBLIC_APP_URL` to exact production URL |
| Builder empty | Add Supabase env vars; run migrations |

Full technical blueprint: [../docs/RESYNC_AI_MASTER_DEPLOYMENT_BLUEPRINT.md](../docs/RESYNC_AI_MASTER_DEPLOYMENT_BLUEPRINT.md)

Australia registration: [../docs/business-legal/12-AUSTRALIA-NSW-REGISTRATION-AND-NEXT-STEPS.md](../docs/business-legal/12-AUSTRALIA-NSW-REGISTRATION-AND-NEXT-STEPS.md)
