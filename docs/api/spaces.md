---
title: Spaces API
description: Organize work into workspaces
---

# Spaces API

---

## Overview

Spaces are workspaces that help organize conversations and documents. Each user has a default space, and can create additional spaces for different projects.

---

## List Spaces

Retrieve all spaces for the authenticated user.

```http
GET /api/spaces
```

### Response

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

---

## Create Space

Create a new workspace.

```http
POST /api/spaces
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `name` | string | Yes | Space name |
| `slug` | string | No | URL-friendly slug (auto-generated if not provided) |

### Request

```json
{
  "name": "RISC-V Project",
  "slug": "risc-v-project"
}
```

### Response

```json
{
  "space": {
    "id": "space_456",
    "name": "RISC-V Project",
    "slug": "risc-v-project",
    "ownerId": "user_123",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Error: Duplicate Slug

```json
{
  "error": "Space with this slug already exists"
}
```

---

## Get Space

Retrieve a specific space.

```http
GET /api/spaces/[id]
```

### Response

```json
{
  "space": {
    "id": "space_123",
    "name": "My Workspace",
    "slug": "my-workspace",
    "ownerId": "user_123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "conversations": [
      {
        "id": "conv_1",
        "title": "Debug Session 1"
      }
    ],
    "documents": [
      {
        "id": "doc_1",
        "title": "counter.v"
      }
    ]
  }
}
```

---

## Update Space

Update a space's name or slug.

```http
PATCH /api/spaces/[id]
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `name` | string | No | New space name |
| `slug` | string | No | New URL slug |

### Request

```json
{
  "name": "RISC-V Debug Project",
  "slug": "risc-v-debug"
}
```

### Response

```json
{
  "space": {
    "id": "space_123",
    "name": "RISC-V Debug Project",
    "slug": "risc-v-debug",
    "updatedAt": "2024-01-01T00:01:00Z"
  }
}
```

---

## Delete Space

Delete a space and optionally its contents.

```http
DELETE /api/spaces/[id]
```

### Query Parameters

| Parameter | Type | Default | Description |
|:----------|:-----|:--------|:------------|
| `deleteContents` | boolean | `false` | Also delete conversations and documents |

### Example

```http
DELETE /api/spaces/space_123?deleteContents=true
```

### Response

```json
{
  "message": "Space deleted"
}
```

::: warning
You cannot delete your default space. Create a new space and set it as default first.
:::
