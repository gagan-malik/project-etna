---
title: Orchestration API
description: Agent orchestration — create runs, stream multi-agent pipelines, list and get runs
---

# Orchestration API

The orchestration layer receives user intent, classifies it, routes to the right agent(s), and executes single or multi-step pipelines. Runs and tasks are persisted for observability and replay.

**Auth:** All routes require session (401 if unauthenticated).

**Rate limit:** 10 requests/minute per user for `POST /run` and `POST /run/stream`.

**Response shape:** `{ data?: T; error?: string; message?: string }`

---

## Create Run (non-streaming)

Create an orchestration run and execute synchronously.

```http
POST /api/orchestration/run
```

### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `input` | string | Yes | User input (1–50000 chars) |
| `conversationId` | string | No | Conversation ID for context (last 20 messages + RAG/sources) |
| `spaceId` | string | No | Space ID for space instructions |
| `sources` | string[] | No | Data sources (e.g. `web`, `my_files`, `org_files`) |
| `model` | string | No | AI model override |

### Response (200)

```json
{
  "data": {
    "run": {
      "id": "clx...",
      "userId": "...",
      "status": "completed",
      "intent": "architect",
      "input": "Design the API for user auth",
      "finalOutput": "...",
      "agent_tasks": [
        { "id": "...", "agentId": "architect", "orderIndex": 0, "status": "completed", "output": "..." },
        { "id": "...", "agentId": "implement", "orderIndex": 1, "status": "completed", "output": "..." }
      ]
    },
    "finalOutput": "...",
    "status": "completed"
  }
}
```

### Errors

| Status | Description |
|:-------|:-------------|
| 400 | Invalid request (validation error) |
| 401 | Unauthorized (session required) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Create Run (streaming)

Create an orchestration run and stream progress via SSE.

```http
POST /api/orchestration/run/stream
```

### Request Body

Same as `POST /api/orchestration/run`.

### Response (200, text/event-stream)

SSE events:

| Event | Payload | Description |
|:------|:--------|:-------------|
| `run_start` | `{ runId, intent, agentIds }` | Run started |
| `task_start` | `{ taskId, agentId, orderIndex }` | Task started |
| `chunk` | `{ content }` | Streaming content chunk |
| `task_end` | `{ taskId, agentId, output }` | Task completed |
| `run_end` | `{ runId, status, finalOutput }` | Run completed |
| `error` | `{ error }` | Error occurred |

### Example SSE stream

```
data: {"type":"run_start","runId":"clx...","intent":"architect","agentIds":["architect","implement"]}

data: {"type":"task_start","taskId":"...","agentId":"architect","orderIndex":0}

data: {"type":"chunk","content":"Here is the API design..."}

data: {"type":"task_end","taskId":"...","agentId":"architect","output":"..."}

data: {"type":"run_end","runId":"clx...","status":"completed","finalOutput":"..."}
```

---

## List Runs

List orchestration runs for the current user.

```http
GET /api/orchestration/runs?limit=20&cursor=clx...
```

### Query Parameters

| Param | Type | Default | Description |
|:------|:-----|:--------|:-------------|
| `limit` | number | 20 | Max runs (1–100) |
| `cursor` | string | — | Pagination cursor (run ID) |

### Response (200)

```json
{
  "data": {
    "runs": [
      {
        "id": "clx...",
        "status": "completed",
        "intent": "research",
        "input": "How does X work?",
        "finalOutput": "...",
        "createdAt": "2024-01-01T00:00:00Z",
        "agent_tasks": [...]
      }
    ],
    "nextCursor": "clx...",
    "hasMore": true
  }
}
```

---

## Get Run

Get a single run with full task details.

```http
GET /api/orchestration/runs/{id}
```

### Response (200)

```json
{
  "data": {
    "run": {
      "id": "clx...",
      "userId": "...",
      "conversationId": "...",
      "status": "completed",
      "intent": "architect",
      "input": "...",
      "finalOutput": "...",
      "agent_tasks": [
        { "id": "...", "agentId": "architect", "orderIndex": 0, "status": "completed", "input": "...", "output": "..." }
      ]
    }
  }
}
```

### Errors

| Status | Description |
|:-------|:-------------|
| 401 | Unauthorized |
| 404 | Run not found (or not owned by user) |
| 500 | Internal server error |

---

## OpenAPI Snippet

```yaml
paths:
  /api/orchestration/run:
    post:
      summary: Create orchestration run (non-streaming)
      security:
        - session: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [input]
              properties:
                input:
                  type: string
                  minLength: 1
                  maxLength: 50000
                conversationId:
                  type: string
                  format: cuid
                spaceId:
                  type: string
                  format: cuid
                sources:
                  type: array
                  items:
                    type: string
                model:
                  type: string
      responses:
        '200':
          description: Run completed
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: object
                    properties:
                      run: { $ref: '#/components/schemas/AgentRun' }
                      finalOutput: { type: string }
                      status: { type: string, enum: [completed, failed] }
        '400':
          description: Invalid request
        '401':
          description: Unauthorized
        '429':
          description: Rate limit exceeded
        '500':
          description: Internal server error

  /api/orchestration/run/stream:
    post:
      summary: Create orchestration run (streaming)
      security:
        - session: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [input]
              properties:
                input: { type: string, minLength: 1, maxLength: 50000 }
                conversationId: { type: string, format: cuid }
                spaceId: { type: string, format: cuid }
                sources: { type: array, items: { type: string } }
                model: { type: string }
      responses:
        '200':
          description: SSE stream
          content:
            text/event-stream:
              schema:
                type: string
                description: SSE events (run_start, task_start, chunk, task_end, run_end, error)
        '401':
          description: Unauthorized
        '429':
          description: Rate limit exceeded

  /api/orchestration/runs:
    get:
      summary: List orchestration runs
      security:
        - session: []
      parameters:
        - name: limit
          in: query
          schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
        - name: cursor
          in: query
          schema: { type: string }
      responses:
        '200':
          description: List of runs
        '401':
          description: Unauthorized

  /api/orchestration/runs/{id}:
    get:
      summary: Get orchestration run
      security:
        - session: []
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Run with tasks
        '401':
          description: Unauthorized
        '404':
          description: Run not found
```
