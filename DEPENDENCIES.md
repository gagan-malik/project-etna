# Core Dependencies Installation Summary

## ✅ Successfully Installed

### Database & ORM
- ✅ `@prisma/client` (v7.1.0) - Prisma Client for database access
- ✅ `prisma` (v7.1.0) - Prisma ORM for database management
- ✅ `pgvector` (v0.2.1) - PostgreSQL vector extension support (dev dependency)

### Authentication
- ✅ `@auth/prisma-adapter` (v2.11.1) - Prisma adapter for Auth.js
- ✅ `next-auth` (v5.0.0-beta.30) - Auth.js v5 (NextAuth.js beta)

### Database & Storage
- ✅ `@vercel/postgres` (v0.10.0) - Vercel Postgres client
- ✅ `@vercel/blob` (v2.0.0) - Vercel Blob storage

### AI Models
- ✅ `openai` (v6.10.0) - OpenAI API client
- ✅ `@google/generative-ai` (v0.24.1) - Google Gemini API client
- ✅ DeepSeek — implemented in `lib/ai/deepseek.ts` (REST API)
- ✅ Llama — implemented in `lib/ai/llama.ts` (REST API)

### UI & Styling
- ✅ `shadcn` (v3.x) - CLI for shadcn/ui (Vega style, zinc theme, large radius)
- ✅ `tailwindcss-animate` (v1.0.7) - Tailwind animation plugin
- ✅ `tw-animate-css` (v1.4.0) - Animation CSS for shadcn components
- ✅ `lucide-react` - Icon library
- ✅ `next-themes` - Dark mode support
- ✅ Radix UI primitives (dialog, dropdown, tabs, etc.) — installed via shadcn

### API Clients
- ✅ `@octokit/rest` (v22.0.1) - GitHub REST API client
- ✅ `@microsoft/microsoft-graph-client` (v3.0.7) - Microsoft Graph API client
- ✅ `axios` - HTTP client for custom REST API calls
- ✅ Confluence — implemented in `lib/integrations/confluence.ts` (REST API)

## Optional / Environment-Dependent

- **DeepSeek** — Add `DEEPSEEK_API_KEY` to `.env.local` to enable; client in `lib/ai/deepseek.ts`
- **Llama** — Configure provider (Replicate, Together AI, etc.); client in `lib/ai/llama.ts`

## Package Versions (Summary)

| Package    | Version   |
|-----------|-----------|
| Next.js   | 15.5.7    |
| React     | 18.3.1    |
| TypeScript| 5.5.4     |
| Prisma    | 7.1.0     |
| Auth.js   | v5 (beta) |
| shadcn/ui | Maia style, neutral theme |

