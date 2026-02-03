#!/usr/bin/env bash
# Cursor afterShellExecution hook (matcher: prisma migrate): run prisma validate after migration.
set -e
INPUT=$(cat)
cd "${CURSOR_PROJECT_DIR:-.}"
if echo "$INPUT" | grep -q 'prisma migrate'; then
  npx prisma validate 2>/dev/null || true
fi
exit 0
