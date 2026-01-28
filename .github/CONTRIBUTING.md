# Contributing to project-etna

Thank you for your interest in contributing to project-etna! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to uphold our Code of Conduct:

- **Be respectful:** Treat everyone with respect and kindness
- **Be inclusive:** Welcome people of all backgrounds and experience levels
- **Be constructive:** Provide helpful feedback and accept criticism gracefully
- **Be patient:** Remember that everyone is learning and growing

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/project-etna.git
   cd project-etna
   ```
3. **Add the upstream remote:**
   ```bash
   git remote add upstream https://github.com/gagan-malik/project-etna.git
   ```
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (for database)
- Git

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up the database:**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/gagan-malik/project-etna/issues)
2. If not, create a new issue using the **Bug Report** template
3. Provide as much detail as possible

### Suggesting Features

1. Check existing [feature requests](https://github.com/gagan-malik/project-etna/issues?q=label%3Aenhancement)
2. Open a new issue using the **Feature Request** template
3. Describe the problem and your proposed solution

### Contributing Code

1. **Find an issue** to work on, or create one first
2. **Comment on the issue** to let others know you're working on it
3. **Write your code** following our style guidelines
4. **Write tests** for your changes
5. **Submit a pull request**

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/gagan-malik/project-etna/issues?q=label%3A%22good+first+issue%22) - these are great for newcomers!

## Pull Request Process

### Before Submitting

- [ ] Your code builds without errors (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Your code follows the style guidelines
- [ ] You've added tests for new functionality
- [ ] You've updated documentation if needed
- [ ] Your commits are clear and descriptive

### Submitting a PR

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub

3. **Fill out the PR template** completely

4. **Link related issues** using keywords like `Fixes #123` or `Closes #456`

### After Submitting

- Respond to review feedback promptly
- Make requested changes in new commits (don't force-push during review)
- Once approved, squash commits if requested

### PR Review Process

1. **Automated checks** run first (tests, linting)
2. **Code review** by maintainers
3. **Changes requested** if needed
4. **Approval** when everything looks good
5. **Merge** by a maintainer

## Style Guidelines

### Code Style

- Use **TypeScript** for all new code
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Keep functions focused and small
- Add comments for complex logic

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add password reset functionality
fix(api): handle null response in user endpoint
docs(readme): update installation instructions
```

### TypeScript Guidelines

```typescript
// Use explicit types for function parameters and return values
function calculateTotal(items: Item[]): number {
  // ...
}

// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Prefer const over let
const config = getConfig();

// Use async/await over callbacks
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}
```

### React/Component Guidelines

```tsx
// Use functional components with hooks
export function UserCard({ user }: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Event handlers prefixed with 'handle'
  const handleClick = () => {
    // ...
  };
  
  return (
    <div className="user-card">
      {/* ... */}
    </div>
  );
}
```

### Testing Guidelines

- Write tests for new features
- Maintain existing test coverage
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

```typescript
describe('UserService', () => {
  it('should return user by id', async () => {
    // Arrange
    const userId = '123';
    
    // Act
    const user = await userService.getById(userId);
    
    // Assert
    expect(user.id).toBe(userId);
  });
});
```

## Community

### Getting Help

- **Discussions:** https://github.com/gagan-malik/project-etna/discussions
- **Issues:** https://github.com/gagan-malik/project-etna/issues

### Staying Updated

- Watch the repository for notifications
- Check the [Announcements](https://github.com/gagan-malik/project-etna/discussions/categories/announcements) category

---

Thank you for contributing to project-etna! Your efforts help make this project better for everyone. 🙏
