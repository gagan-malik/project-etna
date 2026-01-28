---
title: Conversations API
description: Manage chat conversations
---

# Conversations API

---

## List Conversations

Retrieve all conversations for the authenticated user.

```http
GET /api/conversations
```

### Response

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

### Example

```javascript
const response = await fetch('/api/conversations', {
  credentials: 'include'
});
const { conversations } = await response.json();
```

---

## Create Conversation

Create a new conversation.

```http
POST /api/conversations
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `title` | string | Yes | Conversation title |
| `spaceId` | string | No | Space ID (uses default space if not provided) |

### Request

```json
{
  "title": "New Conversation",
  "spaceId": "space_123"
}
```

### Response

```json
{
  "conversation": {
    "id": "conv_456",
    "title": "New Conversation",
    "userId": "user_123",
    "spaceId": "space_123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Example

```javascript
const response = await fetch('/api/conversations', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Debug Session - Counter Module'
  })
});
const { conversation } = await response.json();
```

---

## Get Conversation

Retrieve a specific conversation by ID.

```http
GET /api/conversations/[id]
```

### Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `id` | string | Conversation ID |

### Response

```json
{
  "conversation": {
    "id": "conv_123",
    "title": "My Conversation",
    "userId": "user_123",
    "spaceId": "space_123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "messages": [
      {
        "id": "msg_1",
        "content": "Hello!",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "space": {
      "id": "space_123",
      "name": "My Workspace"
    }
  }
}
```

---

## Update Conversation

Update a conversation's title or other properties.

```http
PATCH /api/conversations/[id]
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `title` | string | No | New conversation title |

### Request

```json
{
  "title": "Updated Title"
}
```

### Response

```json
{
  "conversation": {
    "id": "conv_123",
    "title": "Updated Title",
    "updatedAt": "2024-01-01T00:01:00Z"
  }
}
```

---

## Delete Conversation

Delete a conversation and all its messages.

```http
DELETE /api/conversations/[id]
```

### Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `id` | string | Conversation ID |

### Response

```json
{
  "message": "Conversation deleted"
}
```

::: warning
This action is irreversible. All messages in the conversation will also be deleted.
:::
