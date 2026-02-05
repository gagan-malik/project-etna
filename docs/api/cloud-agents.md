---
title: Cloud Agents API
description: Programmatically launch and manage cloud agents that work on your repositories
---

# Cloud Agents API

> **Status: Backlog (not implemented).** Cloud Agents are deferred as of Feb 2026. Product focus is in-app only. This document describes the **planned** API contract. When implemented, agents will be Etna silicon-aware (RTL/debug). See [BACKLOG.md](../product/BACKLOG.md) CLD-001 and [UX_MASTER_FILE.md](../product/UX_MASTER_FILE.md) — Future: Cloud Agents.

The Cloud Agents API (when implemented) will let you programmatically launch and manage cloud agents that work on your repositories with **Etna's silicon-debug context** (RTL, testbench, protocol awareness).

- The Cloud Agents API uses **Basic Authentication**. You can obtain an API key from your [Etna Dashboard](https://your-domain.vercel.app/settings) (or Cursor Dashboard if integrating with Cursor).
- For details on authentication methods, rate limits, and best practices, see the [API Overview](/docs/api).
- MCP (Model Context Protocol) is not yet supported by the Cloud Agents API.

---

## Endpoints

### List Agents

```http
GET /v0/agents
```

List all cloud agents for the authenticated user.

#### Query Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `limit` | number (optional) | Number of cloud agents to return. Default: 20, Max: 100 |
| `cursor` | string (optional) | Pagination cursor from the previous response |
| `prUrl` | string (optional) | Filter agents by pull request URL |

#### Example

```bash
curl --request GET \
  --url https://api.example.com/v0/agents \
  -u YOUR_API_KEY:
```

#### Response

```json
{
  "agents": [
    {
      "id": "bc_abc123",
      "name": "Add README Documentation",
      "status": "FINISHED",
      "source": {
        "repository": "https://github.com/your-org/your-repo",
        "ref": "main"
      },
      "target": {
        "branchName": "cursor/add-readme-1234",
        "url": "https://example.com/agents?id=bc_abc123",
        "prUrl": "https://github.com/your-org/your-repo/pull/1234",
        "autoCreatePr": false,
        "openAsCursorGithubApp": false,
        "skipReviewerRequest": false
      },
      "summary": "Added README.md with installation instructions and usage examples",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "bc_def456",
      "name": "Fix authentication bug",
      "status": "RUNNING",
      "source": {
        "repository": "https://github.com/your-org/your-repo",
        "ref": "main"
      },
      "target": {
        "branchName": "cursor/fix-auth-5678",
        "url": "https://example.com/agents?id=bc_def456",
        "autoCreatePr": true,
        "openAsCursorGithubApp": true,
        "skipReviewerRequest": false
      },
      "createdAt": "2024-01-15T11:45:00Z"
    }
  ],
  "nextCursor": "bc_ghi789"
}
```

---

### Agent Status

```http
GET /v0/agents/{id}
```

Retrieve the current status and results of a cloud agent.

#### Path Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `id` | string | Unique identifier for the cloud agent (e.g. `bc_abc123`) |

#### Example

```bash
curl --request GET \
  --url https://api.example.com/v0/agents/bc_abc123 \
  -u YOUR_API_KEY:
```

#### Response

```json
{
  "id": "bc_abc123",
  "name": "Add README Documentation",
  "status": "FINISHED",
  "source": {
    "repository": "https://github.com/your-org/your-repo",
    "ref": "main"
  },
  "target": {
    "branchName": "cursor/add-readme-1234",
    "url": "https://example.com/agents?id=bc_abc123",
    "prUrl": "https://github.com/your-org/your-repo/pull/1234",
    "autoCreatePr": false,
    "openAsCursorGithubApp": false,
    "skipReviewerRequest": false
  },
  "summary": "Added README.md with installation instructions and usage examples",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Agent Conversation

```http
GET /v0/agents/{id}/conversation
```

Retrieve the conversation history of a cloud agent, including all user prompts and assistant responses.

> **Note:** If the cloud agent has been deleted, you cannot access the conversation.

#### Path Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `id` | string | Unique identifier for the cloud agent (e.g. `bc_abc123`) |

#### Example

```bash
curl --request GET \
  --url https://api.example.com/v0/agents/bc_abc123/conversation \
  -u YOUR_API_KEY:
```

#### Response

```json
{
  "id": "bc_abc123",
  "messages": [
    {
      "id": "msg_001",
      "type": "user_message",
      "text": "Add a README.md file with installation instructions"
    },
    {
      "id": "msg_002",
      "type": "assistant_message",
      "text": "I'll help you create a comprehensive README.md file with installation instructions. Let me start by analyzing your project structure..."
    },
    {
      "id": "msg_003",
      "type": "assistant_message",
      "text": "I've created a README.md file with the following sections:\n- Project overview\n- Installation instructions\n- Usage examples\n- Configuration options"
    },
    {
      "id": "msg_004",
      "type": "user_message",
      "text": "Also add a section about troubleshooting"
    },
    {
      "id": "msg_005",
      "type": "assistant_message",
      "text": "I've added a troubleshooting section to the README with common issues and solutions."
    }
  ]
}
```

---

### Launch an Agent

```http
POST /v0/agents
```

Start a new cloud agent to work on your repository.

#### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `prompt` | object | Yes | The task prompt for the agent, including optional images |
| `prompt.text` | string | Yes | The instruction text for the agent |
| `prompt.images` | array | No | Array of image objects with base64 data and dimensions (max 5) |
| `model` | string | No | The LLM to use (e.g. `claude-4-sonnet`). If not provided, the service picks the most appropriate model. |
| `source` | object | Yes | Repository source information |
| `source.repository` | string | Yes* | GitHub repository URL (e.g. `https://github.com/your-org/your-repo`) |
| `source.ref` | string | No | Git ref (branch name, tag, or commit hash) to use as the base branch |
| `source.prUrl` | string | No | GitHub pull request URL. When provided, the agent works on this PR's repository and branches. If set, `repository` and `ref` are ignored. |
| `target` | object | No | Target configuration for the agent |
| `target.autoCreatePr` | boolean | No | Whether to automatically create a pull request when the agent completes. Default: `false` |
| `target.openAsCursorGithubApp` | boolean | No | Whether to open the pull request as the Cursor GitHub App instead of as the user. Only applies if `autoCreatePr` is true. Default: `false` |
| `target.skipReviewerRequest` | boolean | No | Whether to skip adding the user as a reviewer to the pull request. Only applies if `autoCreatePr` is true and the PR is opened as the Cursor GitHub App. Default: `false` |
| `target.branchName` | string | No | Custom branch name for the agent to create |
| `target.autoBranch` | boolean | No | Whether to create a new branch (true) or push to the PR's existing head branch (false). Only applies when `source.prUrl` is provided. Default: `true` |
| `webhook` | object | No | Webhook configuration for status change notifications |
| `webhook.url` | string | Yes** | URL to receive webhook notifications about agent status changes |
| `webhook.secret` | string | No | Secret key for webhook payload verification (minimum 32 characters) |

\* Required unless `source.prUrl` is provided.  
\** Required if `webhook` is provided.

#### Example

```bash
curl --request POST \
  --url https://api.example.com/v0/agents \
  -u YOUR_API_KEY: \
  --header 'Content-Type: application/json' \
  --data '{
  "prompt": {
    "text": "Add a README.md file with installation instructions",
    "images": [
      {
        "data": "iVBORw0KGgoAAAANSUhEUgAA...",
        "dimension": {
          "width": 1024,
          "height": 768
        }
      }
    ]
  },
  "source": {
    "repository": "https://github.com/your-org/your-repo",
    "ref": "main"
  },
  "target": {
    "autoCreatePr": true,
    "branchName": "feature/add-readme"
  }
}'
```

#### Response

```json
{
  "id": "bc_abc123",
  "name": "Add README Documentation",
  "status": "CREATING",
  "source": {
    "repository": "https://github.com/your-org/your-repo",
    "ref": "main"
  },
  "target": {
    "branchName": "feature/add-readme",
    "url": "https://example.com/agents?id=bc_abc123",
    "prUrl": "https://github.com/your-org/your-repo/pull/123",
    "autoCreatePr": true,
    "openAsCursorGithubApp": false,
    "skipReviewerRequest": false
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Add Follow-up

```http
POST /v0/agents/{id}/followup
```

Add a follow-up instruction to an existing cloud agent.

#### Path Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `id` | string | Unique identifier for the cloud agent (e.g. `bc_abc123`) |

#### Request Body

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `prompt` | object | Yes | The follow-up prompt for the agent, including optional images |
| `prompt.text` | string | Yes | The follow-up instruction text for the agent |
| `prompt.images` | array | No | Array of image objects with base64 data and dimensions (max 5) |

#### Example

```bash
curl --request POST \
  --url https://api.example.com/v0/agents/bc_abc123/followup \
  -u YOUR_API_KEY: \
  --header 'Content-Type: application/json' \
  --data '{
  "prompt": {
    "text": "Also add a section about troubleshooting",
    "images": [
      {
        "data": "iVBORw0KGgoAAAANSUhEUgAA...",
        "dimension": {
          "width": 1024,
          "height": 768
        }
      }
    ]
  }
}'
```

#### Response

```json
{
  "id": "bc_abc123"
}
```

---

### Stop an Agent

```http
POST /v0/agents/{id}/stop
```

Stop a running cloud agent. This pauses the agent's execution without deleting it.

> **Note:** You can only stop agents that are currently running. If you send a follow-up prompt to a stopped agent, it will start running again.

#### Path Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `id` | string | Unique identifier for the cloud agent (e.g. `bc_abc123`) |

#### Example

```bash
curl --request POST \
  --url https://api.example.com/v0/agents/bc_abc123/stop \
  -u YOUR_API_KEY:
```

#### Response

```json
{
  "id": "bc_abc123"
}
```

---

### Delete an Agent

```http
DELETE /v0/agents/{id}
```

Delete a cloud agent. This action is permanent and cannot be undone.

#### Path Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `id` | string | Unique identifier for the cloud agent (e.g. `bc_abc123`) |

#### Example

```bash
curl --request DELETE \
  --url https://api.example.com/v0/agents/bc_abc123 \
  -u YOUR_API_KEY:
```

#### Response

```json
{
  "id": "bc_abc123"
}
```

---

### API Key Info

```http
GET /v0/me
```

Retrieve information about the API key being used for authentication.

#### Example

```bash
curl --request GET \
  --url https://api.example.com/v0/me \
  -u YOUR_API_KEY:
```

#### Response

```json
{
  "apiKeyName": "Production API Key",
  "createdAt": "2024-01-15T10:30:00Z",
  "userEmail": "developer@example.com"
}
```

---

### List Models

```http
GET /v0/models
```

Retrieve a list of recommended models for cloud agents.

> **Note:** We recommend offering an "Auto" option where you do not provide a model name to the creation endpoint, and the service will pick the most appropriate model.

#### Example

```bash
curl --request GET \
  --url https://api.example.com/v0/models \
  -u YOUR_API_KEY:
```

#### Response

```json
{
  "models": [
    "claude-4-sonnet-thinking",
    "gpt-5.2",
    "claude-4.5-sonnet-thinking"
  ]
}
```

---

### List GitHub Repositories

```http
GET /v0/repositories
```

Retrieve a list of GitHub repositories accessible to the authenticated user.

> **Warning:** This endpoint has very strict rate limits. Limit requests to **1 / user / minute** and **30 / user / hour**. The request can take tens of seconds for users with access to many repositories. Handle missing or delayed information gracefully.

#### Example

```bash
curl --request GET \
  --url https://api.example.com/v0/repositories \
  -u YOUR_API_KEY:
```

#### Response

```json
{
  "repositories": [
    {
      "owner": "your-org",
      "name": "your-repo",
      "repository": "https://github.com/your-org/your-repo"
    },
    {
      "owner": "your-org",
      "name": "another-repo",
      "repository": "https://github.com/your-org/another-repo"
    },
    {
      "owner": "your-username",
      "name": "personal-project",
      "repository": "https://github.com/your-username/personal-project"
    }
  ]
}
```

---

## Agent Status Values

| Status | Description |
|:-------|:------------|
| `CREATING` | Agent is being created |
| `RUNNING` | Agent is actively working |
| `FINISHED` | Agent completed successfully |
| `STOPPED` | Agent was stopped by the user |
| `FAILED` | Agent encountered an error |

---

## Reference

This API is designed to be compatible with the [Cursor Cloud Agents API](https://cursor.com/docs/cloud-agent/api/endpoints). Use Basic Authentication with your API key; do not log or expose API keys in client-side code or logs.
