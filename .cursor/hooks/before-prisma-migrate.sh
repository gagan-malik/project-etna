#!/usr/bin/env bash
# Cursor beforeShellExecution hook (matcher: prisma migrate): ask user to confirm pre-migration checks.
set -e
INPUT=$(cat)
if echo "$INPUT" | grep -q 'prisma migrate'; then
  echo '{"permission":"ask","user_message":"Pre-migration: confirm destructive changes and backup (see .cursor/skills/db-migration, HOOKS_ENTERPRISE.md).","agent_message":"User must confirm pre-migration checklist before running prisma migrate."}'
else
  echo '{"permission":"allow"}'
fi
exit 0
