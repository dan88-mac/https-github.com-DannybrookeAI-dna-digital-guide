# 2000-Word Implementation Prompt — Clear the Highway for Resync AI

Copy this prompt into build agents and human sprint briefs. It synthesizes competitive intelligence and the consolidation plan into a single directional brief.

---

You are building **Resync AI**, a self-healing multimodal workflow SaaS. The highway is blocked by duplicate packs, vague positioning, and unfinished gates. Clear it.

## Positioning (memorize)

Resync is not “another Zapier.” Resync is the **self-healing layer** for multimodal automations: vision, voice, and text chains that recover in production, with overview scores, library-grounded modules (~260), community templates, and a marketplace (20% standard take / 12% enterprise). An internal **agent fleet** (Sentinel, Herald, Beacon, Scout, Curator, Forge, Overseer) keeps the product and content sharp under human approval.

Public brand is **Resync AI only**. Partner names and contracts live in private Desktop vaults and PDF packs—not in marketing chrome.

## Commercial truth (inject everywhere)

| Tier | Price | Role |
|------|-------|------|
| Community | $0 | PLG entry, limited canvas, 500 credits |
| Builder | $39 | Full palette, idea-to-canvas, 8k credits |
| Pro | $129 | ≤50 modules, marketplace sell, 40k credits |
| Enterprise | Custom | SSO/SLA, 12% marketplace fee |

If any page, pack, or agent copy disagrees, **fix the copy**—do not invent a fifth price.

## Competitive highway lanes

Study Zapier, Make, n8n, Workato, Tray, Power Automate, Temporal Cloud, Retool, Activepieces, and Bubble (see `docs/competitive-intelligence/competitors/`). Steal **clarity**, not feature lists. They win on trust, templates, and upgrade walls. We win on heal transparency, multimodal depth, scoreable readiness, and agent ops.

## Product surfaces to ship (no placeholders)

1. Immersive landing with 3D/chip motion (Three/R3F or WebGL—not literal UE5), slideshow/video beds, contextual help icons, letter-by-letter vision quote (respect reduced motion).
2. Studio with **Agentic** and **SaaS** sections; module graphs from 2–3 up to 50; on/off, idle, click triggers.
3. Multimodal catalog with deep explainers from catalog purpose/libraries/IO and a **live code side panel** (highlight, copy, download).
4. Builder gated by tier; overview score chip wired to `overviewScore.ts`.
5. Community with moderated, agent-curated posts—not spam.
6. Marketplace with fee clarity.
7. Pricing theatre that looks premium and checks out via Stripe.
8. Dashboard analytics: flows, credits, subscription state.
9. `/agents` public explainer (no secrets).
10. `/admin/*` fleet console, schedules, narrator, design canvas, security events.

## Auth and security (non-negotiable)

- Customer auth: existing Supabase email/password.
- Admin: `app_role=admin` in profiles; `/admin/login`; footer Admin link; rate-limit; `security_events` on failures.
- **Never** commit passkeys/passwords. Bootstrap from `.env.local` once, then rotate anything pasted in chat.
- Unauthorized admin access → block + report. No stack traces to clients. CSP + no eval. Service role server-only.

## Agent ops model

Twenty-five shared skills (security scan, price sync, login health, content freshness, community seed, SEO draft, competitor watch, legal calendar, uptime, dependency audit, and siblings). Agents propose; Overseer narrates; humans approve publish. Memory is versioned JSON in DB—not self-modifying production code. Python worker under `workers/resync_ops/` uses allowlisted libraries and HMAC from admin API. Cron routes: price auditor, login health, community draft, dependency advisory.

## UX direction (customers must not feel lost)

Contextual info icons with angled/colored/underlined callouts; next-step chips; soft flashing CTAs; upsell popups with frequency caps and real screenshots; side panels that explain modules as they are added. Fail-safe paths always offer “what to do next.”

## Desktop partner vault

`Resync-AI-Desktop/partners/daniel` and `.../brooke` hold contracts and executive packages. Chip-styled local launcher. `run.bat` launches `resync-ai`—do **not** keep a second full copy of the Next app under Desktop.

## Prune rules

Keep: `resync-ai`, `koder-pack`, `docs`, `pdf-deliverables`, slim Desktop, root deploy docs. Delete: Desktop `01-website` duplicate, unused MissionSection, fabricated reviews until real quotes exist. Merge duplicate canvas teasers.

## Quality gates before “done”

- `npm run typecheck` and unit tests green when deps available
- Prices consistent site-wide
- Admin blocked without role
- No secrets in git (`git grep` for passkey patterns fails)
- Vercel Root Directory documented as `resync-ai`
- Competitive docs present (10 briefs + this prompt + sourceful audit)

## Narrative for investors and staff

Automation markets pay for reduced toil. Leaders prove PLG + enterprise dual motion. Resync’s wedge is heal + multimodal + score + agent-operated SaaS. Illustrative ARR scenarios live in legal economics docs and must stay labeled illustrative. Capability claim: meet base-case unit economics if activated→paid and churn bands hold.

## Execution mantra

**Clear the highway:** one app, one price table, one auth story, one admin door, one agent fleet under approval, one Desktop vault for partners, zero duplicate websites, zero secrets in source.

Build in showdown order: sweep docs → auth/gates/prices → landing UX → studio/code panel → agent fleet/cron/python → community/analytics → Desktop slim → prune → social/logo assets.

When uncertain, prefer the existing engine and tiers over greenfield rewrites. Extend `TierGate`, `moduleCatalog`, Supabase helpers, and Stripe routes. Ship real routes and real components—not mockups described in prose.

---

*End of implementation prompt. Approximate length target: 2000 words including tables and lists.*

## Appendix A — Sprint language for engineers

Every PR description should answer: Which highway lane did this clear? Prices touched? Auth touched? Agent memory mutated? Desktop duplication introduced? If yes to duplication, reject the PR. Prefer incremental merges into `resync-ai/app` and `resync-ai/components`. Keep koder-pack regenerated from public screens only after UX freezes.

## Appendix B — Sprint language for design

Motion must serve hierarchy: brand first, one headline, one supporting line, one CTA group on the first viewport. No card grids in the hero. No purple-on-white cliché. Near-black, cyan, indigo. Letter-by-letter animations disable under prefers-reduced-motion. Upsell popups never trap focus without an escape. Admin consoles use thin outlines and calm fields so telemetry is readable for long sessions.

## Appendix C — Sprint language for operators

Before demos: confirm Vercel Root Directory, Supabase env, Stripe price IDs, and that admin users exist. Walk the footer Admin link. Trigger a failed login and confirm a security_event row. Run price auditor cron and confirm Herald would flag drift. Approve one Curator community draft end-to-end. Export a Builder graph and verify code side panel download.

## Appendix D — Legal and trust

Customer-facing Privacy/Terms must stay synchronized with subprocessors (Supabase, Stripe, model providers). Partnership 50/50 drafts remain counsel-bound and private. Do not imply trademarks are registered until filed. Do not present illustrative ARR as forecasts in public marketing.

## Appendix E — Definition of delightful

A new visitor understands Resync in five seconds (heal multimodal workflows), reaches Studio or Builder in two clicks, sees an overview score before they feel lost, and meets a pricing page that feels cinematic yet honest. An admin opens the fleet, watches Overseer narrate, and trusts that autonomy never silently rewrites production.

## Appendix F — Anti-goals

No second monorepo app. No hardcoded founder passkeys. No unbounded web scraping. No silent self-modifying site. No fabricated customer reviews. No Index-of-/ demos. No UE5 binary in the web client. No 27k-file mythology—measure real file counts and prune.

Follow this prompt until the highway is clear.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.


## Reinforcing the highway metaphor

Clearing the highway means every commit removes friction for the next demo: fewer duplicate trees, fewer price lies, fewer unauthenticated admin doors, fewer mock reviews, and more scoreable, healable workflows. Resync wins when a builder can go from idea to graded graph without confusion, when an operator trusts heal metrics, and when admins see agents propose rather than silently mutate. Keep shipping along that road until the product feels inevitable.
