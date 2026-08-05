# Resync AI — Koder iPhone pack (5 file types only)

Import this **folder** into **Koder** on your iPhone. The site behaves like the live Resync AI app (all main screens).

## Files (exactly 5 types)

| File | Type | Role |
|------|------|------|
| `index.html` | **HTML** | App shell, header, footer |
| `styles.css` | **CSS** | Dark theme, glass UI, mobile layout |
| `app.js` | **JavaScript** | Routing, builder, templates, dashboard |
| `data.json` | **JSON** | Templates, pricing, stats, copy |
| `README.md` | **Markdown** | This guide |

No other file types are required.

## Setup in Koder

1. Copy the whole **`koder-pack`** folder to iPhone (Files app, iCloud, or GitHub → download folder).
2. In **Koder**, open the **`koder-pack`** folder as project.
3. Open **`index.html`** → use **Preview / Web View** (or Koder’s built-in browser).
4. Use **Menu** on small screens; desktop nav appears on wider preview.

## Screens (same as website)

- **Home** — hero, stats, templates, waitlist  
- **Templates** — gallery; tap → **Builder**  
- **Community** / **Mission** / **Pricing** / **Resources**  
- **Docs** — deployment guides (Safari)  
- **Dashboard** — metrics + telemetry table  
- **Builder** — add nodes, validate, export (preview)  
- **Sign in** — guest mode → builder  

## If `data.json` does not load

Some previews block `fetch` on `file://`. The app **automatically falls back** to embedded data in `app.js` — the UI still works.

## View in iPhone Safari (no Koder)

See repo root **`IPHONE-VIEW-AND-SAVE.md`** — enable GitHub Pages, then open:

`https://dan88-mac.github.io/https-github.com-DannybrookeAI-dna-digital-guide/`

## Full production app

Deploy from GitHub folder **`resync-ai/`** via Vercel (see [VERCEL-DEPLOY.md](../VERCEL-DEPLOY.md)).
