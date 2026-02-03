---
title: Features
description: Complete list of Project Etna features
---

# Features

Everything you can do with Project Etna.

**Plans and tiers:** See [Feature map by tier](/product/TIER_FEATURES) for what’s available on Demo (unauthenticated), Free, Pro, and Ultra.

---

## AI-Powered Chat

### Multi-Model Support

Choose from multiple AI providers for your debugging sessions:

| Provider | Models | Best For |
|:---------|:-------|:---------|
| OpenAI | GPT-4, GPT-4 Turbo, GPT-3.5 | General RTL analysis, documentation |
| Google | Gemini Pro | Fast responses, multi-modal |
| DeepSeek | DeepSeek Coder | Code-focused analysis |
| Llama | Llama 3 70B/8B | Open-source, local deployment |

### Silicon Debug Prompts

Specialized prompts for hardware debugging:

- **RTL Bug Analysis** - Identify potential bugs in Verilog/SystemVerilog
- **Timing Analysis** - Clock domain crossing, setup/hold violations
- **FSM Debug** - State machine analysis and dead state detection
- **Protocol Compliance** - AXI, APB, Wishbone protocol checking
- **Assertion Generation** - Generate SVA assertions for your design

### Streaming Responses

Real-time streaming of AI responses for immediate feedback.

---

## RTL File Support

### Supported Languages

| Language | Extensions | Features |
|:---------|:-----------|:---------|
| Verilog | `.v` | Full syntax highlighting, module extraction |
| SystemVerilog | `.sv`, `.svh` | Classes, interfaces, assertions |
| VHDL | `.vhd`, `.vhdl` | Entity/architecture parsing |

### Design File Viewer

- **Syntax Highlighting** - Language-aware code coloring
- **Module Hierarchy** - Visual tree of instantiated modules
- **Signal List** - Extract ports, wires, and registers
- **Jump to Definition** - Navigate between modules

### File Upload

Upload RTL files for AI analysis:

```javascript
// Supported file types
const supported = ['.v', '.sv', '.svh', '.vhd', '.vhdl'];
```

---

## Waveform Viewer

::: tip New
Waveform viewer is now available.
:::

### Surfer Integration

View waveform files directly in your browser using the Surfer waveform viewer.

### Supported Formats

| Format | Extension | Description |
|:-------|:----------|:------------|
| VCD | `.vcd` | IEEE standard Value Change Dump |
| FST | `.fst` | Fast Signal Trace (GTKWave) |
| GHW | `.ghw` | GHDL waveform output |

### Upload Limits

| Plan | Max Size | File Count | Formats |
|:-----|:---------|:-----------|:--------|
| Free | 25 MB | 5 files | VCD |
| Pro | 200 MB | 50 files | VCD, FST |
| Team | 500 MB | Unlimited | All |

### Viewer Features

- **Zoom & Pan** - Navigate through simulation time
- **Signal Search** - Find signals by name
- **Markers** - Add time markers for reference
- **Cursor Tracking** - See values at cursor position

---

## Debug Sessions

### Session Management

Organize your debugging work into sessions:

- Create sessions for each bug investigation
- Link RTL files and waveforms to sessions
- Track conversation history per session
- Export debug reports

### Session Properties

| Property | Description |
|:---------|:------------|
| Title | Descriptive name for the session |
| Design Files | Linked RTL and documentation |
| Waveforms | Attached simulation waveforms |
| Conversations | Chat history with AI |
| Notes | Personal annotations |

---

## Workspaces (Spaces)

### Organization

Group related projects into workspaces:

- **Default Space** - Created automatically for each user
- **Custom Spaces** - Create spaces for different projects
- **Shared Spaces** - Collaborate with team members (Team plan)

### Space Contents

Each space can contain:
- Multiple conversations
- Documents (RTL files, specs)
- Waveform files
- Debug sessions

---

## User Interface

### Modern Design

Built with shadcn/ui and Tailwind CSS:

- **Theme** — shadcn Maia style, neutral base color, large border radius; Inter font, Lucide icons
- **Responsive** — Works on desktop, tablet, and mobile
- **Dark Mode** — System-aware theme switching (next-themes)
- **Accessible** — WCAG compliant Radix-based components
- **Fast** — Next.js 15 with server components

### Navigation

- **Sidebar** - Quick access to all features
- **Command Palette** - Keyboard-driven navigation
- **Breadcrumbs** - Always know where you are

### Settings

Full-page settings at `/settings` with:

- **Sidebar** — Search (⌘F), user block, and section nav (General, Agents, Rules, Hooks, Models, Network, etc.)
- **Panels** — Muted section blocks (`SettingsSection`) with compact spacing; content centered with `max-w-2xl`
- **Layout** — Full-width scrollable pane; sticky page title; consistent density (`px-5 py-5`, `space-y-6`)

App pages (Overview, Account, Billing, Activity, Files, Integrations, Waveforms, Test API) use shared `PageTitle` and `PageSection` components for consistent sticky headers and muted section blocks.

### Chat Interface

- **Markdown Support** - Rich text formatting
- **Code Blocks** - Syntax highlighted code
- **Copy Button** - Easy code copying
- **Message History** - Scroll through conversation

---

## Authentication

### Security

- **Password Hashing** - bcrypt with salt
- **HTTP-only Cookies** - Secure session tokens
- **CSRF Protection** - Built-in protection

### Account Management

- Email/password sign up
- Password reset (coming soon)
- Account deletion

---

## API

### RESTful API

Complete API for programmatic access:

- Conversations CRUD
- Messages with streaming
- Documents upload and search
- Waveforms management
- Spaces organization

### Rate Limits

| Plan | Requests/minute |
|:-----|:----------------|
| Free | 60 |
| Pro | 300 |
| Team | 1000 |

---

## Health Monitoring

### Cron Jobs

Automated health checks every 6 hours:

```bash
curl https://your-app.vercel.app/api/cron/health
```

### Slack Integration

Get alerts in Slack:

- Health check results
- Error notifications
- Cron job status

---

## Coming Soon

Features in active development:

::: tip
- **Signal-RTL Correlation** - Link waveform signals to RTL code
- **AI Waveform Queries** - Natural language waveform analysis
- **Team Collaboration** - Shared debug sessions
- **Protocol Detection** - Automatic AXI/APB analysis
:::
