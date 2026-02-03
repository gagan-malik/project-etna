# Cursor-like Settings — Plan and Wireframes

> **Status:** Complete (P0–P3); SET-001–SET-008 implemented  
> **Backlog:** [BACKLOG.md](./BACKLOG.md) SET-001–SET-008  
> **Roadmap:** [ROADMAP.md](./ROADMAP.md) Phase 2

## Overview

Single settings experience (dialog + full page `/settings`) with full information architecture: General, Agents, Tab, Models, Cloud Agents, Tools & MCP, Rules/Skills/Workers, Hooks, Indexing & Docs, Network, Beta, Docs. Privacy Mode is **paid plans only**. P1 scope: layout, General, Rules/Skills/Workers, Hooks.

## Priorities (locked)

| Item | Decision |
|------|----------|
| Entry point | Both dialog + full page `/settings`; same IA; URL `?section=...` |
| Persistence | `userPreferences` (JSON on `users`) + GET/PATCH `/api/settings`; server-side for theme, notifications, privacyMode, etc.; client-only for "Reset Don't Ask Again" |
| User block | Avatar + email + plan at top of settings left column |
| Search | "Search settings ⌘F" in v1; client-side filter |
| Manage Account / Docs | Manage Account → `/account`; Docs → external or `/docs` |
| Privacy Mode | Only for paid plans; free = hide or "Upgrade to enable" |
| Full IA | All sections; placeholders where not yet implemented |
| P1 sections | General, **Rules/Skills/Workers**, **Hooks** (same priority as layout + General) |

## Implementation Phases

| Phase | Deliverable |
|-------|-------------|
| **P0** | Schema + GET/PATCH `/api/settings`; auth; persisted keys |
| **P1** | Layout (user block, search ⌘F, nav) + General + Rules/Skills/Workers + Hooks + persistence + entry (dialog + page) |
| **P2** | Tab, Models, Agents panels |
| **P3** | Cloud Agents, Tools & MCP, Indexing & Docs, Network, Beta |

---

## Global Layout (all sections)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  SETTINGS                                                                        │
├──────────────────────┬──────────────────────────────────────────────────────────┤
│ ┌────┐                │                                                          │
│ │ G  │  user@email.io │  [Section title, e.g. "General"]                         │
│ └────┘  Pro+ Plan     │                                                          │
│ ───────────────────  │  ─── Manage Account ───                                  │
│ Search settings ⌘F   │  Manage your account and billing          [Open ↗]        │
│ ┌────────────────┐   │                                                          │
│ │                │   │  ─── Preferences ───                                     │
│ └────────────────┘   │  Sync layouts...                          [====ON]       │
│ ⚙️ General           │  Editor Settings                           [Open]        │
│ ∞ Agents             │  ...                                                      │
│ → Tab                │                                                          │
│ 📦 Models             │  ─── Notifications ───                                   │
│ ─────────────────     │  System Notifications                    [====ON]       │
│ ☁️ Cloud Agents       │  ...                                                      │
│ 🛠️ Tools & MCP       │                                                          │
│ ─────────────────     │  ─── Privacy ─── (paid only)                             │
│ 📄 Rules, Skills, Workers      │  🔒 Privacy Mode                          [Mode ▼]       │
│ 🔗 Hooks              │                                                          │
│ 📚 Indexing & Docs    │  [ Log Out ]                                              │
│ 🌐 Network            │                                                          │
│ ▶️ Beta               │                                                          │
│ ─────────────────     │                                                          │
│ 📖 Docs ↗             │                                                          │
└──────────────────────┴──────────────────────────────────────────────────────────┘
```

---

## Wireframe 1: General

- **Manage Account:** description + [Open ↗] → `/account`
- **Preferences:** Sync layouts (toggle), Editor Settings (Open), Keyboard Shortcuts (Open), Import VS Code (Import), Reset "Don't Ask Again" (Show)
- **Notifications:** System Notifications, Menu Bar Icon, Completion Sound (toggles)
- **Privacy:** Privacy Mode (lock icon) — dropdown, **paid only**
- **Log Out** at bottom

---

## Wireframe 2: Rules, Skills, Workers

- Context filters: [All] [User] [project-etna]
- "Include third-party skills, workers, and other configs" (toggle)
- **Rules:** description + list (.cursorrules, soul-doc, file-path rules) + [+ New]
- **Skills:** description + empty state + [New Skill]
- **Workers:** description + empty state + [New Worker]
- **Commands:** description + empty state + [New Command]

---

## Wireframe 3: Hooks

- **Configured Hooks (0):** collapsible; empty state "No hooks configured"
- **Execution Log:** [Clear log]; empty state "No hook executions yet"

---

## Wireframes 4–12 (later phases)

- **Tab:** Cursor Tab, Partial Accepts, Suggestions While Commenting, Whitespace-Only, Imports, Auto Import Python (BETA) — toggles
- **Models:** Add/search + model list toggles + API Keys (OpenAI, Anthropic, Google, Azure, AWS)
- **Agents:** General agent, Agent Review, Context, Applying Changes, Auto-Run, Protection, Inline & Terminal, Voice, Attribution
- **Cloud Agents:** Manage Settings, Connect Slack, Workspace Config, Personal Configuration (Sharing, Pricing, GitHub, Base Env, Runtime, Secrets)
- **Tools & MCP:** Browser automation, Show localhost links, Installed MCP servers + Add custom
- **Indexing & Docs:** Codebase indexing (progress, Sync, Delete), Index new folders, .cursorignore; Docs empty state + Add Doc
- **Network:** HTTP Compatibility Mode dropdown, Run Diagnostic button
- **Beta:** Update Access dropdown, Agent Autocomplete, Extension RPC Tracer toggles
- **Docs:** nav link only (external)

---

## Persisted Keys (API)

Stored in `users.userPreferences` (JSON), validated on PATCH:

- `theme`: "light" | "dark" | "system"
- `syncLayouts`: boolean
- `systemNotifications`: boolean
- `menuBarIcon`: boolean
- `completionSound`: boolean
- `privacyMode`: "off" | "standard" | "strict" (paid only; reject for free)
- `includeThirdPartyConfig`: boolean (Rules/Skills)
- (Future: agent defaults, tab toggles, etc.)

Client-only (e.g. localStorage or in-memory): "Reset Don't Ask Again" cleared state.

---

## References

- [BACKLOG.md](./BACKLOG.md) — SET-001–SET-008
- [ROADMAP.md](./ROADMAP.md) — Phase 2
- [UX_MASTER_FILE.md](./UX_MASTER_FILE.md) — Settings IA (Profile, AI Models, Preferences, Integrations, API Keys)
- [WORKERS_UX.md](../../.cursor/WORKERS_UX.md) — Workers UX
