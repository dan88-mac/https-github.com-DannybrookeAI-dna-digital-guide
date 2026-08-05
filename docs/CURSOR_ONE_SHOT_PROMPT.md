# Resync AI — One-Shot Cursor Agent Prompt

Copy everything below the line into a **new Cursor Agent** conversation.

---

You are building **Resync AI** — a production SaaS for self-healing workflow execution, visual workflow building, codegen export, Stripe billing, Supabase multi-tenant data, PWA offline support, and Capacitor mobile wrappers.

**Read and follow completely:** `docs/RESYNC_AI_MASTER_DEPLOYMENT_BLUEPRINT.md` (v2.0).

**Non-negotiables:** Strict TypeScript, Zod at API boundaries, no TODOs in prod code, full file tree from blueprint, RLS on all tenant tables, OpenAI tool-calling runtime with quotas and telemetry, Stripe checkout + portal + idempotent webhooks, React Flow builder + graph worker, codegen export bundle, service worker + IndexedDB sync.

**Order:** Execute build steps 1–15 in the blueprint; pass each verification gate (`pnpm typecheck`, vitest, Playwright smoke, Stripe CLI webhook test).

**Repo layout:** Create `resync-ai/` at repository root with all files, or use repo root if instructed.

When finished, output: commands to run locally, env vars needed, and deploy steps for Vercel + Supabase + Stripe.
