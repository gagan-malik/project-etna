#!/usr/bin/env bash
# Cursor afterFileEdit hook: if edited file is in app/api, run API tests.
set -e
INPUT=$(cat)
cd "${CURSOR_PROJECT_DIR:-.}"
if echo "$INPUT" | grep -q '"file_path".*app/api'; then
  npm run test -- --testPathPattern=api 2>/dev/null || true
fi
exit 0
