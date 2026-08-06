# Resync AI — Desktop Pack (START HERE)

## Layout

| Path | Purpose |
|------|---------|
| `run.bat` / `run.sh` | Install + `npm run dev` for **`../resync-ai`** |
| `open-preview.bat` | Static remodel UI |
| `open-slideshow.bat` | Investor deck |
| `open-contracts.bat` | PDF contracts |
| `partners/` | **Daniel** + **Brooke** private chip vault (`partners/index.html`) |
| `01-website/` | Pointer only — not a second app copy |
| `02-static-preview/` | Offline SPA |
| `03-contracts-pdf/` | Shared PDFs + review |
| `04-investor-slideshow/` | Showcase deck |
| `05-guides/` | Deploy guides |

## Admin (never in this pack)

Bootstrap admins with env-only secrets:

```bash
cd ../resync-ai
# set ADMIN_EMAIL_1 / ADMIN_PASSWORD_1 (and optional _2) in env — not in git
node scripts/bootstrap-admin.mjs
```

Footer **Admin** → `/admin/login`. Unauthorized attempts are reported.

## Prices

Community **$0** · Builder **$39** · Pro **$129** · Enterprise custom · Marketplace **20%** (Enterprise **12%**).
