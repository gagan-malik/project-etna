---
title: Contributing
description: How to contribute to Project Etna
---

# Contributing

Help make Project Etna better.

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Neon account)
- Git

### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/project-etna.git
cd project-etna
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment

```bash
cp .env.example .env.local
# Edit .env.local with your database and API keys
```

### Run Development Server

```bash
npm run dev
```

---

## Development Workflow

### Branch Naming

Use descriptive branch names:

| Type | Pattern | Example |
|:-----|:--------|:--------|
| Feature | `feature/description` | `feature/add-vcd-parser` |
| Bug fix | `fix/description` | `fix/auth-redirect` |
| Docs | `docs/description` | `docs/api-examples` |
| Refactor | `refactor/description` | `refactor/prisma-client` |

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, no code change
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**

```bash
feat(waveform): add FST file support
fix(auth): handle expired sessions correctly
docs(api): add streaming endpoint examples
```

---

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for objects
- Use explicit return types for functions

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}
```

### React Components

- Use function components with hooks
- Props interfaces should be named `ComponentNameProps`
- Colocate styles with components

```tsx
interface ButtonProps {
  variant?: 'default' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'default', children, onClick }: ButtonProps) {
  return (
    <button className={cn(styles[variant])} onClick={onClick}>
      {children}
    </button>
  );
}
```

### API Routes

- Validate input with Zod
- Return consistent error responses
- Check authentication first

```typescript
import { z } from 'zod';
import { auth } from '@/auth';

const schema = z.object({
  title: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const result = schema.safeParse(body);
  
  if (!result.success) {
    return Response.json({ error: result.error.message }, { status: 400 });
  }

  // Handle request...
}
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Writing Tests

Place tests in `__tests__/` directory mirroring source structure:

```
__tests__/
├── lib/
│   ├── rate-limit.test.ts
│   └── validation.test.ts
├── api/
│   └── conversations.test.ts
└── components/
    └── chat-message.test.tsx
```

**Example test:**

```typescript
import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
  it('should allow requests under limit', async () => {
    const result = await rateLimit('user_123', 'free');
    expect(result.allowed).toBe(true);
  });

  it('should block requests over limit', async () => {
    // Exhaust rate limit
    for (let i = 0; i < 60; i++) {
      await rateLimit('user_456', 'free');
    }
    
    const result = await rateLimit('user_456', 'free');
    expect(result.allowed).toBe(false);
  });
});
```

---

## Pull Requests

### Before Submitting

1. **Run tests** - `npm test`
2. **Run linter** - `npm run lint`
3. **Update docs** - If adding features
4. **Add tests** - For new functionality

### PR Template

```markdown
## Description
Brief description of changes.

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactor

## Testing
How was this tested?

## Screenshots
If applicable.

## Checklist
- [ ] Tests pass
- [ ] Linter passes
- [ ] Docs updated
- [ ] Commits follow convention
```

### Review Process

1. Open PR against `main`
2. Automated checks run (tests, linting)
3. Request review from maintainers
4. Address feedback
5. Squash and merge when approved

---

## Project Structure

Key directories to know:

| Directory | Purpose |
|:----------|:--------|
| `app/` | Next.js pages and API routes |
| `components/` | React components |
| `lib/` | Shared utilities and business logic |
| `prisma/` | Database schema and migrations |
| `__tests__/` | Test files |
| `docs/` | Documentation site |

---

## Adding Features

### New API Endpoint

1. Create route in `app/api/`
2. Add Zod validation schema
3. Implement handler with auth check
4. Add tests
5. Document in `docs/api/`

### New Component

1. Create in `components/`
2. Use shadcn/ui primitives where possible
3. Add TypeScript props interface
4. Test with React Testing Library

### New AI Provider

1. Implement provider interface in `lib/ai/`
2. Add to provider registry
3. Add environment variable
4. Update documentation

---

## Documentation

### Local Preview

```bash
cd docs
bundle install
bundle exec jekyll serve
```

Visit http://localhost:4000/project-etna/

### Adding Pages

1. Create `.md` file in `docs/`
2. Add front matter:

```yaml
---
layout: default
title: Page Title
nav_order: 9
description: "Page description"
---
```

3. Write content in Markdown
4. Commit and push - docs deploy automatically

---

## Getting Help

- **Questions** - Open a [Discussion](https://github.com/gaganmalik/project-etna/discussions)
- **Bugs** - Open an [Issue](https://github.com/gaganmalik/project-etna/issues)
- **Security** - See [SECURITY.md](https://github.com/gaganmalik/project-etna/blob/main/.github/SECURITY.md)

---

## Code of Conduct

Be respectful and constructive. We're all here to build something great.
