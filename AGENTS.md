# AGENTS.md

## Cursor Cloud specific instructions

### What this repository is (read first)

This is a **documentation / blueprint-only repository**. It contains **no application
source code** — only Markdown:

- `README.md` — repo overview.
- `docs/RESYNC_AI_MASTER_DEPLOYMENT_BLUEPRINT.md` — the full spec for a product called
  "Resync AI" (a Next.js + Supabase + Stripe + OpenAI SaaS) that is *intended to be built*.
- `docs/CURSOR_ONE_SHOT_PROMPT.md` — a copy-paste prompt to kick off that build.

Non-obvious gotcha: the blueprint reads like a runnable project (it describes a complete
Next.js file tree, `pnpm` commands, migrations, etc.), but **none of that code exists in
this repo**. Do not go looking for `package.json`, lockfiles, `app/`, or `supabase/` — they
are not here, by design.

### Build / test / lint / run

- There is **nothing to install, build, lint, or test** in the current repository state —
  no package manager manifest, no lockfile, no CI config, no test runner.
- Actually *building* Resync AI from the blueprint is a large, separate feature effort
  (not environment setup). It requires external services and secrets — Supabase,
  OpenAI, and Stripe (see the "Environment Variable Matrix" in the blueprint) — and should
  be done on a dedicated build branch, not treated as "dev environment setup".

### Previewing the documentation (the only "app" here)

The product of this repo is the documentation itself. To view it rendered in a browser you
can serve the repo statically, e.g.:

```bash
python3 -m http.server 8080   # then open http://localhost:8080/
```

Note: that serves raw Markdown. For a nicely rendered (HTML) preview you need a Markdown
renderer. **Egress is restricted in this environment** — `pip install` / `npm` registry
fetches are blocked — so a stdlib-only renderer (or a pre-installed tool) is required rather
than pulling a package from the network.

### Environment notes

- Preinstalled runtimes: Node 22, npm, pnpm, Python 3.12 — already sufficient for a docs
  repo; nothing extra is needed on VM startup.
- Network access is restricted (external package registries were unreachable during setup).
