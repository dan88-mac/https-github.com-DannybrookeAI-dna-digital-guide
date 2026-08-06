# Resync AI — Contract & package last-look review

**Review date:** 6 August 2026  
**Scope:** Full business-legal framework + partner PDF packages + alignment with live product (`01-website` / `resync-ai`)  
**Status:** Draft materials — **not legal advice**. Require NSW solicitor / corporate counsel before signing or filing.

---

## How to use this checklist

1. Open both PDFs side-by-side (Daniel + Brooke packages).
2. Walk each section below; tick only when verified.
3. Fix gaps in `sources/` then regenerate partner PDFs before wet-ink signatures.
4. Keep public SaaS UI **brand-only** (Resync AI); partner names belong in contracts / investor packs, not marketing chrome.

---

## A. Legal hygiene (must pass)

| Criterion | Source | Finding | Pass? |
|-----------|--------|---------|-------|
| Disclaimer present & first | `00-LEGAL-DISCLAIMER.md` | States drafts are not a substitute for attorney/accountant/trademark agent | ☐ Fix if missing in PDF cover |
| Document control (product, version, date, partners) | Disclaimer table | Product Resync AI; Draft 1.0; 5 Aug 2026; 50/50 partners named | ☐ |
| Governing law chosen | Doc 03 § header | **NSW, Australia** recommended — blanks remain for counsel | ☐ Counsel to confirm |
| Entity not yet formed called out | Doc 04, AU sheet | Company name TBD; formation steps in AU/NSW guide | ☐ |
| Signature blocks unsigned | Doc 03, 11 | Correct — must stay blank until counsel + wet ink | ☐ Do not “fake sign” |
| Schedules A/B empty | Doc 03 | Contributions & pre-existing IP still blank — **blocking for enforceability** | ☐ Fill before sign |
| Vesting election unchecked | Doc 03 §3.4 | Optional boxes empty — decide with counsel | ☐ |
| Monetary thresholds blank | Doc 03 §6.1–6.2 | Day-to-day vendor cap and debt/litigation thresholds blank | ☐ Fill |

---

## B. Ownership & partnership (50/50 criteria)

| Criterion | Source | Finding | Pass? |
|-----------|--------|---------|-------|
| Equal economic ownership | Doc 03 §3.1 | **50% Daniel Noel Mcgarry / 50% Brooke Caroline Hunt** | ☐ |
| Equal voting / major decisions unanimous | Doc 03 §6.2 | Sale, dilution, IP exclusive license, budget, related-party, litigation | ☐ |
| Deadlock path | Doc 03 §6.3 | Mediation → buy-sell §8 | ☐ |
| Distributions 50/50 | Doc 03 §5.2 | Subject to unanimous reinvestment | ☐ |
| IP assignment to Company | Doc 03 §7 | Forward IP to Company; pre-existing in Schedule B | ☐ |
| Exit / ROFR | Doc 03 §8 | Fair value formula options present but not elected | ☐ Elect formula |
| Partner packages consistent | Executive packages | Both packages must mirror 50/50 and same doc set | ☐ Diff both PDFs |

---

## C. Commercial alignment with **live product** (critical)

Live product source of truth: `01-website/lib/billing/tiers.ts` and marketplace fees.

| Item | Contracts / older docs | Live product | Action |
|------|------------------------|--------------|--------|
| Free tier | Community $0 / 500 credits | Community $0 / 500 credits | Aligned |
| Mid tier name | “Starter” in some charts | **Builder** | Rename in economics docs |
| Mid price | **$29** in doc 07 (old) | **$39** | **Update to $39** |
| Mid credits | 5,000 (old) | **8,000** | **Update** |
| Pro price | **$99** (old) | **$129** | **Update to $129** |
| Pro credits | 25,000 (old) | **40,000** | **Update** |
| Marketplace fee | 15–20% phase language | **10% buyer + 10% seller = 20%** (Enterprise 12%) | Align wording |
| Canvas scale | Implied | Up to **50 modules** on Pro | Mention in commercial annex |

**Reviewer note:** Pricing mismatch was the highest-priority commercial defect. Sources under this Desktop pack and repo docs should match `$0 / $39 / $129 / Custom` after this review pass.

---

## D. Entity, AU/NSW filing, IP & security

| Criterion | Source | Finding | Pass? |
|-----------|--------|---------|-------|
| Formation path | Doc 04, 12, AU sheet | Pty Ltd / ABN / NSW guidance present | ☐ Engage accountant |
| Banking / tax placeholders | Doc 04 | Expected blanks until entity exists | ☐ |
| Trademark plan | Doc 05, 11 | IP Australia / multi-office guidance | ☐ Do not claim registered marks until filed |
| Security program referenced | Doc 05 + Doc 03 §10 | Security owner + compliance program | ☐ Appoint owner |
| Customer contract posture | Doc 05 | Templates / TOS direction — not final ToS | ☐ Counsel for production ToS/DPA |
| Signature & PDF storage procedure | Doc 11 | Path to `/pdf-deliverables/` after signing | ☐ |

---

## E. Vision, economics & roadmap integrity

| Criterion | Source | Finding | Pass? |
|-----------|--------|---------|-------|
| Vision / mission coherent | Doc 02 | Self-healing layer; community + export ownership | ☐ |
| Financials labeled illustrative | Doc 07 | “Not financial advice”; scenario table | ☐ Keep disclaimer in investor deck |
| Unit economics plausible for B2B SaaS | Doc 07 + industry norms | Gross margin target ~70–85% band vs public SaaS comps | ☐ Model, not forecast |
| 5–10 year roadmap non-dead-end | Docs 08, 10 | Marketplace → enterprise → platform API | ☐ |
| Industry models mapped | Doc 06 | Subscription, credits, freemium, marketplace, services | ☐ |

**Illustrative ARR (base case, planning only):** Y1 $240k → Y5 $6M (doc 07). These are **scenarios**, not commitments to investors.

---

## F. Product / engineering criteria (deployment-ready)

| Criterion | Live codebase | Finding | Pass? |
|-----------|---------------|---------|-------|
| Next.js App Router SaaS | `01-website/` | Builder, multimodal, studio, community, marketplace, legal, agent | ☐ |
| Module catalog depth | `lib/engine/moduleCatalog.ts` | ~260 modules / 24 categories | ☐ |
| Overview scoring pillars | `lib/engine/overviewScore.ts` | Structural, multimodal, resilience, libraries, ops, readiness, pairing | ☐ |
| Billing tiers coded | `lib/billing/tiers.ts` | Matches §C live prices | ☐ |
| Deploy docs | `05-guides/VERCEL-DEPLOY.md` | Root Directory **`resync-ai`** / Index-of-/ warning | ☐ |
| Static parity pack | `02-static-preview/` | Offline remodel UI for demos | ☐ |

---

## G. Partner PDF package completeness

| Asset | Path | Pass? |
|-------|------|-------|
| Daniel complete PDF | `03-contracts-pdf/daniel-noel-mcgarry/Resync-AI-Complete-Package-daniel-noel-mcgarry.pdf` | ☐ Open & skim TOC |
| Brooke complete PDF | `03-contracts-pdf/brooke-caroline-hunt/Resync-AI-Complete-Package-brooke-caroline-hunt.pdf` | ☐ Open & skim TOC |
| Sources mirror | `03-contracts-pdf/sources/*.md` | ☐ Same version as PDF build |
| Next steps | `05-guides/NEXT-STEPS-DANIEL-BROOKE.md` | ☐ |

---

## H. Blocking items before signature (priority order)

1. **Solicitor review** under NSW law; finalize entity type (Pty Ltd) and agreement form (shareholders vs partnership).
2. **Fill Schedule A/B**, vesting election, dollar thresholds, effective date.
3. **Align all commercial annexes** to live tiers: Community **$0**, Builder **$39**, Pro **$129**, Enterprise custom; marketplace **20%** (12% enterprise).
4. **Register entity + ABN**; move domains/accounts into company name.
5. **Trademark search + filing** (IP Australia) before heavy public brand spend.
6. **Production Privacy/Terms/DPA** reviewed for Supabase/Stripe/OpenAI subprocessors.
7. **Regenerate partner PDFs** after edits; store signed copies per Doc 11.

---

## I. What already meets criteria well

- Clear **50/50** ownership narrative across disclaimer, partnership agreement, and vision values.
- Strong **Major Decisions / deadlock / buy-sell** skeleton for a two-founder company.
- Explicit **draft / not advice** posture (reduces misuse risk).
- Product has a real **full-stack** shape (Next.js, engine, billing types, deploy guides) suitable to demo beside the contracts.
- Economics doc separates **illustrative scenarios** from guarantees — keep that language in investor materials.

---

## Sign-off (internal)

| Role | Name | Date | Notes |
|------|------|------|-------|
| Product / engineering check | | | |
| Commercial / pricing check | | | |
| Partner A review | Daniel Noel Mcgarry | | |
| Partner B review | Brooke Caroline Hunt | | |
| External counsel | | | **Required before binding effect** |

---

*Generated for the Resync AI Desktop Pack last-look. Update this file when sources or `tiers.ts` change.*
