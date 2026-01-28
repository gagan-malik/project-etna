# Milestone Planning Guide

This document outlines the milestone structure for project-etna. Create these milestones in GitHub to organize work into release cycles.

## Creating Milestones

Use GitHub CLI to create milestones:

```bash
# Create a milestone
gh api repos/gagan-malik/project-etna/milestones -f title="v1.0.0" -f description="Initial stable release" -f due_on="2026-03-31T23:59:59Z"
```

Or create them via the GitHub web interface at:
https://github.com/gagan-malik/project-etna/milestones/new

## Suggested Milestone Structure

### Version-Based Milestones

Use semantic versioning (MAJOR.MINOR.PATCH) for release milestones:

| Milestone | Description | Typical Scope |
|-----------|-------------|---------------|
| v1.0.0 | Major release | Large features, breaking changes |
| v1.1.0 | Minor release | New features, enhancements |
| v1.0.1 | Patch release | Bug fixes, security patches |

### Sprint/Iteration Milestones

For agile workflows, use time-boxed sprints:

| Milestone | Duration | Focus |
|-----------|----------|-------|
| Sprint 1 - Foundation | 2 weeks | Core infrastructure |
| Sprint 2 - Features | 2 weeks | Feature development |
| Sprint 3 - Polish | 2 weeks | Bug fixes, UX improvements |

## Recommended Initial Milestones

### 1. MVP (Minimum Viable Product)
- **Description:** Core functionality for initial release
- **Scope:** Essential features only
- **Labels to include:** `priority/critical`, `priority/high`

### 2. v1.0.0 - Stable Release
- **Description:** First stable public release
- **Scope:** MVP + stability, documentation, testing
- **Labels to include:** All priority levels

### 3. v1.1.0 - Enhancements
- **Description:** First feature update after stable release
- **Scope:** Community-requested features, improvements
- **Labels to include:** `enhancement`, `priority/medium`, `priority/low`

### 4. Backlog
- **Description:** Future work not yet scheduled
- **Scope:** Ideas, nice-to-haves, long-term improvements
- **Due date:** None (open-ended)

## Milestone Workflow

1. **Triage:** New issues start without a milestone
2. **Planning:** During planning, assign issues to milestones
3. **Tracking:** Monitor milestone progress in GitHub
4. **Completion:** Close milestone when all issues are resolved

## Quick Commands

```bash
# List all milestones
gh api repos/gagan-malik/project-etna/milestones

# Close a milestone
gh api repos/gagan-malik/project-etna/milestones/1 -X PATCH -f state="closed"

# View milestone progress
gh issue list --milestone "v1.0.0"
```
