# IP, trademarks, security & customer contracts

Combined necessities for Resync AI protection.

## 1. Trademark & brand

| Asset | Action | Status |
|-------|--------|--------|
| Word mark **“Resync AI”** | File in primary markets (UK IPO / USPTO class 42, 9) | ☐ |
| Logo (see `assets/resync-ai-logo-primary.png`) | File figurative mark | ☐ |
| Domain `resync.ai` or alternative | Register 5–10 year; WHOIS privacy | ☐ |
| Social handles | Secure @resyncai consistent | ☐ |

**Usage rules:** ® after registration; ™ before. Watermarked PDFs use logo + “CONFIDENTIAL — Resync AI”.

## 2. Copyright & code

- Repository: private GitHub org owned by **Company**, both founders as admins  
- **CONTRIBUTOR LICENSE AGREEMENT** for any non-founder devs  
- LICENSE file: proprietary by default; exported customer code under separate export license  

## 3. Trade secrets

- OpenAI prompts/tool schemas for self-healing  
- Stripe webhook handling + credit algorithms  
- Community template ranking  

Store secrets in **1Password / Bitwarden**; never in git.

## 4. Security program (technical + organizational)

### 4.1 Technical (maps to `resync-ai/`)

| Control | Implementation |
|---------|----------------|
| Tenant isolation | Supabase RLS |
| Secrets | Server-only env; rotation quarterly |
| Transport | TLS everywhere |
| Webhooks | Stripe signature verification + idempotency table |
| Rate limits | Runtime execute endpoint |
| CSP | `next.config.mjs` headers |
| Backups | Supabase PITR; test restore quarterly |

### 4.2 Organizational

- Assign **Security Owner** (Daniel or Brooke, rotate annually)  
- Incident response: 24h customer notification for material breaches (legal to refine)  
- Annual penetration test from year 2 revenue threshold  

## 5. Customer-facing legal stack

1. **Terms of Service** — subscription, credits, fair use, limitation of liability  
2. **Privacy Policy** — sub-processors (Supabase, Stripe, OpenAI, Vercel)  
3. **DPA** — for EU/UK B2B  
4. **SLA** — Enterprise tier uptime & support response  

## 6. Partner & contractor agreements

- NDA (mutual) before sharing doc package  
- IP assignment in all dev/design contracts  
- 50/50 partners sign doc 03 before external equity discussions  

## 7. Signed agreement storage

| Document | Location |
|----------|----------|
| Partnership agreement (signed) | Both PDF folders + encrypted backup |
| Trademark certificates | Company minute book |
| Insurance certificates | Shared drive |

## 8. Watermarked contract PDFs

Generate via `scripts/generate-partner-pdf-pack.sh` — includes logo watermark and partner name on cover.
