# Project Etna - Differentiation Strategy

> **Purpose:** Modern feature sets and UX patterns from disruptive SaaS apps that will help Etna stand out from both EDA competitors AND set the standard for AI-native tools.

---

## Learning from Disruptive SaaS Leaders

### What Makes Them Win

| Product | Core Disruption | Key Insight for Etna |
|---------|-----------------|---------------------|
| **Cursor** | AI-native code editor | Agent architecture, workers, background tasks |
| **Linear** | Purpose-built for product teams | Opinionated workflows beat flexibility |
| **Figma** | Real-time multiplayer design | Collaboration as first-class citizen |
| **Notion** | Blocks + flexibility | Composable primitives |
| **Vercel** | Zero-config deployment | "It just works" developer experience |
| **Stripe** | Developer-first payments | Documentation as product |

---

## Differentiation Feature Sets for Etna

### 1. Command Palette & Keyboard-First UX

**Why it matters:** Power users (verification engineers) live in their terminals. They want speed, not clicks.

#### Implementation

```
┌─────────────────────────────────────────────────────────┐
│  ⌘K  Quick Actions                                      │
├─────────────────────────────────────────────────────────┤
│  > New debug session                                    │
│  > Upload waveform...                                   │
│  > Ask AI about current file                           │
│  > Find signal in waveform                             │
│  > Generate testbench for module                       │
│  > Explain this code                                   │
│  > Recent sessions...                                  │
└─────────────────────────────────────────────────────────┘
```

#### Key Shortcuts to Implement

| Shortcut | Action | Context |
|----------|--------|---------|
| `⌘K` | Open command palette | Global |
| `⌘/` | Toggle AI chat | Global |
| `⌘Enter` | Send message to AI | Chat focused |
| `⌘1-5` | Quick prompts | Chat focused |
| `⌘E` | Explain selection | Code selected |
| `⌘D` | Debug this code | Code selected |
| `⌘G` | Generate testbench | Module selected |
| `⌘W` | Jump to waveform | Signal selected |
| `Esc` | Dismiss/Cancel | Anywhere |

#### Linear-Style Search

- **Fuzzy search** across sessions, files, signals
- **Recent items** with intelligent ranking
- **Type-ahead** for common actions
- **Slash commands** in chat: `/explain`, `/testbench`, `/signals`

---

### 2. AI Agent Architecture (Cursor-Inspired)

**Why it matters:** Move beyond chat → enable autonomous debugging workflows.

#### Agent Types for Etna

```
┌─────────────────────────────────────────────────────────┐
│                    ETNA AGENT SYSTEM                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Debug      │  │  Waveform   │  │  Testbench  │    │
│  │  Agent      │  │  Agent      │  │  Agent      │    │
│  │             │  │             │  │             │    │
│  │ Analyzes    │  │ Navigates   │  │ Generates   │    │
│  │ RTL code,   │  │ signals,    │  │ UVM tests,  │    │
│  │ finds bugs  │  │ correlates  │  │ assertions  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│         │                │                │            │
│         └────────────────┼────────────────┘            │
│                          │                             │
│                  ┌───────▼───────┐                     │
│                  │  Orchestrator │                     │
│                  │    Agent      │                     │
│                  └───────────────┘                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Agent Capabilities

| Agent | Responsibility | Example Tasks |
|-------|---------------|---------------|
| **Debug Agent** | RTL analysis | "Find the bug in this FSM", "Why is data_valid stuck low?" |
| **Waveform Agent** | Signal navigation | "Show me when reset deasserts", "Find first error" |
| **Testbench Agent** | Test generation | "Generate UVM agent for this interface" |
| **Protocol Agent** | Protocol checking | "Verify AXI handshake compliance" |
| **RCA Agent** | Root cause analysis | "Why did this test fail?" with log analysis |

#### Background Agents (Like Cursor)

```typescript
// User can kick off analysis and continue working
await etna.backgroundAgent.analyze({
  task: "Find all clock domain crossings in top_module.sv",
  notify: true,  // Toast when complete
  priority: "normal"
});
```

**User sees:**
```
┌─────────────────────────────────────────┐
│ 🔄 Background: Analyzing CDC paths...   │
│    ━━━━━━━━━━━━━━━━━━━━━━━░░░░░░ 67%    │
└─────────────────────────────────────────┘
```

---

### 3. Real-Time Multiplayer Collaboration (Figma-Inspired)

**Why it matters:** Verification is a team sport. Debug sessions often involve multiple engineers.

#### Features

```
┌─────────────────────────────────────────────────────────┐
│  Debug Session: uart_tx_test_fail                       │
│  👤 You  👤 Alice (viewing)  👤 Bob (typing...)         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Waveform Panel]                                       │
│  ─────────────────────────────────────                  │
│      👤 Alice's cursor here                             │
│  clk     ▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔                          │
│  tx_valid▁▁▁▔▔▔▔▔▔▁▁▁▁▁▁▁▁▁▁▁                          │
│  tx_data ═══╬════════╬═══════════                       │
│             👤 You're here                              │
│                                                         │
│  [Chat Panel]                                           │
│  ─────────────────────────────────────                  │
│  You: Why is tx_ready going low here?                  │
│  AI: The FIFO appears full because...                  │
│  Alice: 👀 Looking at the FIFO logic now               │
│  Bob is typing...                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Collaboration Primitives

| Feature | Description |
|---------|-------------|
| **Live cursors** | See where teammates are looking in waveform/code |
| **Presence indicators** | Who's online, what they're viewing |
| **Shared annotations** | Mark signals/times with comments |
| **@mentions in chat** | Tag teammates for input |
| **Session handoff** | Transfer debug context to colleague |
| **Async comments** | Leave notes on signals for later review |

#### Share Links (Vercel-Style)

```
https://etna.dev/session/abc123?t=1500ns&signals=clk,data_valid

→ Opens exact debug state with time cursor and signals pre-selected
```

---

### 4. Opinionated Workflows (Linear-Inspired)

**Why it matters:** Engineers waste time configuring tools. Opinionated > flexible for productivity.

#### Debug Workflow Stages

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  TRIAGE  │───▶│ ANALYZE  │───▶│  DEBUG   │───▶│ RESOLVE  │
│          │    │          │    │          │    │          │
│ What     │    │ Narrow   │    │ Find     │    │ Fix &    │
│ failed?  │    │ down     │    │ root     │    │ verify   │
│          │    │          │    │ cause    │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     ▼               ▼               ▼               ▼
 Quick AI        AI suggests     AI-assisted    Generate
 assessment      signals to      RCA with       fix &
                 examine         waveform       regression
```

#### Built-In Debug Templates

| Template | Use Case | Auto-Setup |
|----------|----------|------------|
| **FSM Debug** | State machine issues | Loads state signals, transition checks |
| **Protocol Debug** | AXI/APB/etc. issues | Loads protocol signals, compliance checks |
| **CDC Debug** | Clock domain crossing | Highlights async signals, metastability |
| **Reset Debug** | Reset sequence issues | Shows reset tree, initialization |
| **FIFO Debug** | FIFO underrun/overrun | Tracks pointers, fill levels |

#### Progress Tracking (Linear-Style)

```
Debug Session: uart_tx_test_001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 75%

✅ Triage: Test timeout at 1500ns
✅ Analyze: Narrowed to tx_fifo module
🔄 Debug: Investigating write pointer logic
⬚ Resolve: Pending
```

---

### 5. Contextual AI (Beyond Chat)

**Why it matters:** Chat is table stakes. Contextual AI anticipates needs.

#### Ghost Suggestions (Cursor-Inspired)

```verilog
// User writes:
always @(posedge clk) begin
  if (rst) begin
    state <= IDLE;

// AI suggests (ghost text):
    counter <= 0;        // ← suggested
    data_valid <= 0;     // ← suggested
  end
```

#### Inline Annotations

```
┌─────────────────────────────────────────────────────────┐
│  module fifo #(parameter DEPTH=16) (                   │
│    input clk,                                          │
│    input wr_en,                                        │
│    input [7:0] wr_data,                                │
│    output full         ⚠️ AI: Never asserted in sim    │
│  );                                                    │
│                                                        │
│  reg [3:0] wr_ptr;     💡 AI: Wraps at 15, DEPTH=16   │
│  reg [3:0] rd_ptr;                                     │
│                                                        │
└─────────────────────────────────────────────────────────┘
```

#### Proactive Insights

AI notices patterns and surfaces them without being asked:

```
┌─────────────────────────────────────────────────────────┐
│ 💡 AI Insight                                          │
├─────────────────────────────────────────────────────────┤
│ I noticed `data_valid` toggles 3 cycles after          │
│ `tx_ready` in your waveform, but your RTL expects      │
│ 2 cycles. This might be the timing issue.              │
│                                                        │
│ [Show in Waveform]  [Explain More]  [Dismiss]          │
└─────────────────────────────────────────────────────────┘
```

---

### 6. Progressive Disclosure & Smart Defaults

**Why it matters:** 40-60% of SaaS users drop off during onboarding. Reduce cognitive load.

#### First-Run Experience

```
Step 1: Upload your first file
┌─────────────────────────────────────────┐
│                                         │
│     📁 Drop a Verilog file here        │
│        or paste code below              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │                                 │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Try an example: [FIFO] [FSM] [UART]   │
│                                         │
└─────────────────────────────────────────┘

Step 2: Ask anything
┌─────────────────────────────────────────┐
│                                         │
│  "What does this code do?"              │
│  "Find potential bugs"                  │
│  "Generate a testbench"                 │
│                                         │
│  [Ask AI ⌘↵]                           │
│                                         │
└─────────────────────────────────────────┘
```

#### Smart Defaults

| Decision | Default | Why |
|----------|---------|-----|
| AI Model | Best available for task | User doesn't choose unless they want |
| Waveform zoom | Auto-fit to interesting region | Not overwhelming full timeline |
| Signal order | By hierarchy, then alphabetical | Matches RTL structure |
| Chat context | Current file + visible waveform | Most relevant context |
| Quick prompts | Show 5 most relevant | Based on file type and common tasks |

#### Power User Escape Hatches

- Settings panel for all customizations
- `⌘,` for preferences
- Per-session overrides
- "Show advanced options" toggles

---

### 7. Instant Feedback Loops (Vercel-Inspired)

**Why it matters:** Speed is a feature. Every delay breaks flow.

#### Performance Targets

| Action | Target | Current Web Norm |
|--------|--------|------------------|
| App load | <1s | 3-5s |
| File upload start | Instant | 2-3s |
| AI response start | <500ms | 2-3s |
| Waveform render | <2s for 25MB | 5-10s |
| Search results | <100ms | 500ms+ |

#### Optimistic UI

```typescript
// Don't wait for server confirmation
function sendMessage(text) {
  // Show immediately
  addMessageToUI({ text, status: 'sending' });
  
  // Update when confirmed
  api.send(text).then(() => {
    updateMessageStatus('sent');
  });
}
```

#### Streaming Everything

```
User: Explain this FSM

AI: [Streaming response]
    This finite state machine has 4 states: IDLE, LOAD,
    PROCESS, and DONE. The transitions are triggered by...
    █ (cursor blinks as text streams)
```

#### Skeleton States

```
┌─────────────────────────────────────────┐
│  Loading debug session...               │
│  ┌─────────────────────────────────┐   │
│  │ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░  │   │  ← Skeleton waveform
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░  │   │
│  │ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░    │  ← Skeleton code
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░     │
└─────────────────────────────────────────┘
```

---

### 8. Documentation as Product (Stripe-Inspired)

**Why it matters:** Great docs reduce support burden and drive adoption.

#### Interactive Examples

```markdown
## Debugging a FIFO Underrun

Try this example live:

[Launch Interactive Demo]

1. Notice the `rd_ptr` advancing past `wr_ptr` at t=1200ns
2. Ask AI: "Why is rd_ptr ahead of wr_ptr?"
3. See the root cause explanation
```

#### Copy-Paste Friendly

Every code snippet has:
- One-click copy button
- Syntax highlighting
- Line numbers (optional)
- "Open in Etna" button

#### Integrated Help

```
┌─────────────────────────────────────────┐
│  💬 Ask AI                              │
│                                         │
│  [How do I find CDC issues?        ]   │
│                                         │
│  Suggested:                             │
│  • "Show me clock domain crossings"     │
│  • "Analyze reset synchronization"      │
│  • "Find metastability risks"           │
│                                         │
│  📖 Related docs:                       │
│  • CDC Verification Guide               │
│  • Reset Best Practices                 │
└─────────────────────────────────────────┘
```

---

### 9. Composable Debug Blocks (Notion-Inspired)

**Why it matters:** Let users build custom debug flows from primitives.

#### Block Types

| Block | Purpose | Example |
|-------|---------|---------|
| **Code Block** | Display RTL snippet | Module definition |
| **Waveform Block** | Embedded signal view | Specific time range |
| **AI Block** | AI analysis output | Explanation, suggestions |
| **Annotation Block** | User notes | "This is where the bug manifests" |
| **Checklist Block** | Debug steps | "✅ Verified reset sequence" |
| **Comparison Block** | Side-by-side | Golden vs actual waveform |

#### Debug Report Builder

```
┌─────────────────────────────────────────────────────────┐
│  Debug Report: UART TX Failure                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ## Summary                                             │
│  [AI Block: Auto-generated summary]                    │
│                                                         │
│  ## Failing Test                                        │
│  [Code Block: Test snippet]                            │
│                                                         │
│  ## Root Cause                                          │
│  [Waveform Block: t=1200ns-1500ns, tx_ready signal]   │
│  [Annotation: FIFO full condition not handled]         │
│                                                         │
│  ## Fix                                                 │
│  [Code Block: Suggested RTL change]                    │
│                                                         │
│  [Export as PDF] [Share Link] [Add to Docs]            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 10. Viral Loops & Growth Features

**Why it matters:** B2B SaaS can grow bottom-up like consumer products.

#### Share Mechanics

| Feature | Viral Potential |
|---------|-----------------|
| **Public debug sessions** | "Here's how I fixed this bug" → shared on Twitter/LinkedIn |
| **Embeddable widgets** | Blog posts with live waveforms |
| **"Powered by Etna"** | Free tier includes branding |
| **Referral program** | Invite colleagues for extra AI queries |

#### Community Features

- **Public template library**: Share debug workflows
- **Discussion threads**: Per-session or per-signal
- **Leaderboard**: Most helpful community members
- **Office hours**: Weekly AI debugging sessions

#### Content Flywheel

```
User debugs issue
       │
       ▼
AI explains solution
       │
       ▼
User shares publicly ──────┐
       │                   │
       ▼                   ▼
SEO brings new users   Social brings new users
       │                   │
       └───────────────────┘
              │
              ▼
       More content created
```

---

## Implementation Priority Matrix

### High Impact, Low Effort (Do First)

| Feature | Impact | Effort | Timeline |
|---------|--------|--------|----------|
| Command palette (⌘K) | High | Low | 1 week |
| Keyboard shortcuts | High | Low | 1 week |
| Streaming AI responses | High | Done ✅ | - |
| Quick prompts | High | Done ✅ | - |
| Share links | Medium | Low | 1 week |
| Skeleton loading states | Medium | Low | 3 days |

### High Impact, High Effort (Plan Carefully)

| Feature | Impact | Effort | Timeline |
|---------|--------|--------|----------|
| Agent architecture | Very High | High | 4-6 weeks |
| Real-time collaboration | High | High | 6-8 weeks |
| Background agents | High | Medium | 3-4 weeks |
| Composable blocks | Medium | High | 4-6 weeks |

### Medium Impact, Low Effort (Quick Wins)

| Feature | Impact | Effort | Timeline |
|---------|--------|--------|----------|
| Inline AI annotations | Medium | Medium | 2 weeks |
| Debug templates | Medium | Low | 1 week |
| Progress indicators | Low | Low | 3 days |
| Smart defaults | Medium | Low | 1 week |

### Low Priority (Later)

| Feature | Impact | Effort | Notes |
|---------|--------|--------|-------|
| Viral loops | Medium | Medium | After PMF |
| Community features | Low | High | After scale |
| Embeddable widgets | Low | Medium | After core stable |

---

## Competitive Differentiation Summary

### vs. Enterprise EDA (Cadence, Synopsys, Siemens)

| Our Advantage | Their Limitation |
|---------------|------------------|
| ⌘K command palette | Menu-driven, mouse-heavy UX |
| Streaming AI chat | Batch responses, no streaming |
| Instant onboarding | Weeks of procurement/setup |
| Multi-model AI choice | Single locked-in AI provider |
| Keyboard-first | Click-heavy interfaces |
| Web-native, mobile-ready | Desktop-only |

### vs. AI Startups (ChipAgents)

| Our Advantage | Their Limitation |
|---------------|------------------|
| Conversational-first | Agent-specific tools |
| Self-service free tier | Sales-required access |
| Modern consumer-grade UX | Enterprise B2B UX |
| Transparent pricing | Opaque enterprise pricing |
| Individual + team focus | Enterprise-only focus |

### vs. Open Source (GTKWave, Surfer)

| Our Advantage | Their Limitation |
|---------------|------------------|
| AI-native | No AI |
| Zero setup | Installation required |
| Collaboration | Single-user |
| Managed hosting | Self-hosted |
| Continuous updates | Slower release cycles |

---

## North Star Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Time to First Debug** | <2 minutes | Frictionless onboarding |
| **AI Queries per Session** | 5+ | Users find AI valuable |
| **Sessions per Week** | 3+ per active user | Habit formation |
| **Share Rate** | 10% of sessions | Viral growth |
| **Upgrade Rate** | 5% free → paid | Business sustainability |

---

## Summary: The Etna Difference

**Etna isn't just "AI for chip debugging" — it's a modern, opinionated, delightful tool that makes verification engineers feel like power users.**

The competition is:
- Legacy EDA tools with AI bolted on
- AI startups with enterprise-only focus
- Open source tools with no AI

Etna is:
- **AI-native**: Built from scratch for conversational debugging
- **Keyboard-first**: ⌘K everything, power user friendly
- **Instant**: No setup, no procurement, no IT
- **Collaborative**: Real-time multiplayer debugging
- **Beautiful**: Consumer-grade UX meets enterprise capability

---

*"The best tool is the one engineers actually want to use."*
