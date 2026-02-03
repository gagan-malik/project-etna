#!/usr/bin/env bash
# Cursor afterFileEdit hook: run lint after agent edits a file.
# Reads JSON from stdin (Cursor sends file_path, edits); we run lint and exit 0 so edits are not blocked.
set -e
# Consume stdin so Cursor's JSON doesn't leak to stdout
cat > /dev/null
cd "${CURSOR_PROJECT_DIR:-.}"
npm run lint
exit 0
