# Project Etna Documentation Site

Standalone documentation app. Same UI stack as the main app (Next.js + Tailwind + shadcn-style theme) but **separate deployment**. Content lives in the parent repo’s `docs/` folder.

## Run locally

**From the repo root (recommended):**

```bash
npm run docs:dev
```

Then open **http://localhost:3001** in your browser. Root `/` redirects to `/docs`.

**Or from this directory:**

```bash
cd docs-app
npm install
npm run dev
```

Then open **http://localhost:3001**. (The docs app runs on port 3001, not 3000.)

## Build

```bash
npm run build
npm run start
```

## Deploy (separate from main app)

- **GitHub Pages:** The workflow `.github/workflows/deploy-docs.yml` builds the static export and deploys to GitHub Pages on push to `main` when `docs/` or `docs-app/` change (or via **Actions → Deploy docs to GitHub Pages → Run workflow**). **One-time setup:** In the repo go to **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. The site will be at `https://<user>.github.io/<repo>/`.
- **Vercel:** Add a second project pointing at this repo, set **Root Directory** to `docs-app`. Docs will be at e.g. `docs-project-etna.vercel.app` or a custom domain like `docs.yourdomain.com`.
- **Other:** Build with `npm run build` and serve the `out/` folder (static export is enabled).

## Content

Markdown files are read from `../docs` (parent repo’s `docs/`). Do not put docs inside `docs-app/`; keep a single source of truth in the repo root `docs/` folder.
