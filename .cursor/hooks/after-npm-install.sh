#!/usr/bin/env bash
# Cursor afterShellExecution hook (matcher: npm install|npm ci): run npm audit and remind about license/DEPENDENCIES.
set -e
INPUT=$(cat)
cd "${CURSOR_PROJECT_DIR:-.}"
if echo "$INPUT" | grep -qE 'npm (install|ci)'; then
  npm audit 2>/dev/null || true
  echo "Reminder: check license and update DEPENDENCIES.md if the project uses it." >&2
fi
exit 0
