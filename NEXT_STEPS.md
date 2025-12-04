# Next Steps - Project Etna Development Roadmap

## ✅ Completed

1. ✅ Core dependencies installed (Prisma, Auth.js, AI models, API clients)
2. ✅ Prisma schema created (User, Space, Conversation, Message, Integration, DocumentIndex)
3. ✅ Database utilities and helpers created
4. ✅ Environment setup scripts and documentation
5. ✅ UI components rebuilt with Shadcn
6. ✅ Settings dialog implemented

## 🎯 Next Steps

### Step 2: Authentication Setup (Auth.js v5)

**Priority: High**

1. **Configure Auth.js:**
   - Create `auth.ts` configuration file
   - Set up Prisma adapter
   - Configure providers (Email, OAuth: GitHub, Google, Microsoft)
   - Set up session management

2. **Create API routes:**
   - `app/api/auth/[...nextauth]/route.ts` - Auth.js handler
   - `app/api/auth/signin/route.ts` - Custom sign-in
   - `app/api/auth/signout/route.ts` - Sign out
   - `app/api/auth/session/route.ts` - Get session

3. **Update login/signup pages:**
   - Connect forms to Auth.js
   - Add OAuth provider buttons
   - Handle authentication flow

**Files to create:**
- `auth.ts` - Auth.js configuration
- `app/api/auth/[...nextauth]/route.ts`
- `middleware.ts` - Route protection

---

### Step 3: API Routes for Core Features

**Priority: High**

1. **Conversations API:**
   - `app/api/conversations/route.ts` - List/create conversations
   - `app/api/conversations/[id]/route.ts` - Get/update/delete conversation
   - `app/api/conversations/[id]/messages/route.ts` - Get messages

2. **Messages API:**
   - `app/api/messages/route.ts` - Create message
   - `app/api/messages/[id]/route.ts` - Get/update/delete message
   - `app/api/messages/stream/route.ts` - Stream AI responses

3. **Spaces API:**
   - `app/api/spaces/route.ts` - List/create spaces
   - `app/api/spaces/[id]/route.ts` - Get/update/delete space

4. **Documents API:**
   - `app/api/documents/route.ts` - List/create documents
   - `app/api/documents/search/route.ts` - Vector similarity search
   - `app/api/documents/[id]/route.ts` - Get/update/delete document

**Files to create:**
- `app/api/conversations/` directory
- `app/api/messages/` directory
- `app/api/spaces/` directory
- `app/api/documents/` directory

---

### Step 4: AI Model Integrations

**Priority: High**

1. **Create AI service layer:**
   - `lib/ai/openai.ts` - OpenAI integration
   - `lib/ai/gemini.ts` - Google Gemini integration
   - `lib/ai/deepseek.ts` - DeepSeek REST API client
   - `lib/ai/llama.ts` - Llama API client (Replicate/Together AI)
   - `lib/ai/index.ts` - Unified AI service interface

2. **Implement streaming:**
   - Server-sent events for real-time responses
   - Token streaming support
   - Error handling and retries

3. **Model selection:**
   - Update LLM selector component
   - Connect to actual API calls
   - Track usage and costs

**Files to create:**
- `lib/ai/` directory with all AI integrations
- `lib/ai/types.ts` - Type definitions

---

### Step 5: Integration Clients

**Priority: Medium**

1. **GitHub Integration:**
   - `lib/integrations/github.ts` - GitHub API client
   - `app/api/integrations/github/route.ts` - GitHub webhooks
   - Repository indexing functionality

2. **Confluence Integration:**
   - `lib/integrations/confluence.ts` - Confluence REST client
   - `app/api/integrations/confluence/route.ts` - Sync content
   - Page indexing and search

3. **Microsoft Graph Integration:**
   - `lib/integrations/microsoft.ts` - Microsoft Graph client
   - `app/api/integrations/microsoft/route.ts` - Office 365 integration
   - Document indexing from OneDrive/SharePoint

4. **Integration Management:**
   - `app/api/integrations/route.ts` - List/create integrations
   - `app/api/integrations/[id]/route.ts` - Manage integration
   - `app/api/integrations/[id]/sync/route.ts` - Sync data

**Files to create:**
- `lib/integrations/` directory
- `app/api/integrations/` directory

---

### Step 6: Vector Search & Embeddings

**Priority: Medium**

1. **Embedding generation:**
   - `lib/embeddings/openai.ts` - OpenAI embeddings
   - `lib/embeddings/gemini.ts` - Gemini embeddings
   - `lib/embeddings/index.ts` - Unified embedding service

2. **Document indexing:**
   - `lib/indexing/indexer.ts` - Document processor
   - Chunking strategy for large documents
   - Batch embedding generation
   - Store in DocumentIndex table

3. **Vector search:**
   - Enhance `lib/db.ts` with better search functions
   - RAG (Retrieval Augmented Generation) implementation
   - Context injection into AI prompts

**Files to create:**
- `lib/embeddings/` directory
- `lib/indexing/` directory

---

### Step 7: Frontend-Backend Integration

**Priority: High**

1. **Update Chat Page:**
   - Connect to messages API
   - Implement streaming responses
   - Add file upload functionality
   - Show conversation history

2. **Update Activity/History Page:**
   - Fetch conversations from API
   - Add filtering and search
   - Show conversation details

3. **Update Settings:**
   - Connect settings to API
   - Save user preferences
   - Manage integrations

4. **Add Loading States:**
   - Skeleton loaders
   - Error boundaries
   - Toast notifications

**Files to update:**
- `app/chat/page.tsx`
- `app/activity/page.tsx`
- `components/settings-dialog.tsx`

---

### Step 8: Advanced Features

**Priority: Low**

1. **Real-time updates:**
   - WebSocket or Server-Sent Events
   - Live conversation updates
   - Collaboration features

2. **Analytics:**
   - Usage tracking
   - Cost monitoring
   - Performance metrics

3. **File handling:**
   - Vercel Blob storage integration
   - File upload/download
   - Image processing

4. **Notifications:**
   - Email notifications
   - Push notifications
   - In-app notifications

---

## Recommended Order

1. **Step 2: Authentication** (Critical - needed for everything else)
2. **Step 3: API Routes** (Core functionality)
3. **Step 4: AI Integrations** (Main feature)
4. **Step 7: Frontend Integration** (Connect UI to backend)
5. **Step 5: Integration Clients** (Extended features)
6. **Step 6: Vector Search** (Advanced search)
7. **Step 8: Advanced Features** (Polish and enhancements)

## Quick Start Commands

```bash
# After setting up database
npm run db:migrate
npm run db:seed

# Development
npm run dev

# Database management
npm run db:studio  # View database
npm run db:generate  # Regenerate Prisma Client
```

## Environment Variables Needed

Make sure these are set in `.env.local`:

- ✅ `DATABASE_URL` - Database connection
- ✅ `NEXTAUTH_SECRET` - Auth.js secret
- ⏭️ `OPENAI_API_KEY` - OpenAI API key
- ⏭️ `GOOGLE_GENERATIVE_AI_API_KEY` - Gemini API key
- ⏭️ `GITHUB_TOKEN` - GitHub integration
- ⏭️ Other API keys as needed

## Resources

- [Auth.js v5 Documentation](https://authjs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

