# View the website & save everything on iPhone

You **cannot** run the full Next.js app on iPhone without a cloud deploy—but you **can** view the site in Safari and save all files to the **Files** app.

---

## Option A — View in Safari (easiest after GitHub Pages is on)

### One-time setup (2 minutes, on iPhone)

1. Open **Safari** → [github.com/dan88-mac/https-github.com-DannybrookeAI-dna-digital-guide](https://github.com/dan88-mac/https-github.com-DannybrookeAI-dna-digital-guide)
2. Tap **Settings** (repo) → **Pages** (or on desktop: repo **Settings → Pages**).
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Merge the branch `cursor/resync-ai-full-build-86ce` into **main** (or ask Cursor to merge the PR).
5. Wait ~2–5 min for the **Pages — Resync preview site** workflow to finish (green check on **Actions** tab).

### Your live preview URL (Safari)

After Pages is enabled, open:

**https://dan88-mac.github.io/https-github.com-DannybrookeAI-dna-digital-guide/**

Use the menu → **Contracts** to open PDFs and legal docs.  
This is the same experience as the **Koder pack**, works on iPhone without Koder.

> If the link 404s, Pages is not enabled yet—use Option B or C below.

---

## Option B — GitHub app → download whole project to Files

This saves **all folders** (website code, contracts, PDFs, Koder pack):

1. Install **GitHub** from the App Store → sign in.
2. Open repo: **https-github.com-DannybrookeAI-dna-digital-guide**
3. Tap **⋯** (more) → **Download ZIP** (or clone; ZIP is simplest).
4. When download completes, tap **Share** → **Save to Files**.
5. Choose **On My iPhone** → create folder **Resync AI** → Save.

You now have:

| Folder | What it is |
|--------|------------|
| `koder-pack/` | Open `index.html` in **Koder** preview |
| `pdf-deliverables/daniel-noel-mcgarry/` | Your PDF + contracts |
| `pdf-deliverables/brooke-caroline-hunt/` | Brooke’s PDF + contracts |
| `resync-ai/` | Full SaaS (deploy via Vercel) |
| `docs/business-legal/` | All legal markdown |

### View contracts from Files

1. **Files** app → **Resync AI** → `pdf-deliverables` → your name folder.
2. Tap **`Resync-AI-Complete-Package-daniel-noel-mcgarry.pdf`** (or Brooke’s).
3. iPhone opens Quick Look — pinch/zoom, share, or print.

---

## Option C — Koder (5-file mini site offline)

1. In **Files**, go to **Resync AI/koder-pack** (from ZIP).
2. In **Koder**, open that folder as project.
3. Open **`index.html`** → **Preview / Web View**.
4. Tap **Contracts** in the menu for links (needs internet for GitHub PDF URLs).

---

## Option D — Full production website (Vercel)

The **real** SaaS (login, Supabase, Stripe) needs cloud hosting:

1. **Safari** → [vercel.com](https://vercel.com) → sign in with GitHub.
2. Import this repo → set **Root Directory** to **`resync-ai`**.
3. Deploy → open the `*.vercel.app` link.

Details: `resync-ai/DEPLOY-FROM-GITHUB.md` (inside your ZIP).

---

## Contracts only (quick links)

After merge to **main**, open in Safari:

| Document | Link |
|----------|------|
| Daniel PDF | [Open PDF](https://raw.githubusercontent.com/dan88-mac/https-github.com-DannybrookeAI-dna-digital-guide/main/pdf-deliverables/daniel-noel-mcgarry/Resync-AI-Complete-Package-daniel-noel-mcgarry.pdf) |
| Brooke PDF | [Open PDF](https://raw.githubusercontent.com/dan88-mac/https-github.com-DannybrookeAI-dna-digital-guide/main/pdf-deliverables/brooke-caroline-hunt/Resync-AI-Complete-Package-brooke-caroline-hunt.pdf) |

*(Links work after files are on the `main` branch.)*

---

## Why nothing worked before

| Try | Issue |
|-----|--------|
| Koder only | Needs correct folder + Preview on `index.html` |
| Next.js on phone | Requires `npm run dev` or Vercel—not runnable in Files alone |
| PDF in GitHub | Must tap file → download/view, or use ZIP to Files |

---

## Need help?

Email yourself the GitHub Pages URL once Actions deploy succeeds, or the ZIP from **Download ZIP**—both work entirely from iPhone.
