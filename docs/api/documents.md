---
title: Documents API
description: Upload and search documents for context-aware AI assistance
---

# Documents API

---

## Overview

Documents in Project Etna serve as context for AI conversations. Upload RTL files, specifications, and documentation to enhance AI responses.

---

## List Documents

Retrieve documents, optionally filtered by space.

```http
GET /api/documents
```

### Query Parameters

| Parameter | Type | Required | Description |
|:----------|:-----|:---------|:------------|
| `spaceId` | string | No | Filter by space ID |

### Response

```json
{
  "documents": [
    {
      "id": "doc_123",
      "title": "counter.v",
      "content": "module counter...",
      "url": null,
      "source": "upload",
      "sourceId": null,
      "spaceId": "space_123",
      "userId": "user_123",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## Create Document

Upload a new document.

```http
POST /api/documents
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `title` | string | Yes | Document title |
| `content` | string | Yes | Document content |
| `url` | string | No | Source URL |
| `source` | string | No | Source type (`upload`, `github`, `url`) |
| `sourceId` | string | No | External source identifier |
| `spaceId` | string | No | Space to add document to |
| `metadata` | object | No | Additional metadata |

### Request

```json
{
  "title": "counter.v",
  "content": "module counter (\n  input clk,\n  input rst,\n  output reg [7:0] count\n);\n  always @(posedge clk) begin\n    if (rst) count <= 0;\n    else count <= count + 1;\n  end\nendmodule",
  "source": "upload",
  "spaceId": "space_123",
  "metadata": {
    "language": "verilog",
    "fileSize": 256
  }
}
```

### Response

```json
{
  "document": {
    "id": "doc_456",
    "title": "counter.v",
    "userId": "user_123",
    "spaceId": "space_123",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Search Documents

Search documents using text matching. Vector similarity search coming soon.

```http
POST /api/documents/search
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `query` | string | Yes | Search query |
| `limit` | number | No | Max results (default: 5) |
| `spaceId` | string | No | Limit to specific space |

### Request

```json
{
  "query": "counter module clock",
  "limit": 5,
  "spaceId": "space_123"
}
```

### Response

```json
{
  "documents": [
    {
      "id": "doc_123",
      "title": "counter.v",
      "content": "module counter...",
      "relevance": 0.85
    }
  ]
}
```

::: note
Currently uses text search. Vector similarity search with embeddings will be enabled in a future update for more accurate semantic matching.
:::

---

## Get Document

Retrieve a specific document.

```http
GET /api/documents/[id]
```

### Response

```json
{
  "document": {
    "id": "doc_123",
    "title": "counter.v",
    "content": "module counter...",
    "url": null,
    "source": "upload",
    "sourceId": null,
    "spaceId": "space_123",
    "userId": "user_123",
    "metadata": {
      "language": "verilog"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Update Document

Update a document's content or metadata.

```http
PATCH /api/documents/[id]
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `title` | string | No | Updated title |
| `content` | string | No | Updated content |
| `metadata` | object | No | Updated metadata |

### Request

```json
{
  "title": "counter_v2.v",
  "content": "// Updated counter module\nmodule counter...",
  "metadata": {
    "version": 2
  }
}
```

---

## Delete Document

Delete a document.

```http
DELETE /api/documents/[id]
```

### Response

```json
{
  "message": "Document deleted"
}
```

---

## Supported File Types

Project Etna can parse and analyze:

| Type | Extensions | Description |
|:-----|:-----------|:------------|
| Verilog | `.v` | Verilog HDL |
| SystemVerilog | `.sv`, `.svh` | SystemVerilog |
| VHDL | `.vhd`, `.vhdl` | VHDL |
| Text | `.txt`, `.md` | Plain text and Markdown |

::: tip
RTL files are automatically syntax-highlighted and parsed for module hierarchy extraction.
:::
