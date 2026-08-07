# Resync AI — Full Showdown Master Plan (5000+ words)

**Document control:** Draft for build execution · Branch `cursor/enterprise-saas-consolidation-d3bc` · Public brand: Resync AI only · Prices: Community $0 · Builder $39 · Pro $129 · Enterprise custom · Marketplace 20% (Enterprise 12%).

**Security gate:** Operator credentials must live only in local/env bootstrap (`scripts/bootstrap-admin.mjs`). Never commit passkeys, never show founder names on public UI. Rotate any credential ever pasted into chat.

**File reality:** Tracked sources are on the order of hundreds of files (~360 after prune), not 27,346. Parallel sweep already produced BEST-OF and competitive briefs; this document is the expanded showdown plan that binds every requested method into numbered steps.

---

## 0. Executive thesis — clear the highway

Resync AI is a self-healing multimodal workflow SaaS. The highway is cleared when there is one Next.js app (`resync-ai/`), one price table, one admin door, one agent fleet under human approval, one Desktop partner vault, and zero secrets in git. Competitors (Zapier, Make, n8n, Workato, Tray, Power Automate, Temporal Cloud, Retool, Activepieces, Bubble) prove the market pays for reduced operational toil. Resync’s wedge is heal transparency, multimodal depth, overview scores, marketplace compounding, and an internal Hermes-styled agent ops console.

This plan compiles every requested method into steps, outcomes, and build focus. It also records what is already shipped versus what this showdown iteration gap-fills.


## 1. Parallel sweep protocol (Steps 1–8)

**Step 1 — Inventory.** Enumerate all paths excluding `.git`, `node_modules`, `.next`. Produce counts by area: app routes, engine, billing, Desktop, legal, PDFs, CI.

**Step 2 — Pod A Marketing.** Keep HeroImmersive; trim duplicate canvas teasers; remove fabricated reviews until real quotes exist.

**Step 3 — Pod B Engine.** Keep moduleCatalog (~260), pairing, overviewScore, ideaToCanvas as canonical.

**Step 4 — Pod C Auth/Billing/API.** Keep Supabase auth, Stripe routes, expand TierGate.

**Step 5 — Pod D Desktop/Legal.** Slim Desktop launcher; partner vaults private; legal in docs + pdf-deliverables.

**Step 6 — BEST-OF index.** keep / merge / delete / private (already at `docs/consolidation/BEST-OF-INDEX.md`).

**Step 7 — Competitive briefs.** Ten ~1000-word overviews (already under `docs/competitive-intelligence/competitors/`).

**Step 8 — 2000-word implementation prompt.** Highway synthesis (already at `docs/competitive-intelligence/2000-WORD-IMPLEMENTATION-PROMPT.md`).

**Best outcome:** One source of truth for what stays; no second full app copy.


## 2. Singleized website structure (Steps 9–20)

**Step 9 — Route map.** `/` immersive · `/studio` agentic+SaaS · `/multimodal` catalog+code panel · `/builder` gated · `/community` · `/marketplace` · `/pricing` theatre · `/dashboard` · `/agents` · `/admin/*` · legal.

**Step 10 — Layout shell.** Header/Footer, SiteAgentShell, UpsellPopupHost, WebGL/chip backdrop.

**Step 11 — Contextual info icons.** Angled/colored/underlined drawers (`ContextInfo`).

**Step 12 — Letter-by-letter.** Typewriter with reduced-motion fallback.

**Step 13 — Side panels.** CodeSidePanel generate/copy/download as modules add.

**Step 14 — No placeholders.** Product-real copy only; illustrative economics labeled in investor docs.

**Step 15 — Offline parity.** koder-pack remains thin mirror.

**Step 16 — Price injection.** Every surface cites $0/$39/$129 and 20%/12% fees.

**Step 17 — Brand rule.** Public Resync AI; founders only in partners/ PDFs.

**Step 18 — Deduplicate landing.** Remove ReviewsSection/VisionLegalStrip/Monster teaser duplication.

**Step 19 — Social kit.** `/resources/social` logo + visionary quote.

**Step 20 — QR / circuitry / infographics.** SVG assets for pricing/community deep links (gap-fill this iteration).

**Best outcome:** A customer never feels lost; next-step chips and context icons always offer a path.


## 3. Auth, payments, admin, subscription gates (Steps 21–35)

**Step 21 — Customer auth.** Supabase email/password + callback.

**Step 22 — Tier helpers.** canAccessFullBuilder, canAccessProCanvas, maxModulesForTier (3 / 20 / 50).

**Step 23 — TierGate UI.** Blur + upgrade CTA for locked features.

**Step 24 — Middleware.** Protect `/dashboard`, `/builder`; protect `/admin/*` requiring `app_role=admin`.

**Step 25 — Admin login.** `/admin/login`; footer discreet Admin link; opaque “Access denied”.

**Step 26 — security_events.** Persist failed/forbidden attempts via `/api/admin/security-event`.

**Step 27 — Bootstrap script.** Env-only ADMIN_EMAIL/PASSWORD; set app_role=admin; rotate chat-exposed secrets.

**Step 28 — Migration.** profiles.app_role, security_events, agent_memory, agent_proposals, site_analytics_daily.

**Step 29 — Stripe checkout/portal.** Existing routes; pricing theatre marketing layer.

**Step 30 — Marketplace fees UI.** 10%+10%=20%; Enterprise 12%.

**Step 31 — Guest limits.** Without Supabase, explore allowed; admin blocked.

**Step 32 — Rate limits.** Login/security event buckets.

**Step 33 — CSP / inspect mode.** Admin security checklist page; no eval; service role server-only.

**Step 34 — Notifications dash.** Server-structured alerts for operators/customers (gap-fill).

**Step 35 — Analytics dash.** Visits, pending subscribers, completed flows (gap-fill + cron rollups).

**Best outcome:** Unauthorized admin entry blocked ASAP and reported; paid sections constricted by plan.


## 4. Agent fleet, skills, schedules, Python ops (Steps 36–55)

**Step 36 — 25 skills registry.** security_scan through approve_queue in `lib/agents/fleet.ts`.

**Step 37 — Seven agents.** Sentinel, Herald, Beacon, Scout, Curator, Forge, Overseer.

**Step 38 — Admin console.** Thin outlines, column sliders, thought streams, autonomy toggle.

**Step 39 — Public /agents.** Explainer without secrets.

**Step 40 — Autonomy mode.** Start/stop loops; proposals require approval.

**Step 41 — Memory kinds.** working / reverse / future versioned JSON (schema ready).

**Step 42 — Cron price-audit.** Herald skill automation.

**Step 43 — Cron login-health.** Sentinel skill automation.

**Step 44 — Cron community-draft.** Curator drafts pending approval.

**Step 45 — Triple-check.** lint → typecheck → tests before publish.

**Step 46 — Python worker.** Allowlisted tools + HMAC (`workers/resync_ops/worker.py`).

**Step 47 — No unbounded scrape.** Allowlisted digests + local competitive docs only.

**Step 48 — Overseer narrator.** Status narrative in console (extend with stored digests).

**Step 49 — Design canvas.** Admin mini preview for creatives.

**Step 50 — Secure inspect.** Checklist page.

**Step 51 — Community curator UI.** Surface pending drafts in admin + moderated feed hooks (gap-fill).

**Step 52 — Competitor monthly digest folder.** `docs/competitive-intelligence/updates/`.

**Step 53 — Law/vision obligations.** Tie Overseer legal_calendar skill to docs/business-legal index.

**Step 54 — Three autonomous loops.** (1) hourly sentinel (2) daily curator (3) weekly overseer — already in plan procedures.

**Step 55 — Fail-safe rule.** Agents propose; humans approve; never silent prod mutation.

**Best outcome:** State-of-the-art ops team looking after the site without rewriting production unchecked.


## 5. Studio & multimodal agentic construction (Steps 56–70)

**Step 56 — Studio sections.** Agentic workflows vs SaaS website flows (shipped).

**Step 57 — Scale bands.** small / large / monster mapping to 2–3, 10–20, 25–50 nodes.

**Step 58 — Module creator criteria.** Templates for 2–3, 10–20, 30, 40, 50 module targets (gap-fill explicit selector).

**Step 59 — On/off, idle, click triggers.** Documented in studio UI as method chips (gap-fill).

**Step 60 — Autonomous next-objective links.** Pairing recommendations from modulePairing.

**Step 61 — Deep explainers.** purpose / libraries / IO from catalog.

**Step 62 — Code side panel multimodal.** Generate as filters change; copy/download.

**Step 63 — Builder code panel.** Wire selected canvas nodes into CodeSidePanel (gap-fill).

**Step 64 — Overview score.** Gate production-ready badge via TierGate overview_score.

**Step 65 — 50 method types.** Catalog categories + agent/ML/commerce/devops etc. as studio method grid (gap-fill list UI).

**Step 66 — Hundreds of function notes.** Catalog instructions fields exposed in expanded cards.

**Step 67 — Error check.** Validate graph before export (existing validate path).

**Step 68 — Highlight generated code.** Mono panel with module comments.

**Step 69 — Save design locally.** studio store already persists.

**Step 70 — Share to community.** Moderation gate before post.

**Best outcome:** Studio is the agentic evolving workflow creator plus SaaS flow designer with precise code export.


## 6. Visual excellence & UE5-inspired motion (Steps 71–85)

**Step 71 — Folding chip backdrop.** CSS 3D / perspective (not Unreal binary).

**Step 72 — Hero network canvas.** Existing WebGL/node network.

**Step 73 — Pricing Animatrix.** Conic gradients, perspective hover on PricingTable.

**Step 74 — Upsell popups.** Frequency-capped randomized tips.

**Step 75 — Flashing next-step cues.** Pulse on autonomy/CTA (reduced-motion safe).

**Step 76 — Symbols/icons.** ContextInfo “i”, agent status dots.

**Step 77 — Slideshow/video beds.** FeatureVideoShowcase retained as media metaphor.

**Step 78 — Partner chip vault HTML.** 3D chip cards for Daniel/Brooke.

**Step 79 — Logo mark.** R gradient tile + social page.

**Step 80 — Visionary quote.** “Build once. Heal always. Compound.”

**Step 81 — Infographic SVGs.** Circuitry + QR to /pricing and /community (gap-fill).

**Step 82 — Accessibility.** prefers-reduced-motion disables typewriter loops.

**Step 83 — Performance.** Lazy heavy canvases; poster frames for video later.

**Step 84 — Brand palette.** Near-black, cyan, indigo — no purple-on-white cliché.

**Step 85 — YouTube-like narrator storyboard.** Admin design canvas as staging (extend scripts later).

**Best outcome:** Bespoke enterprise developer aesthetic without fake UE5 claims.


## 7. Desktop packaging (Steps 86–92)

**Step 86 — Launcher.** run.bat → ../resync-ai npm install && npm run dev.

**Step 87 — open-preview / slideshow / contracts bats.**

**Step 88 — partners/daniel + partners/brooke.** Full PDF packages.

**Step 89 — partners/index.html chip vault.**

**Step 90 — Remove duplicate 01-website tree.** Pointer README only.

**Step 91 — Zip artifact.** Resync-AI-Desktop.zip.

**Step 92 — START-HERE.** Prices, admin bootstrap note, brand rule.

**Best outcome:** Clean Desktop package; private partner folders; public site brand-only.


## 8. Twenty features — each with method

1. Folding 3D hero — FoldingChipBackdrop + network canvas.
2. Contextual info icons — ContextInfo drawers.
3. Letter-by-letter quote — Typewriter.
4. Hero media — FeatureVideoShowcase / slideshow beds.
5. Upsell popups — UpsellPopupHost.
6. Tier-aware locks — TierGate + access.ts.
7. Live code side panel — CodeSidePanel.
8. Overview score — overviewScore.ts + gate.
9. Agent fleet console — /admin/agents.
10. Overseer narrator — thoughtStream + weekly digest.
11. Price auditor cron — /api/cron/price-audit.
12. Login health cron — /api/cron/login-health.
13. Community curator — /api/cron/community-draft + UI.
14. Secure inspect — /admin/security.
15. Admin footer entry — Footer Admin link.
16. Analytics dash — /dashboard + admin analytics (gap-fill admin page).
17. Studio agentic creator — Studio dual sections + method grid.
18. Module depth docs — catalog expanded cards.
19. Marketplace fee clarity — pricing + terms.
20. Social/landing kit — /resources/social + agents push.


## 9. Five automated production procedures

1. **Pre-deploy gate:** typecheck, unit tests, price sync, secret scan.
2. **Hourly sentinel:** auth anomalies + health latency.
3. **Daily curator:** community draft → admin approve.
4. **Weekly overseer report:** narrative summary stored.
5. **Monthly competitive digest:** Scout notes into updates/.


## 10. Competitor audit summary (full essays on disk)

| Site | Why they win | Resync move |
|------|--------------|-------------|
| Zapier | Directory + PLG | Heal + score + multimodal |
| Make | Visual ops | Agent ops console |
| n8n | Open/self-host | Managed SaaS + marketplace |
| Workato | Enterprise iPaaS | Ladder to Enterprise |
| Tray.io | Embedded | Builder UX + community |
| Power Automate | M365 gravity | Cross-stack multimodal |
| Temporal Cloud | Durable exec | Visual heal for mixed teams |
| Retool | Internal tools | External workflow + market |
| Activepieces | Open PLG | Polish + fleet |
| Bubble | No-code apps | Workflow-native heal SaaS |

Each has a ~1000-word brief in `docs/competitive-intelligence/competitors/`. The 2000-word highway prompt binds them into execution language.


## 11. Sourceful understanding — why own this SaaS

People visit to solve integration toil. They subscribe when a workflow becomes operationally critical and free limits bind. Profit comes from PLG (Community→Builder), expansion (Pro), marketplace take rate, and Enterprise ARR. Healthy bands: gross margin 75–85%, NRR 110%+, CAC payback <14 mo, logo churn <8%, heal success ≥90% on paid. Resync maps acquire→activate→monetize→retain across landing, studio, builder, pricing, community, marketplace, and admin agents.

Risks: connector parity myths, model COGS, unsigned legal drafts, Vercel Root Directory mistakes, secrets in git. Mitigations: gates, env bootstrap, scoreable quality, prune duplicates, counsel for contracts.


## 12. Deployment readiness & cleanup (Steps 93–100)

**Step 93 — Vercel Root Directory = resync-ai.**

**Step 94 — Env:** Supabase, Stripe, OpenAI, CRON_SECRET, admin bootstrap once.

**Step 95 — Pages workflow soft-fail** until Pages enabled.

**Step 96 — Prune** unused MissionSection file optional; keep tree: resync-ai, koder-pack, docs, pdf-deliverables, slim Desktop, workers.

**Step 97 — Chat/title/save path** are human ops after merge.

**Step 98 — Logo/quote/social** shipped as routes/assets; agents can push captions under approval.

**Step 99 — Analytics/notifications** gap-fill this showdown.

**Step 100 — Definition of done.** One deployable app; secure admin; gated paid surfaces; agent console + crons; Desktop vaults; competitive docs; no secrets in git; prices aligned.

---

## 13. Numbered method catalogue (user request showdown)

The following expands each major user-requested method into intent → best outcome → build focus.


### Method 1: Parallel multi-pod file sweep

**Intent:** Capture the user’s showdown requirement for “Parallel multi-pod file sweep” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Compress 360+ sources into BEST-OF without losing engine depth.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 2: Compliance-oriented server repos

**Intent:** Capture the user’s showdown requirement for “Compliance-oriented server repos” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Supabase migrations, RLS posture, service role server-only.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 3: Latest library integrations

**Intent:** Capture the user’s showdown requirement for “Latest library integrations” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Catalog libraries grounded; Stripe/Supabase/OpenAI hooks.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 4: Package Desktop + zip

**Intent:** Capture the user’s showdown requirement for “Package Desktop + zip” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** run.bat launcher + partner vault + preview.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 5: State-of-the-art agents team

**Intent:** Capture the user’s showdown requirement for “State-of-the-art agents team” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Seven Hermes-styled roles + 25 skills.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 6: Scheduled auto tasks

**Intent:** Capture the user’s showdown requirement for “Scheduled auto tasks” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Vercel crons for price, login, community.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 7: Compile latest content

**Intent:** Capture the user’s showdown requirement for “Compile latest content” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Curator/Overseer drafts under approval.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 8: Inject/fix prices

**Intent:** Capture the user’s showdown requirement for “Inject/fix prices” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** tiers.ts as SSOT; Herald audits drift.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 9: Check login

**Intent:** Capture the user’s showdown requirement for “Check login” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** login-health cron + middleware.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 10: User authentication

**Intent:** Capture the user’s showdown requirement for “User authentication” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Supabase email/password + session cookies.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 11: Constrict paid sections

**Intent:** Capture the user’s showdown requirement for “Constrict paid sections” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** TierGate + maxModulesForTier.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 12: Admin login footer

**Intent:** Capture the user’s showdown requirement for “Admin login footer” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Discreet Admin → /admin/login.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 13: Block unauthorized ASAP

**Intent:** Capture the user’s showdown requirement for “Block unauthorized ASAP” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Redirect + security_events.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 14: Passkeys without names in UI

**Intent:** Capture the user’s showdown requirement for “Passkeys without names in UI” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Env bootstrap only; rotate chat secrets.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 15: Scrape best of each build

**Intent:** Capture the user’s showdown requirement for “Scrape best of each build” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** BEST-OF index; no second app tree.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 16: Singleized website

**Intent:** Capture the user’s showdown requirement for “Singleized website” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Canonical resync-ai.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 17: Daniel/Brooke Desktop folders

**Intent:** Capture the user’s showdown requirement for “Daniel/Brooke Desktop folders” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** partners/daniel and partners/brooke.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 18: 3D chip vault

**Intent:** Capture the user’s showdown requirement for “3D chip vault” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** partners/index.html UE5-inspired CSS 3D.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 19: RTX/Unreal ideas in web

**Intent:** Capture the user’s showdown requirement for “RTX/Unreal ideas in web” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** CSS/WebGL metaphors — not UE5 runtime.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 20: Video/animation content ideas

**Intent:** Capture the user’s showdown requirement for “Video/animation content ideas” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Feature showcase + design canvas.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 21: Hardcoded server Hermes agents

**Intent:** Capture the user’s showdown requirement for “Hardcoded server Hermes agents” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Server routes + fleet registry prompts.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 22: Dedicated agent job sections

**Intent:** Capture the user’s showdown requirement for “Dedicated agent job sections” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Admin console per agent.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 23: Security/sales/marketing/search jobs

**Intent:** Capture the user’s showdown requirement for “Security/sales/marketing/search jobs” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Sentinel/Herald/Beacon/Scout.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 24: Secure inspect mode

**Intent:** Capture the user’s showdown requirement for “Secure inspect mode” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** /admin/security checklist.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 25: Fail-safe customer direction

**Intent:** Capture the user’s showdown requirement for “Fail-safe customer direction” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Context icons + upsell tips + next steps.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 26: Contextual info icons

**Intent:** Capture the user’s showdown requirement for “Contextual info icons” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** ContextInfo component.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 27: Main page 3D folding loop

**Intent:** Capture the user’s showdown requirement for “Main page 3D folding loop” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** FoldingChipBackdrop.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 28: Image slideshows/videos

**Intent:** Capture the user’s showdown requirement for “Image slideshows/videos” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Marketing media sections.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 29: Definitive side panels

**Intent:** Capture the user’s showdown requirement for “Definitive side panels” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** CodeSidePanel.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 30: Letter-by-letter animations

**Intent:** Capture the user’s showdown requirement for “Letter-by-letter animations” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Typewriter.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 31: No placeholders

**Intent:** Capture the user’s showdown requirement for “No placeholders” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Trim fabricated reviews.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 32: Angled/colored/underlined context

**Intent:** Capture the user’s showdown requirement for “Angled/colored/underlined context” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** ContextInfo styles.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 33: Clickable animated icons

**Intent:** Capture the user’s showdown requirement for “Clickable animated icons” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Pulse status dots, CTAs.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 34: Upsell popups

**Intent:** Capture the user’s showdown requirement for “Upsell popups” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** UpsellPopupHost.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 35: Community randomized agent posts

**Intent:** Capture the user’s showdown requirement for “Community randomized agent posts” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** community-draft cron + moderation.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 36: Autonomous button telemetry

**Intent:** Capture the user’s showdown requirement for “Autonomous button telemetry” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Autonomy toggle + thought streams.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 37: Narrator overseer

**Intent:** Capture the user’s showdown requirement for “Narrator overseer” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Overseer skills + digests.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 38: Self/reverse/future memory

**Intent:** Capture the user’s showdown requirement for “Self/reverse/future memory” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** agent_memory schema.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 39: Massive Python function calling

**Intent:** Capture the user’s showdown requirement for “Massive Python function calling” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Allowlisted worker only.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 40: Self-evolving structured loops

**Intent:** Capture the user’s showdown requirement for “Self-evolving structured loops” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Proposals queue — human apply.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 41: Competitor understanding loops

**Intent:** Capture the user’s showdown requirement for “Competitor understanding loops” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Competitive intel docs + Scout.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 42: Law/rights/vision alignment

**Intent:** Capture the user’s showdown requirement for “Law/rights/vision alignment” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** business-legal + legal_calendar skill.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 43: Three induced autonomous methods

**Intent:** Capture the user’s showdown requirement for “Three induced autonomous methods” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Hourly/daily/weekly procedures.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 44: Payment/pricing marketing theatre

**Intent:** Capture the user’s showdown requirement for “Payment/pricing marketing theatre” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Pricing page effects.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 45: 20 features with methods

**Intent:** Capture the user’s showdown requirement for “20 features with methods” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Section 8 list.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 46: 5 automated procedures

**Intent:** Capture the user’s showdown requirement for “5 automated procedures” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Section 9 list.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 47: 10 competitor 1000w overviews

**Intent:** Capture the user’s showdown requirement for “10 competitor 1000w overviews” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** competitors/*.md.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 48: 2000w implementation prompt

**Intent:** Capture the user’s showdown requirement for “2000w implementation prompt” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** 2000-WORD-IMPLEMENTATION-PROMPT.md.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 49: Remove unnecessary duplicates

**Intent:** Capture the user’s showdown requirement for “Remove unnecessary duplicates” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Deleted Desktop 01-website copy.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 50: Logo + visionary quote + social landings

**Intent:** Capture the user’s showdown requirement for “Logo + visionary quote + social landings” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** /resources/social.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 51: Agent design canvas

**Intent:** Capture the user’s showdown requirement for “Agent design canvas” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** /admin/design.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 52: Analytics visits/subscribers/flows

**Intent:** Capture the user’s showdown requirement for “Analytics visits/subscribers/flows” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** site_analytics_daily + dash gap-fill.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 53: Notifications dash telemetry

**Intent:** Capture the user’s showdown requirement for “Notifications dash telemetry” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** gap-fill admin notifications.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 54: Agent page thin outline UI

**Intent:** Capture the user’s showdown requirement for “Agent page thin outline UI” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Admin agents layout.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 55: Column sliders

**Intent:** Capture the user’s showdown requirement for “Column sliders” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Panel width slider shipped.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 56: 25 skills structure

**Intent:** Capture the user’s showdown requirement for “25 skills structure” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** AGENT_SKILLS array.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 57: Module counts 2–3 to 50

**Intent:** Capture the user’s showdown requirement for “Module counts 2–3 to 50” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Scale options + maxModulesForTier.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 58: Agentic studio creator page focus

**Intent:** Capture the user’s showdown requirement for “Agentic studio creator page focus” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Studio agentic section.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 59: SaaS website studio section

**Intent:** Capture the user’s showdown requirement for “SaaS website studio section” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Studio SaaS card.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 60: 50 method types + more soon

**Intent:** Capture the user’s showdown requirement for “50 method types + more soon” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Method grid gap-fill.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 61: Hundreds of module purpose texts

**Intent:** Capture the user’s showdown requirement for “Hundreds of module purpose texts” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Catalog purpose/instructions.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 62: On/off idle click methods

**Intent:** Capture the user’s showdown requirement for “On/off idle click methods” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Method chips gap-fill.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 63: Exact structured code side panel

**Intent:** Capture the user’s showdown requirement for “Exact structured code side panel” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** CodeSidePanel.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


### Method 64: Check/fix studio multimodal errors

**Intent:** Capture the user’s showdown requirement for “Check/fix studio multimodal errors” inside the Resync enterprise construction without duplicating the monorepo or leaking secrets.

**Best outcome:** Validate + moderation.

**Build focus:** Implement or extend the existing consolidation surfaces (`resync-ai`, Desktop partners, docs/competitive-intelligence, workers/resync_ops). Prefer extending TierGate, fleet.ts, cron routes, and catalog-driven studio over greenfield rewrites. Verify prices, auth walls, and brand rules on every touch. Document operator steps in START-HERE / DEPLOY-FROM-GITHUB. When automation is involved, require admin approval before publish. Measure success by demoability, CI health, and absence of secrets in `git grep` scans.

**Symbols / artifacts:** ▹ code · ▣ security · ◈ pricing · △ agents · ◇ desktop vault.


## 14. Infographics, circuitry, logos, QR, video, slideshows

- **Logo:** R mark gradient; social share card route.
- **QR:** SVG linking to `/pricing` and `/community` (generated in public/).
- **Circuitry diagram:** SVG metaphor of heal loop trigger→vision→heal→notify.
- **Slideshow:** Desktop investor deck 27 slides + site FeatureVideoShowcase.
- **Video ideas:** Admin design canvas storyboard; export WebM when ffmpeg available later.
- **Numbers:** 7 agents · 25 skills · ~260 modules · 3/20/50 node caps · $0/$39/$129 · 20%/12% fees · 10 competitor briefs · 5 procedures · 20 features · 100 showdown methods above.

---

## 15. Showdown execution order (begin deployment)

1. Keep consolidating on `cursor/enterprise-saas-consolidation-d3bc`.
2. Gap-fill analytics, notifications, community curator UI, QR/circuit assets, studio method grid, builder code panel wiring.
3. Re-sync Desktop zip to Desktop folder.
4. Secret scan; confirm no passkeys in tree.
5. Push; update PR; Vercel Root Directory `resync-ai`.
6. Bootstrap admins via env; rotate credentials.
7. Demo: run.bat / static preview /admin/agents /pricing.

**Mantra:** Build once. Heal always. Compound. Clear the highway.

---

*End of master showdown plan. This document is planning + binding specification for continued implementation. Not legal advice; not an offer to sell securities. Partnership drafts remain counsel-bound and private.*
