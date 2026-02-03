#!/usr/bin/env bash
# Cursor preToolUse (Write) hook: run lint before agent applies file edits. Always allow; run lint to surface issues. Set DENY_ON_LINT_FAIL=1 to deny when lint fails.
set -e
cat > /dev/null
cd "${CURSOR_PROJECT_DIR:-.}"
if npm run lint 2>/dev/null; then
  echo '{"decision":"allow"}'
  exit 0
elif [ "${DENY_ON_LINT_FAIL:-0}" = "1" ]; then
  echo '{"decision":"deny","reason":"Lint failed. Fix lint errors before applying edits."}'
  exit 2
else
  echo '{"decision":"allow"}'
  exit 0
fi
