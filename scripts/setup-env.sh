#!/bin/bash

# Setup script for Project Etna environment variables

echo "🚀 Setting up Project Etna environment..."

# Generate NEXTAUTH_SECRET if not already set
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local from template..."
  
  # Create .env.local with generated secret
  NEXTAUTH_SECRET=$(openssl rand -base64 32)
  
  cat > .env.local << EOF
# Database
# For local development with PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/project_etna?schema=public"

# For Vercel Postgres (get from Vercel dashboard)
# DATABASE_URL="postgres://default:password@ep-xxx.region.aws.neon.tech:5432/verceldb?sslmode=require"

# For Neon (free PostgreSQL with pgvector)
# DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech:5432/neondb?sslmode=require"

# NextAuth.js (Auth.js v5)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY="your-google-gemini-api-key-here"

# DeepSeek (custom REST API)
DEEPSEEK_API_KEY="your-deepseek-api-key-here"
DEEPSEEK_API_URL="https://api.deepseek.com"

# Llama (depends on provider - example for Replicate)
REPLICATE_API_TOKEN="your-replicate-api-token-here"
# Or for Together AI
TOGETHER_API_KEY="your-together-api-key-here"

# GitHub (for @octokit/rest)
GITHUB_TOKEN="your-github-personal-access-token-here"

# Microsoft Graph (for @microsoft/microsoft-graph-client)
MICROSOFT_CLIENT_ID="your-microsoft-client-id-here"
MICROSOFT_CLIENT_SECRET="your-microsoft-client-secret-here"
MICROSOFT_TENANT_ID="your-microsoft-tenant-id-here"

# Confluence (custom REST API)
CONFLUENCE_BASE_URL="https://your-domain.atlassian.net"
CONFLUENCE_EMAIL="your-email@example.com"
CONFLUENCE_API_TOKEN="your-confluence-api-token-here"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token-here"
EOF

  echo "✅ Created .env.local with generated NEXTAUTH_SECRET"
  echo ""
  echo "⚠️  IMPORTANT: Please update DATABASE_URL in .env.local with your database connection string"
  echo ""
else
  echo "✅ .env.local already exists"
fi

echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local and set your DATABASE_URL"
echo "2. Add your API keys (OpenAI, Gemini, etc.)"
echo "3. Run: npm run db:migrate"
echo ""

