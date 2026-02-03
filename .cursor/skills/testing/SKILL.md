---
name: testing
description: Add or update tests for lib/ and API behavior. Use when adding or changing logic in lib/ or app/api/ that should be tested.
---

# Testing Skill

When adding or updating tests for lib/ or API behavior, follow these steps.

## 1. Scope

- New or changed public functions in lib/ must have unit tests (or integration tests if they hit DB/external).
- New or changed API routes must have tests for success and key error cases (400, 401, 404, 500).

## 2. Structure

- Use the project test runner (Jest) and existing patterns in __tests__/.
- Place tests in __tests__/ mirroring the source (e.g. __tests__/lib/validation.test.ts for lib/validation.ts).
- One describe per module or route; nested describe for groups of cases.

## 3. Cases

- Happy path: valid input, expected response or return value.
- Validation: invalid input, expect 400 or thrown validation error.
- Auth: unauthenticated or unauthorized, expect 401/403 where applicable.
- Not found: missing resource, expect 404.
- Server error: mock failure, expect 500 or thrown error and no PII in response.

## 4. Mocking

- Mock external services and DB where appropriate for unit tests; prefer integration tests for critical DB or API contracts.
- Do not over-mock; test real behavior where it matters (e.g. validation schema, error mapping).

## 5. Assertions

- Assert on response status, body shape, and error message where relevant.
- Avoid brittle assertions on exact copy; assert on structure and key fields.

## Output

- Test file(s) that run with `npm run test`; no skipped tests unless documented.
- Edge cases and error paths covered for the changed code.
