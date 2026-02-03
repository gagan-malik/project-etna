---
name: observability
description: Add logging and correlation for new endpoints or background jobs. Use when adding API routes, background jobs, or integration points that should be traceable.
---

# Observability Skill

When adding new endpoints or background jobs, follow these steps.

## 1. Logging

- Log at key points: request start (with method, path, request id if present), success, and errors.
- Use structured fields where possible (e.g. `{ route, method, status, durationMs, error }`).
- Never log secrets or PII; sanitize before logging.

## 2. Correlation

- Include a request id or correlation id in logs for a given request or job run (e.g. from header or generated).
- Use the same id in error responses (e.g. in a header or safe field) so support can correlate with logs.

## 3. Errors

- Log errors with context: route/job name, correlation id, and the error (message and stack server-side only).
- Map to user-facing message and status; do not expose internals in the response.

## 4. Metrics (optional)

- If the project uses a metrics layer, add counters or timers for new routes or jobs (e.g. success/failure, latency).
- Otherwise, ensure logs are sufficient to debug failures and measure usage.

## Output

- New or updated code with structured logging and correlation; errors logged with context and mapped safely to responses.
