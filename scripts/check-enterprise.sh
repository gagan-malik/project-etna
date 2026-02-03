#!/bin/bash
# Enterprise check: lint, test, typecheck.
# Use as pre-commit or CI hook. See .cursor/HOOKS_ENTERPRISE.md.

set -e
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Enterprise check (lint, test, typecheck)     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Running lint...${NC}"
npm run lint
echo -e "${GREEN}✓ Lint passed${NC}"
echo ""

echo -e "${YELLOW}Running tests...${NC}"
npm run test
echo -e "${GREEN}✓ Tests passed${NC}"
echo ""

echo -e "${YELLOW}Running typecheck (tsc --noEmit)...${NC}"
npx tsc --noEmit
echo -e "${GREEN}✓ Typecheck passed${NC}"
echo ""

echo -e "${GREEN}✓ Enterprise check complete.${NC}"
