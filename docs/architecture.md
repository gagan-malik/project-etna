---
layout: default
title: Architecture
nav_order: 6
description: "Technical architecture of Project Etna"
---

# Architecture
{: .no_toc }

Technical deep-dive into Project Etna's design.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js   │  │  shadcn/ui  │  │   Surfer Viewer     │  │
│  │   App Dir   │  │  Components │  │   (iframe/WASM)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Next.js)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Auth.js    │  │  API Routes │  │   Server Actions    │  │
│  │  Sessions   │  │  REST API   │  │   Streaming SSE     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   PostgreSQL    │  │  Vercel Blob    │  │   AI Providers  │
│   (Neon/Local)  │  │  File Storage   │  │  OpenAI/Gemini  │
│   + pgvector    │  │                 │  │  DeepSeek/Llama │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
|:-----------|:--------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **Lucide Icons** | Icon library |
| **next-themes** | Dark mode support |

### Backend

| Technology | Purpose |
|:-----------|:--------|
| **Next.js API Routes** | REST API endpoints |
| **Auth.js v5** | Authentication |
| **Prisma ORM** | Database access |
| **Zod** | Request validation |

### Database

| Technology | Purpose |
|:-----------|:--------|
| **PostgreSQL** | Primary database |
| **pgvector** | Vector similarity search |
| **Prisma Migrations** | Schema management |
| **Neon** | Serverless PostgreSQL |

### Storage & Services

| Technology | Purpose |
|:-----------|:--------|
| **Vercel Blob** | File storage (waveforms, uploads) |
| **Vercel** | Hosting and deployment |

---

## Project Structure

```
project-etna/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   ├── conversations/ # Chat management
│   │   ├── messages/      # Message handling
│   │   ├── documents/     # Document CRUD
│   │   ├── spaces/        # Workspace management
│   │   ├── waveforms/     # Waveform uploads
│   │   └── cron/          # Health checks
│   ├── chat/              # Main chat interface
│   ├── activity/          # History page
│   ├── settings/          # User settings
│   ├── waveforms/         # Waveform viewer
│   ├── login/             # Login page
│   └── signup/            # Registration
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── chat/             # Chat-specific components
│   ├── waveform/         # Waveform viewer components
│   └── debug/            # Debug session components
├── lib/                   # Shared utilities
│   ├── prisma.ts         # Database client
│   ├── ai/               # AI provider integrations
│   ├── validation.ts     # Zod schemas
│   └── rate-limit.ts     # Rate limiting
├── prisma/               # Database schema
│   ├── schema.prisma     # Prisma schema
│   └── migrations/       # Database migrations
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
└── public/               # Static assets
```

---

## Database Schema

### Core Entities

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  spaces        Space[]
  conversations Conversation[]
  documents     Document[]
  waveformFiles WaveformFile[]
  debugSessions DebugSession[]
}

model Space {
  id        String   @id @default(cuid())
  name      String
  slug      String
  ownerId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  owner         User           @relation(...)
  conversations Conversation[]
  documents     Document[]
}

model Conversation {
  id        String   @id @default(cuid())
  title     String
  userId    String
  spaceId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user     User      @relation(...)
  space    Space     @relation(...)
  messages Message[]
}

model WaveformFile {
  id             String   @id @default(cuid())
  fileName       String
  blobUrl        String
  fileSize       Int
  format         String
  userId         String
  debugSessionId String?
  createdAt      DateTime @default(now())
}
```

### Entity Relationships

```
User ─┬─< Space ─┬─< Conversation ─< Message
      │          └─< Document
      ├─< WaveformFile
      └─< DebugSession ─< WaveformFile
```

---

## Authentication Flow

```
1. User submits credentials
           │
           ▼
2. POST /api/auth/callback/credentials
           │
           ▼
3. Auth.js validates credentials
           │
           ▼
4. bcrypt.compare(password, hash)
           │
           ▼
5. Create session in database
           │
           ▼
6. Set HTTP-only session cookie
           │
           ▼
7. Redirect to /chat
```

---

## AI Integration

### Provider Architecture

```typescript
// lib/ai/providers.ts
interface AIProvider {
  name: string;
  models: Model[];
  chat(messages: Message[]): AsyncGenerator<string>;
}

const providers: Record<string, AIProvider> = {
  openai: new OpenAIProvider(),
  google: new GeminiProvider(),
  deepseek: new DeepSeekProvider(),
  llama: new LlamaProvider(),
};
```

### Streaming Response Flow

```
1. User sends message
           │
           ▼
2. POST /api/messages/stream
           │
           ▼
3. Select AI provider & model
           │
           ▼
4. Stream response chunks
           │
           ▼
5. SSE: data: {"content": "..."}
           │
           ▼
6. Save complete message to DB
```

---

## Waveform Integration

### Upload Flow

```
1. User selects file
           │
           ▼
2. POST /api/waveforms/upload (multipart)
           │
           ▼
3. Validate file type & size
           │
           ▼
4. Upload to Vercel Blob
           │
           ▼
5. Save metadata to PostgreSQL
           │
           ▼
6. Return blob URL
```

### Viewer Architecture

```
┌─────────────────────────────────────┐
│        Etna Frontend                │
│  ┌─────────────────────────────────┐│
│  │     WaveformPanel Component     ││
│  │  ┌───────────────────────────┐  ││
│  │  │  iframe (Surfer Viewer)   │  ││
│  │  │  src: app.surfer-project  │  ││
│  │  │        .org/?url=...      │  ││
│  │  └───────────────────────────┘  ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
              │ postMessage
              ▼
┌─────────────────────────────────────┐
│     Surfer Viewer (External)        │
│  - Parses VCD/FST/GHW              │
│  - Renders waveforms               │
│  - Handles zoom/pan/cursor         │
└─────────────────────────────────────┘
```

---

## Rate Limiting

### Implementation

```typescript
// lib/rate-limit.ts
const rateLimiter = new Map<string, TokenBucket>();

export async function rateLimit(
  userId: string,
  plan: 'free' | 'pro' | 'team'
): Promise<boolean> {
  const limits = {
    free: { tokens: 60, refillRate: 1 },
    pro: { tokens: 300, refillRate: 5 },
    team: { tokens: 1000, refillRate: 16 },
  };
  // Token bucket algorithm
}
```

---

## Deployment

### Vercel Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/health",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### Environment Variables

```bash
# Database
DATABASE_URL=

# Auth
AUTH_SECRET=

# AI Providers
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=
DEEPSEEK_API_KEY=

# Storage
BLOB_READ_WRITE_TOKEN=

# Monitoring
SLACK_WEBHOOK_URL=
```

---

## Security Considerations

### Data Protection

- Passwords hashed with bcrypt (12 rounds)
- HTTP-only session cookies
- CSRF tokens on all mutations
- Input validation with Zod

### Access Control

- All API routes check session
- Users can only access their own data
- Spaces provide additional isolation

### File Uploads

- Type validation (VCD, FST, GHW only)
- Size limits per plan
- Stored in isolated Vercel Blob containers
