# Documentation (separate site)

Documentation is a **standalone Next.js app** in `docs-app/`. It uses the same UI stack as the main app (Next.js, Tailwind, shadcn-style theme) but is **not** part of the production app. Deploy it separately.

- **Content:** All markdown lives in the repo root `docs/` folder. The docs app reads from `../docs` when building.
- **Local:** From the repo root run `npm run docs:dev`, then open [http://localhost:3001](http://localhost:3001) (docs use port **3001**; the main app uses 3000).
- **Deploy:** Add a separate Vercel (or other) project with **Root Directory** set to `docs-app`. Your docs site will have its own URL (e.g. `docs.project-etna.com`), independent of the main app.

See `docs-app/README.md` for run and deploy steps.
