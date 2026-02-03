#!/usr/bin/env bash
# Git pre-commit hook: lint + test + typecheck. Install via husky or: ln -sf ../../scripts/pre-commit.sh .git/hooks/pre-commit
set -e
echo "Running pre-commit checks (lint, test, typecheck)..."
npm run lint
npm run test
npx tsc --noEmit
echo "Pre-commit checks passed."
exit 0
