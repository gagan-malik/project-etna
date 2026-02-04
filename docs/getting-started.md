---
title: Getting Started
description: Quick start guide for Project Etna
---

# Getting Started

Get Project Etna up and running in just a few minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **PostgreSQL** - For database (or use Neon/Supabase for serverless)

## Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/gaganmalik/project-etna.git
cd project-etna
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and configure:

```bash
cp .env.example .env.local
```

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/etna"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=http://localhost:3000/chat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=http://localhost:3000/chat

# AI Providers (at least one required)
OPENAI_API_KEY="sk-..."
GOOGLE_AI_API_KEY="..."
DEEPSEEK_API_KEY="..."
```

For full Clerk setup (redirect URLs, sign-in/sign-up paths), see [Clerk Setup](CLERK_SETUP.md).

### 4. Set Up Database

Run the automated setup script:

```bash
./scripts/setup-database.sh
```

Or manually:

```bash
npx prisma generate
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Options

### Option A: Local PostgreSQL

Install PostgreSQL locally and create a database:

```bash
createdb etna
```

Update your `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://localhost:5432/etna"
```

### Option B: Neon (Serverless)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

::: note
Neon is recommended for development as it provides a free tier and requires no local setup.
:::

### Option C: Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → Database → Connection string
3. Copy the connection string to `DATABASE_URL`

## AI Provider Setup

Project Etna supports multiple AI providers. Configure at least one:

### OpenAI

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Add to `.env.local`:

```bash
OPENAI_API_KEY="sk-..."
```

### Google Gemini

1. Get an API key from [makersuite.google.com](https://makersuite.google.com)
2. Add to `.env.local`:

```bash
GOOGLE_AI_API_KEY="..."
```

### DeepSeek

1. Get an API key from [platform.deepseek.com](https://platform.deepseek.com)
2. Add to `.env.local`:

```bash
DEEPSEEK_API_KEY="..."
```

## Verify Installation

After starting the dev server, verify everything works:

### 1. Check the Homepage

Visit [http://localhost:3000](http://localhost:3000) - you should see the login page.

### 2. Create an Account

Click "Sign Up" and create a new account.

### 3. Test AI Chat

Navigate to the chat interface and send a test message.

### 4. Test API Health

```bash
curl http://localhost:3000/api/cron/health
```

Expected response:

```json
{
  "success": true,
  "healthy": true,
  "checks": {
    "Database": "Healthy",
    "Environment": "development"
  }
}
```

## Common Issues

### Database Connection Failed

::: warning
`Error: Can't reach database server`
:::

**Solution:** Ensure PostgreSQL is running and the `DATABASE_URL` is correct.

```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL (macOS)
brew services start postgresql
```

### Prisma Generate Failed

::: warning
`Error: Prisma schema is not valid`
:::

**Solution:** Run Prisma generate manually:

```bash
npx prisma generate
npx prisma db push --force-reset
```

### Missing API Key

::: warning
`Error: No API key configured for provider`
:::

**Solution:** Ensure at least one AI provider is configured in `.env.local`.

## Next Steps

Now that you have Project Etna running:

1. **[Explore Features](/features)** - Learn about all available features
2. **[API Reference](/api/)** - Integrate with the API
3. **[Waveform Viewer](/waveforms)** - Upload and view waveform files
4. **[Contributing](/contributing)** - Help improve Project Etna
