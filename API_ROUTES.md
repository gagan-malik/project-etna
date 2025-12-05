# 📡 API Routes Documentation

This document describes all available API routes in Project Etna.

## 🔐 Authentication

All API routes (except auth routes) require authentication. Include the session cookie in requests.

---

## 💬 Conversations API

### List Conversations
```http
GET /api/conversations
```

**Response:**
```json
{
  "conversations": [
    {
      "id": "conv_123",
      "title": "My Conversation",
      "userId": "user_123",
      "spaceId": "space_123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "messages": [...],
      "space": {...}
    }
  ]
}
```

### Create Conversation
```http
POST /api/conversations
Content-Type: application/json

{
  "title": "New Conversation",
  "spaceId": "space_123" // Optional, uses default space if not provided
}
```

### Get Conversation
```http
GET /api/conversations/[id]
```

### Update Conversation
```http
PATCH /api/conversations/[id]
Content-Type: application/json

{
  "title": "Updated Title"
}
```

### Delete Conversation
```http
DELETE /api/conversations/[id]
```

---

## 📝 Messages API

### Create Message
```http
POST /api/messages
Content-Type: application/json

{
  "conversationId": "conv_123",
  "content": "Hello!",
  "role": "user",
  "metadata": {} // Optional
}
```

### Stream AI Response
```http
POST /api/messages/stream
Content-Type: application/json

{
  "conversationId": "conv_123",
  "content": "Hello!",
  "model": "gpt-4",
  "provider": "openai"
}
```

**Response:** Server-Sent Events (SSE) stream
```
data: {"content": "Hello", "done": false}
data: {"content": " there", "done": false}
data: {"done": true}
```

### Get Message
```http
GET /api/messages/[id]
```

### Update Message
```http
PATCH /api/messages/[id]
Content-Type: application/json

{
  "content": "Updated content",
  "metadata": {}
}
```

### Delete Message
```http
DELETE /api/messages/[id]
```

---

## 🏢 Spaces API

### List Spaces
```http
GET /api/spaces
```

**Response:**
```json
{
  "spaces": [
    {
      "id": "space_123",
      "name": "My Workspace",
      "slug": "my-workspace",
      "ownerId": "user_123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "_count": {
        "conversations": 5
      }
    }
  ]
}
```

### Create Space
```http
POST /api/spaces
Content-Type: application/json

{
  "name": "New Workspace",
  "slug": "new-workspace" // Optional, auto-generated from name if not provided
}
```

### Get Space
```http
GET /api/spaces/[id]
```

### Update Space
```http
PATCH /api/spaces/[id]
Content-Type: application/json

{
  "name": "Updated Name",
  "slug": "updated-slug"
}
```

### Delete Space
```http
DELETE /api/spaces/[id]
```

---

## 📄 Documents API

### List Documents
```http
GET /api/documents?spaceId=space_123
```

**Query Parameters:**
- `spaceId` (optional) - Filter by space

### Create Document
```http
POST /api/documents
Content-Type: application/json

{
  "title": "Document Title",
  "content": "Document content...",
  "url": "https://example.com/doc", // Optional
  "source": "github", // Optional
  "sourceId": "repo_123", // Optional
  "spaceId": "space_123", // Optional
  "metadata": {} // Optional
}
```

### Search Documents
```http
POST /api/documents/search
Content-Type: application/json

{
  "query": "search query",
  "limit": 5, // Optional, default: 5
  "spaceId": "space_123" // Optional
}
```

**Note:** Currently uses text search. Vector similarity search will be enabled once embeddings are implemented.

### Get Document
```http
GET /api/documents/[id]
```

### Update Document
```http
PATCH /api/documents/[id]
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "metadata": {}
}
```

### Delete Document
```http
DELETE /api/documents/[id]
```

---

## 🔑 Authentication API

### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure-password"
}
```

### Auth.js Routes
```http
GET /api/auth/[...nextauth]  // Auth.js handler
POST /api/auth/[...nextauth] // Auth.js handler
```

---

## ⚠️ Error Responses

All routes return standard error responses:

```json
{
  "error": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing/invalid fields)
- `401` - Unauthorized (not authenticated)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate slug)
- `500` - Internal Server Error

---

## 📝 Notes

- All routes verify user ownership before allowing access
- Conversations automatically use the user's default space if no `spaceId` is provided
- Message streaming is currently a placeholder - will be connected to AI services in Step 4
- Document vector search uses text search as fallback until embeddings are implemented

---

## 🚀 Next Steps

1. **Step 4:** Connect AI services to message streaming
2. **Step 7:** Connect frontend to these APIs
3. **Step 6:** Implement vector embeddings for document search

