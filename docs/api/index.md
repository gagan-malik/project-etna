---
title: API Reference
description: Complete API documentation for Project Etna
---

# API Reference

Complete documentation for the Project Etna REST API.

---

## Overview

Project Etna exposes a RESTful API for managing conversations, messages, documents, and more. All API routes require authentication unless otherwise noted.

## Base URL

```
https://your-domain.vercel.app/api
```

For local development:

```
http://localhost:3000/api
```

---

## Authentication

All API routes (except auth routes) require authentication. The API uses session-based authentication via cookies.

### Authenticating Requests

Include the session cookie in your requests. When using fetch:

```javascript
fetch('/api/conversations', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

---

## Response Format

### Success Response

```json
{
  "conversations": [...],
  "message": "Success"
}
```

### Error Response

```json
{
  "error": "Error message here"
}
```

---

## Status Codes

| Code | Description |
|:-----|:------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Missing or invalid fields |
| `401` | Unauthorized - Not authenticated |
| `404` | Not Found |
| `409` | Conflict - e.g., duplicate slug |
| `500` | Internal Server Error |

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

| Plan | Requests/minute |
|:-----|:----------------|
| Free | 60 |
| Pro | 300 |
| Team | 1000 |

When rate-limited, you'll receive a `429 Too Many Requests` response.

---

## API Endpoints

- [Authentication](/api/authentication) - Sign up, sign in, and session management
- [Conversations](/api/conversations) - Create and manage chat conversations
- [Messages](/api/messages) - Send messages and stream AI responses
- [Spaces](/api/spaces) - Organize work into spaces/workspaces
- [Documents](/api/documents) - Upload and search documents
- [Waveforms](/api/waveforms) - Upload and manage waveform files
- [Settings](/api/settings) - Get and update user preferences (theme, notifications, privacy mode, etc.)
- [Cloud Agents](/api/cloud-agents) - *(Planned)* Programmatically launch and manage silicon-aware cloud agents on your repositories
