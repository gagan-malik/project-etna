---
name: db-migration
description: Create or apply Prisma migrations safely; document rollback. Use when changing prisma/schema.prisma or creating/applying migrations.
---

# DB Migration Skill

When changing the schema or creating/applying migrations, follow these steps.

## 1. Schema changes

- Keep schema.prisma the single source of truth; avoid raw SQL for schema changes.
- Use meaningful model and field names; add @@map if DB naming differs from Prisma names.
- For destructive changes (drop column, drop table): ensure no critical data loss or document the migration as one-way.

## 2. Migration creation

- Use `npx prisma migrate dev --name <descriptive_name>` for local development.
- Use `npx prisma migrate deploy` in CI/production; do not use `migrate dev` in production.
- Make migrations idempotent where possible (e.g. conditional creation); document any manual steps.

## 3. Rollback

- Document rollback steps for destructive migrations (e.g. "Restore from backup and run migration X to revert").
- For additive-only migrations, rollback may be "revert the migration file and run migrate deploy" if supported by your workflow.

## 4. Pre-apply check

- List tables/columns affected; if destructive, remind to backup and confirm.
- Run `npx prisma validate` before committing; run `npx prisma migrate status` to confirm state.

## 5. Post-apply

- Run app smoke test or health check after applying in a given environment.
- Optionally run seed if required for new required data.

## Output

- Migration file(s) with a clear name; rollback steps documented in migration comment or README.
- Reminder to run pre-apply check (and backup for destructive changes) before applying in production.
