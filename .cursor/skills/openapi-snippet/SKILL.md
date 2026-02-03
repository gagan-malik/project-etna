---
name: openapi-snippet
description: Emit OpenAPI path/request/response snippet for docs. Use when adding or changing a public or partner API that should be documented in OpenAPI.
---

# OpenAPI Snippet Skill

When adding or changing a public or partner API, produce an OpenAPI snippet for documentation.

## 1. Path and method

- Include path (e.g. `/api/v1/resource`) and HTTP method (GET, POST, etc.).
- Document path parameters and query parameters with types and descriptions.

## 2. Request body

- For POST/PUT/PATCH, include request body schema (JSON Schema or OpenAPI schema).
- Document required vs optional fields and validation rules (e.g. max length, format).

## 3. Responses

- Document at least: 200/201 (success), 400 (validation error), 401 (unauthenticated), 403 (forbidden), 404 (not found), 500 (server error).
- Include response body shape for success and for error (e.g. `{ error: string, message?: string }`).

## 4. Where to put it

- Add the snippet to docs/api/ or the project's OpenAPI spec file (e.g. openapi.yaml or in docs).
- Keep in sync with the actual route handler; update when the API changes.

## Output

- OpenAPI path entry (or equivalent markdown) with path, method, parameters, request body, and response codes/bodies.
- Snippet added to the project's API documentation.
