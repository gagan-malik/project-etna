---
layout: default
title: Messages
parent: API Reference
nav_order: 3
---

# Messages API
{: .no_toc }

Send and manage chat messages with AI streaming support.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Create Message

Add a new message to a conversation.

```http
POST /api/messages
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `conversationId` | string | Yes | Conversation to add message to |
| `content` | string | Yes | Message content |
| `role` | string | Yes | `user` or `assistant` |
| `metadata` | object | No | Additional metadata |

### Request

```json
{
  "conversationId": "conv_123",
  "content": "Hello!",
  "role": "user",
  "metadata": {}
}
```

### Response

```json
{
  "message": {
    "id": "msg_456",
    "conversationId": "conv_123",
    "content": "Hello!",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Stream AI Response

Send a message and receive a streaming AI response.

```http
POST /api/messages/stream
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `conversationId` | string | Yes | Conversation ID |
| `content` | string | Yes | User message |
| `model` | string | No | AI model (default: `gpt-4`) |
| `provider` | string | No | AI provider (default: `openai`) |

### Request

```json
{
  "conversationId": "conv_123",
  "content": "Analyze this Verilog module for bugs",
  "model": "gpt-4",
  "provider": "openai"
}
```

### Response (Server-Sent Events)

The response is a stream of Server-Sent Events (SSE):

```
data: {"content": "I'll analyze", "done": false}
data: {"content": " the module", "done": false}
data: {"content": " for potential", "done": false}
data: {"content": " bugs.", "done": false}
data: {"done": true}
```

### Example: Consuming the Stream

```javascript
const response = await fetch('/api/messages/stream', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationId: 'conv_123',
    content: 'Analyze this module',
    model: 'gpt-4',
    provider: 'openai'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  const lines = text.split('\n').filter(line => line.startsWith('data: '));
  
  for (const line of lines) {
    const data = JSON.parse(line.slice(6));
    if (!data.done) {
      console.log(data.content); // Append to UI
    }
  }
}
```

### Supported Models

| Provider | Models |
|:---------|:-------|
| OpenAI | `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo` |
| Google | `gemini-pro`, `gemini-pro-vision` |
| DeepSeek | `deepseek-chat`, `deepseek-coder` |
| Llama | `llama-3-70b`, `llama-3-8b` |

---

## Get Message

Retrieve a specific message.

```http
GET /api/messages/[id]
```

### Response

```json
{
  "message": {
    "id": "msg_123",
    "conversationId": "conv_123",
    "content": "Hello!",
    "role": "user",
    "metadata": {},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Update Message

Update a message's content or metadata.

```http
PATCH /api/messages/[id]
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `content` | string | No | Updated content |
| `metadata` | object | No | Updated metadata |

### Request

```json
{
  "content": "Updated content",
  "metadata": { "edited": true }
}
```

---

## Delete Message

Delete a specific message.

```http
DELETE /api/messages/[id]
```

### Response

```json
{
  "message": "Message deleted"
}
```
