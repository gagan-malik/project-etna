# Security Policy

## Supported Versions

The following versions of project-etna are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of project-etna seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT Open a Public Issue

Please **do not** report security vulnerabilities through public GitHub issues. This could put users at risk.

### 2. Report Privately

Report vulnerabilities through one of these channels:

**Preferred Method - GitHub Security Advisories:**
1. Go to https://github.com/gagan-malik/project-etna/security/advisories
2. Click "New draft security advisory"
3. Fill in the vulnerability details
4. Submit the advisory

**Alternative - Email:**
- Send details to the repository owner's email
- Use subject line: `[SECURITY] project-etna vulnerability report`

### 3. What to Include

Please include the following information in your report:

- **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass)
- **Affected component** (e.g., API endpoint, library, configuration)
- **Steps to reproduce** the vulnerability
- **Proof of concept** (if possible)
- **Impact assessment** (what could an attacker do?)
- **Suggested fix** (if you have one)

### 4. What to Expect

After submitting a vulnerability report:

1. **Acknowledgment:** You'll receive a response within 48 hours acknowledging receipt
2. **Assessment:** We'll investigate and assess the severity within 7 days
3. **Updates:** You'll be kept informed of our progress
4. **Resolution:** We aim to patch critical vulnerabilities within 14 days
5. **Disclosure:** Once fixed, we'll coordinate public disclosure with you

### 5. Recognition

We appreciate security researchers who help keep project-etna safe:

- Contributors who report valid vulnerabilities will be credited in release notes (unless they prefer to remain anonymous)
- We may recognize significant contributions in our README

## Security Best Practices for Users

When using project-etna, please follow these security practices:

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique values for secrets
- Rotate credentials regularly

### Authentication
- Use strong passwords
- Enable 2FA where possible
- Review session management settings

### Deployment
- Keep dependencies up to date
- Use HTTPS in production
- Follow the deployment checklist in our documentation

### API Security
- Validate all user inputs
- Use proper authentication on all endpoints
- Implement rate limiting

## Security-Related Configuration

See the following files for security configuration:

- `middleware.ts` - Authentication and route protection
- `lib/rate-limit.ts` - Rate limiting configuration
- `auth.ts` - Authentication configuration
- `.env.example` - Required environment variables

## Dependency Security

We use the following tools to maintain dependency security:

- **Dependabot:** Automated dependency updates
- **npm audit:** Regular vulnerability scanning
- **CodeQL:** Static code analysis

## Known Security Limitations

- This is a prototype/development project; production use requires additional hardening
- See the deployment checklist for production security requirements
