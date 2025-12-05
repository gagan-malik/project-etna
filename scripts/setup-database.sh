#!/bin/bash

# 🎨 Colors for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Database Setup Helper Script 🚀     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}📝 Creating .env.local file...${NC}"
    cp .env.local.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo ""
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env.local || grep -q 'DATABASE_URL=""' .env.local; then
    echo -e "${YELLOW}⚠️  DATABASE_URL is not set!${NC}"
    echo ""
    echo -e "Please follow these steps:"
    echo -e "1. ${BLUE}Get your database connection string:${NC}"
    echo -e "   - Vercel: Go to your project → Storage → Postgres → Copy connection string"
    echo -e "   - Neon: Go to your project → Copy connection string"
    echo ""
    echo -e "2. ${BLUE}Open .env.local and paste it:${NC}"
    echo -e "   ${YELLOW}DATABASE_URL=\"your-connection-string-here\"${NC}"
    echo ""
    read -p "Press Enter when you've added your DATABASE_URL..."
    echo ""
fi

# Check if NEXTAUTH_SECRET is set
if ! grep -q "NEXTAUTH_SECRET=" .env.local || grep -q 'NEXTAUTH_SECRET=""' .env.local; then
    echo -e "${YELLOW}🔐 Generating NEXTAUTH_SECRET...${NC}"
    SECRET=$(openssl rand -base64 32)
    
    # Update .env.local
    if grep -q "NEXTAUTH_SECRET=" .env.local; then
        # Replace existing
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$SECRET\"|" .env.local
        else
            # Linux
            sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$SECRET\"|" .env.local
        fi
    else
        # Add new
        echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env.local
    fi
    
    echo -e "${GREEN}✅ Generated and saved NEXTAUTH_SECRET${NC}"
    echo ""
fi

# Check if NEXTAUTH_URL is set
if ! grep -q "NEXTAUTH_URL=" .env.local; then
    echo "NEXTAUTH_URL=\"http://localhost:3000\"" >> .env.local
    echo -e "${GREEN}✅ Added NEXTAUTH_URL${NC}"
    echo ""
fi

# Check if DATABASE_URL is still empty
if grep -q 'DATABASE_URL=""' .env.local; then
    echo -e "${RED}❌ DATABASE_URL is still empty!${NC}"
    echo -e "Please add your database connection string to .env.local"
    echo -e "Then run this script again."
    exit 1
fi

echo -e "${GREEN}✅ Environment variables are set!${NC}"
echo ""

# Ask if they want to run migrations
echo -e "${BLUE}📦 Ready to create database tables?${NC}"
read -p "Run migrations now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🏗️  Running database migrations...${NC}"
    echo ""
    
    # Generate Prisma Client first
    echo -e "${YELLOW}Step 1: Generating Prisma Client...${NC}"
    npx prisma generate
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Prisma Client generated${NC}"
        echo ""
        
        # Run migrations
        echo -e "${YELLOW}Step 2: Creating database tables...${NC}"
        npx prisma migrate dev --name init
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
            echo -e "${GREEN}║   🎉 Setup Complete!                    ║${NC}"
            echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "Your database is ready! You can now:"
            echo -e "1. ${BLUE}Start your app:${NC} npm run dev"
            echo -e "2. ${BLUE}Test signup:${NC} Go to http://localhost:3000/signup"
            echo ""
        else
            echo -e "${RED}❌ Migration failed. Check the error above.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Failed to generate Prisma Client.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⏭️  Skipping migrations. Run this when ready:${NC}"
    echo -e "   ${BLUE}npx prisma migrate dev --name init${NC}"
    echo ""
fi

