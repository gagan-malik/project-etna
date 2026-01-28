# Project Etna - Product Roadmap

## Current State

### Implemented Features ✅
- AI-powered chat with silicon debugging prompts
- RTL file parsing (Verilog, SystemVerilog, VHDL)
- Design file viewer with syntax highlighting
- Module hierarchy visualization
- Debug session management
- User authentication
- Multi-model AI support (OpenAI, Gemini, DeepSeek, Llama)
- **Waveform file viewing (Surfer integration)** ← NEW
- **VCD/FST/GHW file upload and storage** ← NEW

### Missing for Complete Debug Workflow ❌
- Signal correlation (RTL ↔ waveform)
- Register semantic understanding (access types, reset values)
- Testplan/coverage integration

---

## Roadmap

### Phase 1: MVP Waveform Support ✅ COMPLETED (January 2026)

**Goal:** Basic waveform viewing to complete the debug workflow

#### 1.1 File Upload Infrastructure ✅
- [x] Add waveform file upload endpoint (`/api/waveforms/upload`)
- [x] Store files in Vercel Blob
- [x] File type validation (VCD, FST, GHW)
- [x] File size limits (25 MB free, 200 MB pro, 500 MB team)
- [x] Associate waveforms with debug sessions

#### 1.2 Surfer Integration ✅
- [x] Embed Surfer viewer via iframe (app.surfer-project.org)
- [x] Pass Vercel Blob URLs to Surfer
- [x] Basic UI for waveform file selection (`/waveforms` page)
- [x] Link waveforms to debug sessions
- [x] postMessage API for viewer control
- [x] Collapsible waveform panel component

#### 1.3 Database Schema Updates ✅
- [x] Created `waveform_files` table
- [x] Added `waveformFileId` to `debug_sessions`
- [x] Migration applied: `20260128000000_add_waveform_files`

#### Implementation Details

**Files Created:**
```
components/waveform/
├── surfer-viewer.tsx      # Surfer iframe with postMessage API
├── waveform-uploader.tsx  # Drag-and-drop upload component
├── waveform-panel.tsx     # Collapsible panel for debug flow
└── index.ts               # Barrel exports

app/waveforms/
└── page.tsx               # Waveform management UI

app/api/waveforms/
├── route.ts               # GET/DELETE waveforms
└── upload/route.ts        # POST upload to Vercel Blob

public/surfer/
└── README.md              # Self-hosted WASM setup guide

prisma/migrations/20260128000000_add_waveform_files/
└── migration.sql          # Database migration
```

**Pricing Limits Implemented:**
| Plan | File Size | File Count | Formats |
|------|-----------|------------|---------|
| Free | 25 MB | 5 files | VCD only |
| Pro | 200 MB | 50 files | VCD + FST |
| Team | 500 MB | Unlimited | All |

### Phase 2: Enhanced Integration

**Goal:** Deeper integration between waveforms, RTL, and AI

#### 2.1 Host Surfer WASM
- [ ] Download Surfer WASM build
- [ ] Host in `/public/surfer/`
- [ ] Implement postMessage API communication
- [ ] Custom Etna-branded UI wrapper

#### 2.2 Signal-RTL Correlation
- [ ] Extract signal names from waveform files
- [ ] Match signals to RTL module/port definitions
- [ ] Highlight correlated signals in both viewers
- [ ] "Jump to signal" from RTL to waveform

#### 2.3 AI Waveform Awareness
- [ ] Include signal list in AI context
- [ ] AI can reference specific time ranges
- [ ] AI can suggest signals to examine
- [ ] Natural language waveform queries ("show me when data_valid goes high")

#### 2.4 OpenTitan Integration - Quick Wins
> See [OPENTITAN_INTEGRATION.md](./OPENTITAN_INTEGRATION.md) for details

- [ ] Add `hjson` npm package for parsing
- [ ] Parse register access types (rw, ro, rw1c, wo, etc.)
- [ ] Add register semantics to AI prompts
- [ ] Store UVM templates as prompt context for testbench generation
- [ ] Add hardware access type understanding (hro, hrw, hwo)

### Phase 3: Advanced Features

**Goal:** Professional-grade debugging capabilities

#### 3.1 Waveform Analysis
- [ ] Automatic protocol detection (AXI, APB, etc.)
- [ ] Timing violation detection
- [ ] Clock domain crossing analysis
- [ ] Signal comparison (golden vs. actual)

#### 3.2 Collaboration
- [ ] Shared debug sessions
- [ ] Waveform annotations
- [ ] Comment threads on specific signals/times
- [ ] Export debug reports

#### 3.3 CI/CD Integration
- [ ] API for automated waveform uploads
- [ ] Regression comparison
- [ ] Automated bug detection
- [ ] GitHub/GitLab integration

#### 3.4 OpenTitan Integration - Medium Term
> See [OPENTITAN_INTEGRATION.md](./OPENTITAN_INTEGRATION.md) for details

- [ ] Full Hjson register file parser (`lib/design-files/hjson-parser.ts`)
- [ ] Testplan file support (DVSim format)
- [ ] Index OpenTitan DV methodology docs for RAG
- [ ] CSR exclusion tag parsing and display
- [ ] FPV assertion pattern library for AI generation
- [ ] Shadow register understanding for AI context

### Phase 4: Enterprise Features

**Goal:** Support large-scale verification workflows

#### 4.1 Server Mode (Infrastructure Addition)
- [ ] Deploy Surfer server on Fly.io/Railway
- [ ] Streaming for large files (500MB+)
- [ ] FST format full support
- [ ] No file size limits

#### 4.2 Enterprise Security
- [ ] SSO/SAML integration
- [ ] On-premise deployment option
- [ ] Audit logging
- [ ] Data retention policies

#### 4.3 Custom AI
- [ ] Fine-tuned models for specific designs
- [ ] RAG over internal documentation
- [ ] Custom assertion generation
- [ ] Integration with formal verification tools

#### 4.4 OpenTitan Integration - Deep
> See [OPENTITAN_INTEGRATION.md](./OPENTITAN_INTEGRATION.md) for details

- [ ] reggen output parsing (auto-generated RTL/headers)
- [ ] Full IP documentation structure indexing
- [ ] UVM testbench auto-generation (uvmdvgen patterns)
- [ ] Formal verification integration (fpvgen patterns)
- [ ] Custom AI training on DV methodology corpus

---

## Technical Dependencies

### npm Packages to Add

```bash
# Phase 1 - Basic VCD support
npm install vcd-stream        # VCD parsing

# Phase 2 - Enhanced features  
npm install wavedrom          # Timing diagram generation
npm install hjson             # Hjson parsing (OpenTitan register files)

# Optional - lightweight fallback
npm install @aspect/vcd-parser  # Alternative VCD parser
```

### External Services

| Phase | Service | Purpose |
|-------|---------|---------|
| 1 | Vercel Blob | Waveform file storage |
| 1 | app.surfer-project.org | iframe waveform viewing |
| 4 | Fly.io / Railway | Surfer server hosting |

### Surfer Resources

- **WASM Build**: `https://gitlab.com/surfer-project/surfer/-/jobs/artifacts/main/download?job=pages_build`
- **Documentation**: `https://docs.surfer-project.org/book/`
- **API Reference**: `surfer/assets/integration.js` in Surfer repo

---

## Success Metrics

### Phase 1 (MVP)
- Users can upload and view VCD files
- 50+ debug sessions with waveforms created
- < 5s load time for 10MB VCD

### Phase 2
- Average session includes both RTL + waveform
- AI references signals in 30%+ of responses
- Signal correlation accuracy > 90%

### Phase 3
- 10+ team accounts active
- CI/CD integration used by 5+ teams
- Protocol detection accuracy > 85%

### Phase 4
- Enterprise contracts signed
- Files > 500MB successfully handled
- On-prem deployment completed

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Surfer WASM breaks | Fallback to iframe + JS VCD parser |
| File size limits too restrictive | Early enterprise outreach |
| Performance issues with large files | Implement pagination/streaming |
| Surfer project abandoned | Fork and maintain, or switch to vcdrom |

---

## References

### Waveform & Visualization
- [Surfer Project](https://surfer-project.org/)
- [Surfer GitLab](https://gitlab.com/surfer-project/surfer)
- [WaveDrom VCD Parser](https://github.com/wavedrom/vcd)

### OpenTitan Resources
- [OpenTitan GitHub](https://github.com/lowRISC/opentitan)
- [OpenTitan Documentation](https://opentitan.org/book/)
- [Register Tool (reggen)](https://opentitan.org/book/util/reggen/index.html)
- [DVSim](https://opentitan.org/book/util/dvsim/index.html)
- [uvmdvgen](https://opentitan.org/book/util/uvmdvgen/index.html)
- [fpvgen](https://opentitan.org/book/util/fpvgen/index.html)
- [DV Methodology](https://opentitan.org/book/doc/contributing/dv/methodology/index.html)

### Other Tools
- [Hardware Agent (hagent)](https://github.com/masc-ucsc/hagent)
- [Verible SystemVerilog Tools](https://chipsalliance.github.io/verible/)
