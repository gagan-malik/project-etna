# Project Etna - UX Master File

> **Version:** 1.3  
> **Last Updated:** January 2026  
> **Author:** Gagan Malik  
> **Status:** Baseline Definition (Unauthenticated, Voice & Multi-Mode Experience)

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Unauthenticated Experience](#unauthenticated-experience)
3. [Voice Experience](#voice-experience)
4. [Interaction Modes](#interaction-modes)
5. [User Personas](#user-personas)
6. [Information Architecture](#information-architecture)
7. [Navigation Model](#navigation-model)
8. [Task Flows](#task-flows)
9. [End-to-End User Journeys](#end-to-end-user-journeys)
10. [Interaction Patterns](#interaction-patterns)
11. [Visual Design System](#visual-design-system)
12. [Responsive Behavior](#responsive-behavior)
13. [Accessibility Guidelines](#accessibility-guidelines)
14. [UX Metrics & Success Criteria](#ux-metrics--success-criteria)

---

## Design Philosophy

### Core Principles

Etna's UX is built on five foundational principles that differentiate it from legacy EDA tools:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│    1. CONVERSATION FIRST                                           │
│       AI chat is the primary interface, not a sidebar feature       │
│                                                                     │
│    2. ZERO FRICTION                                                │
│       Value before signup - debug without an account                │
│                                                                     │
│    3. KEYBOARD NATIVE                                              │
│       Power users never need to reach for the mouse                 │
│                                                                     │
│    4. PROGRESSIVE DISCLOSURE                                       │
│       Simple by default, powerful when needed                       │
│                                                                     │
│    5. DELIGHTFUL SPEED                                             │
│       Every interaction feels instant                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Design Mantras

| Legacy EDA Approach | Etna Approach |
|---------------------|---------------|
| "Click through menus" | "Just ask" |
| "Read the manual" | "Watch it figure it out" |
| "Configure everything" | "Smart defaults, escape hatches" |
| "Desktop installation" | "Open a browser tab" |
| "Wait for batch processing" | "Stream in real-time" |

### Emotional Design Goals

| Moment | User Should Feel |
|--------|------------------|
| First visit | "I can try this right now without signing up" |
| First AI response | "Wow, it actually understands hardware!" |
| Finding a bug | "This just saved me hours" |
| Query limit reached | "I got real value, signing up is worth it" |
| After signup | "That was instant, and my session is preserved" |
| Sharing with team | "My colleagues need to see this" |

---

## Unauthenticated Experience

### Philosophy: Value Before Signup

**Inspired by:** ChatGPT, Perplexity, Claude.ai, Figma

The most successful modern products let users experience core value *before* asking for commitment. Users should be able to:

1. **Arrive** → **Try** → **Get Value** → **Want More** → **Sign Up**

NOT:

1. ~~Arrive → Sign Up → Hope it's good~~

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  TRADITIONAL FUNNEL          vs.       ETNA FUNNEL                 │
│                                                                     │
│  ┌─────────────┐                      ┌─────────────┐              │
│  │   Landing   │                      │   Landing   │              │
│  └──────┬──────┘                      └──────┬──────┘              │
│         │                                    │                      │
│         ▼                                    ▼                      │
│  ┌─────────────┐                      ┌─────────────┐              │
│  │   Sign Up   │ ← FRICTION           │  Try It Now │ ← NO WALL   │
│  │   Wall      │                      │  (no login) │              │
│  └──────┬──────┘                      └──────┬──────┘              │
│         │ 😤 60% drop                        │ 😊 High engagement  │
│         ▼                                    ▼                      │
│  ┌─────────────┐                      ┌─────────────┐              │
│  │  Try Product│                      │   WOW! 🎉   │              │
│  └──────┬──────┘                      │  This works!│              │
│         │                             └──────┬──────┘              │
│         ▼                                    │                      │
│  ┌─────────────┐                             ▼                      │
│  │   Maybe     │                      ┌─────────────┐              │
│  │   Value?    │                      │  Sign Up    │ ← MOTIVATED │
│  └─────────────┘                      │  (to save)  │              │
│                                       └─────────────┘              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Guest User Capabilities

| Feature | Guest (No Account) | Free Account | Pro Account |
|---------|-------------------|--------------|-------------|
| **AI Queries** | 5 per day | 50 per day | 500 per day |
| **Paste Code** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Upload Files** | ❌ No | ✅ 10 files | ✅ Unlimited |
| **Upload Waveforms** | ❌ No | ✅ 5 files (25MB) | ✅ 50 files (200MB) |
| **Save Sessions** | ❌ No (ephemeral) | ✅ Yes | ✅ Yes |
| **Session History** | Current session only | 30 days | 90 days |
| **Quick Prompts** | ✅ All | ✅ All | ✅ All |
| **Model Selection** | Default only | Standard models | All models |
| **Share Sessions** | ❌ No | ✅ Yes | ✅ Yes |

### Guest Experience Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     GUEST USER LANDING                              │
└─────────────────────────────────────────────────────────────────────┘

    User arrives at etna.dev (no account)
                    │
                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                                                               │
    │   🔥 ETNA - AI Silicon Debug Assistant                       │
    │                                                               │
    │   Debug your Verilog in seconds. No signup required.         │
    │                                                               │
    │   ┌─────────────────────────────────────────────────────┐    │
    │   │                                                     │    │
    │   │  Paste your Verilog/SystemVerilog code here...      │    │
    │   │                                                     │    │
    │   │  module fifo #(parameter DEPTH=16) (                │    │
    │   │    input clk,                                       │    │
    │   │    input rst_n,                                     │    │
    │   │    ...                                              │    │
    │   │  );                                                 │    │
    │   │                                                     │    │
    │   └─────────────────────────────────────────────────────┘    │
    │                                                               │
    │   [🔍 Find Bugs]  [📝 Explain]  [🧪 Generate Testbench]      │
    │                                                               │
    │   ─────────────── or try an example ───────────────          │
    │                                                               │
    │   [FIFO Module]  [FSM Controller]  [UART TX]  [AXI Master]   │
    │                                                               │
    │                                                               │
    │   Already have an account? [Sign In]                         │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                    │
                    │ User pastes code OR clicks example
                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                                                               │
    │  INSTANT DEBUG INTERFACE (no login!)                         │
    │                                                               │
    │  ┌─────────────────────────┬─────────────────────────────┐   │
    │  │                         │                             │   │
    │  │   YOUR CODE             │   🤖 AI ASSISTANT          │   │
    │  │   ─────────────         │   ─────────────────         │   │
    │  │                         │                             │   │
    │  │   module fifo ...       │   I found 2 potential      │   │
    │  │     input clk,          │   issues in your FIFO:     │   │
    │  │     input rst_n,        │                             │   │
    │  │     ...                 │   🐛 Off-by-one error      │   │
    │  │                         │   Line 24: wr_ptr wraps    │   │
    │  │   ▶ Line 24 highlighted │   incorrectly...           │   │
    │  │                         │                             │   │
    │  │                         │   ⚠️ Missing reset...       │   │
    │  │                         │                             │   │
    │  └─────────────────────────┴─────────────────────────────┘   │
    │                                                               │
    │  ┌─────────────────────────────────────────────────────────┐ │
    │  │ Ask follow-up question...                      [Send ⌘↵]│ │
    │  └─────────────────────────────────────────────────────────┘ │
    │                                                               │
    │  💡 4 of 5 free queries remaining today                      │
    │     [Sign up free for 50/day]                                │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
```

### Signup Trigger Points (Soft Gates)

Users are gently prompted to sign up when they want to do MORE, not to do ANYTHING.

```
┌─────────────────────────────────────────────────────────────────────┐
│  SIGNUP TRIGGERS (Progressive)                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  TRIGGER 1: Query Limit Reached                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  😊 You've used your 5 free queries for today!             │   │
│  │                                                             │   │
│  │  Sign up (free) to get 50 queries per day, plus:           │   │
│  │  • Save your debug sessions                                 │   │
│  │  • Upload design files                                      │   │
│  │  • Upload waveforms                                         │   │
│  │  • Access session history                                   │   │
│  │                                                             │   │
│  │  [Continue with Google]  [Continue with GitHub]            │   │
│  │                                                             │   │
│  │  Or wait until tomorrow for 5 more free queries            │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  TRIGGER 2: Trying to Save Session                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  📁 Want to save this session?                             │   │
│  │                                                             │   │
│  │  Create a free account to save and access your debug       │   │
│  │  sessions from any device.                                  │   │
│  │                                                             │   │
│  │  [Sign up to save]  [Continue without saving]              │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  TRIGGER 3: Trying to Upload File                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  📤 File upload requires a free account                    │   │
│  │                                                             │   │
│  │  This keeps your files secure and lets you access them     │   │
│  │  later. Takes 10 seconds to sign up.                        │   │
│  │                                                             │   │
│  │  [Continue with Google]  [Continue with GitHub]            │   │
│  │                                                             │   │
│  │  For now, you can paste code directly into the chat.       │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  TRIGGER 4: Wanting to Share                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🔗 Share this debug session                               │   │
│  │                                                             │   │
│  │  Sign up to create shareable links to your debug sessions. │   │
│  │  Recipients can view without signing up.                    │   │
│  │                                                             │   │
│  │  [Sign up to share]  [Copy code to clipboard instead]      │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Guest Session Persistence

**Problem:** Guest users lose everything when they close the tab.

**Solution:** Use localStorage for session-level persistence, with clear upgrade path.

```
┌─────────────────────────────────────────────────────────────────────┐
│  GUEST SESSION HANDLING                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  WHILE ACTIVE:                                                     │
│  • Current conversation stored in localStorage                     │
│  • Pasted code preserved                                           │
│  • Query count tracked (resets daily)                              │
│                                                                     │
│  ON TAB CLOSE (if valuable session):                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  ⚠️ You have an unsaved debug session                      │   │
│  │                                                             │   │
│  │  Sign up to save your conversation and code analysis.      │   │
│  │                                                             │   │
│  │  [Save & Sign Up]  [Leave Anyway]                          │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ON RETURN (within 24 hours):                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  👋 Welcome back!                                          │   │
│  │                                                             │   │
│  │  We saved your last session. Pick up where you left off?  │   │
│  │                                                             │   │
│  │  [Resume Session]  [Start Fresh]                           │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Anonymous User Identification

Track guest users for analytics without requiring account:

```typescript
// Guest user tracking (privacy-respecting)
interface GuestSession {
  // Anonymous identifier (browser fingerprint hash)
  guestId: string;
  
  // Session data (localStorage)
  queriesUsedToday: number;
  lastQueryDate: string;
  currentConversation: Message[];
  pastedCode: string | null;
  
  // Analytics (aggregated, not PII)
  firstVisit: string;
  totalQueries: number;
  convertedToAccount: boolean;
}
```

### URL-Based Sharing for Guests

Even without accounts, guests can share via URL parameters:

```
https://etna.dev/try?code=BASE64_ENCODED_CODE

→ Opens Etna with pre-loaded code
→ Recipient sees the code immediately
→ Can query AI without account
→ Great for Stack Overflow answers, blog posts, tweets
```

### Example-Driven Landing

Pre-loaded examples let users see value in ONE CLICK:

```
┌─────────────────────────────────────────────────────────────────────┐
│  TRY AN EXAMPLE                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │ 📦 FIFO         │  │ 🔄 FSM          │  │ 📡 UART TX      │    │
│  │                 │  │                 │  │                 │    │
│  │ Async FIFO with │  │ Traffic light   │  │ Serial transmit │    │
│  │ common bugs     │  │ controller      │  │ module          │    │
│  │                 │  │                 │  │                 │    │
│  │ [Try it →]      │  │ [Try it →]      │  │ [Try it →]      │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │ 🔌 AXI Master   │  │ 🧮 ALU          │  │ ⏰ Clock Divider│    │
│  │                 │  │                 │  │                 │    │
│  │ AXI4-Lite bus   │  │ Arithmetic      │  │ Fractional      │    │
│  │ master          │  │ logic unit      │  │ clock divider   │    │
│  │                 │  │                 │  │                 │    │
│  │ [Try it →]      │  │ [Try it →]      │  │ [Try it →]      │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                     │
│  Each example pre-loads code AND asks "Find bugs in this code"    │
│  → User immediately sees AI analysis                               │
│  → WOW moment in < 10 seconds                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Guest-to-Account Conversion Flow

When a guest decides to sign up:

```
┌─────────────────────────────────────────────────────────────────────┐
│  CONVERSION FLOW                                                   │
└─────────────────────────────────────────────────────────────────────┘

    Guest has valuable session (code + conversation)
                    │
                    │ Clicks "Sign up to save"
                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                                                               │
    │  Create your free account                                    │
    │                                                               │
    │  [🔵 Continue with Google]                                   │
    │  [⚫ Continue with GitHub]                                    │
    │                                                               │
    │  ─────────── or ───────────                                  │
    │                                                               │
    │  Email: [________________________]                           │
    │  Password: [________________________]                        │
    │                                                               │
    │  [Create Account]                                            │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                    │
                    │ OAuth complete (< 3 seconds)
                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                                                               │
    │  ✅ Account created!                                         │
    │                                                               │
    │  We've saved your debug session.                             │
    │                                                               │
    │  ┌───────────────────────────────────────────────────────┐   │
    │  │ 📁 Session: FIFO Debug                                │   │
    │  │ 📝 5 messages                                          │   │
    │  │ 📄 1 code snippet                                      │   │
    │  │ ⏰ Started 10 minutes ago                              │   │
    │  └───────────────────────────────────────────────────────┘   │
    │                                                               │
    │  [Continue Debugging →]                                      │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                    │
                    │ Seamless continuation
                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                                                               │
    │  Same interface, now with:                                   │
    │  • 50 queries/day (was 5)                                    │
    │  • Session auto-saved                                        │
    │  • File upload enabled                                       │
    │  • History accessible                                        │
    │                                                               │
    │  User continues exactly where they left off                  │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
```

### Metrics for Unauthenticated Experience

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Guest → First Query** | >80% | Measures landing page effectiveness |
| **Guest → WOW moment** | <30 seconds | Time to value |
| **Queries before signup** | 2-3 average | Proves value before asking |
| **Guest → Account conversion** | >15% | Measures signup motivation |
| **Session preservation** | >50% | Guests return with saved state |
| **Query limit → Signup** | >40% | Limit drives conversion |

### Implementation Considerations

```
┌─────────────────────────────────────────────────────────────────────┐
│  TECHNICAL IMPLEMENTATION                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  RATE LIMITING (Guest)                                             │
│  • IP-based + browser fingerprint                                  │
│  • 5 queries/day per unique visitor                                │
│  • Graceful degradation on VPN/shared IPs                          │
│                                                                     │
│  STORAGE                                                           │
│  • localStorage for current session                                │
│  • No server-side storage for guests                               │
│  • Clear guidance on ephemeral nature                              │
│                                                                     │
│  SECURITY                                                          │
│  • Pasted code never stored server-side for guests                 │
│  • Rate limiting prevents abuse                                    │
│  • No file upload without account (attack vector)                  │
│                                                                     │
│  ANALYTICS                                                         │
│  • Anonymous session tracking                                      │
│  • Conversion funnel monitoring                                    │
│  • A/B testing signup triggers                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Competitive Reference

| Product | Guest Experience | Signup Trigger |
|---------|-----------------|----------------|
| **ChatGPT** | Full chat, limited model | History, GPT-4 |
| **Perplexity** | Full search, 5/day Pro | Pro features, more queries |
| **Claude.ai** | Full chat, limited | History, file upload |
| **Figma** | View only, can edit | Save, collaborate |
| **Notion** | Read public pages | Edit, create |
| **Etna** | 5 queries, paste code | Save, upload, more queries |

---

## Voice Experience

### Competitive Analysis: Voice in AI Tools

| Product | Voice Input | Voice Output | Status | Notes |
|---------|-------------|--------------|--------|-------|
| **ChatGPT** | ✅ Yes | ✅ Yes | GA (Nov 2025) | Integrated into main chat, screen sharing |
| **GitHub Copilot** | ✅ Yes | ❌ No | GA (VS Code Speech) | Voice commands for coding, navigation |
| **Perplexity** | ✅ Yes | ✅ Yes | GA | Voice search and responses |
| **Claude.ai** | ❌ No | ❌ No | Not available | Text-only interface |
| **Cursor** | ❌ No | ❌ No | Not available | No voice features announced |
| **Siemens EDA** | ✅ Yes | ❌ No | Preview (2025) | Natural language commands in Aprisa AI |
| **Cadence** | ❌ No | ❌ No | Not available | Traditional GUI/CLI |
| **Synopsys** | ❌ No | ❌ No | Not available | Traditional GUI/CLI |
| **ChipAgents** | ❌ No | ❌ No | Not available | Enterprise focus, no voice |
| **GTKWave** | ❌ No | ❌ No | N/A | Desktop tool |
| **Etna** | 🎯 **Opportunity** | 🎯 **Opportunity** | Planned | First voice-enabled silicon debug |

**Key Insight:** Voice is becoming standard in consumer AI (ChatGPT, Perplexity) but is virtually **non-existent in EDA tools**. Siemens is the only enterprise EDA company exploring natural language, but not true voice input. This is a significant differentiation opportunity.

### Why Voice for Silicon Debugging?

```
┌─────────────────────────────────────────────────────────────────────┐
│                     VOICE VALUE PROPOSITION                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🎯 USE CASE 1: Hands-Free Debugging                               │
│  ─────────────────────────────────────────────────────────────────  │
│  Engineer is viewing waveform on one screen, RTL on another.       │
│  Hands are on keyboard navigating signals.                         │
│                                                                     │
│  Instead of: Context switch → type question → wait → read          │
│  With voice: "Hey Etna, why is data_valid stuck low at 1500ns?"    │
│              → AI responds while hands stay on keyboard            │
│                                                                     │
│  🎯 USE CASE 2: Rapid-Fire Questions                               │
│  ─────────────────────────────────────────────────────────────────  │
│  During debug session, engineer has multiple quick questions:      │
│                                                                     │
│  "What's the reset value of this register?"                        │
│  "Is this a blocking or non-blocking assignment?"                  │
│  "Show me where tx_ready is driven"                                │
│                                                                     │
│  Voice is 3x faster than typing for short queries                  │
│                                                                     │
│  🎯 USE CASE 3: Accessibility                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  Engineers with RSI, carpal tunnel, or disabilities                │
│  can interact fully without keyboard/mouse                         │
│                                                                     │
│  🎯 USE CASE 4: Mobile/Tablet Review                               │
│  ─────────────────────────────────────────────────────────────────  │
│  Engineer reviewing code/waveforms on iPad during commute          │
│  Voice input is natural on touch devices                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Voice Interface Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                       VOICE UI COMPONENTS                          │
└─────────────────────────────────────────────────────────────────────┘

    CHAT INPUT AREA (with voice)
    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │  ┌─────────────────────────────────────────────────────────┐   │
    │  │ Ask about your code...                          🎤  ⌘↵  │   │
    │  └─────────────────────────────────────────────────────────┘   │
    │                                                                 │
    │  🎤 = Voice input button (click or hold)                       │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    VOICE ACTIVE STATE
    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │  ┌─────────────────────────────────────────────────────────┐   │
    │  │ 🎤 Listening...                              ⏹️  Cancel │   │
    │  │                                                         │   │
    │  │  "Why is the write pointer not incrementing..."        │   │
    │  │   ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (live)  │   │
    │  │                                                         │   │
    │  └─────────────────────────────────────────────────────────┘   │
    │                                                                 │
    │  • Real-time transcription shown as user speaks                │
    │  • Waveform visualization indicates audio level                │
    │  • User can see and correct transcription before sending       │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    VOICE RESPONSE (Optional TTS)
    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │  🤖 AI Response                                    🔊 ▶️ Pause  │
    │  ────────────────────────────────────────────────────────────  │
    │                                                                 │
    │  "The write pointer isn't incrementing because the FIFO is    │
    │   full. Looking at line 45, when `full` is high, the write    │
    │   enable is gated off..."                                      │
    │                                                                 │
    │  [📄 Show in code]  [📊 Show in waveform]                      │
    │                                                                 │
    │  • AI response read aloud (optional, toggle in settings)       │
    │  • User can pause/resume audio                                 │
    │  • Text shown simultaneously for reference                     │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
```

### Voice Interaction Modes

| Mode | Activation | Use Case | Experience |
|------|------------|----------|------------|
| **Push-to-Talk** | Click & hold 🎤 | Quick questions | Hold button, speak, release to send |
| **Toggle Mode** | Click 🎤 once | Longer dictation | Click to start, click again to stop |
| **Keyboard Shortcut** | `⌘⇧V` | Power users | No mouse needed |
| **Wake Word** (future) | "Hey Etna" | Hands-free | Always listening (opt-in) |
| **Continuous Conversation** | After AI response | Follow-ups | Auto-listen for response |

### Voice Commands (Silicon-Specific)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    VOICE COMMAND VOCABULARY                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  NAVIGATION COMMANDS                                               │
│  • "Go to line 45"                                                 │
│  • "Show me the FSM module"                                        │
│  • "Jump to where clk is defined"                                  │
│  • "Zoom in on time 1500 nanoseconds"                              │
│  • "Show signals clk, reset, and data_valid"                       │
│                                                                     │
│  DEBUG COMMANDS                                                    │
│  • "Find bugs in this module"                                      │
│  • "Why is [signal] stuck at [value]?"                            │
│  • "Explain this always block"                                     │
│  • "What's wrong with line 23?"                                    │
│  • "Check the reset logic"                                         │
│                                                                     │
│  GENERATION COMMANDS                                               │
│  • "Generate a testbench for this module"                          │
│  • "Write an assertion for valid-ready handshake"                  │
│  • "Create a clock divider by 4"                                   │
│                                                                     │
│  CONTEXT COMMANDS                                                  │
│  • "What file am I looking at?"                                    │
│  • "Summarize this module"                                         │
│  • "What signals are in scope?"                                    │
│  • "How many flip-flops are in this design?"                       │
│                                                                     │
│  SYSTEM COMMANDS                                                   │
│  • "New session"                                                   │
│  • "Save this session"                                             │
│  • "Copy the last response"                                        │
│  • "Dark mode" / "Light mode"                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Technical Implementation

```
┌─────────────────────────────────────────────────────────────────────┐
│                   VOICE TECHNICAL ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SPEECH-TO-TEXT (Input)                                            │
│  ──────────────────────                                            │
│  Option A: Web Speech API (Browser-native)                         │
│  • Free, no API costs                                              │
│  • Works in Chrome, Edge, Safari                                   │
│  • May send audio to Google/Apple servers                          │
│  • Good for MVP                                                    │
│                                                                     │
│  Option B: OpenAI Whisper API                                      │
│  • $0.006/minute (very cheap)                                      │
│  • Higher accuracy, especially for technical terms                 │
│  • Better for "SystemVerilog", "FIFO", "FSM" vocabulary           │
│  • On-device option available (whisper.cpp)                        │
│                                                                     │
│  Option C: Deepgram / AssemblyAI                                   │
│  • Real-time streaming transcription                               │
│  • Custom vocabulary support                                       │
│  • Higher cost but lower latency                                   │
│                                                                     │
│  RECOMMENDATION: Start with Web Speech API for MVP,               │
│  upgrade to Whisper for technical accuracy                         │
│                                                                     │
│  ──────────────────────────────────────────────────────────────── │
│                                                                     │
│  TEXT-TO-SPEECH (Output) - Optional                                │
│  ──────────────────────                                            │
│  Option A: Web Speech API (Browser TTS)                            │
│  • Free, works offline                                             │
│  • Robotic voice quality                                           │
│                                                                     │
│  Option B: OpenAI TTS                                              │
│  • $0.015/1K characters                                            │
│  • Natural voice (multiple options)                                │
│  • "Nova" voice recommended for technical content                  │
│                                                                     │
│  Option C: ElevenLabs                                              │
│  • Most natural voice                                              │
│  • Higher cost                                                     │
│                                                                     │
│  RECOMMENDATION: Make TTS optional (off by default),              │
│  use OpenAI TTS when enabled                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Voice UX Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                       VOICE INTERACTION FLOW                       │
└─────────────────────────────────────────────────────────────────────┘

    User clicks/holds 🎤 or presses ⌘⇧V
                    │
                    ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  PERMISSION CHECK (first time only)                            │
    │                                                                 │
    │  ┌─────────────────────────────────────────────────────────┐   │
    │  │  🎤 Etna wants to use your microphone                   │   │
    │  │                                                         │   │
    │  │  Voice input lets you ask questions hands-free.         │   │
    │  │  Audio is processed securely and not stored.            │   │
    │  │                                                         │   │
    │  │  [Allow]  [Not now]                                    │   │
    │  └─────────────────────────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
                    │
                    │ User allows
                    ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  LISTENING STATE                                               │
    │                                                                 │
    │  Visual: 🎤 pulses, waveform shows audio level                 │
    │  Audio: Optional subtle "listening" chime                      │
    │  Text: Real-time transcription appears                         │
    │                                                                 │
    │  User speaks: "Why is data valid stuck low after reset?"      │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
                    │
                    │ User releases button or pauses speaking
                    ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  CONFIRMATION STATE (brief, ~500ms)                            │
    │                                                                 │
    │  ┌─────────────────────────────────────────────────────────┐   │
    │  │ "Why is data valid stuck low after reset?"        [Edit]│   │
    │  └─────────────────────────────────────────────────────────┘   │
    │                                                                 │
    │  • User can tap [Edit] to correct transcription               │
    │  • Auto-sends after brief delay if no edit                    │
    │  • Or user can press Enter to send immediately                │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
                    │
                    │ Auto-send or Enter
                    ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  AI PROCESSING & RESPONSE                                      │
    │                                                                 │
    │  • AI processes query (same as typed)                         │
    │  • Response streams in (text)                                  │
    │  • If TTS enabled: Response read aloud                        │
    │  • Continuous mode: Auto-listen for follow-up                 │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
```

### Voice Settings

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️ SETTINGS > Voice                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  VOICE INPUT                                                       │
│  ───────────────────────────────────────────────────────────────   │
│  Enable voice input                              [✓]               │
│  Input mode                                      [Push-to-talk ▼]  │
│  Keyboard shortcut                               [⌘⇧V]            │
│  Auto-send after silence                         [✓] 1.5 seconds  │
│  Show transcription while speaking               [✓]               │
│                                                                     │
│  VOICE OUTPUT (Text-to-Speech)                                     │
│  ───────────────────────────────────────────────────────────────   │
│  Read AI responses aloud                         [ ]               │
│  Voice                                           [Nova ▼]          │
│  Speech rate                                     [1.0x ▼]          │
│  Auto-stop on new input                          [✓]               │
│                                                                     │
│  PRIVACY                                                           │
│  ───────────────────────────────────────────────────────────────   │
│  Audio processing                                [Cloud ▼]         │
│  │ Cloud: Best accuracy (audio sent to server)                    │
│  │ On-device: Good accuracy (audio stays local) [Pro]            │
│  │                                                                 │
│  Audio is never stored or used for training.                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Voice Feature Rollout

| Phase | Features | Target |
|-------|----------|--------|
| **Phase 1 (MVP)** | Push-to-talk, Web Speech API, no TTS | 2 weeks |
| **Phase 2** | Whisper integration, better accuracy | 4 weeks |
| **Phase 3** | TTS responses (optional), voice settings | 6 weeks |
| **Phase 4** | Continuous conversation, wake word | 8+ weeks |

### Voice Accessibility Benefits

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ACCESSIBILITY IMPACT                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  👁️ VISUAL IMPAIRMENTS                                             │
│  • TTS reads AI responses aloud                                    │
│  • Navigate by voice without seeing screen                         │
│  • Combine with screen reader for full accessibility               │
│                                                                     │
│  🖐️ MOTOR IMPAIRMENTS                                              │
│  • Voice input eliminates typing need                              │
│  • Full functionality without keyboard/mouse                       │
│  • Critical for RSI, carpal tunnel                                 │
│                                                                     │
│  🧠 COGNITIVE LOAD                                                  │
│  • Speaking is more natural than typing                            │
│  • Reduces context-switching burden                                │
│  • Faster expression of complex questions                          │
│                                                                     │
│  📱 SITUATIONAL                                                     │
│  • Hands occupied (hardware lab, driving)                          │
│  • Touch device without keyboard                                   │
│  • Multi-monitor setup, hands on other device                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Competitive Advantage

```
┌─────────────────────────────────────────────────────────────────────┐
│                VOICE AS DIFFERENTIATION                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CURRENT STATE OF MARKET                                           │
│  • ChatGPT: Voice is core feature, sets user expectations          │
│  • EDA tools: Zero voice capability (except Siemens NL commands)   │
│  • Gap: Engineers expect voice (from consumer AI) but can't        │
│         get it in their professional tools                         │
│                                                                     │
│  ETNA OPPORTUNITY                                                  │
│  ─────────────────────────────────────────────────────────────     │
│                                                                     │
│  "First voice-enabled silicon debug assistant"                     │
│                                                                     │
│  Marketing angle:                                                  │
│  • "Debug hands-free while you navigate waveforms"                 │
│  • "Ask questions as fast as you think them"                       │
│  • "ChatGPT-style voice for hardware engineers"                    │
│                                                                     │
│  Demo potential:                                                   │
│  • Conference booth: Engineer speaks to Etna, finds bugs live      │
│  • YouTube: "I debugged my FPGA project without touching keyboard" │
│  • Social: Voice interaction clips are highly shareable            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Interaction Modes

### Overview: Streamlined 4-Mode System

Etna uses a focused 4-mode system for optimal user experience. Each mode has a clear, distinct purpose - no overlap or confusion.

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ETNA INTERACTION MODES                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│     ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│     │    ASK    │    │   AGENT   │    │   DEBUG   │    │   EDIT    │
│     │    💬     │    │    🤖     │    │    🐛     │    │    ✏️     │
│     │           │    │           │    │           │    │           │
│     │  Learn &  │    │ Autonomous│    │ Systematic│    │  Precise  │
│     │  Explore  │    │ Execution │    │Bug Hunting│    │  Control  │
│     └───────────┘    └───────────┘    └───────────┘    └───────────┘
│          │                │                │                │       
│          ▼                ▼                ▼                ▼       
│      Read-only       Full autonomy    Waveforms +      User-driven 
│      questions       + planning      hypothesis        edits only  
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Why 4 Modes?

| Need | Mode | What It Does |
|------|------|--------------|
| **"I have a question"** | 💬 Ask | Learn without changing anything |
| **"Build this for me"** | 🤖 Agent | AI plans and executes autonomously |
| **"Something's broken"** | 🐛 Debug | Systematic bug hunting + waveforms |
| **"Change exactly this"** | ✏️ Edit | Precise, controlled modifications |

### Mode Comparison Matrix

| Aspect | Ask 💬 | Agent 🤖 | Debug 🐛 | Edit ✏️ |
|--------|--------|----------|----------|---------|
| **Purpose** | Learn & understand | Build & implement | Fix bugs systematically | Precise modifications |
| **Code Changes** | ❌ None | ✅ Multi-file | ✅ Targeted fixes | ✅ Explicit only |
| **AI Autonomy** | Read-only | Full (with planning) | Guided | Minimal |
| **Waveforms** | View only | — | Full integration | — |
| **Shortcut** | `⌘. A` | `⌘. G` | `⌘. D` | `⌘. E` |

### Mode Switcher UI

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MODE SWITCHER                               │
└─────────────────────────────────────────────────────────────────────┘

    Access: Press ⌘. (Cmd+Period) or click mode indicator

    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │  ┌─────────────────────────────────────────────────────────┐   │
    │  │ Ask a question...                    🤖 Agent ▼   🎤  ⌘↵ │   │
    │  └─────────────────────────────────────────────────────────┘   │
    │                                         ▲                       │
    │                                         │ Click to open         │
    │                                         ▼                       │
    │  ┌─────────────────────────────────────────────────────────┐   │
    │  │  SELECT MODE                                     ⌘.     │   │
    │  ├─────────────────────────────────────────────────────────┤   │
    │  │                                                         │   │
    │  │  💬 Ask                                              A  │   │
    │  │     Learn about code, ask questions                     │   │
    │  │                                                         │   │
    │  │  📋 Plan                                             P  │   │
    │  │     Create a plan before implementation                 │   │
    │  │                                                         │   │
    │  │  🐛 Debug                                            D  │   │
    │  │     Systematic bug hunting with runtime analysis        │   │
    │  │                                                         │   │
    │  │  🤖 Agent                               ● Current    G  │   │
    │  │     Autonomous task execution                           │   │
    │  │                                                         │   │
    │  │  ✏️ Manual                                           M  │   │
    │  │     Direct control, explicit instructions               │   │
    │  │                                                         │   │
    │  └─────────────────────────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
```

---

### Mode 1: Ask Mode 💬

**Purpose:** Learn, understand, and explore without making changes.

```
┌─────────────────────────────────────────────────────────────────────┐
│  💬 ASK MODE                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CAPABILITIES                           RESTRICTIONS               │
│  ─────────────                          ────────────               │
│  ✅ Answer questions about code         ❌ No code modifications   │
│  ✅ Explain RTL constructs              ❌ No file creation        │
│  ✅ Search codebase                     ❌ No testbench generation │
│  ✅ Analyze waveforms (read-only)       ❌ No automated fixes      │
│  ✅ Provide educational content                                    │
│  ✅ Compare approaches                                             │
│  ✅ Cite documentation                                             │
│                                                                     │
│  IDEAL FOR                                                         │
│  ─────────                                                         │
│  • "What does this always_ff block do?"                           │
│  • "Explain the difference between blocking and non-blocking"      │
│  • "How does clock domain crossing work?"                         │
│  • "What's the purpose of this FSM state?"                        │
│  • "Find all instances of data_valid in the codebase"             │
│                                                                     │
│  VISUAL INDICATOR                                                  │
│  ────────────────                                                  │
│  Chat input shows: 💬 Ask mode (read-only)                        │
│  Responses are educational, no action buttons for code changes     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Ask Mode Example:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  💬 Ask Mode                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  You: What's the difference between `always_ff` and `always`?      │
│                                                                     │
│  AI: Great question! Here's the difference:                        │
│                                                                     │
│  **`always` (Verilog)**                                            │
│  - Original Verilog construct                                      │
│  - Can infer either sequential or combinational logic              │
│  - Synthesis tools must guess intent from sensitivity list         │
│                                                                     │
│  **`always_ff` (SystemVerilog)**                                   │
│  - Explicitly declares flip-flop (sequential) logic                │
│  - Must have edge-sensitive event (posedge/negedge)                │
│  - Synthesis tools enforce sequential semantics                    │
│  - Linting tools can catch errors more easily                      │
│                                                                     │
│  **Example:**                                                       │
│  ```systemverilog                                                  │
│  // Verilog - ambiguous                                            │
│  always @(posedge clk) q <= d;                                     │
│                                                                     │
│  // SystemVerilog - explicit sequential                            │
│  always_ff @(posedge clk) q <= d;                                  │
│  ```                                                               │
│                                                                     │
│  💡 Best practice: Use `always_ff` for sequential logic in         │
│     SystemVerilog for clarity and better tool support.             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Mode 2: Plan Mode 📋

**Purpose:** Create structured plans before implementation. Research first, build second.

```
┌─────────────────────────────────────────────────────────────────────┐
│  📋 PLAN MODE                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  WORKFLOW                                                          │
│  ────────                                                          │
│                                                                     │
│  1. USER DESCRIBES TASK                                            │
│     "Add AXI4-Lite slave interface to the register block"          │
│                                                                     │
│  2. AI RESEARCHES & ASKS QUESTIONS                                 │
│     • Explores existing code structure                             │
│     • Identifies dependencies                                      │
│     • Asks clarifying questions:                                   │
│       - "What address width do you need?"                          │
│       - "Should it support byte enables?"                          │
│       - "Do you have existing bus infrastructure?"                 │
│                                                                     │
│  3. AI CREATES PLAN                                                │
│     • Structured Markdown document                                 │
│     • File-by-file breakdown                                       │
│     • Code snippets for key changes                                │
│     • Estimated complexity                                         │
│                                                                     │
│  4. USER REVIEWS & EDITS PLAN                                      │
│     • Modify steps before execution                                │
│     • Add/remove requirements                                      │
│     • Approve or request changes                                   │
│                                                                     │
│  5. TRANSITION TO AGENT MODE                                       │
│     • "Execute this plan" → switches to Agent mode                 │
│     • Plan serves as instruction set                               │
│                                                                     │
│  CAPABILITIES                           RESTRICTIONS               │
│  ─────────────                          ────────────               │
│  ✅ Research codebase                   ❌ No direct code changes  │
│  ✅ Ask clarifying questions            ❌ Plan only, no execution │
│  ✅ Create structured plans                                        │
│  ✅ Estimate complexity                                            │
│  ✅ Identify dependencies                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Plan Mode Example:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  📋 Plan Mode                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  You: Add reset synchronization to all async inputs                │
│                                                                     │
│  AI: I'll create a plan for this. First, let me ask a few         │
│      questions:                                                    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🤔 Clarifying Questions                                     │   │
│  │                                                             │   │
│  │ 1. How many stages of synchronization? (typically 2-3)     │   │
│  │    [2 stages]  [3 stages]  [Custom: ___]                   │   │
│  │                                                             │   │
│  │ 2. Should I use a standard synchronizer module or inline?  │   │
│  │    [Create module]  [Inline]                               │   │
│  │                                                             │   │
│  │ 3. Are there any timing constraints I should know about?   │   │
│  │    [No constraints]  [Let me specify: ___]                 │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  You: 2 stages, create a module, no special constraints            │
│                                                                     │
│  AI: Here's my plan:                                               │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📋 PLAN: Reset Synchronization                              │   │
│  │ ─────────────────────────────────────────────────────────── │   │
│  │                                                             │   │
│  │ **Summary:** Add 2-stage synchronizers to 4 async inputs   │   │
│  │ **Complexity:** Medium (3-4 files, ~50 lines)              │   │
│  │                                                             │   │
│  │ **Step 1: Create synchronizer module**                     │   │
│  │ File: `rtl/common/sync_2stage.sv`                          │   │
│  │ ```systemverilog                                           │   │
│  │ module sync_2stage (                                       │   │
│  │   input  logic clk,                                        │   │
│  │   input  logic async_in,                                   │   │
│  │   output logic sync_out                                    │   │
│  │ );                                                         │   │
│  │   logic [1:0] sync_ff;                                     │   │
│  │   always_ff @(posedge clk) begin                          │   │
│  │     sync_ff <= {sync_ff[0], async_in};                    │   │
│  │   end                                                      │   │
│  │   assign sync_out = sync_ff[1];                           │   │
│  │ endmodule                                                  │   │
│  │ ```                                                        │   │
│  │                                                             │   │
│  │ **Step 2: Modify top_module.sv**                           │   │
│  │ - Instantiate sync_2stage for: rst_n, enable, mode_sel    │   │
│  │ - Update port connections                                  │   │
│  │                                                             │   │
│  │ **Step 3: Update testbench**                               │   │
│  │ - Add latency compensation for synchronized signals        │   │
│  │                                                             │   │
│  │ **Step 4: Add timing constraints** (optional)              │   │
│  │ - set_false_path for async inputs                         │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [✏️ Edit Plan]  [🤖 Execute Plan]  [💬 Ask Questions]            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Mode 3: Debug Mode 🐛

**Purpose:** Systematic bug hunting with hypothesis generation and runtime analysis.

```
┌─────────────────────────────────────────────────────────────────────┐
│  🐛 DEBUG MODE                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  WORKFLOW (Inspired by Cursor Debug Mode)                          │
│  ────────                                                          │
│                                                                     │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐         │
│  │DESCRIBE │───▶│HYPOTHE- │───▶│INSTRUMENT│───▶│REPRODUCE│         │
│  │   BUG   │    │  SIZE   │    │  CODE   │    │   BUG   │         │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘         │
│       │                                             │              │
│       │         ┌─────────┐    ┌─────────┐         │              │
│       │         │ VERIFY  │◀───│ ANALYZE │◀────────┘              │
│       │         │   FIX   │    │  & FIX  │                        │
│       │         └─────────┘    └─────────┘                        │
│       │              │                                             │
│       └──────────────┴─── (iterate if needed) ───▶                │
│                                                                     │
│  PHASE 1: Describe the Bug                                         │
│  • Provide error messages, failing test output                     │
│  • Describe expected vs actual behavior                            │
│  • Attach waveform if available                                    │
│                                                                     │
│  PHASE 2: AI Generates Hypotheses                                  │
│  • Multiple possible root causes                                   │
│  • Ranked by likelihood                                            │
│  • Reasoning for each hypothesis                                   │
│                                                                     │
│  PHASE 3: AI Instruments Code                                      │
│  • Adds $display / $monitor statements                             │
│  • Adds assertions to test hypotheses                              │
│  • Suggests signals to observe in waveform                         │
│                                                                     │
│  PHASE 4: User Reproduces Bug                                      │
│  • Run simulation with instrumentation                             │
│  • AI collects and analyzes output                                 │
│                                                                     │
│  PHASE 5: AI Analyzes & Fixes                                      │
│  • Runtime data confirms/refutes hypotheses                        │
│  • Generates targeted fix                                          │
│  • Explains root cause                                             │
│                                                                     │
│  PHASE 6: Verify Fix                                               │
│  • User confirms fix works                                         │
│  • If not, iterate with new data                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Debug Mode Example:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  🐛 Debug Mode                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  You: FIFO test is failing. It reports "data mismatch at read 10" │
│       Expected 0x0A, got 0x09. Waveform attached.                  │
│                                                                     │
│  AI: I'll investigate this systematically.                         │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔍 HYPOTHESES (ranked by likelihood)                        │   │
│  │                                                             │   │
│  │ 1. 🎯 Off-by-one in write pointer (HIGH - 70%)             │   │
│  │    The "expected 0x0A, got 0x09" suggests data is shifted  │   │
│  │    by one position. Write pointer may wrap incorrectly.    │   │
│  │                                                             │   │
│  │ 2. ⚠️ Read pointer advancing early (MEDIUM - 20%)          │   │
│  │    Read pointer might increment before data is valid.      │   │
│  │                                                             │   │
│  │ 3. 📝 Reset initialization issue (LOW - 10%)               │   │
│  │    Pointers might not reset to same value.                 │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Let me add instrumentation to test hypothesis #1:                 │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📝 INSTRUMENTATION (added to fifo.sv)                      │   │
│  │                                                             │   │
│  │ ```systemverilog                                           │   │
│  │ // Debug: Track write pointer behavior                     │   │
│  │ always @(posedge clk) begin                                │   │
│  │   if (wr_en) begin                                        │   │
│  │     $display("[%0t] WRITE: ptr=%0d, data=%h, next_ptr=%0d",│   │
│  │              $time, wr_ptr, wr_data,                       │   │
│  │              (wr_ptr == DEPTH-1) ? 0 : wr_ptr + 1);       │   │
│  │   end                                                      │   │
│  │ end                                                        │   │
│  │ ```                                                        │   │
│  │                                                             │   │
│  │ [Apply Instrumentation]  [Skip to Fix]  [Try Different]   │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  You: [Runs simulation, pastes output]                             │
│                                                                     │
│  AI: ✅ **Confirmed: Off-by-one error**                            │
│                                                                     │
│  From the logs, I see:                                             │
│  - Write 9: ptr=9, next_ptr=10 ❌ (should wrap to 0, DEPTH=10)    │
│  - Write 10: ptr=10, next_ptr=11 ❌ (out of bounds!)              │
│                                                                     │
│  **Root Cause:** Line 47 uses `DEPTH` instead of `DEPTH-1`        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔧 FIX                                                     │   │
│  │                                                             │   │
│  │ ```diff                                                    │   │
│  │ - if (wr_ptr == DEPTH)                                    │   │
│  │ + if (wr_ptr == DEPTH - 1)                                │   │
│  │     wr_ptr <= 0;                                          │   │
│  │ ```                                                        │   │
│  │                                                             │   │
│  │ [Apply Fix]  [Apply & Remove Debug]  [Explain More]       │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Mode 4: Agent Mode 🤖

**Purpose:** Autonomous task execution with full capabilities.

```
┌─────────────────────────────────────────────────────────────────────┐
│  🤖 AGENT MODE                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CAPABILITIES (Full Autonomy)                                      │
│  ────────────────────────────                                      │
│  ✅ Explore codebase autonomously                                  │
│  ✅ Create new files                                               │
│  ✅ Modify existing files                                          │
│  ✅ Generate testbenches                                           │
│  ✅ Generate assertions                                            │
│  ✅ Multi-file changes                                             │
│  ✅ Refactoring                                                    │
│  ✅ Execute from plans                                             │
│                                                                     │
│  GUARDRAILS                                                        │
│  ──────────                                                        │
│  • Shows changes before applying (diff view)                       │
│  • Requires confirmation for destructive changes                   │
│  • Can be interrupted at any point                                 │
│  • Tracks all changes for easy revert                              │
│                                                                     │
│  IDEAL FOR                                                         │
│  ─────────                                                         │
│  • "Create a parameterized FIFO module"                           │
│  • "Add AXI-Lite interface to this peripheral"                    │
│  • "Refactor this FSM to use enum states"                         │
│  • "Generate comprehensive testbench for uart_tx"                 │
│  • "Fix all linting warnings in this file"                        │
│                                                                     │
│  EXECUTION MODEL                                                   │
│  ───────────────                                                   │
│                                                                     │
│  User Request                                                      │
│       │                                                            │
│       ▼                                                            │
│  ┌─────────────┐                                                   │
│  │   EXPLORE   │  AI searches codebase, understands context       │
│  └──────┬──────┘                                                   │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────┐                                                   │
│  │    PLAN     │  AI creates internal execution plan               │
│  └──────┬──────┘                                                   │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────┐                                                   │
│  │   EXECUTE   │  AI makes changes (with user confirmation)       │
│  └──────┬──────┘                                                   │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────┐                                                   │
│  │   VERIFY    │  AI checks changes, offers to test               │
│  └─────────────┘                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Agent Mode Example:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  🤖 Agent Mode                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  You: Create a parameterized async FIFO with configurable depth   │
│       and width. Include gray code pointers for CDC.              │
│                                                                     │
│  AI: I'll create this for you. Let me explore your codebase       │
│      first...                                                      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Exploring...                                             │   │
│  │ • Found existing sync FIFO at rtl/fifo_sync.sv             │   │
│  │ • Found coding conventions in rtl/common/                  │   │
│  │ • No existing async FIFO found                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  I'll create the following files:                                  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📁 FILES TO CREATE                                          │   │
│  │                                                             │   │
│  │ 1. rtl/fifo_async.sv         (main module, ~120 lines)     │   │
│  │ 2. rtl/common/gray_code.sv   (gray encoder/decoder)        │   │
│  │ 3. tb/fifo_async_tb.sv       (testbench, ~200 lines)       │   │
│  │                                                             │   │
│  │ [Preview All]  [Create Files]  [Modify Plan]               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  You: [Clicks "Create Files"]                                      │
│                                                                     │
│  AI: Creating files...                                             │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ✅ Created: rtl/fifo_async.sv                              │   │
│  │                                                             │   │
│  │ ```systemverilog                                           │   │
│  │ module fifo_async #(                                       │   │
│  │   parameter WIDTH = 8,                                     │   │
│  │   parameter DEPTH = 16,                                    │   │
│  │   parameter ADDR_WIDTH = $clog2(DEPTH)                    │   │
│  │ )(                                                         │   │
│  │   // Write domain                                          │   │
│  │   input  logic                 wr_clk,                     │   │
│  │   input  logic                 wr_rst_n,                   │   │
│  │   input  logic                 wr_en,                      │   │
│  │   input  logic [WIDTH-1:0]     wr_data,                    │   │
│  │   output logic                 full,                       │   │
│  │   // ... (showing partial)                                 │   │
│  │ ```                                                        │   │
│  │                                                             │   │
│  │ [View Full File]  [Edit]  [Undo]                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ✅ All 3 files created successfully.                              │
│                                                                     │
│  Would you like me to run the testbench?                          │
│  [Run Tests]  [I'll Run Later]                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Mode 5: Manual Mode ✏️

**Purpose:** Direct, explicit control for precise modifications.

```
┌─────────────────────────────────────────────────────────────────────┐
│  ✏️ MANUAL MODE                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PHILOSOPHY                                                        │
│  ──────────                                                        │
│  User is in full control. AI only does exactly what's asked.      │
│  No autonomous exploration, no suggestions beyond the request.     │
│                                                                     │
│  CAPABILITIES                           RESTRICTIONS               │
│  ─────────────                          ────────────               │
│  ✅ Edit specific files (user-named)    ❌ No autonomous search   │
│  ✅ Make specific changes               ❌ No exploring codebase  │
│  ✅ Apply user's exact instructions     ❌ No "helpful" additions │
│  ✅ Targeted refactoring                ❌ No file creation       │
│                                              (unless specified)    │
│                                                                     │
│  IDEAL FOR                                                         │
│  ─────────                                                         │
│  • "In fifo.sv line 45, change DEPTH to DEPTH-1"                  │
│  • "Rename signal `valid` to `data_valid` in this file"           │
│  • "Add `default: state <= IDLE;` to the case statement"          │
│  • "Remove all $display statements from this module"              │
│                                                                     │
│  USE WHEN                                                          │
│  ────────                                                          │
│  • You know exactly what change you want                          │
│  • Agent mode is making unwanted changes                          │
│  • Precise surgical edits needed                                  │
│  • Teaching the AI specific patterns                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Manual Mode Example:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  ✏️ Manual Mode                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  You: In fifo.sv, change the parameter DEPTH from 16 to 32        │
│                                                                     │
│  AI: I'll make that specific change.                               │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📝 CHANGE (fifo.sv)                                        │   │
│  │                                                             │   │
│  │ ```diff                                                    │   │
│  │ @@ -1,5 +1,5 @@                                           │   │
│  │  module fifo #(                                           │   │
│  │ -  parameter DEPTH = 16,                                  │   │
│  │ +  parameter DEPTH = 32,                                  │   │
│  │    parameter WIDTH = 8                                    │   │
│  │  )(                                                       │   │
│  │ ```                                                        │   │
│  │                                                             │   │
│  │ [Apply]  [Cancel]                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Note: I only changed what you asked. No other modifications.     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Mode-Specific Features

#### Background Agents (Agent Mode)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🤖 BACKGROUND AGENT                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Run complex tasks in the background while you continue working.   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🔄 Background: Generating testbench for uart_tx...         │   │
│  │     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░ 75%                 │   │
│  │     Estimated: 2 minutes remaining                          │   │
│  │                                                              │   │
│  │     [View Progress]  [Cancel]                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  When complete:                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ✅ Background task complete                                 │   │
│  │     Generated uart_tx_tb.sv (350 lines)                     │   │
│  │                                                              │   │
│  │     [View Result]  [Apply]  [Dismiss]                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Mode Auto-Suggestion

```
┌─────────────────────────────────────────────────────────────────────┐
│  💡 MODE AUTO-SUGGESTION                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Etna detects query intent and suggests the optimal mode:          │
│                                                                     │
│  Query: "What does always_comb do?"                                │
│  → Suggested: 💬 Ask Mode (educational question)                   │
│                                                                     │
│  Query: "Add error handling to this module"                        │
│  → Suggested: 📋 Plan Mode (complex change, needs planning)        │
│                                                                     │
│  Query: "Test is failing with timeout error"                       │
│  → Suggested: 🐛 Debug Mode (bug investigation)                    │
│                                                                     │
│  Query: "Create a testbench for this FIFO"                        │
│  → Suggested: 🤖 Agent Mode (file generation)                      │
│                                                                     │
│  Query: "Change line 45 to use <= instead of ="                   │
│  → Suggested: ✏️ Manual Mode (specific, targeted edit)             │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 💡 This looks like a debugging task.                        │   │
│  │    Switch to 🐛 Debug Mode for systematic bug hunting?      │   │
│  │                                                             │   │
│  │    [Switch to Debug]  [Stay in Agent]                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Mode Keyboard Shortcuts Summary

| Shortcut | Action |
|----------|--------|
| `⌘.` | Open mode switcher |
| `⌘. A` | Switch to Ask mode |
| `⌘. P` | Switch to Plan mode |
| `⌘. D` | Switch to Debug mode |
| `⌘. G` | Switch to Agent mode (Go) |
| `⌘. M` | Switch to Manual mode |
| `⇧Tab` | Quick toggle: Agent ↔ Plan |

---

### Competitive Comparison: Modes

| Mode | Cursor | Etna | Etna Differentiation |
|------|--------|------|---------------------|
| **Ask** | ✅ Yes | ✅ Yes | + Silicon-specific knowledge |
| **Plan** | ✅ Yes | ✅ Yes | + Testplan awareness, coverage planning |
| **Debug** | ✅ Yes | ✅ Yes | + Waveform integration, hypothesis on signals |
| **Agent** | ✅ Yes | ✅ Yes | + RTL generation, assertion generation |
| **Manual** | ✅ Yes | ✅ Yes | Same |
| **Waveform Mode** | ❌ No | 🎯 **Unique** | Signal analysis, protocol debugging |

### Etna-Specific Mode: Waveform Mode 📊 (Unique)

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 WAVEFORM MODE (Etna-Exclusive)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PURPOSE                                                           │
│  ───────                                                           │
│  AI-assisted waveform analysis mode, unique to Etna.               │
│  Correlates RTL code with waveform data for deep debugging.        │
│                                                                     │
│  CAPABILITIES                                                      │
│  ────────────                                                      │
│  ✅ Navigate waveform via natural language                         │
│  ✅ Correlate signals with RTL source                              │
│  ✅ Identify anomalies in signal patterns                          │
│  ✅ Detect protocol violations (AXI, APB, etc.)                    │
│  ✅ Compare expected vs actual behavior                            │
│  ✅ Generate assertions from observed patterns                     │
│                                                                     │
│  COMMANDS                                                          │
│  ────────                                                          │
│  • "Zoom to time 1500ns"                                          │
│  • "Show me when data_valid first goes high"                      │
│  • "Find the first error in the AXI transaction"                  │
│  • "Why is there a gap between ready and valid?"                  │
│  • "Compare this signal to the expected waveform"                 │
│  • "Generate an assertion for this handshake pattern"             │
│                                                                     │
│  INTEGRATION                                                       │
│  ───────────                                                       │
│  • Works with Surfer waveform viewer                              │
│  • AI can control waveform zoom, pan, cursor                      │
│  • Bidirectional linking: click signal → see RTL                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## User Personas

### Primary Persona: Maya - Professional Verification Engineer

```
┌─────────────────────────────────────────────────────────────────────┐
│  👩‍💻 MAYA CHEN                                                      │
│  Senior Verification Engineer at a mid-size semiconductor company   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DEMOGRAPHICS                                                       │
│  • Age: 32                                                         │
│  • Location: Austin, TX                                            │
│  • Experience: 8 years in ASIC verification                        │
│  • Education: MS Electrical Engineering                            │
│                                                                     │
│  CURRENT TOOLS                                                     │
│  • Primary: Synopsys Verdi (company license)                       │
│  • Secondary: GTKWave for quick checks                             │
│  • Frustrated with: License bottlenecks, slow startup              │
│                                                                     │
│  GOALS                                                             │
│  • Debug failing tests faster                                      │
│  • Reduce time spent on root cause analysis                        │
│  • Share findings with team efficiently                            │
│  • Learn new verification techniques                               │
│                                                                     │
│  PAIN POINTS                                                       │
│  • "Verdi takes 5 minutes to load a large waveform"                │
│  • "I spend 60% of my time on debugging, not design"               │
│  • "Hard to explain bugs to junior engineers"                      │
│  • "No AI help for hardware-specific questions"                    │
│                                                                     │
│  TECHNOLOGY COMFORT                                                │
│  • Heavy keyboard user (Vim keybindings)                           │
│  • Uses terminal daily                                             │
│  • Skeptical of AI but curious                                     │
│  • Values speed over flashy features                               │
│                                                                     │
│  QUOTE                                                             │
│  "I don't need another tool to learn. I need something that        │
│   makes my existing workflow faster."                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Maya's Key Scenarios:**
1. Quick debug during code review (5 min task)
2. Deep root cause analysis on complex failure (2+ hour task)
3. Generate testbench for new module (30 min task)
4. Explain protocol issue to junior engineer (15 min task)

---

### Secondary Persona: Alex - Computer Engineering Student

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎓 SHIVAM SRIKANTH                                                  │
│  Senior undergrad studying Computer Engineering                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DEMOGRAPHICS                                                       │
│  • Age: 21                                                         │
│  • Location: Bangalore, India                                            │
│  • Experience: 2 digital design courses                            │
│  • Education: BS Computer Engineering (in progress)                │
│                                                                     │
│  CURRENT TOOLS                                                     │
│  • Vivado (university license)                                     │
│  • GTKWave                                                         │
│  • ChatGPT for homework help                                       │
│                                                                     │
│  GOALS                                                             │
│  • Complete class projects on time                                 │
│  • Understand why their code doesn't work                          │
│  • Learn industry best practices                                   │
│  • Build portfolio for job applications                            │
│                                                                     │
│  PAIN POINTS                                                       │
│  • "I don't know what I don't know"                                │
│  • "Error messages in Verilog are cryptic"                         │
│  • "ChatGPT gives generic answers for hardware"                    │
│  • "Can't afford professional tools"                               │
│                                                                     │
│  TECHNOLOGY COMFORT                                                │
│  • Digital native, learns tools quickly                            │
│  • Prefers web apps over desktop                                   │
│  • Active on Discord, GitHub                                       │
│  • Expects free tiers and instant access                           │
│                                                                     │
│  QUOTE                                                             │
│  "I just want to paste my code and understand what's wrong."       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Shivam's Key Scenarios:**
1. Debug class assignment at 11pm (urgent, 30 min)
2. Learn how a FIFO works (educational, 1 hour)
3. Prepare for technical interview (prep, 2 hours)
4. Show project to professor (demo, 10 min)

---

### Tertiary Persona: Sam - FPGA Hobbyist

```
┌─────────────────────────────────────────────────────────────────────┐
│  🛠️ SAM NAKAMURA                                                    │
│  Software engineer by day, FPGA tinkerer by night                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DEMOGRAPHICS                                                       │
│  • Age: 38                                                         │
│  • Location: Kyoto, Japan                                           │
│  • Experience: 12 years software, 3 years FPGA hobby              │
│  • Education: BS Computer Science                                  │
│                                                                     │
│  CURRENT TOOLS                                                     │
│  • Lattice iCEcube2                                                │
│  • GTKWave                                                         │
│  • Various open-source tools                                       │
│                                                                     │
│  GOALS                                                             │
│  • Build custom hardware projects                                  │
│  • Contribute to open-source hardware                              │
│  • Learn ASIC design techniques                                    │
│  • Eventually design a RISC-V core                                 │
│                                                                     │
│  PAIN POINTS                                                       │
│  • "Professional tools cost more than my car"                      │
│  • "Hard to find hardware debugging help online"                   │
│  • "Simulation vs synthesis mismatches confuse me"                 │
│  • "Want to verify designs but don't know UVM"                     │
│                                                                     │
│  TECHNOLOGY COMFORT                                                │
│  • Expert programmer, learning hardware                            │
│  • Loves command line and automation                               │
│  • Active in maker communities                                     │
│  • Will pay for tools that save time                               │
│                                                                     │
│  QUOTE                                                             │
│  "I want professional-quality tools at indie-hacker prices."       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Sam's Key Scenarios:**
1. Debug weekend project (hobby, 2 hours)
2. Learn SystemVerilog from Verilog (educational, ongoing)
3. Share design on GitHub (open-source, 30 min)
4. Verify RISC-V core implementation (ambitious, weeks)

---

### Persona Comparison Matrix

| Attribute | Maya (Pro) | Shivam (Student) | Sam (Hobbyist) |
|-----------|------------|----------------|----------------|
| **Primary goal** | Speed | Learning | Exploration |
| **Price sensitivity** | Low (company pays) | High (student) | Medium (hobby budget) |
| **Time available** | Limited (work hours) | Variable (class schedule) | Evenings/weekends |
| **Feature depth** | Wants advanced | Needs guided | Appreciates power |
| **Support needs** | Self-serve | Tutorials | Community |
| **Likely tier** | Team/Enterprise | Free | Pro |

---

## Information Architecture

### Site Map

```
etna.dev
│
├── 🏠 Home (Marketing)
│   ├── Features
│   ├── Pricing
│   ├── Docs
│   ├── Blog
│   └── Sign In / Sign Up
│
├── 🆓 Try (/try) ← GUEST ENTRY POINT (no auth required)
│   ├── Code Input Area
│   ├── Example Templates
│   ├── AI Chat (limited)
│   └── Upgrade CTAs
│
├── 🔐 Auth
│   ├── /login
│   ├── /signup
│   └── /auth (OAuth callback)
│
├── 📊 Dashboard (/overview)
│   ├── Recent Sessions
│   ├── Quick Actions
│   ├── Usage Stats
│   └── Upgrade CTA (if free)
│
├── 💬 Chat (/chat) ← PRIMARY INTERFACE
│   ├── New Conversation
│   ├── Conversation History
│   ├── Context Panel (files, waveforms)
│   └── AI Model Selector
│
├── 🔧 Debug Sessions (/sessions)
│   ├── Session List
│   ├── Session Detail
│   │   ├── Code Panel
│   │   ├── Waveform Panel
│   │   ├── AI Chat Panel
│   │   └── Insights Panel
│   └── Create New Session
│
├── 📁 Files (/files)
│   ├── Design Files (RTL)
│   │   ├── Upload
│   │   ├── Browse
│   │   └── View/Edit
│   └── Waveform Files
│       ├── Upload
│       ├── Browse
│       └── View
│
├── 📈 Waveforms (/waveforms)
│   ├── Waveform Viewer (Surfer embed)
│   ├── File Selector
│   └── Signal Search
│
├── 📜 Activity (/activity)
│   ├── Recent Actions
│   ├── AI Query History
│   └── Session Timeline
│
├── ⚙️ Settings (/settings)
│   ├── Profile
│   ├── Preferences
│   │   ├── AI Model Default
│   │   ├── Theme (Light/Dark)
│   │   ├── Keyboard Shortcuts
│   │   └── Editor Settings
│   ├── Integrations
│   └── API Keys
│
├── 💳 Billing (/billing)
│   ├── Current Plan
│   ├── Usage
│   ├── Invoices
│   └── Upgrade/Downgrade
│
└── 👤 Account (/account)
    ├── Profile
    ├── Security
    ├── Team (if applicable)
    └── Delete Account
```

### Information Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LEVEL 1: GLOBAL                            │
│                                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Logo   │  │  Chat   │  │ Sessions│  │  Files  │  │ Account │ │
│  │  Home   │  │ (Prime) │  │         │  │         │  │Settings │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│                    ↓                                               │
├─────────────────────────────────────────────────────────────────────┤
│                         LEVEL 2: CONTEXT                           │
│                                                                     │
│  Within Chat/Session:                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [File Context]  [Waveform Context]  [Session History]      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                    ↓                                               │
├─────────────────────────────────────────────────────────────────────┤
│                         LEVEL 3: ACTIONS                           │
│                                                                     │
│  Quick Prompts:                                                    │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │Explain │ │ Debug  │ │Generate│ │ Find   │ │Analyze │           │
│  │        │ │        │ │  Test  │ │ Bugs   │ │Protocol│           │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘           │
│                    ↓                                               │
├─────────────────────────────────────────────────────────────────────┤
│                         LEVEL 4: DETAILS                           │
│                                                                     │
│  Expandable sections for advanced options:                         │
│  • Model selection                                                 │
│  • Output format preferences                                       │
│  • Context window management                                       │
│  • Export options                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Content Relationships

```
                    ┌─────────────────┐
                    │   USER ACCOUNT  │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │   DESIGN    │   │   WAVEFORM  │   │   DEBUG     │
    │   FILES     │   │   FILES     │   │   SESSIONS  │
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
           │                 │                 │
           │    ┌────────────┼────────────┐    │
           │    │            │            │    │
           ▼    ▼            ▼            ▼    ▼
         ┌─────────────────────────────────────────┐
         │                                         │
         │            AI CONVERSATIONS             │
         │                                         │
         │  • References design files              │
         │  • Analyzes waveforms                   │
         │  • Attached to debug sessions           │
         │  • Persisted in history                 │
         │                                         │
         └─────────────────────────────────────────┘
```

---

## Navigation Model

### Primary Navigation (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌──────┐                                          ┌────┐ ┌────────┐│
│ │ ETNA │    Chat    Sessions    Files    Docs     │ ⌘K │ │ Avatar ││
│ └──────┘                                          └────┘ └────────┘│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        [CONTENT AREA]                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Secondary Navigation (Sidebar - Context Dependent)

```
┌───────────────────┬─────────────────────────────────────────────────┐
│                   │                                                 │
│  📁 CONTEXT       │                                                 │
│  ─────────────    │                                                 │
│                   │                                                 │
│  Design Files     │                                                 │
│  ├─ top.sv        │            [MAIN CONTENT]                       │
│  ├─ fifo.sv ★     │                                                 │
│  └─ uart_tx.sv    │                                                 │
│                   │                                                 │
│  Waveforms        │                                                 │
│  └─ test_001.vcd  │                                                 │
│                   │                                                 │
│  ─────────────    │                                                 │
│                   │                                                 │
│  💬 HISTORY       │                                                 │
│  ─────────────    │                                                 │
│                   │                                                 │
│  Today            │                                                 │
│  ├─ FIFO debug    │                                                 │
│  └─ UART issue    │                                                 │
│                   │                                                 │
│  Yesterday        │                                                 │
│  └─ FSM review    │                                                 │
│                   │                                                 │
└───────────────────┴─────────────────────────────────────────────────┘
```

### Command Palette (⌘K)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 🔍  Search commands, files, sessions...                       │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  QUICK ACTIONS                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ➕  New debug session                              ⌘N         │ │
│  │ 📤  Upload file...                                 ⌘U         │ │
│  │ 💬  New AI chat                                    ⌘⇧N        │ │
│  │ 🔍  Find in files                                  ⌘⇧F        │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AI COMMANDS                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 🤖  Explain selected code                          ⌘E         │ │
│  │ 🐛  Debug this module                              ⌘D         │ │
│  │ 📝  Generate testbench                             ⌘G         │ │
│  │ 🔌  Analyze protocol                               ⌘P         │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  RECENT FILES                                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 📄  fifo.sv                                        2m ago     │ │
│  │ 📄  uart_tx.sv                                     1h ago     │ │
│  │ 📊  test_001.vcd                                   3h ago     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Keyboard Shortcut Reference

| Category | Shortcut | Action |
|----------|----------|--------|
| **Global** | `⌘K` | Open command palette |
| | `⌘/` | Toggle AI chat panel |
| | `⌘,` | Open settings |
| | `⌘⇧P` | Open keyboard shortcuts |
| | `Esc` | Close modal / Cancel |
| **Modes** | `⌘.` | Open mode switcher |
| | `⌘. A` | Switch to Ask mode |
| | `⌘. P` | Switch to Plan mode |
| | `⌘. D` | Switch to Debug mode |
| | `⌘. G` | Switch to Agent mode |
| | `⌘. M` | Switch to Manual mode |
| | `⌘. W` | Switch to Waveform mode |
| | `⇧Tab` | Quick toggle: Agent ↔ Plan |
| **Voice** | `⌘⇧V` | Start voice input (push-to-talk) |
| | `V` (in chat) | Quick voice input |
| | `Esc` | Cancel voice recording |
| **Navigation** | `⌘1` | Go to Chat |
| | `⌘2` | Go to Sessions |
| | `⌘3` | Go to Files |
| | `⌘[` | Go back |
| | `⌘]` | Go forward |
| **AI Actions** | `⌘Enter` | Send message |
| | `⌘E` | Explain selection |
| | `⌘D` | Debug selection |
| | `⌘G` | Generate testbench |
| | `⌘⇧C` | Copy AI response |
| **File Actions** | `⌘N` | New session |
| | `⌘U` | Upload file |
| | `⌘S` | Save (where applicable) |
| | `⌘W` | Close tab/panel |
| **Waveform** | `←` / `→` | Pan waveform |
| | `+` / `-` | Zoom in/out |
| | `F` | Fit to view |
| | `Space` | Toggle measurement cursor |

---

## Task Flows

### Task Flow 1: First-Time Debug (Guest User - No Signup)

**Persona:** Alex (Student)  
**Goal:** Debug a class assignment  
**Time:** <2 minutes to first value (NO SIGNUP REQUIRED)

```
┌─────────────────────────────────────────────────────────────────────┐
│              FIRST-TIME DEBUG FLOW (UNAUTHENTICATED)               │
└─────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   LANDING   │  User arrives at etna.dev
    │    PAGE     │  (Google: "verilog fsm not working")
    └──────┬──────┘
           │
           │ NO SIGNUP WALL - Direct to value
           ▼
    ┌─────────────┐     ┌─────────────────────────────────────────┐
    │  IMMEDIATE  │────▶│                                         │
    │   CODE      │     │  🔥 Debug your Verilog instantly       │
    │   INPUT     │     │                                         │
    │             │     │  ┌─────────────────────────────────┐   │
    │  (no login) │     │  │ Paste your code here...         │   │
    │             │     │  │                                 │   │
    │             │     │  │ module fsm (                    │   │
    │             │     │  │   input clk, rst,               │   │
    │             │     │  │   ...                           │   │
    │             │     │  └─────────────────────────────────┘   │
    │             │     │                                         │
    │             │     │  ─── or try an example ───             │
    │             │     │  [FIFO] [FSM] [UART] [AXI]             │
    │             │     │                                         │
    └──────┬──────┘     └─────────────────────────────────────────┘
           │
           │ User pastes code OR clicks "FSM" example
           ▼
    ┌─────────────┐     ┌─────────────────────────────────────────┐
    │    CHAT     │────▶│  AI: "I see this is a Moore FSM with   │
    │  INTERFACE  │     │       4 states. What would you like    │
    │             │     │       help with?"                       │
    │  (GUEST)    │     │                                         │
    │             │     │  Quick prompts:                         │
    │             │     │  [🔍 Find bugs] [📝 Explain] [🧪 Test] │
    │             │     │                                         │
    │             │     │  ────────────────────────────────────   │
    │             │     │  💡 4 of 5 free queries remaining      │
    │             │     │                                         │
    └──────┬──────┘     └─────────────────────────────────────────┘
           │
           │ User clicks "Find bugs" (Query 1 of 5)
           ▼
    ┌─────────────┐     ┌─────────────────────────────────────────┐
    │  AI STREAMS │────▶│  AI: "I found 2 potential issues:      │
    │   RESPONSE  │     │                                         │
    │             │     │  1. 🐛 Combinational loop on line 23   │
    │             │     │     You're checking `state` before     │
    │             │     │     it's registered...                  │
    │             │     │                                         │
    │             │     │  2. ⚠️ Missing default case...         │
    │             │     │                                         │
    │             │     │  [Show fix] [Explain more]              │
    │             │     │                                         │
    │             │     │  ────────────────────────────────────   │
    │             │     │  💡 3 of 5 free queries remaining      │
    │             │     │                                         │
    └──────┬──────┘     └─────────────────────────────────────────┘
           │
           ▼
    ┌─────────────┐
    │   SUCCESS   │  User found their bug!
    │   WOW! 🎉   │  Time: 90 seconds, NO SIGNUP
    └──────┬──────┘
           │
           │ User continues debugging (uses 3 more queries)
           ▼
    ┌─────────────┐     ┌─────────────────────────────────────────┐
    │  SOFT GATE  │────▶│                                         │
    │  (Query 5)  │     │  😊 You've used your 5 free queries!   │
    │             │     │                                         │
    │             │     │  Sign up (free) to get 50/day plus:    │
    │             │     │  ✓ Save this debug session              │
    │             │     │  ✓ Upload files & waveforms            │
    │             │     │  ✓ Access history anytime              │
    │             │     │                                         │
    │             │     │  [Continue with Google]                 │
    │             │     │  [Continue with GitHub]                 │
    │             │     │                                         │
    │             │     │  Or come back tomorrow for 5 more      │
    │             │     │                                         │
    └──────┬──────┘     └─────────────────────────────────────────┘
           │
           │ User signs up (motivated by value received)
           ▼
    ┌─────────────┐     ┌─────────────────────────────────────────┐
    │  CONVERTED  │────▶│  ✅ Welcome! Your session is saved.    │
    │   USER      │     │                                         │
    │             │     │  You now have 50 queries/day.          │
    │             │     │  [Continue debugging →]                 │
    │             │     │                                         │
    └─────────────┘     └─────────────────────────────────────────┘
```

**Key UX Decisions:**
- **NO SIGNUP REQUIRED** for first value - like ChatGPT/Perplexity
- 5 free queries per day for guests (enough to solve one problem)
- Code paste works immediately - no account needed
- AI proactively suggests helpful actions
- Streaming response shows immediate progress
- Signup prompted only AFTER user has received value
- Session state preserved if user converts
- Examples provide instant "wow" moment in one click

---

### Task Flow 2: Deep Debug Session (Power User)

**Persona:** Maya (Professional)  
**Goal:** Root cause analysis on failing test  
**Time:** 30-60 minutes

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DEEP DEBUG SESSION FLOW                      │
└─────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   ⌘K: New   │  Maya opens command palette
    │   Session   │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐     ┌─────────────────────────────────────────┐
    │   SELECT    │────▶│  Session Template:                      │
    │  TEMPLATE   │     │  ○ Blank session                        │
    │             │     │  ● Protocol Debug (AXI/APB)             │
    │             │     │  ○ FSM Debug                            │
    │             │     │  ○ CDC Analysis                         │
    └──────┬──────┘     └─────────────────────────────────────────┘
           │
           │ Selected: "Protocol Debug"
           ▼
    ┌─────────────┐     ┌─────────────────────────────────────────┐
    │   UPLOAD    │────▶│  Files needed:                          │
    │   FILES     │     │  ☑ RTL files (required)                 │
    │             │     │  ☑ Waveform (recommended)               │
    │             │     │  ☐ Testbench (optional)                 │
    └──────┬──────┘     └─────────────────────────────────────────┘
           │
           │ Uploads: axi_master.sv, test_001.vcd
           ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │                     DEBUG WORKSPACE                             │
    ├────────────────────┬────────────────────┬───────────────────────┤
    │                    │                    │                       │
    │    CODE PANEL      │   WAVEFORM PANEL   │     CHAT PANEL       │
    │                    │                    │                       │
    │  ┌──────────────┐  │  ┌──────────────┐  │  ┌─────────────────┐ │
    │  │ axi_master.sv│  │  │ ▁▔▁▔▁▔ clk  │  │  │ AI: Ready to    │ │
    │  │              │  │  │ ▁▁▔▔▔▔ valid│  │  │ help debug your │ │
    │  │ module axi..│  │  │ ════════ data│  │  │ AXI master.     │ │
    │  │   input clk,│  │  │              │  │  │                 │ │
    │  │   input rst,│  │  │    ▲ cursor  │  │  │ Quick prompts:  │ │
    │  │   ...       │  │  │              │  │  │ [Check protocol]│ │
    │  │              │  │  │              │  │  │ [Find errors]   │ │
    │  └──────────────┘  │  └──────────────┘  │  └─────────────────┘ │
    │                    │                    │                       │
    └────────────────────┴────────────────────┴───────────────────────┘
           │
           │ Maya types: "Why does AWREADY stay low after t=1500ns?"
           ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  AI ANALYSIS                                                    │
    ├─────────────────────────────────────────────────────────────────┤
    │                                                                 │
    │  AI: "Looking at the waveform around t=1500ns, I see:          │
    │                                                                 │
    │  📊 **Waveform Analysis**                                       │
    │  At t=1500ns, AWVALID asserts but AWREADY stays low.           │
    │  The slave appears to be in a blocked state.                   │
    │                                                                 │
    │  🔍 **Probable Root Cause**                                     │
    │  In `axi_master.sv` line 142, the state machine transitions    │
    │  to WAIT_READY, but the condition on line 156 requires         │
    │  `fifo_not_full` which is never true after the 10th transfer.  │
    │                                                                 │
    │  [Jump to line 142] [Show in waveform] [Suggest fix]           │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
           │
           │ Maya clicks "Jump to line 142"
           ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  CODE PANEL (scrolled to line 142, highlighted)                │
    ├─────────────────────────────────────────────────────────────────┤
    │  140│   WAIT_READY: begin                                      │
    │  141│     if (awready) begin                                   │
    │▶142│       state <= SEND_DATA;        // 💡 AI: Issue here    │
    │  143│     end else if (!fifo_not_full) begin                   │
    │  144│       // Stuck here when FIFO backs up                   │
    │  145│     end                                                   │
    └─────────────────────────────────────────────────────────────────┘
           │
           │ Maya: "Generate an assertion to catch this"
           ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  AI GENERATES ASSERTION                                         │
    ├─────────────────────────────────────────────────────────────────┤
    │                                                                 │
    │  ```systemverilog                                               │
    │  // Assertion: AWREADY should respond within 100 cycles        │
    │  property p_awready_timeout;                                    │
    │    @(posedge clk) disable iff (rst)                            │
    │    awvalid |-> ##[1:100] awready;                              │
    │  endproperty                                                    │
    │                                                                 │
    │  assert property (p_awready_timeout)                           │
    │    else $error("AWREADY timeout after AWVALID");               │
    │  ```                                                           │
    │                                                                 │
    │  [Copy] [Add to file] [Explain this assertion]                 │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  SESSION COMPLETE                                               │
    ├─────────────────────────────────────────────────────────────────┤
    │                                                                 │
    │  Debug Summary:                                                 │
    │  • Root cause: FIFO backpressure not handled in FSM           │
    │  • Fix: Add timeout or alternative state transition            │
    │  • Artifact: Generated assertion for regression                │
    │                                                                 │
    │  [Export report] [Share session] [Create follow-up task]       │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
```

**Key UX Decisions:**
- Three-panel layout for code + waveform + chat
- Bidirectional linking between code and waveform
- AI references specific lines and times
- One-click navigation to relevant locations
- Generated artifacts can be copied or added directly
- Session summary for documentation

---

### Task Flow 3: Upload and View Waveform

**Persona:** Any user  
**Goal:** View waveform and correlate with code  
**Time:** 2-5 minutes

```
    ┌─────────────┐
    │   ⌘U or    │  User wants to upload waveform
    │ Drag & Drop │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐     ┌─────────────────────────────────────────┐
    │   UPLOAD    │────▶│  ┌─────────────────────────────────┐   │
    │   MODAL     │     │  │                                 │   │
    │             │     │  │   📁 Drop VCD, FST, or GHW     │   │
    │             │     │  │      file here                  │   │
    │             │     │  │                                 │   │
    │             │     │  │   Supported: .vcd .fst .ghw     │   │
    │             │     │  │   Max size: 25 MB (Free)        │   │
    │             │     │  │             200 MB (Pro)        │   │
    │             │     │  │                                 │   │
    │             │     │  └─────────────────────────────────┘   │
    └──────┬──────┘     └─────────────────────────────────────────┘
           │
           │ User drops test_001.vcd (15 MB)
           ▼
    ┌─────────────┐     ┌─────────────────────────────────────────┐
    │  UPLOADING  │────▶│  Uploading test_001.vcd...             │
    │   PROGRESS  │     │  ━━━━━━━━━━━━━━━━━━━━░░░░░░ 67%       │
    │             │     │                                         │
    │             │     │  Parsing waveform...                    │
    │             │     │  Found 1,247 signals                    │
    └──────┬──────┘     └─────────────────────────────────────────┘
           │
           │ Upload complete
           ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  WAVEFORM VIEWER                                                │
    ├─────────────────────────────────────────────────────────────────┤
    │  ┌─────────────────────────────────────────────────────────┐   │
    │  │ 🔍 Search signals...                    [+] Add signal  │   │
    │  └─────────────────────────────────────────────────────────┘   │
    │                                                                 │
    │  Signal          │ 0ns      500ns     1000ns    1500ns    2000ns│
    │  ─────────────────┼──────────────────────────────────────────── │
    │  tb.dut.clk      │ ▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔ │
    │  tb.dut.rst_n    │ ▁▁▁▁▁▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │
    │  tb.dut.data[7:0]│ ════╬════════╬════════════════════════════ │
    │  tb.dut.valid    │ ▁▁▁▁▁▁▁▁▔▔▔▔▁▁▁▁▁▁▁▁▔▔▔▔▔▔▔▔▁▁▁▁▁▁▁▁▁▁▁ │
    │                  │                    ▲                        │
    │                  │                 cursor                      │
    │  ─────────────────┴──────────────────────────────────────────── │
    │                                                                 │
    │  Time: 1247ns   Value: data=0x3F, valid=1                      │
    │                                                                 │
    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌─────────────────────┐  │
    │  │ ← → │ │ Zoom │ │  Fit │ │Cursor│ │ Ask AI about this ▶ │  │
    │  └──────┘ └──────┘ └──────┘ └──────┘ └─────────────────────┘  │
    └─────────────────────────────────────────────────────────────────┘
```

---

### Task Flow 4: Generate Testbench

**Persona:** Sam (Hobbyist)  
**Goal:** Create a testbench for a module  
**Time:** 5-10 minutes

```
    ┌─────────────┐
    │  Open file  │  User has fifo.sv open
    │  fifo.sv    │
    └──────┬──────┘
           │
           │ ⌘G (Generate testbench shortcut)
           ▼
    ┌─────────────┐     ┌─────────────────────────────────────────┐
    │  TESTBENCH  │────▶│  Generate Testbench for `fifo`         │
    │   OPTIONS   │     │                                         │
    │             │     │  Style:                                 │
    │             │     │  ● Simple (Verilog $display)           │
    │             │     │  ○ SystemVerilog Assertions             │
    │             │     │  ○ UVM (requires more setup)            │
    │             │     │                                         │
    │             │     │  Coverage:                              │
    │             │     │  ☑ Basic read/write                     │
    │             │     │  ☑ Empty/full conditions                │
    │             │     │  ☐ Corner cases                         │
    │             │     │  ☐ Randomized testing                   │
    │             │     │                                         │
    │             │     │  [Generate]  [Advanced options...]      │
    └──────┬──────┘     └─────────────────────────────────────────┘
           │
           │ User clicks "Generate"
           ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  AI GENERATING (streaming)                                      │
    ├─────────────────────────────────────────────────────────────────┤
    │                                                                 │
    │  ```verilog                                                     │
    │  `timescale 1ns/1ps                                            │
    │                                                                 │
    │  module fifo_tb;                                               │
    │    // Clock and reset                                          │
    │    reg clk = 0;                                                │
    │    reg rst_n;                                                  │
    │    always #5 clk = ~clk;                                       │
    │                                                                 │
    │    // DUT signals                                              │
    │    reg wr_en, rd_en;                                           │
    │    reg [7:0] wr_data;█                                         │
    │  ```                                                           │
    │  ━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░ Generating...                │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
           │
           │ Generation complete
           ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │  TESTBENCH GENERATED                                            │
    ├─────────────────────────────────────────────────────────────────┤
    │                                                                 │
    │  ✅ Generated `fifo_tb.sv` (87 lines)                          │
    │                                                                 │
    │  Includes:                                                      │
    │  • Clock generation (100 MHz)                                   │
    │  • Reset sequence                                               │
    │  • 5 test cases:                                                │
    │    1. Basic write and read                                      │
    │    2. Fill FIFO to full                                         │
    │    3. Empty FIFO completely                                     │
    │    4. Write while full (overflow check)                         │
    │    5. Read while empty (underflow check)                        │
    │                                                                 │
    │  [Preview] [Download] [Copy to clipboard] [Add to project]     │
    │                                                                 │
    │  💡 Tip: Run with `iverilog -o fifo_test fifo.sv fifo_tb.sv`  │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
```

---

## End-to-End User Journeys

### Journey 1: Student Discovers Etna (Alex)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     STUDENT DISCOVERY JOURNEY                       │
│                        Duration: ~1 week                            │
└─────────────────────────────────────────────────────────────────────┘

DAY 1: DISCOVERY (11pm, homework due tomorrow)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Context: Alex is stuck on a digital design homework at 11pm
    
    ┌───────────┐      ┌───────────┐      ┌───────────┐
    │  Google:  │─────▶│  Clicks   │─────▶│  Lands on │
    │ "verilog  │      │  Etna     │      │  etna.dev │
    │  fsm not  │      │  result   │      │           │
    │  working" │      │           │      │           │
    └───────────┘      └───────────┘      └───────────┘
                                               │
    Touchpoint: SEO / Content marketing         │
    Emotion: Frustrated, desperate              │
                                               ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  LANDING PAGE (NO SIGNUP REQUIRED)                           │
    │                                                               │
    │  "Debug your Verilog instantly. No signup needed."           │
    │                                                               │
    │  ┌─────────────────────────────────────┐                     │
    │  │  Paste your code here...            │                     │
    │  │                                     │                     │
    │  │  module fsm (...                    │ ← Alex pastes code │
    │  │                                     │                     │
    │  └─────────────────────────────────────┘                     │
    │                                                               │
    │  [🔍 Find Bugs]  [📝 Explain]  [🧪 Generate Test]           │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                               │
    Touchpoint: IMMEDIATE VALUE, no friction    │
    Emotion: "Wait, I can just use it?"         │
                                               ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  FIRST DEBUG (NO ACCOUNT!)                                   │
    │                                                               │
    │  Alex pastes FSM code, clicks "Find Bugs"                   │
    │                                                               │
    │  AI: "I see this is a Moore FSM with 4 states. The issue     │
    │       is on line 23 - you're checking `state` before it's    │
    │       registered, creating a combinational loop."            │
    │                                                               │
    │  Alex: "OMG that's exactly it!" 🎉                           │
    │                                                               │
    │  💡 4 of 5 free queries remaining today                      │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                               │
    Touchpoint: WOW moment WITHOUT signup       │
    Emotion: Amazed, relieved, grateful         │
    Time elapsed: ~90 seconds                   │
                                               ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  CONTINUED DEBUGGING (still no account)                      │
    │                                                               │
    │  Alex asks 3 more follow-up questions                        │
    │  • "How do I fix it?"                                        │
    │  • "Show me the corrected code"                              │
    │  • "Will this work for Mealy FSM too?"                       │
    │                                                               │
    │  → Homework complete! Crisis averted!                        │
    │                                                               │
    │  💡 1 of 5 free queries remaining today                      │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                               │
    Touchpoint: Problem solved                  │
    Emotion: "This tool is amazing"             │
                                               ▼
DAY 2: CONVERSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ┌───────────────────────────────────────────────────────────────┐
    │  RETURN VISIT                                                │
    │                                                               │
    │  Alex returns for another homework problem                   │
    │  Uses 5 free queries, hits limit                             │
    │                                                               │
    │  ┌─────────────────────────────────────────────────────┐     │
    │  │  😊 You've used your 5 free queries today!         │     │
    │  │                                                     │     │
    │  │  Sign up (free) to get 50/day, plus:               │     │
    │  │  • Save your sessions                               │     │
    │  │  • Upload files & waveforms                        │     │
    │  │                                                     │     │
    │  │  [Continue with Google]                            │     │
    │  └─────────────────────────────────────────────────────┘     │
    │                                                               │
    │  Alex thinks: "I already got value twice. Worth it."        │
    │  → Signs up with .edu Google account                         │
    │  → Detects student, gets bonus queries                       │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                               │
    Touchpoint: Motivated signup (value proven) │
    Emotion: Rational decision, not coerced     │
                                               ▼
DAY 2-5: ADOPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ┌───────────────────────────────────────────────────────────────┐
    │  RETURN USAGE                                                 │
    │                                                               │
    │  • Day 2: Uses Etna for another homework problem             │
    │  • Day 3: Tells roommate about it                            │
    │  • Day 4: Uploads waveform from lab assignment               │
    │  • Day 5: Hits 50 query limit, considers waiting vs Pro      │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                                │
    Touchpoint: Habit formation                 │
    Emotion: Dependent, value-aware             │
                                                ▼
DAY 7: SHARING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ┌───────────────────────────────────────────────────────────────┐
    │  VIRAL MOMENT                                                 │
    │                                                               │
    │  Alex posts on class Discord:                                │
    │  "Anyone else use this AI tool for debugging? Saved my ass   │
    │   on the FSM homework: etna.dev"                             │
    │                                                               │
    │  → 5 classmates sign up                                      │
    │  → TA notices, mentions to professor                         │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                                │
    Touchpoint: Word of mouth, social sharing   │
    Emotion: Advocate, proud                    │
                                                ▼
OUTCOME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    • Alex: Active free user, potential future Pro
    • Acquired: 5 additional users via referral
    • Potential: Professor evaluation for course adoption
```

---

### Journey 2: Professional Evaluates Etna (Maya)

```
┌─────────────────────────────────────────────────────────────────────┐
│                   PROFESSIONAL EVALUATION JOURNEY                   │
│                        Duration: ~2 weeks                           │
└─────────────────────────────────────────────────────────────────────┘

WEEK 1: EVALUATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Context: Maya sees colleague using unfamiliar tool
    
    ┌───────────┐      ┌───────────┐      ┌───────────┐
    │ Colleague │─────▶│  "What's  │─────▶│  Maya     │
    │ uses Etna │      │  that     │      │  visits   │
    │ in debug  │      │  tool?"   │      │  etna.dev │
    │ meeting   │      │           │      │           │
    └───────────┘      └───────────┘      └───────────┘
                                                │
    Touchpoint: Word of mouth (enterprise)      │
    Emotion: Skeptical but curious              │
                                                ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  INITIAL EVALUATION                                           │
    │                                                               │
    │  Maya's mental checklist:                                    │
    │  ☑ Does it understand real hardware? (pastes AXI code)       │
    │  ☑ How fast is it? (impressed by streaming)                  │
    │  ☑ What about waveforms? (uploads VCD, it works)             │
    │  ☐ Security/compliance? (needs to investigate)               │
    │  ☐ Can team use it? (needs to check pricing)                 │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                                │
    Touchpoint: Self-service evaluation         │
    Emotion: Impressed but cautious             │
                                                ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  SHADOW IT USAGE                                              │
    │                                                               │
    │  • Uses free tier for quick checks alongside Verdi           │
    │  • Doesn't upload proprietary IP (cautious)                  │
    │  • Uses for "second opinion" on complex bugs                 │
    │  • Finds it genuinely helpful for protocol questions         │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                                │
    Touchpoint: Value demonstration             │
    Emotion: Finding it useful                  │
                                                ▼
WEEK 2: TEAM EXPANSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ┌───────────────────────────────────────────────────────────────┐
    │  INTERNAL ADVOCACY                                            │
    │                                                               │
    │  Maya to manager:                                            │
    │  "There's this AI tool I've been using personally. It's      │
    │   way faster than Verdi for quick questions. Can we try      │
    │   it for the team?"                                          │
    │                                                               │
    │  Manager: "How much?"                                        │
    │  Maya: "$49/user/month vs $50K+/year for more Verdi seats"   │
    │  Manager: "Let's try it."                                    │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                                │
    Touchpoint: Internal champion               │
    Emotion: Confident, advocating              │
                                                ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  TEAM PILOT                                                   │
    │                                                               │
    │  • 5-person team starts Team trial                           │
    │  • Uses for protocol debugging, testbench generation         │
    │  • Collaboration features for debug sessions                 │
    │  • Junior engineers find it especially helpful               │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                                │
    Touchpoint: Team value demonstration        │
    Emotion: Team success                       │
                                                ▼
OUTCOME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    • Team: 5 Team tier seats ($245/month)
    • Usage: Complements (doesn't replace) Verdi
    • Potential: Expand to other teams, Enterprise deal
```

---

### Journey 3: Hobbyist Builds Skill (Sam)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      HOBBYIST SKILL JOURNEY                        │
│                       Duration: ~3 months                          │
└─────────────────────────────────────────────────────────────────────┘

MONTH 1: LEARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Context: Sam wants to learn SystemVerilog for hobby FPGA projects
    
    ┌───────────────────────────────────────────────────────────────┐
    │  DISCOVERY                                                    │
    │                                                               │
    │  Sam reads blog post: "AI Tools for FPGA Development 2026"   │
    │  Etna mentioned as "ChatGPT for hardware engineers"          │
    │  Signs up to try it                                          │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                                │
    Touchpoint: Content marketing               │
    Emotion: Excited to try                     │
                                                ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  LEARNING USE CASE                                            │
    │                                                               │
    │  Sam: "Convert this Verilog to SystemVerilog with modern     │
    │        conventions"                                          │
    │                                                               │
    │  AI: [Provides converted code with detailed explanations]    │
    │                                                               │
    │  Sam: "Explain what `always_ff` does differently"            │
    │                                                               │
    │  AI: [Educational explanation with examples]                 │
    │                                                               │
    │  → Sam learns faster than reading docs alone                 │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                                │
    Touchpoint: Educational value               │
    Emotion: Learning, progressing              │
                                                ▼
MONTH 2: PRO CONVERSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ┌───────────────────────────────────────────────────────────────┐
    │  HITTING LIMITS                                               │
    │                                                               │
    │  • Sam consistently uses all 50 free queries                 │
    │  • Wants to upload larger waveforms (>25 MB)                 │
    │  • Weekend project blocked by waiting for query reset        │
    │                                                               │
    │  Decision: "I spend $20/month on coffee. This is worth it."  │
    │                                                               │
    │  → Upgrades to Pro ($19/month)                               │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                                │
    Touchpoint: Natural upgrade trigger         │
    Emotion: Rational decision                  │
                                                ▼
MONTH 3: POWER USER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ┌───────────────────────────────────────────────────────────────┐
    │  OPEN SOURCE CONTRIBUTION                                     │
    │                                                               │
    │  • Uses Etna to verify RISC-V core design                    │
    │  • Generates testbenches for open-source project             │
    │  • Shares debug session in GitHub issue                      │
    │  • Other contributors ask "what tool is that?"               │
    │                                                               │
    │  → Becomes community advocate                                │
    │                                                               │
    └───────────────────────────────────────────────────────────────┘
                                                │
    Touchpoint: Community integration           │
    Emotion: Contributing, advocating           │
                                                ▼
OUTCOME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    • Sam: Pro subscriber, 3+ months retained
    • LTV: $19 × 12+ months = $228+/year
    • Referrals: ~10 open-source community members
```

---

## Interaction Patterns

### Pattern 1: Quick Prompts

Pre-defined actions that reduce friction for common tasks.

```
┌─────────────────────────────────────────────────────────────────────┐
│  QUICK PROMPTS (context-aware)                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  When viewing CODE:                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│  │   Explain    │ │    Debug     │ │   Generate   │               │
│  │    Code      │ │    This      │ │  Testbench   │               │
│  └──────────────┘ └──────────────┘ └──────────────┘               │
│  ┌──────────────┐ ┌──────────────┐                                │
│  │    Find      │ │   Add        │                                │
│  │    Bugs      │ │ Assertions   │                                │
│  └──────────────┘ └──────────────┘                                │
│                                                                     │
│  When viewing WAVEFORM:                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│  │   Analyze    │ │    Find      │ │   Compare    │               │
│  │   Signals    │ │   Errors     │ │   Expected   │               │
│  └──────────────┘ └──────────────┘ └──────────────┘               │
│  ┌──────────────┐ ┌──────────────┐                                │
│  │   Check      │ │  Correlate   │                                │
│  │  Protocol    │ │  with Code   │                                │
│  └──────────────┘ └──────────────┘                                │
│                                                                     │
│  When starting FRESH:                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│  │   Upload     │ │    Paste     │ │    Try       │               │
│  │    File      │ │    Code      │ │  Example     │               │
│  └──────────────┘ └──────────────┘ └──────────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Pattern 2: Streaming Response with Actions

```
┌─────────────────────────────────────────────────────────────────────┐
│  AI RESPONSE (streaming)                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🤖 Analyzing your FIFO module...                                  │
│                                                                     │
│  I found **2 potential issues**:                                   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🐛 **Issue 1: Off-by-one error** (High confidence)          │   │
│  │                                                             │   │
│  │ Line 24: `if (wr_ptr == DEPTH)` should be `DEPTH - 1`      │   │
│  │                                                             │   │
│  │ The write pointer should wrap at DEPTH-1 (15) not DEPTH    │   │
│  │ (16) since arrays are 0-indexed.                           │   │
│  │                                                             │   │
│  │ [Jump to line 24] [Show fix] [Explain more]                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ⚠️ **Issue 2: Missing reset** (Medium confidence)           │   │
│  │                                                             │   │
│  │ Line 12: `rd_ptr` is not reset in the reset block          │   │
│  │                                                             │   │
│  │ This could cause undefined behavior after reset.█          │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░ Still analyzing...         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Pattern 3: Contextual Side Panel

```
┌─────────────────────────────────────────────────────────────────────┐
│  CONTEXT PANEL (slides in from right)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Triggered by: Clicking "Jump to line 24" or signal name          │
│                                                                     │
│  ┌─────────────────────────────┬───────────────────────────────┐   │
│  │                             │                               │   │
│  │      MAIN CONTENT           │   📍 CONTEXT                  │   │
│  │      (Chat)                 │                               │   │
│  │                             │   fifo.sv:24                  │   │
│  │                             │   ─────────────────           │   │
│  │                             │                               │   │
│  │                             │   22│ always @(posedge clk)  │   │
│  │                             │   23│   if (wr_en) begin     │   │
│  │                             │  ▶24│     if (wr_ptr==DEPTH) │   │
│  │                             │   25│       wr_ptr <= 0;     │   │
│  │                             │   26│     else              │   │
│  │                             │                               │   │
│  │                             │   💡 AI highlighted this     │   │
│  │                             │      as probable bug         │   │
│  │                             │                               │   │
│  │                             │   [Edit] [Copy] [Close ×]    │   │
│  │                             │                               │   │
│  └─────────────────────────────┴───────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Pattern 4: Toast Notifications

```
┌─────────────────────────────────────────────────────────────────────┐
│  TOAST TYPES                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Success:                                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ✅ File uploaded successfully              [View] [Dismiss] │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Info:                                                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 💡 Tip: Press ⌘K to open command palette         [Got it]  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Warning:                                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ⚠️ You've used 45/50 free queries today     [Upgrade]       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Error:                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ❌ File too large (max 25 MB on free)       [See plans]     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Background task:                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔄 Analyzing CDC paths... 67%                    [Cancel]   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Visual Design System

### Color Palette

```
┌─────────────────────────────────────────────────────────────────────┐
│  BRAND COLORS                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Primary (Volcanic Orange - "Etna")                                │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │ #FFF4ED│ │ #FFD9C2│ │ #FF7A3D│ │ #E85A1C│ │ #B84315│           │
│  │  50    │ │  200   │ │  500   │ │  600   │ │  700   │           │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘           │
│                                                                     │
│  Neutral (Slate)                                                   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │ #F8FAFC│ │ #E2E8F0│ │ #94A3B8│ │ #475569│ │ #0F172A│           │
│  │  50    │ │  200   │ │  400   │ │  600   │ │  900   │           │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘           │
│                                                                     │
│  Semantic                                                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                      │
│  │ #22C55E│ │ #EAB308│ │ #EF4444│ │ #3B82F6│                      │
│  │ Success│ │ Warning│ │ Error  │ │ Info   │                      │
│  └────────┘ └────────┘ └────────┘ └────────┘                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Typography

```
┌─────────────────────────────────────────────────────────────────────┐
│  TYPOGRAPHY SCALE                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Font Family: Inter (UI), JetBrains Mono (Code)                   │
│                                                                     │
│  Display     48px / 1.1   Bold      Page titles                   │
│  H1          36px / 1.2   Semibold  Section headers               │
│  H2          24px / 1.3   Semibold  Card titles                   │
│  H3          20px / 1.4   Medium    Subsections                   │
│  Body        16px / 1.5   Regular   Paragraphs                    │
│  Small       14px / 1.5   Regular   Secondary text                │
│  Caption     12px / 1.4   Medium    Labels, hints                 │
│                                                                     │
│  Code        14px / 1.6   Regular   JetBrains Mono                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Examples

```
┌─────────────────────────────────────────────────────────────────────┐
│  BUTTONS                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Primary:    ┌────────────────┐                                    │
│              │   Start Debug  │  Filled, brand color              │
│              └────────────────┘                                    │
│                                                                     │
│  Secondary:  ┌────────────────┐                                    │
│              │    Cancel      │  Outlined, neutral                │
│              └────────────────┘                                    │
│                                                                     │
│  Ghost:      ┌────────────────┐                                    │
│              │   Learn more   │  Text only, hover underline       │
│              └────────────────┘                                    │
│                                                                     │
│  Icon:       ┌────┐                                                │
│              │ ⚙️ │  Square, subtle background on hover           │
│              └────┘                                                │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  INPUT FIELDS                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Default:    ┌─────────────────────────────────────┐               │
│              │ Placeholder text                    │               │
│              └─────────────────────────────────────┘               │
│                                                                     │
│  Focused:    ┌─────────────────────────────────────┐               │
│              │ User input█                         │  Brand border │
│              └─────────────────────────────────────┘               │
│                                                                     │
│  Error:      ┌─────────────────────────────────────┐               │
│              │ Invalid input                       │  Red border   │
│              └─────────────────────────────────────┘               │
│              ⚠️ Error message appears below                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  CARDS                                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Session: FIFO Debug                              🕐 2h ago │   │
│  │  ───────────────────────────────────────────────────────── │   │
│  │  Files: fifo.sv, fifo_tb.sv                                │   │
│  │  Status: ● Resolved                                         │   │
│  │                                                             │   │
│  │  [Open]                                    [Delete] [Share] │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Specs: 1px border, 8px radius, 16px padding, subtle shadow       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Responsive Behavior

### Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | <640px | Single column, bottom nav |
| Tablet | 640-1024px | Collapsible sidebar |
| Desktop | 1024-1440px | Full sidebar + content |
| Wide | >1440px | Sidebar + content + context panel |

### Mobile Adaptations

```
┌──────────────────────┐
│  MOBILE LAYOUT       │
│  (<640px)            │
├──────────────────────┤
│                      │
│  ┌────────────────┐  │
│  │     HEADER     │  │
│  │  Logo    ☰     │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │                │  │
│  │                │  │
│  │    CONTENT     │  │
│  │   (scrollable) │  │
│  │                │  │
│  │                │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │  💬  📁  ⚙️   │  │
│  │  Chat Files    │  │
│  │      Settings  │  │
│  └────────────────┘  │
│                      │
└──────────────────────┘

Key adaptations:
• Bottom navigation bar
• Hamburger menu for secondary nav
• Full-width chat input
• Swipeable panels for code/waveform
• Sheets instead of modals
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| **Color contrast** | 4.5:1 minimum for text, 3:1 for large text |
| **Keyboard navigation** | All interactive elements focusable, visible focus states |
| **Screen readers** | ARIA labels, semantic HTML, live regions for streaming |
| **Motion** | Respect `prefers-reduced-motion`, no autoplay |
| **Text scaling** | UI functional at 200% zoom |

### Focus Management

```
Tab order for main interface:

1. Skip to content link (hidden until focused)
2. Logo/Home link
3. Primary navigation items
4. Command palette button
5. User menu
6. Sidebar (if open)
7. Main content area
8. Chat input (if visible)
```

### Screen Reader Announcements

| Event | Announcement |
|-------|--------------|
| AI starts responding | "AI is typing..." |
| AI finishes | "AI response complete" |
| File uploaded | "File [name] uploaded successfully" |
| Error | "Error: [message]" |
| Navigation | "[Page name] loaded" |

---

## UX Metrics & Success Criteria

### Core Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to First Value** | <90 seconds | Analytics: landing to first AI response (NO signup) |
| **Guest → First Query** | >80% | % of visitors who paste code and query AI |
| **Task Success Rate** | >85% | User can complete intended task |
| **Error Rate** | <5% | Unrecoverable errors in session |
| **System Usability Scale** | >80 | Quarterly SUS survey |
| **Net Promoter Score** | >50 | Quarterly NPS survey |

### Micro-Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Page load time | <1s | Perceived performance |
| AI response start | <500ms | Streaming feels instant |
| Command palette open | <100ms | Power user satisfaction |
| File upload start | Instant | No perceived delay |
| Search results | <100ms | Fluid interaction |

### Funnel Metrics (Updated for Unauthenticated Flow)

```
NEW FUNNEL (Unauthenticated-First):

Visitor → Paste Code:              Target 60%    (no barrier)
Paste Code → First Query:          Target 90%    (one click)
First Query → WOW Moment:          Target 70%    (AI finds something useful)
WOW Moment → Query Limit:          Target 50%    (uses 5 queries)
Query Limit → Signup:              Target 40%    (motivated conversion)
Signup → Return (D1):              Target 60%    (higher due to proven value)
Free Account → Pro:                Target 5%     (power users)

COMPARISON TO TRADITIONAL FUNNEL:

Traditional:  Visitor → Signup (15%) → Query (80%) = 12% reach first query
Etna:         Visitor → Query (54%) → Signup (40%) = 22% convert after value

Result: 1.8x more signups, and they're QUALIFIED (already got value)
```

### Qualitative Signals

| Signal | Collection Method |
|--------|-------------------|
| "Wow" moments | User interviews, session recordings |
| Confusion points | Heatmaps, rage clicks |
| Feature requests | In-app feedback, support tickets |
| Competitor mentions | Win/loss interviews |

---

## Document History

| Date | Version | Changes |
|------|---------|---------|
| January 2026 | 1.0 | Initial UX Master File |
| January 2026 | 1.1 | Added Unauthenticated Experience (GPT/Perplexity model) |
| January 2026 | 1.2 | Added Voice Experience (first in EDA industry) |
| January 2026 | 1.3 | Added Interaction Modes (Ask, Plan, Debug, Agent, Manual, Waveform) |

---

## Appendix: Design Resources

### Figma Files (to be created)
- [ ] Component library
- [ ] Page templates
- [ ] User flow diagrams
- [ ] Prototype links

### Research Artifacts (to be created)
- [ ] User interview recordings
- [ ] Usability test results
- [ ] Competitive UX audit
- [ ] Analytics dashboard

---

*"Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs*

*This document serves as the single source of truth for Etna's user experience design. All feature development should reference these guidelines to ensure consistency and quality.*
