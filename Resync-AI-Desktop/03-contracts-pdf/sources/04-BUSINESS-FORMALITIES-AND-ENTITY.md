# Business formalities & entity setup

Indexed procedure for Daniel Noel Mcgarry and Brooke Caroline Hunt.

## Phase 1 — Choose structure (with advisor)

| Option | Typical use | Notes |
|--------|-------------|-------|
| **UK Ltd** | Two shareholders, 50/50 | Companies House, PSC register |
| **US LLC** | Flexible, pass-through tax | Operating agreement mirrors doc 03 |
| **AU Pty Ltd** | Two directors/shareholders | ASIC registration |

**Action:** Both partners meet accountant + solicitor → select jurisdiction → reserve name **“Resync AI Ltd”** (or local equivalent).

## Phase 2 — Incorporation checklist

- [ ] Register company; issue 50/50 shares  
- [ ] Adopt shareholders’ / operating agreement (based on doc 03)  
- [ ] Register PSC / beneficial owners  
- [ ] Obtain EIN / VAT / GST numbers as applicable  
- [ ] Open **business bank account** (dual authorization for transfers > threshold)  
- [ ] Accounting software (Xero, QuickBooks) + chart of accounts for SaaS (deferred revenue)  

## Phase 3 — Operating accounts & vendors

| Vendor | Purpose | Contract owner |
|--------|---------|----------------|
| Stripe | Subscriptions | Company |
| Supabase | Database / auth | Company |
| Vercel / Render | Hosting | Company |
| OpenAI | Runtime API | Company |
| Domain registrar | resync.ai (or chosen TLD) | Company |
| Google Workspace / M365 | Email @company domain | Company |

## Phase 4 — Insurance & risk

- [ ] Cyber liability insurance  
- [ ] Professional indemnity (if consulting bundled)  
- [ ] D&O if raising external capital later  

## Phase 5 — Policies (minimum viable governance)

- [ ] Privacy policy + cookie notice (GDPR / UK GDPR / CCPA as applicable)  
- [ ] Terms of service + acceptable use  
- [ ] Data processing agreement template for B2B customers  
- [ ] Internal data retention schedule  

## Phase 6 — Record keeping

Maintain **digital minute book**:

- Signed PDF of doc 03 in `pdf-deliverables/daniel-noel-mcgarry/` and `brooke-caroline-hunt/`  
- Cap table spreadsheet (updated only by unanimous decision)  
- Board/partner resolutions for Major Decisions (Section 6.2)  

## Tax & profitability routing

- SaaS revenue recognized per accounting standard (IFRS 15 / ASC 606)  
- Separate **Stripe balance** from operating expenses  
- Quarterly partner review: burn, runway, distribution vs reinvestment (doc 07)  
