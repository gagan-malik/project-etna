#!/bin/bash

# 🎨 Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   API Routes Test Script 🧪            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local file not found!${NC}"
    echo -e "Please set up your database first. See DATABASE_SETUP_SIMPLE.md"
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env.local || grep -q 'DATABASE_URL=""' .env.local; then
    echo -e "${RED}❌ DATABASE_URL is not set in .env.local!${NC}"
    echo -e "Please configure your database connection first."
    exit 1
fi

# Check if server is running
echo -e "${YELLOW}📡 Checking if dev server is running...${NC}"
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Dev server is not running.${NC}"
    echo -e "Please start it in another terminal: ${BLUE}npm run dev${NC}"
    echo ""
    read -p "Press Enter when the server is running..."
fi

echo ""
echo -e "${GREEN}✅ Ready to test API routes!${NC}"
echo ""
echo -e "${YELLOW}Note:${NC} This script will test the API routes."
echo -e "Make sure you have:"
echo -e "  1. Database configured and migrated"
echo -e "  2. Dev server running (npm run dev)"
echo -e "  3. A test user account created"
echo ""
read -p "Press Enter to continue..."

# Test endpoints
BASE_URL="http://localhost:3000"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Testing API Routes${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test 1: Get Spaces (requires auth)
echo -e "${YELLOW}Test 1: GET /api/spaces${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/spaces" \
  -H "Content-Type: application/json" \
  -b "next-auth.session-token=test" 2>/dev/null)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Correctly returns 401 (Unauthorized) - Auth is working!${NC}"
elif [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Returns 200 - Spaces retrieved!${NC}"
    echo "$BODY" | head -c 200
    echo "..."
else
    echo -e "${RED}❌ Unexpected response: HTTP $HTTP_CODE${NC}"
fi
echo ""

# Test 2: Get Conversations (requires auth)
echo -e "${YELLOW}Test 2: GET /api/conversations${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/conversations" \
  -H "Content-Type: application/json" \
  -b "next-auth.session-token=test" 2>/dev/null)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Correctly returns 401 (Unauthorized) - Auth is working!${NC}"
elif [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Returns 200 - Conversations retrieved!${NC}"
else
    echo -e "${RED}❌ Unexpected response: HTTP $HTTP_CODE${NC}"
fi
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Basic API route tests completed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Create a user account at: ${BLUE}http://localhost:3000/signup${NC}"
echo -e "2. Log in at: ${BLUE}http://localhost:3000/login${NC}"
echo -e "3. Use browser DevTools Network tab to test authenticated requests"
echo -e "4. Or use a tool like Postman/Insomnia with session cookies"
echo ""

