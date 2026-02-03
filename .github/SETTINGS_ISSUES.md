# Cursor-like Settings — GitHub Issues for Project Board

> **Status:** SET-001–SET-008 are **implemented**. These issue templates are kept for reference and for closing corresponding board cards.

Add these issues to the Project Etna Roadmap board (Backlog or Ready column). New issues/PRs are auto-added when `PROJECT_TOKEN` is set; see [PROJECTS.md](./PROJECTS.md).

**Labels to add:** `enhancement`, `settings`, `priority/p1` or `priority/p2` as noted.

---

## P0

### SET-001: Settings persistence (schema + API)
**Title:** `[Settings] P0: Add user preferences schema and GET/PATCH /api/settings`  
**Labels:** `enhancement`, `settings`, `priority/p0`  
**Body:**
- Add `userPreferences Json?` to `users` in Prisma schema
- Create migration
- GET `/api/settings`: return user preferences + plan (for paid-only features)
- PATCH `/api/settings`: validate with Zod; reject `privacyMode` for free plan
- Document persisted keys in SETTINGS_PLAN.md

**Ref:** docs/product/BACKLOG.md SET-001, docs/product/SETTINGS_PLAN.md

---

## P1

### SET-002: Settings layout and General panel
**Title:** `[Settings] P1: Settings layout (user block, search ⌘F, nav) and General panel`  
**Labels:** `enhancement`, `settings`, `priority/p1`  
**Body:**
- Shared layout: left nav (user block, search ⌘F, all sections), right content
- General panel: Manage Account, Preferences, Notifications, Privacy (paid only), Log Out
- Entry: dialog from sidebar + full page `/settings`; `?section=general`
- Wire General controls to `/api/settings`

**Ref:** docs/product/BACKLOG.md SET-002, docs/product/SETTINGS_PLAN.md

### SET-003: Rules, Skills, Workers panel
**Title:** `[Settings] P1: Rules, Skills, Workers settings panel`  
**Labels:** `enhancement`, `settings`, `priority/p1`  
**Body:**
- Context filters (All, User, project); include third-party toggle
- Rules list + New; Skills/Workers/Commands empty states + New buttons
- Persist include-third-party via /api/settings where applicable

**Ref:** docs/product/BACKLOG.md SET-003, docs/product/SETTINGS_PLAN.md, .cursor/WORKERS_UX.md

### SET-004: Hooks panel
**Title:** `[Settings] P1: Hooks settings panel`  
**Labels:** `enhancement`, `settings`, `priority/p1`  
**Body:**
- Configured Hooks (0) + empty state; Execution Log + Clear log + empty state
- Ready for future hooks backend

**Ref:** docs/product/BACKLOG.md SET-004, docs/product/SETTINGS_PLAN.md

---

## P2

### SET-005: Tab panel
**Title:** `[Settings] P2: Tab settings panel`  
**Labels:** `enhancement`, `settings`, `priority/p2`  

### SET-006: Models panel
**Title:** `[Settings] P2: Models and API Keys (BYOK) panel`  
**Labels:** `enhancement`, `settings`, `priority/p2`  

### SET-007: Agents panel
**Title:** `[Settings] P2: Agents settings panel (full)`  
**Labels:** `enhancement`, `settings`, `priority/p2`  

### SET-008: Remaining panels
**Title:** `[Settings] P2–P3: Cloud Agents, Tools & MCP, Indexing & Docs, Network, Beta panels`  
**Labels:** `enhancement`, `settings`, `priority/p2`  

---

## Creating issues via GitHub CLI

```bash
# From repo root, create P0 issue (example)
gh issue create --title "[Settings] P0: Add user preferences schema and GET/PATCH /api/settings" \
  --body-file - <<'BODY'
- Add userPreferences Json? to users (Prisma)
- Migration; GET/PATCH /api/settings; privacy mode paid-only
- Ref: docs/product/BACKLOG.md SET-001, docs/product/SETTINGS_PLAN.md
BODY
--label "enhancement,settings,priority/p0"
```

Then in GitHub: Projects → add issue to "Project Etna Roadmap" → Backlog or Ready.
