# Feature map by tier

This document maps which features are available for each audience: **Demo** (unauthenticated), **Free**, **Pro**, and **Ultra**. Use it for product, support, and implementation consistency.

---

## Tier overview

| Tier | Who | Auth |
|------|-----|------|
| **Demo** | Visitors, try-before-signup | Not signed in |
| **Free** | Signed-up users on the free plan | Signed in, `plan = free` |
| **Pro** | Paid Pro subscription | Signed in, `plan = pro`, active subscription |
| **Ultra** | Paid Ultra subscription | Signed in, `plan = ultra`, active subscription |

---

## Feature matrix

### Chat & AI

| Feature | Demo | Free | Pro | Ultra |
|--------|:----:|:----:|:---:|:-----:|
| Use chat UI | ✅ | ✅ | ✅ | ✅ |
| Static / guest model list | ✅ | — | — | — |
| Full model list (API) | — | ✅ | ✅ | ✅ |
| Auto model selection | — | ✅ | ✅ | ✅ |
| MAX Mode (highest-quality models) | — | ❌ | ✅ | ✅ |
| Reasoning models (e.g. GPT-4 Turbo, Gemini Pro, DeepSeek Chat) | — | ❌ | ✅ | ✅ |
| Use multiple models | — | ❌ | ✅ | ✅ |
| Streaming responses | ✅ (guest) | ✅ | ✅ | ✅ |
| Silicon debug prompts (RTL, FSM, etc.) | ✅ | ✅ | ✅ | ✅ |
| Conversation history persisted | ❌ | ✅ | ✅ | ✅ |
| Unlimited conversations | — | Limited | ✅ | ✅ |

### Waveforms

| Feature | Demo | Free | Pro | Ultra |
|--------|:----:|:----:|:---:|:-----:|
| View waveform docs / UI | ✅ (read-only context) | ✅ | ✅ | ✅ |
| Upload waveform files | ❌ | ✅ | ✅ | ✅ |
| Max waveform file size | — | 25 MB | 200 MB | 200 MB* |
| Max number of waveform files | — | 5 | Higher** | Higher** |
| VCD format | — | ✅ | ✅ | ✅ |
| FST format | — | ❌ | ✅ | ✅ |
| GHW format | — | ✅ | ✅ | ✅ |
| Surfer viewer (zoom, pan, signals) | — | ✅ | ✅ | ✅ |

\* Ultra may be raised to match Enterprise (e.g. 500 MB) in a future release.  
\** Pro/Ultra limits are higher than Free; exact caps may vary by configuration.

### Settings & account

| Feature | Demo | Free | Pro | Ultra |
|--------|:----:|:----:|:---:|:-----:|
| View settings | ❌ | ✅ | ✅ | ✅ |
| General preferences (theme, notifications) | — | ✅ | ✅ | ✅ |
| Privacy Mode | — | ❌ | ✅ | ✅ |
| Bring your own API keys | — | ✅* | ✅ | ✅ |
| Models panel (enable/disable providers) | — | ✅ | ✅ | ✅ |
| Billing & subscription management | — | Upgrade CTA | ✅ | ✅ |
| Usage / activity views | — | ✅ | ✅ | ✅ |
| Manage account (profile) | — | ✅ | ✅ | ✅ |

\* Some model/API key options may be limited or gated for Free in the UI.

---

## Settings panels (by tier)

All settings require sign-in (no Demo access). Below, **Pro** means the feature is available on Pro and Ultra (paid plans); **Free** means available on Free; **Pro (badge)** means the UI shows a Pro badge and the feature may be gated or placeholder.

### Core

| Panel / feature | Free | Pro | Ultra |
|-----------------|:----:|:---:|:-----:|
| **Overview** | | | |
| Ultra & Pro plan cards, upgrade CTAs | ✅ | ✅ | ✅ |
| Current plan display | ✅ | ✅ | ✅ |
| Your Analytics (e.g. lines of agent edits) | ✅ | ✅ | ✅ |
| Manage subscription | — | ✅ | ✅ |
| **General** | | | |
| Theme (light / dark / system) | ✅ | ✅ | ✅ |
| System / email / push notifications | ✅ | ✅ | ✅ |
| Keyboard Shortcuts | ✅ | ✅ | ✅ |
| Privacy Mode (off / standard / strict) | ❌ | ✅ | ✅ |
| **Account** | | | |
| Profile (name, email, bio, avatar) | ✅ | ✅ | ✅ |
| Change password | ✅ | ✅ | ✅ |
| Manage account | ✅ | ✅ | ✅ |

### Integrations

| Panel / feature | Free | Pro | Ultra |
|-----------------|:----:|:---:|:-----:|
| **Agents** | | | |
| Default mode, location, auto-clear, review on commit | ✅ | ✅ | ✅ |
| Web search tool, auto-accept, auto-run mode | ✅ | ✅ | ✅ |
| Protection (browser, MCP tools, file-deletion) | ✅ | ✅ | ✅ |
| Toolbar on selection, commit attribution | ✅ | ✅ | ✅ |
| **Tab** | | | |
| Cursor Tab, partial accepts, suggestions while commenting | ✅ | ✅ | ✅ |
| Whitespace-only suggestions, imports, auto-import Python | ✅ | ✅ | ✅ |
| **Models** | | | |
| Enable/disable models per provider | ✅ | ✅ | ✅ |
| Auto Mode | ✅ | ✅ | ✅ |
| MAX Mode | ❌ | ✅ | ✅ |
| Reasoning models | ❌ | ✅ | ✅ |
| Bring your own keys (BYOK) | ❌ | ✅ | ✅ |
| **Cloud Agents** | Backlog (Pro when shipped) | — | — |
| **Tools & MCP** | Pro (badge) | ✅ | ✅ |

### Billing & usage

| Panel / feature | Free | Pro | Ultra |
|-----------------|:----:|:---:|:-----:|
| **Usage** | | | |
| Usage per session (view) | Pro (badge) | ✅ | ✅ |
| **Billing & Invoices** | | | |
| Included usage table | Pro (badge) | ✅ | ✅ |
| On-demand usage, invoices, manage subscription | ✅ | ✅ | ✅ |

### Rules & automation

| Panel / feature | Free | Pro | Ultra |
|-----------------|:----:|:---:|:-----:|
| **Rules** | | | |
| Context (include third-party configs) | Pro (badge) | ✅ | ✅ |
| Rules (e.g. .cursorrules, soul-doc) | Pro (badge) | ✅ | ✅ |
| Commands (/ prefix workflows) | Pro (badge) | ✅ | ✅ |
| **Skills** | Pro (badge) | ✅ | ✅ |
| **Workers** | Pro (badge) | ✅ | ✅ |
| **Hooks** | Pro (badge) | ✅ | ✅ |

### Data & beta

| Panel / feature | Free | Pro | Ultra |
|-----------------|:----:|:---:|:-----:|
| **Indexing & Docs** | | | |
| Codebase indexing | Pro (badge) | ✅ | ✅ |
| Index new folders (toggle) | ✅ | ✅ | ✅ |
| Ignore files (.cursorignore) | Pro (badge) | ✅ | ✅ |
| Docs (crawl and index) | Pro (badge) | ✅ | ✅ |
| **Beta** | | | |
| Early access (pre-release builds) | ✅ | ✅ | ✅ |
| Agent autocomplete, extension RPC tracer | ✅ | ✅ | ✅ |

### Support

| Panel / feature | Free | Pro | Ultra |
|-----------------|:----:|:---:|:-----:|
| **Documentation** (external link) | ✅ | ✅ | ✅ |
| **Contact us** | ✅ | ✅ | ✅ |

### Implementation notes (settings)

- **Backend-gated**: Privacy Mode (General), MAX Mode (Models), and Bring your own keys (Models) are enforced server-side for Free; Free users cannot enable them.
- **Pro (badge) only**: Panels/sections marked "Pro (badge)" show an upgrade badge in the UI; backend gating may or may not be implemented yet. Treat as Pro+ for product positioning.
- **Settings layout (sidebar)**: Sidebar shows plan tier then email (no avatar). Unauthenticated: plan tier, "—" for email, "Sign in" only. Authenticated Free: "Upgrade" and "Sign out". Pro/Ultra: "Sign out" only (no Upgrade). "Manage subscription" and current plan details live in Overview and Billing panels.
- **Overview panel**: Shows Ultra ($200/mo) and Pro ($60/mo) plan cards with upgrade CTAs, plus current plan section and Your Analytics.

### Workspaces & data

| Feature | Demo | Free | Pro | Ultra |
|--------|:----:|:----:|:---:|:-----:|
| Default space (workspace) | ❌ | ✅ | ✅ | ✅ |
| Create spaces / workspaces | — | ✅ | ✅ | ✅ |
| Conversations in spaces | — | ✅ | ✅ | ✅ |
| Document indexing | — | ✅ | ✅ | ✅ |
| Integrations (e.g. GitHub, Confluence) | — | ✅ | ✅ | ✅ |
| Debug sessions (RTL + waveforms) | — | ✅ | ✅ | ✅ |
| Design file upload & viewer | — | ✅ | ✅ | ✅ |
| Files page | — | ✅ | ✅ | ✅ |

### API & platform

| Feature | Demo | Free | Pro | Ultra |
|--------|:----:|:----:|:---:|:-----:|
| REST API (with auth) | ❌ | ✅ | ✅ | ✅ |
| Rate limits (e.g. messages, uploads) | Stricter | Standard | Higher | Higher |
| Test API page | — | ✅ | ✅ | ✅ |

### Support & experience

| Feature | Demo | Free | Pro | Ultra |
|--------|:----:|:----:|:---:|:-----:|
| In-app upgrade prompts | — | ✅ | ✅ | — |
| Community support | — | ✅ | — | — |
| Priority support | — | ❌ | ✅ | ✅ |
| Beta / early access (when offered) | — | Optional | ✅ | ✅ |

---

## Implementation notes

- **Demo**: No session; chat may use a static model list and non-persisted conversations. All write/upload and settings require sign-in.
- **Free**: `plan === "free"`. Enforced limits: 5 waveform files, 25 MB per file, VCD/GHW only (no FST). No MAX Mode or Use Multiple Models; no Privacy Mode.
- **Pro / Ultra**: Treated as premium in code via `hasPremiumAccess()` (active subscription required). Pro and Ultra share the same feature set in the current implementation; Ultra may gain higher limits (e.g. waveform size/count) in future.
- **Enterprise**: Documented on overview/plans; contact sales. Not included in this matrix; see [PRICING.md](./PRICING.md) or overview page for positioning.

---

## Upsell strategy

**In short:** Show upgrade at the moment of need (limits, gated features). Message Free → Pro with concrete benefits (MAX Mode, FST, BYOK, limits); message Pro → Ultra with scale (20x, early access). Use the trigger table and recommended copy below for consistency.

### Principles

- **Value-first**: Lead with outcome (faster debug, better models, no limits), not feature names.
- **Right moment**: Surface upgrade when the user hits a limit or tries a gated feature; avoid generic banners.
- **Clear ladder**: Free → Pro (unlock power) → Ultra (maximum scale). One step at a time.
- **Anchoring**: Show Ultra so Pro feels like the sensible default; show what they’re missing in concrete terms.

### Target narrative by tier

| From | To | Core message |
|------|-----|--------------|
| **Demo** | Free | "Save your work — sign in to keep conversations and settings." |
| **Free** | Pro | "Unlock the best models and remove limits so you can ship faster." |
| **Pro** | Ultra | "Get 20x headroom and early access when you need maximum scale." |

### When to show upgrade (triggers)

Use these to decide **where** and **when** to show CTAs or paywalls:

| Trigger | Where | Suggested CTA / copy |
|--------|--------|------------------------|
| User hits 5 waveform files (Free) | Files / upload flow | "You've reached the Free limit (5 files). Upgrade to Pro for more." |
| User uploads file > 25 MB (Free) | Upload error / modal | "This file is over 25 MB. Pro supports up to 200 MB and FST compression." |
| User tries FST upload (Free) | Upload / format error | "FST is a Pro feature. Upgrade to work with compressed waveforms." |
| User tries MAX Mode (Free) | Chat / model selector | "MAX Mode uses our best models. Upgrade to Pro to enable it." |
| User tries "Use multiple models" (Free) | Chat / models UI | "Use multiple models in one flow with Pro." |
| User opens Models → BYOK (Free) | Settings → Models | "Bring your own API keys with Pro — unlimited queries, your keys." |
| User opens Privacy Mode (Free) | Settings → General | "Keep your code private. Privacy Mode is available on Pro and above." |
| User sees Pro-badged panel (Free) | Any "Pro" badge | Use badge + one-line benefit (see Recommended copy). |
| Pro user with high usage | Usage / Billing | "Need more headroom? Ultra gives you 20x limits and early access." |

### Placement hierarchy

1. **In-context (best)**: Paywall or inline CTA at the moment they hit the limit or click the gated feature (e.g. MAX Mode, FST upload, BYOK).
2. **Settings Overview**: Plan cards (Ultra, Pro) with short benefit line + "Upgrade to Pro" / "Upgrade to Ultra". Sidebar "Upgrade" for Free only.
3. **Overview page** (if used): Plan comparison with clear "Most popular" on Pro and outcome-led descriptions.
4. **Avoid**: Repeated global banners; vague "Upgrade for more" with no concrete reason.

### Psychology

- **Loss framing**: "You're at the Free limit" or "This feature isn't available on Free" works better than "Pro has more."
- **Specificity**: "200 MB files and FST" beats "bigger files"; "MAX Mode and multiple models" beats "better AI."
- **One step**: Don’t push Free users to Ultra; push to Pro first. Ultra is for power users who already see the ceiling.

---

## Recommended copy

Use this section for in-app strings, tooltips, and paywall messages. Keep tone clear and benefit-led.

### Plan cards (Settings Overview / Overview page)

**Pro ($60/mo)**  
- Headline: **Pro**  
- Subline (short): *"MAX Mode, multiple models, higher limits, and FST waveforms."*  
- Button: **Upgrade to Pro**  
- Optional one-liner: *"Unlock the best models and remove the limits that slow you down."*

**Ultra ($200/mo)**  
- Headline: **Ultra**  
- Subline (short): *"20x usage limits and early access to advanced features."*  
- Button: **Upgrade to Ultra**  
- Optional one-liner: *"For teams and power users who need maximum headroom."*

### Upgrade CTAs (buttons / links)

| Context | Primary CTA | Secondary (e.g. "Learn more") |
|--------|-------------|-------------------------------|
| Plan card | "Upgrade to Pro" / "Upgrade to Ultra" | — |
| Sidebar (Free) | "Upgrade" | — |
| After limit (e.g. file count) | "Upgrade to Pro" | "See what's in Pro" |
| Gated feature (MAX Mode, BYOK, FST) | "Upgrade to unlock" or "Unlock with Pro" | "View plans" |

### Paywall / limit messages (user just hit a gate)

- **File count (5 files, Free):**  
  *"You've reached the Free plan limit (5 files). Upgrade to Pro to store more waveforms and use FST."*
- **File size (>25 MB, Free):**  
  *"This file is over 25 MB. Pro supports up to 200 MB and FST compression for large traces."*
- **FST format (Free):**  
  *"FST is available on Pro. Upgrade to work with compressed waveforms and larger designs."*
- **MAX Mode (Free):**  
  *"MAX Mode uses our highest-quality models. Upgrade to Pro to enable it."*
- **Multiple models (Free):**  
  *"Use multiple models in one workflow with Pro."*
- **Privacy Mode (Free):**  
  *"Privacy Mode (no training on your code) is available on Pro and above."*
- **BYOK (Free):**  
  *"Bring your own API keys with Pro — unlimited queries and access to premium models."*

### Pro badge (settings panels)

When a panel or row is Pro-gated, use a short badge + explanation:

- Badge: **Pro** (with gem or lock icon if in design system).
- Tooltip or inline: *"Available on Pro"* or *"Unlock with Pro — [one benefit], e.g. unlimited usage."*

### Toasts / confirmations (after upgrade)

- *"You're now on Pro. MAX Mode, multiple models, and FST are unlocked."*
- *"You're now on Ultra. You have 20x usage limits and early access to new features."*

### Sign-in / Demo → Free

- **Sign in CTA:** *"Sign in to save conversations and sync settings across devices."*
- **After sign-in (first time):** *"You're on the Free plan. Upgrade anytime to unlock MAX Mode and higher limits."* (optional, non-blocking.)

### Copy to avoid

- Vague: "Upgrade for more features," "Get more with Pro."
- Jargon-only: "BYOK," "FST" without a one-line explanation where space allows.
- Pushing Ultra to Free users; keep the ladder Free → Pro → Ultra.

---

## Related docs

- [Features](/features) — Full feature list
- [SETTINGS_PLAN.md](./SETTINGS_PLAN.md) — Settings and paid-only options (e.g. Privacy Mode)
- [PRICING.md](./PRICING.md) — Plan positioning, triggers, and pricing
- Overview page (`/overview`) — In-app plan comparison and upgrade CTA
