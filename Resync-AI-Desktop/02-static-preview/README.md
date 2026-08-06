# Resync AI — iPhone / Koder offline pack

Static SPA preview of the Resync AI remodel (brand-first home, builder, multimodal catalog, studio, community, marketplace, pricing, vision/privacy/terms, floating **a-sync agent**).

This zip does **not** run the full Next.js app (`resync-ai/`). Use it to open the product UI on iPhone without Vercel or GitHub Actions.

## Files (exactly 5 types — Koder-friendly)

| File | Role |
|------|------|
| `index.html` | Shell, header, footer (brand only), agent chrome |
| `styles.css` | Dark near-black + cyan/indigo, glass, motion |
| `app.js` | Hash router, builder/studio/community UX, agent replies |
| `data.json` | Catalog subset, pricing $0/$39/$129, marketplace, copy |
| `README.md` | This guide |

## Open on iPhone

1. Download **`resync-ai-iphone.zip`** (repo root, `koder-pack/`, or artifacts).
2. In **Files**, tap the zip → **Uncompress**.
3. Open the folder in **Koder** → open **`index.html`** → **Preview** / Web View.
4. Use **Menu** on small screens; tap **Ask a-sync agent** for navigate/recommend help.

### Safari (optional)

Host the unzipped folder (e.g. GitHub Pages) and open `index.html` in Safari. Local `file://` may block `fetch` of `data.json`; the app falls back to embedded data in `app.js`.

## Screens

- **Home** — brand-first hero + canvas teaser  
- **Builder** — add modules, validate, export text  
- **Multimodal** — search/filter catalog → add to builder  
- **Studio** — idea → simple graph → send to builder  
- **Community** — feed + compose + word-filter moderation  
- **Marketplace** — free / paid cards + fee note  
- **Pricing** — Community $0 / Builder $39 / Pro $129 / Enterprise  
- **Vision / Privacy / Terms** — short summaries  
- **a-sync agent** — canned navigate & recommend replies (does not build full workflows)

## Full cloud app (Next.js)

Deploy from **`resync-ai/`** with Vercel **Root Directory = `resync-ai`**.  
If you see an **“Index of /”** listing (`.rsc`, `_next` folders), Root Directory is wrong — see [VERCEL-DEPLOY.md](../VERCEL-DEPLOY.md).

Working static preview (Netlify): `https://deploy-preview-4--a-syncai.netlify.app`
