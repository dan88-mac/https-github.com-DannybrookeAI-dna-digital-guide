# Australia (NSW) — registration, ABN & next steps

**Jurisdiction:** New South Wales, Australia  
**Product:** Resync AI (SaaS)  
**Draft v1.1 — not legal or tax advice; confirm with an Australian accountant and solicitor.**

---

## Co-founders (50/50)

| | Daniel Noel Mcgarry | Brooke Caroline Hunt |
|---|---------------------|----------------------|
| **Role** | Co-founder / 50% | Co-founder / 50% |
| **Email** | danielmcgarrys@gmail.com | misshookiehunt@gmail.com |
| **Mobile** | 0468 460 863 | 0472 876 976 |
| **Address (residential / contact)** | 21 Judith St, Gorokan NSW | 72 Richardson Rd, San Remo NSW |

Use these on **ABN application** and **company registration** once your solicitor confirms. For a **public GitHub repo**, consider keeping this file private or redacting street addresses after ASIC registration (use registered office address instead).

---

## Business name & ABN (your next actions)

### Step 1 — Choose and reserve business name

1. Search **[ASIC Connect](https://connectonline.asic.gov.au/)** → Business names / company name availability.  
2. Decide legal structure (most common for you two):

| Structure | Best when | 50/50 fit |
|-----------|-----------|-----------|
| **Pty Ltd** (proprietary limited) | SaaS, liability protection, investors later | Issue 50 shares each or equal share classes |
| **Partnership + ABN** | Very early, low cost | Partnership agreement (doc 03) essential |

**Recommended path for Resync AI:** **Australian Pty Ltd** owning the IP, with Daniel and Brooke each holding **50% of shares** (mirror [03-PARTNERSHIP-AND-OWNERSHIP-AGREEMENT.md](./03-PARTNERSHIP-AND-OWNERSHIP-AGREEMENT.md) in a **Shareholders’ Agreement** reviewed locally).

**Business name to register:** _________________________ (e.g. *Resync AI Pty Ltd*)  
**ABN (after registration):** __ __ ___ ___ ___ ___ ___ (9 digits — apply below)

### Step 2 — Register company (Pty Ltd)

- Use ASIC **Form 201** via registered agent or online service (e.g. accountant/lawyer bundle).  
- Registered office: can be accountant’s office or suitable NSW address (not necessarily home).  
- **ACN** issued → then apply for **ABN** via **[abr.business.gov.au](https://abr.business.gov.au/)**.

### Step 3 — ABN & GST

- **ABN:** Required for invoicing, Stripe AU, and tax. Free via Australian Business Register.  
- **GST:** Register when turnover approaches **$75,000** AUD/year (or register voluntarily if claiming credits).  
- **PAYG / super:** When you pay salaries (including yourselves as employees/directors — ask accountant).

### Step 4 — Bank account

- Open **business account** in company name; two signatories recommended for amounts above your agreed threshold (doc 03).

### Step 5 — IP & contracts (Australia)

- Assign all Resync AI IP from both founders **to the Pty Ltd** (deed of assignment — lawyer).  
- **Trade mark:** **[ipaustralia.gov.au](https://www.ipaustralia.gov.au/)** — classes **9** (software) and **42** (SaaS).  
- **Privacy:** Australian Privacy Act / APPs; privacy policy mentioning overseas subprocessors (Supabase, OpenAI, Stripe, Vercel).  
- **Terms of use:** Governed by **laws of New South Wales, Australia**; courts of NSW.

Update doc 03 signature block:

- **Governing law:** State of New South Wales, Commonwealth of Australia.

---

## Deploy product (no laptop — iPhone)

1. Merge PR on GitHub (Safari).  
2. Connect repo to **Vercel** → root `resync-ai` → see [../../resync-ai/DEPLOY-FROM-GITHUB.md](../../resync-ai/DEPLOY-FROM-GITHUB.md).  
3. Supabase **Sydney** region + run SQL migrations.  
4. Set env vars on Vercel → redeploy.

---

## Checklist — “completed vs you still do”

| Area | Status in repo | Your action |
|------|----------------|-------------|
| SaaS codebase | ✅ `resync-ai/` | Deploy via Vercel |
| 50/50 agreement draft | ✅ Doc 03 | NSW solicitor review + sign |
| Partner PDF packs | ✅ `pdf-deliverables/` | Sign & store |
| Pty Ltd + ACN | ☐ | ASIC registration |
| ABN | ☐ | abr.business.gov.au |
| Business name | ☐ | Fill in above when chosen |
| Trademark AU | ☐ | IP Australia |
| Stripe AU | ☐ | Business verification |
| Cyber insurance | ☐ | Broker (recommended before scale) |

---

## Recommended professionals (Central Coast NSW)

Search locally for: **small business accountant** (SaaS + R&D Tax Incentive later) and **commercial solicitor** (shareholders’ agreement + IP assignment). Bring this folder + doc 03 to the first meeting.

---

## Document index

Continue with [01-MASTER-INDEX.md](./01-MASTER-INDEX.md) and [11-SIGNATURE-AND-FILING-PROCEDURE.md](./11-SIGNATURE-AND-FILING-PROCEDURE.md).
