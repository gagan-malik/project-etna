# Deploying the documentation site

The docs are built with **VitePress** and deployed via **GitHub Actions** to GitHub Pages.

## One-time setup: Use GitHub Actions for Pages

For the VitePress site to appear (not the old Jekyll UI), GitHub Pages must use the workflow as the source:

1. Open your repo on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **GitHub Actions** (not "Deploy from a branch").
3. Save. The next push to `main` that touches `docs/` will run the "Deploy Documentation" workflow and publish the new site.

After that, the site will be at **https://YOUR_USERNAME.github.io/project-etna/** (or your repo’s Pages URL).

## Local preview

```bash
npm run docs:dev    # dev server
npm run docs:build  # production build
npm run docs:preview # preview built site
```
