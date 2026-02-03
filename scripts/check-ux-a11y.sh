#!/bin/bash
# UX & accessibility check: lint + checklist reminder.
# Use as post-edit or pre-commit hook when UI files change.
# See .cursor/HOOKS_UX.md

set -e
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   UX & Accessibility check                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Running lint...${NC}"
npm run lint
echo -e "${GREEN}✓ Lint passed${NC}"
echo ""

echo -e "${YELLOW}Manual UX/a11y checklist (for changed UI):${NC}"
echo "  • Keyboard: all interactive elements focusable, visible focus, Esc closes modals"
echo "  • Labels: every input has a visible label or aria-label"
echo "  • ARIA: live regions for streaming/toasts; aria-expanded for collapse"
echo "  • Contrast: text 4.5:1, don’t rely on color alone"
echo "  • Motion: respect prefers-reduced-motion; no autoplay"
echo "  • Zoom: layout usable at 200%"
echo ""
echo -e "${GREEN}✓ Run complete. See .cursor/rules/ux-usability-accessibility.mdc and .cursor/skills/accessibility/SKILL.md${NC}"
