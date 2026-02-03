# UX, Usability & Accessibility Hooks

Hooks run at specific events to enforce UX and a11y quality. Wire these to your scripts, CI, or Cursor/editor hooks where supported.

## Hook definitions

| Hook | Trigger | Action |
|------|---------|--------|
| **Pre-edit (UI)** | Before applying multi-file edits to `**/*.tsx` or `components/**` | Run `npm run lint`; if red, warn before applying. |
| **Post-edit (UI)** | After generating or changing components or pages | Run [scripts/check-ux-a11y.sh](scripts/check-ux-a11y.sh); optionally run `npm run lint`. |
| **Pre-commit** | On commit (if changed files include `**/*.tsx`, `app/**/page.tsx`, or `components/**` | Run `npm run lint`; run `./scripts/check-ux-a11y.sh` for UX/a11y checklist. |
| **PR / Pre-merge** | When opening or updating a PR that touches UI | Run lint; run check-ux-a11y.sh; recommend manual keyboard + screen reader test for changed flows. |
| **New component** | When creating a new component under `components/` | Remind: add labels, focus handling, and ARIA if interactive; run accessibility skill. |
| **New form** | When adding a form (inputs, submit) | Remind: labels, validation, error messages, loading state; run usability-check and accessibility skills. |
| **New modal/dialog** | When adding a dialog or modal | Remind: focus trap, Esc to close, focus restore; run accessibility skill. |

## Script

- **[scripts/check-ux-a11y.sh](scripts/check-ux-a11y.sh)**  
  Runs lint and prints a short UX/a11y checklist (keyboard, labels, contrast, live regions). Use in post-edit or pre-commit.

## Optional: automated a11y tests

To add automated a11y checks (e.g. axe-core):

1. Install: `npm install -D @axe-core/cli` (or `@axe-core/react` for in-browser).
2. Add script in `package.json`: `"a11y": "axe path/to/build-or-html"` (or run axe in Jest).
3. Add a **Pre-push or CI** hook: run `npm run a11y` when UI files changed.

Until then, rely on [.cursor/skills/accessibility/SKILL.md](.cursor/skills/accessibility/SKILL.md) and manual keyboard + screen reader testing for critical flows.
