# Enterprise Hooks

**Unlike Workers:** Cursor **does** read a project file for Hooks: **`.cursor/hooks.json`**. Hooks defined there run automatically; you don't create them in Settings. If Settings → Hooks was blank, it was because we hadn't added `hooks.json`—it's now added.

**Cursor hooks** (in `.cursor/hooks.json` and `.cursor/hooks/`):

| Your hook | Cursor event | Script | Action |
|-----------|--------------|--------|--------|
| **Pre-edit** | `preToolUse` (matcher: Write) | [before-write-lint.sh](.cursor/hooks/before-write-lint.sh) | Run lint before agent applies file edits; allow by default; set `DENY_ON_LINT_FAIL=1` to deny when lint fails. |
| **Post-edit** | `afterFileEdit` | [after-edit-lint.sh](.cursor/hooks/after-edit-lint.sh) | Run lint after every file edit (does not block). |
| **Post-edit (API)** | `afterFileEdit` | [after-edit-api-tests.sh](.cursor/hooks/after-edit-api-tests.sh) | If edited file is in `app/api/`, run `npm run test -- --testPathPattern=api`. |
| **Pre-migration** | `beforeShellExecution` (matcher: prisma migrate) | [before-prisma-migrate.sh](.cursor/hooks/before-prisma-migrate.sh) | **Ask** user to confirm destructive changes and backup (see db-migration skill). |
| **Post-migration** | `afterShellExecution` (matcher: prisma migrate) | [after-prisma-migrate.sh](.cursor/hooks/after-prisma-migrate.sh) | Run `npx prisma validate` after migration. |
| **New dependency** | `afterShellExecution` (matcher: npm install\|npm ci) | [after-npm-install.sh](.cursor/hooks/after-npm-install.sh) | Run `npm audit` and remind: check license, update DEPENDENCIES.md. |

**Not Cursor hooks (git / process):**

| Hook | Where | Action |
|------|--------|--------|
| **Pre-commit** | **Git hook** | Script: [scripts/pre-commit.sh](scripts/pre-commit.sh). Install: `ln -sf ../../scripts/pre-commit.sh .git/hooks/pre-commit` or use Husky. Runs lint + test + `tsc --noEmit`. |
| **New env var** | **Process reminder** | No Cursor event. When adding env vars: add to `.env.example` and deployment docs; never commit real values. |

## Scripts

- **[scripts/check-enterprise.sh](scripts/check-enterprise.sh)** — Full check: lint + test + `tsc --noEmit`. Use in CI or manually.
- **[scripts/check-ux-a11y.sh](scripts/check-ux-a11y.sh)** — UX/a11y checklist when UI files change; see [.cursor/HOOKS_UX.md](.cursor/HOOKS_UX.md).
- **[scripts/pre-commit.sh](scripts/pre-commit.sh)** — Git pre-commit: lint + test + typecheck. Install as git hook (see above).

## Optional: CI

- In CI (e.g. GitHub Actions): run `npm run lint`, `npm run test`, `npx tsc --noEmit` on every push/PR.
- For PRs that touch app/api/: run API tests.
- For PRs that touch prisma/: run `npx prisma validate` and migration checks.
