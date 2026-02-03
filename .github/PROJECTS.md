# GitHub Projects Setup Guide

This guide explains how to set up GitHub Projects for project-etna to manage work in a Kanban-style board.

## Creating a Project Board

### Via GitHub Web UI

1. Go to https://github.com/gagan-malik/project-etna/projects
2. Click **"New project"**
3. Select **"Board"** template (recommended) or **"Table"**
4. Name it: "Project Etna Roadmap"

### Via GitHub CLI

```bash
# Create a new project (requires GitHub CLI 2.0+)
gh project create --owner gagan-malik --title "Project Etna Roadmap"
```

## Recommended Board Structure

### Columns (for Kanban board)

| Column | Description | Automation |
|--------|-------------|------------|
| **Backlog** | Ideas and future work | - |
| **Ready** | Refined and ready to start | - |
| **In Progress** | Currently being worked on | Auto-move when PR opened |
| **In Review** | Awaiting code review | Auto-move when PR ready for review |
| **Done** | Completed work | Auto-move when issue closed |

### Creating Columns with Automation

1. Open your project board
2. Click **"+ Add column"** (or the `+` on the right)
3. Configure each column:

#### Backlog
- No automation

#### Ready  
- No automation (manually move items here during planning)

#### In Progress
- Automation: "When issue is assigned" → Move to this column
- Automation: "When pull request is opened" → Move to this column

#### In Review
- Automation: "When pull request is ready for review" → Move to this column

#### Done
- Automation: "When issue is closed" → Move to this column
- Automation: "When pull request is merged" → Move to this column

## Custom Fields

Add these custom fields to enhance tracking:

### Priority (Single Select)
- 🔴 Critical
- 🟠 High  
- 🟡 Medium
- 🟢 Low

### Effort (Single Select)
- XS (< 1 hour)
- S (< 1 day)
- M (1-3 days)
- L (3-5 days)
- XL (> 1 week)

### Sprint (Iteration)
- Configure 2-week iterations
- Useful for sprint planning

### Type (Single Select)
- 🐛 Bug
- ✨ Feature
- 📚 Documentation
- 🔧 Maintenance
- 🧪 Testing

## Views

Create multiple views for different perspectives:

### 1. Board View (Default)
- Group by: Status (column)
- Filter: None
- Good for: Daily standups, quick overview

### 2. Sprint View
- Group by: Sprint iteration
- Filter: Current sprint
- Good for: Sprint planning and tracking

### 3. My Items
- Filter: Assignee = @me
- Good for: Personal task list

### 4. Priority View
- Group by: Priority field
- Sort by: Created date
- Good for: Triaging and prioritization

### 5. Bugs Only
- Filter: Type = Bug
- Sort by: Priority
- Good for: Bug triaging

## Linking Issues to Projects

### Automatically via Labels

Add this workflow to `.github/workflows/project-automation.yml`:

```yaml
name: Add to Project
on:
  issues:
    types: [opened]
  pull_request:
    types: [opened]

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/users/gagan-malik/projects/YOUR_PROJECT_NUMBER
          github-token: ${{ secrets.PROJECT_TOKEN }}
```

### Manually

1. Open any issue or PR
2. In the right sidebar, click **"Projects"**
3. Select your project board
4. Choose the appropriate status

## Best Practices

1. **Keep the board updated** - Move items as work progresses
2. **Limit WIP** - Don't have too many items "In Progress"
3. **Regular grooming** - Review backlog weekly
4. **Use labels consistently** - They help with filtering
5. **Link PRs to issues** - Use "Closes #123" in PR descriptions
6. **Archive completed items** - Keep the Done column manageable

## Useful Filters

```
# All open bugs
is:issue is:open label:bug

# High priority items
is:issue is:open label:priority/high

# Items assigned to you
is:issue is:open assignee:@me

# Unassigned items ready for pickup
is:issue is:open no:assignee label:ready

# Cursor-like Settings work
is:issue is:open label:settings
```

## Cursor-like Settings (Phase 2)

Settings work is tracked in the backlog and roadmap. To add Settings issues to the project board:

1. **Issue list:** See [SETTINGS_ISSUES.md](./SETTINGS_ISSUES.md) for titles, bodies, and labels (SET-001–SET-008).
2. **Create issues:** Use GitHub UI (New Issue) or `gh issue create` with the titles/bodies from that file.
3. **Add to board:** New issues are auto-added if project automation is configured; otherwise use the Projects sidebar on each issue to add to "Project Etna Roadmap".
4. **Labels:** Add `settings` and `priority/p0` or `priority/p1` / `priority/p2` so filters work.

**Product docs:** [docs/product/SETTINGS_PLAN.md](../docs/product/SETTINGS_PLAN.md), [docs/product/BACKLOG.md](../docs/product/BACKLOG.md).
