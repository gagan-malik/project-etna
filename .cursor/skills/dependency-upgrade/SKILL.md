---
name: dependency-upgrade
description: Upgrade dependencies safely; check changelog and breaking changes. Use when bumping npm (or other) dependencies.
---

# Dependency-Upgrade Skill

When upgrading dependencies, follow these steps.

## 1. Changelog and breaking changes

- Read the dependency's changelog (e.g. GitHub releases, CHANGELOG.md) for the version range you are upgrading to.
- Note breaking changes and deprecations; plan code or config updates.

## 2. Version range

- Prefer upgrading one major (or minor) at a time for large deps to isolate breakage.
- Use the range specified in package.json (e.g. ^1.2.3); run `npm update` or `npm install <pkg>@latest` as appropriate.

## 3. Install and verify

- Run `npm install` (or equivalent); resolve any peer dependency warnings.
- Run `npm run lint` and `npm run test`; fix any failures.
- Run a quick smoke test (e.g. dev server, critical flow) if the dep is used at runtime.

## 4. Security and license

- Run `npm audit` after upgrade; fix or accept vulnerabilities as per policy.
- For new dependencies, check license (e.g. permissive for enterprise use); update DEPENDENCIES.md or equivalent if the project tracks them.

## Output

- Updated package.json (and lockfile); tests and lint passing; changelog/breaking changes addressed; npm audit and license noted.
