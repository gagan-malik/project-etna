# Project Etna - Competitor Benchmarking & Analysis

> **Last Updated:** January 2026  
> **Purpose:** Comprehensive competitive analysis to identify market positioning, gaps, and opportunities

---

## Executive Summary

Project Etna operates in the **AI-powered silicon verification and debugging** market. This market is dominated by three enterprise EDA giants (Cadence, Synopsys, Siemens EDA) with combined market cap exceeding $200B, while being disrupted by well-funded AI startups (ChipAgents, ChipStack). Etna's opportunity lies in the **underserved middle market**: professional engineers priced out of enterprise tools, students, and hobbyist FPGA developers.

**Key Strategic Insight:** The verification market is experiencing a paradigm shift from "tool-centric" to "AI-agent-centric" workflows. Etna can leapfrog legacy tools by building an AI-native, conversational-first experience rather than retrofitting AI onto existing tools.

---

## Competitive Landscape Overview

```
                    HIGH PRICE
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    │   SYNOPSYS ●      │      ● CADENCE    │
    │   (Verdi, VSO.ai) │   (Verisium)      │
    │                   │                   │
    │        ● SIEMENS  │                   │
    │     (Questa One)  │                   │
    │                   │                   │
 LEGACY ────────────────┼─────────────────── AI-NATIVE
    │                   │                   │
    │                   │   ● ChipAgents    │
    │                   │   ($21M funding)  │
    │                   │                   │
    │   ● GTKWave       │      ★ ETNA       │
    │   ● Surfer        │   (opportunity)   │
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                   LOW PRICE
```

---

## Detailed Competitor Profiles

### 1. Cadence - Verisium Platform

**Company:** Cadence Design Systems (NASDAQ: CDNS)  
**Market Cap:** ~$80B  
**Product:** Verisium AI-Driven Verification Platform

#### Product Suite

| Tool | Function | AI Capability |
|------|----------|---------------|
| **Verisium Manager** | Verification management | Predictive analytics |
| **Verisium Debug** | Interactive debugging | AI-assisted root cause |
| **Verisium AutoTriage** | Bug classification | Automatic error categorization |
| **Verisium CodeMiner** | Code analysis | Pattern detection |
| **Verisium WaveMiner** | Waveform analysis | AI signal correlation |
| **Verisium SimAI** | Simulation optimization | Compute resource optimization |
| **Verisium SmartRun** | Regression management | Smart test selection |

#### Strengths
- Complete verification ecosystem integration
- Deep EDA expertise (40+ years)
- Massive R&D budget ($1.5B+/year)
- Established customer relationships
- Hardware-software co-verification

#### Weaknesses
- **Pricing barrier**: $50K+/year licenses exclude 90% of potential users
- **Legacy UX**: Desktop-centric, complex setup
- **Tool sprawl**: Multiple tools for different tasks
- **Vendor lock-in**: Proprietary file formats, workflows
- **Slow AI adoption**: AI features bolted onto legacy architecture

#### Pricing
- Enterprise only: $50,000 - $500,000+/year per seat
- Multi-year contracts typical
- No self-service or trial options

---

### 2. Synopsys - VSO.ai & Verdi

**Company:** Synopsys Inc. (NASDAQ: SNPS)  
**Market Cap:** ~$85B  
**Products:** VSO.ai, Verdi Debug Platform, Synopsys.ai

#### Product Suite

| Product | Function | AI Capability |
|---------|----------|---------------|
| **VSO.ai** | Verification optimization | AI-driven test selection |
| **Verdi** | Debug platform | Limited AI, traditional debug |
| **VC Formal** | Formal verification | AI-guided proof strategies |
| **Synopsys.ai** | Unified AI platform | Generative AI across tools |

#### Strengths
- Market leader in EDA
- Complete design-to-verification flow
- Strongest in formal verification
- Aggressive AI investment (Synopsys.ai platform)
- Acquisition strategy (recently acquired Ansys)

#### Weaknesses
- **Even higher pricing** than Cadence
- **Fragmented product line**: VSO.ai vs Verdi confusion
- **Desktop-first**: No web-native experience
- **Slow innovation cycles**: 12-18 month release cycles
- **Complex licensing**: CPU/core-based licensing confusion

#### Pricing
- Enterprise only: $75,000 - $1M+/year
- Often bundled with synthesis tools
- Academic programs exist but limited

---

### 3. Siemens EDA (formerly Mentor Graphics)

**Company:** Siemens Digital Industries Software  
**Parent Market Cap:** ~$150B (Siemens AG)  
**Products:** Questa One, Aprisa AI

#### Product Suite

| Product | Function | AI Capability |
|---------|----------|---------------|
| **Questa One** | Smart verification | 50x coverage acceleration |
| **Questa Prime** | Simulation | AI-optimized regression |
| **Questa Formal** | Formal verification | AI-guided assertions |
| **Aprisa AI** | Implementation | Generative AI for PnR |

#### Key Claims
- 50x faster coverage acceleration
- 48x faster fault simulation  
- 24+ hours → <1 minute processing time
- "EDA AI System" with RAG framework

#### Strengths
- Industrial backing (Siemens resources)
- Strong in automotive/safety-critical
- Functional safety expertise
- On-premise security focus
- Growing AI investment

#### Weaknesses
- **Third place in verification market**
- **Mentor brand confusion**: Siemens EDA vs Mentor legacy
- **Less EDA-native AI**: Coming from industrial AI perspective
- **Enterprise-only focus**: No SMB or individual products
- **Integration overhead**: Complex with other Siemens tools

#### Pricing
- Enterprise only: $40,000 - $300,000+/year
- Often bundled with Siemens PLM tools
- Academic programs through university partnerships

---

### 4. ChipAgents (AI Startup)

**Company:** ChipAgents Inc. (Startup)  
**Funding:** $21M Series A (October 2025)  
**Focus:** Agentic AI for chip design and verification

#### Products

| Product | Function | Status |
|---------|----------|--------|
| **Waveform Agents** | AI waveform navigation | Production |
| **CoverAgent** | Functional coverage | Production |
| **RCA Agent** | Root cause analysis | Production |
| **Design Agents** | Design automation | Beta |

#### Key Claims
- 50x YoY sales growth
- 50+ semiconductor company deployments
- 10x faster design iteration
- "Autonomous" root cause analysis

#### Strengths
- **AI-native architecture**: Built from scratch for AI
- **Modern tech stack**: Cloud-native, SaaS
- **VC backing**: Strong funding runway
- **Speed to market**: Rapid iteration
- **Enterprise traction**: Proven with major chipmakers

#### Weaknesses
- **Enterprise focus**: Pricing targets large teams
- **Narrow scope**: Specific AI agents, not unified platform
- **Unproven scale**: Still early stage
- **No free tier**: Requires sales engagement
- **Dependent on waveform quality**: AI needs good signal data

#### Pricing
- Undisclosed (estimated $5K-50K/user/year)
- Enterprise sales model
- No self-service

---

### 5. Open Source Tools

#### GTKWave
**Type:** Open-source waveform viewer  
**License:** GPL  
**Established:** Mid-2000s

| Aspect | Assessment |
|--------|------------|
| **Strengths** | Free, supports all formats, large user base |
| **Weaknesses** | Dated UI, no AI, no collaboration, desktop-only |
| **Pricing** | Free |
| **Threat Level** | Low (different market segment) |

#### Surfer
**Type:** Modern open-source waveform viewer  
**License:** MIT  
**Status:** Active development

| Aspect | Assessment |
|--------|------------|
| **Strengths** | Modern UI, web-native, WASM-based, good API |
| **Weaknesses** | No AI, viewer-only (no debugging), limited community |
| **Pricing** | Free |
| **Threat Level** | Partner opportunity (Etna uses Surfer) |

#### Sigrok
**Type:** Signal analysis software suite  
**License:** GPL v3

| Aspect | Assessment |
|--------|------------|
| **Strengths** | Hardware analyzer support, protocol decoders |
| **Weaknesses** | Focused on real hardware, not simulation waveforms |
| **Pricing** | Free |
| **Threat Level** | Low (different use case) |

---

## Feature Comparison Matrix

### Core Capabilities

| Feature | Cadence | Synopsys | Siemens | ChipAgents | GTKWave | **Etna** |
|---------|---------|----------|---------|------------|---------|----------|
| Waveform Viewing | 5/5 | 5/5 | 5/5 | 4/5 | 3/5 | **3/5** |
| RTL Debugging | 5/5 | 5/5 | 5/5 | 3/5 | 0/5 | **3/5** |
| AI Chat Interface | 2/5 | 2/5 | 3/5 | 4/5 | 0/5 | **5/5** |
| Root Cause Analysis | 4/5 | 4/5 | 4/5 | 5/5 | 0/5 | **3/5** |
| Collaboration | 3/5 | 3/5 | 3/5 | 3/5 | 0/5 | **2/5** |
| CI/CD Integration | 4/5 | 4/5 | 4/5 | 4/5 | 0/5 | **1/5** |

### AI Capabilities

| AI Feature | Cadence | Synopsys | Siemens | ChipAgents | **Etna** |
|------------|---------|----------|---------|------------|----------|
| Conversational AI | 1/5 | 2/5 | 2/5 | 3/5 | **5/5** |
| Natural Language Debug | 1/5 | 2/5 | 2/5 | 3/5 | **5/5** |
| Multi-Model Support | 1/5 | 1/5 | 1/5 | 2/5 | **5/5** |
| Streaming Responses | 1/5 | 1/5 | 1/5 | 3/5 | **5/5** |
| Silicon-Specific Prompts | 3/5 | 3/5 | 3/5 | 4/5 | **4/5** |
| Context Awareness | 4/5 | 4/5 | 4/5 | 4/5 | **3/5** |

### User Experience

| UX Factor | Cadence | Synopsys | Siemens | ChipAgents | GTKWave | **Etna** |
|-----------|---------|----------|---------|------------|---------|----------|
| Modern UI | 2/5 | 2/5 | 2/5 | 4/5 | 1/5 | **5/5** |
| Web-Based | 1/5 | 1/5 | 2/5 | 4/5 | 0/5 | **5/5** |
| Setup Time | 1/5 | 1/5 | 1/5 | 3/5 | 3/5 | **5/5** |
| Mobile Friendly | 0/5 | 0/5 | 0/5 | 2/5 | 0/5 | **4/5** |
| Learning Curve | 1/5 | 1/5 | 1/5 | 3/5 | 2/5 | **5/5** |

### Accessibility & Pricing

| Factor | Cadence | Synopsys | Siemens | ChipAgents | GTKWave | **Etna** |
|--------|---------|----------|---------|------------|---------|----------|
| Free Tier | No | No | No | No | Yes | **Yes** |
| Self-Service | No | No | No | No | Yes | **Yes** |
| Individual Pricing | No | No | No | No | Free | **$19/mo** |
| Trial Available | Limited | Limited | Limited | No | N/A | **Yes** |
| Student Access | Academic | Academic | Academic | No | Yes | **Yes** |

---

## Gap Analysis

### Gaps Where Etna LEADS

| Gap | Competitor Limitation | Etna Advantage |
|-----|----------------------|----------------|
| **Conversational UX** | Tools have forms/menus, not chat | AI-first chat interface |
| **Accessibility** | $50K+ minimums | Freemium from $0 |
| **Instant Access** | Weeks for procurement | Sign up in 30 seconds |
| **Modern Stack** | Legacy desktop apps | Next.js, React, streaming |
| **Model Choice** | Single proprietary AI | OpenAI, Gemini, DeepSeek, Llama |
| **Web-Native** | Desktop installations | Browser-based, zero install |
| **Developer Experience** | Enterprise complexity | GitHub/Vercel-style simplicity |

### Gaps Where Etna LAGS

| Gap | Competitor Strength | Etna Limitation | Mitigation |
|-----|---------------------|-----------------|------------|
| **Deep Integration** | Full EDA flow integration | Standalone tool | Focus on debug-only excellence |
| **Large File Support** | Handles 10GB+ files | 500MB limit | Phase 4 server mode |
| **Formal Verification** | Built-in formal tools | None | Partner or integrate |
| **Protocol Analysis** | AXI/PCIe/USB analyzers | Manual | Phase 3 auto-detection |
| **Enterprise Security** | SOC2, on-prem, air-gap | Cloud-only | Phase 4 enterprise features |
| **Coverage Tracking** | Full coverage databases | Basic | Phase 3 testplan support |
| **Regression Suite** | Manage 100K+ tests | Not designed for this | Out of scope (focus on debug) |

### Gaps That Are OPPORTUNITIES

| Gap | Market Need | Opportunity |
|-----|-------------|-------------|
| **Hobbyist/Maker Market** | Zero tools for FPGA hobbyists | Free tier captures entire segment |
| **Student Market** | Academic licenses are bureaucratic | Self-service education tier |
| **Startups** | Can't afford enterprise tools | Affordable Pro tier for chip startups |
| **Quick Debug** | Enterprise tools overkill for small issues | "Just paste your code and ask" |
| **Learning Tool** | No AI tutoring for RTL | "Explain this Verilog" use case |
| **Second Opinion** | Engineers want quick AI check | Complement (not replace) enterprise tools |

---

## SWOT Analysis

### Strengths

1. **AI-Native Architecture**
   - Built from ground up with LLM integration
   - No legacy code constraining AI features
   - Modern streaming, real-time responses

2. **Accessible Pricing**
   - $19/mo vs $50K+/year
   - Opens 99% of market currently unserved
   - Predictable SaaS model

3. **Zero Friction Onboarding**
   - Sign up → debugging in under 2 minutes
   - No procurement, no IT, no installation
   - Modern auth (Google, GitHub)

4. **Multi-Model AI**
   - Users choose their preferred AI model
   - Not locked to single provider
   - Can leverage best model for each task

5. **Modern Developer Experience**
   - Familiar patterns (Vercel, Stripe, Linear)
   - API-first design
   - Clean, responsive UI

### Weaknesses

1. **Limited Feature Depth**
   - No formal verification
   - Basic waveform viewing (via Surfer)
   - No regression management

2. **File Size Constraints**
   - 500MB max (Team tier)
   - Can't handle production-scale SoC waveforms
   - Requires future server mode

3. **No Existing Customer Base**
   - Unproven in production
   - No case studies or testimonials
   - Must build trust from zero

4. **Single Product**
   - Competitors have integrated ecosystems
   - Can't lock customers into workflow
   - Easy to switch away

5. **Resource Constraints**
   - Small team vs billion-dollar R&D
   - Limited funds for enterprise sales
   - Can't match feature velocity of Big 3

### Opportunities

1. **Underserved Market Segments**
   - **Students**: 500K+ EE/CS students globally
   - **Hobbyists**: Growing FPGA maker community
   - **Startups**: 1000+ chip startups can't afford enterprise
   - **Consultants**: Individual verification engineers

2. **AI Paradigm Shift**
   - Industry moving to AI-assisted workflows
   - Legacy tools retrofitting AI poorly
   - Window to establish AI-native brand

3. **Open Source Partnership**
   - Surfer integration already working
   - OpenTitan methodology as foundation
   - RISC-V community growing rapidly

4. **Enterprise "Shadow IT"**
   - Engineers using personal tools at work
   - Free/Pro tier seeds enterprise deals
   - Bottom-up adoption model

5. **Complementary Positioning**
   - "Quick AI check" alongside enterprise tools
   - Not replacing, augmenting existing workflows
   - Lower barrier to first use

### Threats

1. **Big 3 AI Investment**
   - Cadence/Synopsys/Siemens all investing heavily in AI
   - Could add conversational features to existing tools
   - Massive distribution advantage

2. **ChipAgents Growth**
   - Well-funded, AI-native competitor
   - Could move downmarket with free tier
   - Already has enterprise credibility

3. **Open Source AI**
   - Someone could add AI to GTKWave/Surfer
   - Community-driven alternative
   - Free forever model

4. **Market Education**
   - Engineers skeptical of AI for hardware
   - "AI can't understand my design" objection
   - Requires proving accuracy/value

5. **Platform Dependencies**
   - Relies on LLM providers (OpenAI, etc.)
   - Relies on Surfer for waveform viewing
   - Vercel/cloud dependency

---

## Strategic Opportunities

### Opportunity 1: Own the "First AI Debug" Experience

**Insight:** Most engineers' first experience with AI debugging will define their expectations.

**Strategy:**
- Make Etna the default "try AI for debugging" tool
- Optimize for viral sharing ("paste code, get answer")
- Create memorable "wow" moments in first session
- Target tutorials, courses, bootcamps as entry points

**Tactics:**
- [ ] "Share this debug" links for social
- [ ] Embeddable debug widget for blogs/tutorials
- [ ] Partnership with FPGA educators (Nand2Tetris, etc.)
- [ ] YouTube tutorials showing "debug in 60 seconds"

**Success Metric:** 50% of new hardware engineers try Etna before enterprise tools

---

### Opportunity 2: Build the AI Debug Assistant Category

**Insight:** No one owns "conversational debugging" as a product category.

**Strategy:**
- Position as "ChatGPT for chip debugging"
- Own the natural language debugging paradigm
- Build brand around "just ask" simplicity

**Tactics:**
- [ ] Coin "Conversational Debug" as category term
- [ ] Publish thought leadership on AI-native verification
- [ ] Create comparison pages vs enterprise tools
- [ ] SEO for "AI Verilog debug", "RTL assistant", etc.

**Success Metric:** "Etna" becomes synonymous with AI hardware debugging

---

### Opportunity 3: Capture Students → Future Decision Makers

**Insight:** Today's students are tomorrow's tool decision makers.

**Strategy:**
- Make Etna the tool students learn with
- Build habits before they encounter enterprise tools
- Create evangelists who request Etna at employers

**Tactics:**
- [ ] Free tier generous for student projects
- [ ] University outreach program
- [ ] Student ambassador program
- [ ] Course material partnerships (SystemVerilog courses)
- [ ] GitHub Student Developer Pack inclusion

**Success Metric:** Used in 100+ university courses within 2 years

---

### Opportunity 4: "Second Opinion" Positioning

**Insight:** Even enterprise tool users want quick AI checks.

**Strategy:**
- Position as complement, not replacement
- "Get a quick AI opinion before deep debugging"
- Low-risk adoption (doesn't replace existing tools)

**Tactics:**
- [ ] Fast paste-and-ask flow
- [ ] Export findings to share with team
- [ ] Integration with enterprise tools (import VCD from Verdi)
- [ ] "AI checked, enterprise verified" messaging

**Success Metric:** 30% of users also have enterprise tool licenses

---

### Opportunity 5: Chip Startup Bundle

**Insight:** 1000+ chip startups in AI/automotive/IoT need verification tools but can't afford enterprise licenses.

**Strategy:**
- Become the default verification tool for seed-stage chip startups
- Grow with customers as they scale
- Convert to enterprise when they can afford it

**Tactics:**
- [ ] YC/Techstars/etc. startup program
- [ ] Accelerator partnerships
- [ ] "First tool after tapeout" positioning
- [ ] Case studies with successful startup customers
- [ ] Team tier pricing attractive vs enterprise minimums

**Success Metric:** Used by 100+ funded chip startups

---

## Competitive Response Playbook

### If Cadence/Synopsys Add Chat Interface

**Their likely move:** Add ChatGPT-style interface to Verdi/Verisium

**Our response:**
- Emphasize "AI-native" vs "AI-added"
- Point out integration friction (install, license, configure)
- Highlight model choice vs locked-in AI
- Focus on UX superiority (we iterate weekly, they iterate yearly)
- Double down on accessibility (they won't go freemium)

### If ChipAgents Launches Free Tier

**Their likely move:** Add developer/student tier to capture bottom of market

**Our response:**
- Compete on UX and onboarding speed
- Emphasize conversational vs agent-specific interface
- Build community moat (tutorials, content, forums)
- Geographic expansion (their focus is US enterprise)
- Feature parity race on core debugging

### If Open Source Adds AI

**Their likely move:** Community builds AI plugin for GTKWave/Surfer

**Our response:**
- Welcome and integrate (we use Surfer)
- Differentiate on hosted/managed experience
- Emphasize no-setup, instant access
- Build proprietary prompts and training
- Focus on session management, history, collaboration

---

## Key Differentiators to Emphasize

### In Marketing

1. **"Debug in 60 seconds"** - Zero installation, instant access
2. **"Ask, don't click"** - Conversational vs menu-driven
3. **"Choose your AI"** - Model flexibility vs vendor lock-in
4. **"Built for engineers, priced for humans"** - $19 vs $50K
5. **"Modern tools for modern silicon"** - Web-native vs desktop legacy

### In Sales

1. **TCO Comparison**: Show 100x cost savings vs enterprise
2. **Time to Value**: 2 minutes vs 2 weeks procurement
3. **Risk Reduction**: Try before committing, cancel anytime
4. **Team Agility**: Add users instantly, no license negotiation
5. **AI Quality**: Multi-model, latest AI vs legacy implementations

### In Product

1. **Streaming responses**: Real-time AI typing vs batch responses
2. **Quick prompts**: Silicon-specific shortcuts vs generic
3. **Session history**: Build debugging knowledge base
4. **File + chat unity**: RTL, waveform, and AI in one view
5. **Modern auth**: Google/GitHub vs enterprise SSO complexity

---

## Action Items

### Immediate (This Quarter)

- [ ] Create competitor comparison landing pages
- [ ] Build "try vs [competitor]" demo flows
- [ ] Publish "Why Etna" positioning document
- [ ] Set up competitive intelligence tracking
- [ ] Document win/loss reasons from early users

### Near-Term (Next Quarter)

- [ ] Student/university outreach program
- [ ] Chip startup accelerator partnerships
- [ ] Content marketing: AI debugging tutorials
- [ ] Community building: Discord/forum launch
- [ ] Case study with early adopter

### Medium-Term (6 Months)

- [ ] Signal-RTL correlation (key differentiator)
- [ ] Protocol auto-detection (match enterprise)
- [ ] Team collaboration features
- [ ] API for CI/CD integration
- [ ] Enterprise security certifications (SOC2)

---

## Appendix: Competitor Pricing Reference

| Product | Model | Estimated Cost | Notes |
|---------|-------|----------------|-------|
| Cadence Verisium | Enterprise | $50K-500K/year | Per-seat licensing |
| Synopsys Verdi | Enterprise | $75K-1M/year | Often bundled |
| Siemens Questa One | Enterprise | $40K-300K/year | Academic discounts |
| ChipAgents | Enterprise | $5K-50K/user/year | Estimated |
| GTKWave | Free | $0 | Open source |
| Surfer | Free | $0 | Open source |
| **Etna Free** | Freemium | **$0** | 50 AI queries/day |
| **Etna Pro** | SaaS | **$19/month** | 500 AI queries/day |
| **Etna Team** | SaaS | **$49/user/month** | Collaboration |
| **Etna Enterprise** | Custom | **Contact sales** | On-prem, SSO |

---

## Differentiation Strategy: Learning from Disruptive SaaS Leaders

To beat both enterprise EDA giants AND emerging AI startups, Etna must adopt the UX patterns that made products like Cursor, Linear, Figma, Notion, and Vercel category-defining.

### Lessons from Disruptive SaaS

| Product | Core Disruption | Etna Application |
|---------|-----------------|------------------|
| **Cursor** | AI-native editor with agents | Multi-agent system (Debug, Waveform, Testbench agents) |
| **Linear** | Opinionated, purpose-built workflows | Built-in debug stages: Triage → Analyze → Debug → Resolve |
| **Figma** | Real-time multiplayer collaboration | Live cursors, shared annotations, presence indicators |
| **Notion** | Composable blocks | Debug report builder with reusable primitives |
| **Vercel** | Zero-config, instant feedback | <2 min to first debug, streaming everything |
| **Stripe** | Documentation as product | Interactive examples, integrated contextual help |

---

### Feature Set 1: Command Palette & Keyboard-First UX

Power users (verification engineers) live in terminals. They want speed, not clicks.

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
└─────────────────────────────────────────────────────────┘
```

**Key Shortcuts:**

| Shortcut | Action |
|----------|--------|
| `⌘K` | Open command palette |
| `⌘/` | Toggle AI chat |
| `⌘Enter` | Send message to AI |
| `⌘E` | Explain selection |
| `⌘D` | Debug this code |
| `⌘G` | Generate testbench |

**Slash Commands in Chat:** `/explain`, `/testbench`, `/signals`, `/protocol`

---

### Feature Set 2: AI Agent Architecture

Move beyond chat to autonomous debugging workflows.

```
┌─────────────────────────────────────────────────────────┐
│                    ETNA AGENT SYSTEM                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Debug      │  │  Waveform   │  │  Testbench  │    │
│  │  Agent      │  │  Agent      │  │  Agent      │    │
│  │             │  │             │  │             │    │
│  │ Analyzes    │  │ Navigates   │  │ Generates   │    │
│  │ RTL, finds  │  │ signals,    │  │ UVM tests,  │    │
│  │ bugs        │  │ correlates  │  │ assertions  │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         └────────────────┼────────────────┘            │
│                   ┌──────▼──────┐                      │
│                   │ Orchestrator│                      │
│                   └─────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

| Agent | Responsibility | Example |
|-------|---------------|---------|
| **Debug Agent** | RTL analysis | "Find the bug in this FSM" |
| **Waveform Agent** | Signal navigation | "Show me when reset deasserts" |
| **Testbench Agent** | Test generation | "Generate UVM agent for this interface" |
| **Protocol Agent** | Protocol checking | "Verify AXI handshake compliance" |
| **RCA Agent** | Root cause analysis | "Why did this test fail?" |

**Background Agents:** Kick off analysis, continue working, get notified when complete.

---

### Feature Set 3: Real-Time Multiplayer Collaboration

Verification is a team sport. Debug sessions often involve multiple engineers.

```
┌─────────────────────────────────────────────────────────┐
│  Debug Session: uart_tx_test_fail                       │
│  👤 You  👤 Alice (viewing)  👤 Bob (typing...)         │
├─────────────────────────────────────────────────────────┤
│  [Waveform Panel]                                       │
│      👤 Alice's cursor                                  │
│  clk     ▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔▁▔                          │
│  tx_valid▁▁▁▔▔▔▔▔▔▁▁▁▁▁▁▁▁▁▁▁                          │
│             👤 Your cursor                              │
│                                                         │
│  [Chat Panel]                                           │
│  You: Why is tx_ready going low here?                  │
│  AI: The FIFO appears full because...                  │
│  Alice: 👀 Looking at the FIFO logic now               │
└─────────────────────────────────────────────────────────┘
```

**Collaboration Features:**
- Live cursors on waveform/code
- Presence indicators (who's online, what they're viewing)
- Shared annotations on signals
- @mentions in chat
- Session handoff to colleagues
- Share links with exact state: `etna.dev/session/abc?t=1500ns&signals=clk,data`

---

### Feature Set 4: Opinionated Debug Workflows

Less configuration, more productivity. Built-in templates enforce best practices.

**Debug Stages:**

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  TRIAGE  │───▶│ ANALYZE  │───▶│  DEBUG   │───▶│ RESOLVE  │
│          │    │          │    │          │    │          │
│ What     │    │ Narrow   │    │ Find     │    │ Fix &    │
│ failed?  │    │ down     │    │ root     │    │ verify   │
└──────────┘    └──────────┘    │ cause    │    └──────────┘
                                └──────────┘
```

**Built-In Debug Templates:**

| Template | Use Case | Auto-Setup |
|----------|----------|------------|
| **FSM Debug** | State machine issues | Loads state signals, checks transitions |
| **Protocol Debug** | AXI/APB issues | Protocol signals, compliance checks |
| **CDC Debug** | Clock domain crossing | Async signals, metastability warnings |
| **FIFO Debug** | FIFO under/overrun | Tracks pointers, fill levels |

---

### Feature Set 5: Contextual AI (Beyond Chat)

Chat is table stakes. Contextual AI anticipates needs without being asked.

**Inline Annotations:**

```verilog
module fifo #(parameter DEPTH=16) (
  input clk,
  output full         ⚠️ AI: Never asserted in simulation
);

reg [3:0] wr_ptr;     💡 AI: Wraps at 15, but DEPTH=16
```

**Proactive Insights:**

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

### Feature Set 6: Instant Feedback & Performance

Speed is a feature. Every delay breaks flow state.

**Performance Targets:**

| Action | Target | Industry Norm |
|--------|--------|---------------|
| App load | <1s | 3-5s |
| AI response start | <500ms | 2-3s |
| Waveform render (25MB) | <2s | 5-10s |
| Search results | <100ms | 500ms+ |

**UX Patterns:**
- Optimistic UI (show immediately, confirm later)
- Streaming AI responses (see typing in real-time)
- Skeleton loading states
- Lazy loading for large files

---

### Feature Set 7: Composable Debug Blocks

Let users build custom debug flows from primitives (Notion-inspired).

**Block Types:**

| Block | Purpose |
|-------|---------|
| **Code Block** | Display RTL snippet |
| **Waveform Block** | Embedded signal view at specific time |
| **AI Block** | AI analysis output |
| **Annotation Block** | User notes |
| **Checklist Block** | Debug verification steps |
| **Comparison Block** | Golden vs actual side-by-side |

**Use Case:** Build shareable debug reports that combine code, waveforms, AI analysis, and notes into a single exportable document.

---

### Feature Set 8: Multi-Mode Interaction System (Cursor-Inspired)

Adopt Cursor's successful mode-switching paradigm, tailored for silicon debugging.

**4-Mode System:**

| Mode | Icon | Purpose | Key Capability |
|------|------|---------|----------------|
| **Ask** | 💬 | Learn & explore | Read-only questions, no code changes |
| **Agent** | 🤖 | Build & implement | Full autonomy + built-in planning |
| **Debug** | 🐛 | Fix bugs systematically | Waveform integration + hypothesis generation |
| **Manual** | ✏️ | Precise modifications | User-controlled, explicit edits only |

**Why This Matters:**

| User Need | Mode | Benefit |
|-----------|------|---------|
| "I have a question" | Ask | Safe exploration without accidental changes |
| "Build this for me" | Agent | AI handles complexity with planning |
| "Something's broken" | Debug | Systematic investigation with waveforms |
| "Change exactly this" | Manual | Surgical precision, no AI surprises |

**Silicon-Specific Enhancements:**

| Mode | Etna Enhancement vs Cursor |
|------|---------------------------|
| **Ask** | + RTL syntax knowledge, protocol expertise |
| **Agent** | + Testbench generation, assertion generation |
| **Debug** | + **Waveform integration** (unique), hypothesis on signals |
| **Manual** | + Verilog/SystemVerilog aware edits |

**Keyboard Shortcuts:**

| Shortcut | Action |
|----------|--------|
| `⌘.` | Open mode switcher |
| `⌘. A` | Switch to Ask |
| `⌘. G` | Switch to Agent (Go) |
| `⌘. D` | Switch to Debug |
| `⌘. M` | Switch to Manual |

**Competitive Advantage:** Debug mode with integrated waveform analysis is **unique to Etna** - no EDA tool or AI coding assistant offers this.

---

### Feature Set 9: BYOK (Bring Your Own Key) & Multi-Model Support

Let users bring their own API keys and choose from multiple AI models.

**Why BYOK Matters:**

| Benefit | For Users | For Etna |
|---------|-----------|----------|
| **Cost Control** | Use existing API budgets | Zero AI cost on BYOK users |
| **Model Choice** | Pick best model per task | Higher margins |
| **Privacy** | Own keys = own data policies | Enterprise appeal |
| **No Lock-in** | Switch models anytime | Differentiation |
| **Latest Models** | Day-1 access to new releases | No integration burden |

**BYOK Providers (Priority Order):**

| Provider | Why | Integration Effort |
|----------|-----|-------------------|
| **OpenRouter** | 400+ models, one API | Single integration |
| **OpenAI** | Enterprise customers have keys | Separate integration |
| **Anthropic** | Popular for coding | Separate integration |

**Model Recommendations per Mode:**

| Mode | Default (Free) | Recommended (BYOK) |
|------|----------------|-------------------|
| **Ask** | DeepSeek V3 | Any (cheap works fine) |
| **Agent** | DeepSeek V3 | Claude 3.5, GPT-4o |
| **Debug** | DeepSeek V3 | DeepSeek V3, Claude |
| **Manual** | DeepSeek V3 | Any |

**MVP Strategy:**
- Use **OpenRouter** as unified gateway
- Single API integration covers 400+ models
- DeepSeek V3 as default (best price/performance)
- BYOK as Pro feature upsell

**Competitive Comparison:**

| Feature | Etna | Cursor | EDA Tools | ChipAgents |
|---------|------|--------|-----------|------------|
| BYOK | ✅ Pro feature | ✅ | ❌ | ❌ |
| Multi-model | ✅ 400+ via OpenRouter | ✅ | ❌ Single vendor | ❌ |
| Model per mode | ✅ Recommendations | ❌ | ❌ | ❌ |
| Open source models | ✅ Full support | ✅ | ❌ | ❌ |

---

### Implementation Priority

**Do First (High Impact, Low Effort):**

| Feature | Timeline |
|---------|----------|
| Command palette (⌘K) | 1 week |
| Keyboard shortcuts | 1 week |
| Share links with state | 1 week |
| Skeleton loading states | 3 days |
| Debug templates | 1 week |
| Mode switcher UI (⌘.) | 1 week |
| Ask mode (read-only) | 1 week |
| OpenRouter integration (MVP AI) | 1 week |
| BYOK settings UI | 1 week |

**Plan Carefully (High Impact, High Effort):**

| Feature | Timeline |
|---------|----------|
| Agent architecture | 4-6 weeks |
| Agent mode with planning | 3-4 weeks |
| Debug mode with waveform integration | 4-6 weeks |
| Model recommendations per mode | 2-3 weeks |
| Real-time collaboration | 6-8 weeks |
| Background agents | 3-4 weeks |
| Composable blocks | 4-6 weeks |

---

### Competitive Differentiation Summary

**vs. Enterprise EDA (Cadence, Synopsys, Siemens):**

| Etna Advantage | Their Limitation |
|----------------|------------------|
| ⌘K command palette | Menu-driven, mouse-heavy |
| Streaming AI chat | Batch responses |
| Instant onboarding | Weeks of procurement |
| Multi-model AI + BYOK | Single locked-in AI provider |
| Keyboard-first | Click-heavy interfaces |
| 4-mode system (Ask/Agent/Debug/Manual) | Single monolithic interface |

**vs. AI Startups (ChipAgents):**

| Etna Advantage | Their Limitation |
|----------------|------------------|
| Conversational-first | Agent-specific tools |
| Self-service free tier | Sales-required |
| Consumer-grade UX | Enterprise B2B UX |
| Transparent pricing | Opaque pricing |
| BYOK (Bring Your Own Key) | Locked to their AI provider |
| Cursor-style interaction modes | No mode system |

**vs. Open Source (GTKWave, Surfer):**

| Etna Advantage | Their Limitation |
|----------------|------------------|
| AI-native with model choice | No AI |
| Zero setup | Installation required |
| Collaboration | Single-user |
| Managed hosting | Self-hosted |
| Debug mode with waveform AI | Manual waveform analysis |

**vs. Cursor (AI Code Editors):**

| Etna Advantage | Cursor's Limitation |
|----------------|---------------------|
| Silicon/RTL domain expertise | General-purpose coding |
| Waveform integration in Debug mode | No waveform support |
| Protocol-aware (AXI, APB, etc.) | No hardware protocol knowledge |
| Testbench & assertion generation | Software-focused generation |

---

### North Star Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Time to First Debug** | <2 minutes | Frictionless onboarding |
| **AI Queries per Session** | 5+ | Users find AI valuable |
| **Sessions per Week** | 3+ per active user | Habit formation |
| **Share Rate** | 10% of sessions | Viral growth |
| **Upgrade Rate** | 5% free → paid | Business sustainability |

---

## Document History

| Date | Version | Changes |
|------|---------|---------|
| January 2026 | 1.0 | Initial competitor benchmarking |
| January 2026 | 1.1 | Added differentiation strategy from disruptive SaaS leaders |
| January 2026 | 1.2 | Added 4-mode interaction system (Ask, Agent, Debug, Manual) |
| January 2026 | 1.3 | Added BYOK & multi-model support strategy |

---

*This document should be reviewed quarterly and updated when significant competitive changes occur.*
