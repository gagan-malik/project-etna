---
name: error-handling
description: Add try/catch, context, and user-facing mapping. Use when adding new services, integrations, or API handlers.
---

# Error-Handling Skill

When adding new services, integrations, or API handlers, follow these steps.

## 1. Try/catch

- Wrap async operations and external calls in try/catch (or .catch with logging).
- Do not swallow errors; log or rethrow with context.

## 2. Context

- When logging, include context: operation name, route or function, relevant ids (request id, user id if safe), and the error.
- Never log secrets or PII; sanitize error messages before logging if they might contain user data.

## 3. Rethrow / map

- For API handlers: map known errors to HTTP status and a safe user-facing message (e.g. 404 "Not found", 400 "Invalid input").
- For 500, return a generic message and correlate with server logs (e.g. request id).
- Rethrow with a wrapper error type if the caller needs to distinguish (e.g. NotFoundError, ValidationError).

## 4. User-facing messages

- Error responses should be actionable where possible ("Invalid email" not "Validation failed").
- Do not expose stack traces, internal paths, or dependency errors to the client.

## Output

- Code with try/catch, structured logging, and consistent error mapping for API boundaries.
- If the code path is security-sensitive, apply the **security-review** skill.
