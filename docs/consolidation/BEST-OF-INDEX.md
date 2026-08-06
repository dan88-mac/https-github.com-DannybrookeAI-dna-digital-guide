# BEST-OF Index — Resync AI consolidation

Sweep date: 2026-08-06 · ~445 tracked files · Canonical app: `resync-ai/`

## Verdict legend

| Verdict | Meaning |
|---------|---------|
| KEEP | Canonical; do not duplicate |
| MERGE | Fold into KEEP target |
| SLIM | Keep path but remove duplication |
| DELETE | Remove after merge |
| PRIVATE | Partner-only (Desktop vault / PDFs) |

## Product UI

| Path | Verdict | Notes |
|------|---------|-------|
| `resync-ai/components/marketing/HeroImmersive.tsx` | KEEP | Brand-first hero |
| `resync-ai/app/page.tsx` | MERGE | Trim duplicate canvas sections |
| `FeatureVideoShowcase.tsx` | MERGE | Into hero media bed |
| `ReviewsSection.tsx` | DELETE | Fabricated quotes until real |
| `VisionLegalStrip.tsx` | MERGE | Into Footer / vision |
| `MissionSection.tsx` | DELETE | Unused overlap |
| `ScaleShowcase` + `MonsterCanvasTeaser` | MERGE | Single scale demo |
| `Header.tsx` / `Footer.tsx` | KEEP | Add Admin footer link |
| Legal pages (privacy/terms/…) | KEEP | Product legal |
| `lib/engine/*` | KEEP | ~260 modules, scores |
| `lib/billing/tiers.ts` | KEEP | $0 / $39 / $129 |
| `components/billing/TierGate.tsx` | KEEP | Expand usage |
| `app/(auth)/login` | KEEP | Harden + admin sibling |
| Stripe / community APIs | KEEP | |
| `koder-pack/` | SLIM | Offline mirror of public screens |
| `Resync-AI-Desktop/01-website/` | DELETE | Duplicate of app; launcher only |
| `Resync-AI-Desktop/02-static-preview` | KEEP | Instant preview |
| `docs/business-legal/*` | KEEP | Governance |
| `pdf-deliverables/*` | PRIVATE | Partner PDFs |
| Investor slideshow | KEEP | Desktop pack |

## Pricing alignment targets

Everywhere must show: Community **$0**, Builder **$39**, Pro **$129**, Enterprise custom; marketplace **20%** (Enterprise **12%**).

## Brand

Public SaaS: **Resync AI** only. Founder names only in PRIVATE packs.
