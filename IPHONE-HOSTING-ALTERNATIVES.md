# Other ways to view Resync AI on iPhone (when Vercel & GitHub fail)

Vercel runs the **full** Next.js app (`resync-ai/`) — it needs env vars and a successful build.  
If that fails, use a **static preview** (`koder-pack/`) — same look, menu, Contracts, Builder — on any host below.

---

## ⭐ Option 1 — Netlify (recommended, ~3 minutes)

Works in **Safari on iPhone**.

1. Open **https://app.netlify.com** → Sign up with **GitHub**.
2. **Add new site** → **Import an existing project** → choose your GitHub repo.
3. Netlify reads **`netlify.toml`** at repo root automatically:
   - **Publish directory:** `koder-pack`
   - **Build command:** (empty / echo only)
4. Tap **Deploy site**.
5. You get a URL like **`https://random-name.netlify.app`** — bookmark on iPhone.

**No root directory mistake** — unlike Vercel, you do **not** set `resync-ai` for this preview.

### Netlify Drop (no GitHub)

1. On a computer (or Files → compress `koder-pack` to ZIP):
2. **https://app.netlify.com/drop** → drag the **`koder-pack`** folder or ZIP.
3. Netlify gives you a live URL immediately.

---

## Option 2 — Cloudflare Pages (free, stable)

1. **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** → Connect GitHub.
2. Select your repo.
3. **Framework preset:** None  
4. **Build command:** *(leave blank)*  
5. **Build output directory:** `koder-pack`  
6. **Save and Deploy** → open `*.pages.dev` on iPhone.

---

## Option 3 — Render static site

1. **https://dashboard.render.com** → **New** → **Static Site** → connect GitHub repo.
2. **Publish directory:** `koder-pack`  
3. **Build command:** *(empty)*  
4. Create → open the `onrender.com` URL on iPhone.

(Or use **`render.yaml`** in this repo if Render detects it.)

---

## Option 4 — Fix Vercel (full app with APIs)

Only use this when you want **login, Supabase, Stripe** — not just the preview UI.

| Setting | Value |
|---------|--------|
| Root Directory | `resync-ai` |
| Framework | Next.js |
| Env vars | At minimum: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL` (= your Vercel URL) |

**Why Vercel “doesn’t work”:**

- Wrong root (must be `resync-ai`, not repo root).
- Build fails without placeholder env vars — add the three above, redeploy.
- **Cold start** on free tier — first load slow; refresh once.
- Visiting `/builder` with Supabase configured but not logged in → redirects to login (expected).

For **iPhone testing of the UI only**, use **Netlify + koder-pack** (Option 1).

---

## Option 5 — GitHub Pages (if Actions are enabled)

1. Repo **Settings** → **Pages** → Source: **GitHub Actions**.
2. Merge to `main` → wait for workflow **“Pages — Resync preview site”**.
3. URL: **https://dan88-mac.github.io/https-github.com-DannybrookeAI-dna-digital-guide/**

If you **can’t** see Pages in Settings, use Netlify (Option 1) instead — same files, easier setup.

---

## Option 6 — Offline on iPhone (Files + Koder)

1. GitHub app → repo → **Download ZIP** → **Save to Files**.
2. **Koder** → open **`koder-pack`** → preview **`index.html`**.

Contracts: menu → **Contracts** (needs internet for PDF links) or open PDFs from **`pdf-deliverables/`** in Files.

---

## Option 7 — Email yourself a link

After Netlify/Cloudflare deploy, email the **`https://….netlify.app`** link to yourself and open on iPhone — simplest daily access.

---

## Quick comparison

| Method | Full SaaS APIs | iPhone Safari | Setup difficulty |
|--------|----------------|---------------|------------------|
| Netlify (`koder-pack`) | Preview UI only | ✅ | Easy |
| Cloudflare Pages | Preview UI only | ✅ | Easy |
| Vercel (`resync-ai`) | ✅ Full | ✅ if build OK | Harder |
| Files + Koder | Preview offline | ✅ | Medium |
| GitHub Pages | Preview UI | ✅ if enabled | Medium |

---

## Contracts on iPhone

On any live preview URL → tap **Contracts** in the menu.

Or in **Files** → `pdf-deliverables/daniel-noel-mcgarry/*.pdf`

---

**Recommended for you right now:** **Netlify Option 1** — import GitHub repo, deploy `koder-pack`, bookmark the URL on your iPhone home screen (Safari → Share → Add to Home Screen).
