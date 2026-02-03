---
name: api-route
description: Add or change an API route with validation, error handling, and docs. Use when creating or modifying app/api/** route handlers.
---

# API Route Skill

When adding or changing an API route, follow these steps.

## 1. Types

- Define or reuse request/response types (e.g. in types/ or next to the route).
- Use explicit types for body, query, and response; avoid `any`.

## 2. Validation

- Validate body/query with lib/validation (Zod schemas or equivalent) before use.
- Return 400 with a clear, user-safe error message for invalid input (e.g. `{ error: "Invalid request", message: "..." }`).

## 3. Auth (if protected)

- Use session/auth helpers (auth.ts, getSession) for protected routes.
- Return 401 if unauthenticated, 403 if unauthorized.
- Apply the **auth-check** skill when the route touches user/session data.

## 4. Errors

- Wrap handler logic in try/catch; log errors server-side with context (route name, request id if present).
- Return consistent JSON (e.g. `{ data?, error?, message? }`); use 4xx/5xx status codes correctly.
- For 500, return a generic message; do not expose stack traces or internals.

## 5. Documentation

- Add or update the route in docs/api/ or OpenAPI (path, method, request/response, errors).
- For public/partner APIs, use the **openapi-snippet** skill to emit a path snippet.

## 6. Tests

- Add or update tests for success and error cases (e.g. invalid input, 401, 404, 500).
- Use the **testing** skill for test structure and edge cases.

## Output

- Route handler with validation, auth (if needed), error handling, and types.
- Updated API docs and tests where applicable.
