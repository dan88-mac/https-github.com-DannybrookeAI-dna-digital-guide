# One-time setup — then GitHub deploys Netlify for you

I **cannot** click Netlify on your iPhone or use your Netlify login from Cursor’s server (Netlify’s API is blocked from this VM).  
You can still deploy **automatically from GitHub** in about **5 minutes**:

---

## Path A — Netlify app on iPhone (no tokens, easiest)

1. Safari → **https://app.netlify.com** → log in with **GitHub**.
2. **Add new site** → **Import an existing project**.
3. Pick repo **`https-github.com-DannybrookeAI-dna-digital-guide`**.
4. Branch: **`main`** (merge your PR first) or **`cursor/resync-ai-full-build-86ce`** for testing.
5. Netlify reads **`netlify.toml`**: publish **`koder-pack`**, no build.
6. **Deploy** → copy your **`https://….netlify.app`** URL.

Done. Every git push redeploys.

---

## Path B — GitHub Action (deploy from “here” via GitHub)

After merge to `main`:

### 1. Create a Netlify personal access token

1. **https://app.netlify.com/user/applications** → **Personal access tokens** → **New token**.
2. Copy the token.

### 2. Create or open a Netlify site

- Either complete **Path A** once, or **Sites** → **Add site** → **Deploy manually** (any name).

### 3. Get Site ID

**Site settings** → **General** → **Site details** → **Site ID** (UUID like `abc123-def456-...`).

### 4. Add GitHub secrets

GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Name | Value |
|------|--------|
| `NETLIFY_AUTH_TOKEN` | token from step 1 |
| `NETLIFY_SITE_ID` | Site ID from step 3 |

### 5. Run the workflow

**Actions** tab → **Deploy to Netlify** → **Run workflow** → branch **`main`**.

When green, open the URL in **Netlify dashboard** → your site → **Domain settings**.

---

## Path C — You’re on iPhone only right now

Use **Path A** (Netlify + GitHub import). No laptop required.

---

## What gets deployed

The **`koder-pack`** folder — same UI as the marketing site preview: Home, Templates, Community, **Contracts**, Builder, Pricing, Dashboard.

Full Next.js app remains in **`resync-ai/`** for Vercel later.
