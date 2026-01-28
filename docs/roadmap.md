---
layout: default
title: Roadmap
nav_order: 5
description: "Project Etna development roadmap and planned features"
---

# Product Roadmap
{: .no_toc }

What's been built and what's coming next.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Current Status

{: .highlight }
**Phase 1 (MVP Waveform Support) is COMPLETE** - January 2026

### Implemented Features ✅

| Feature | Description |
|:--------|:------------|
| AI Chat | Silicon debugging prompts with multi-model support |
| RTL Parsing | Verilog, SystemVerilog, VHDL file support |
| Design Viewer | Syntax highlighting and module hierarchy |
| Debug Sessions | Session management and organization |
| Authentication | User accounts with secure sessions |
| Waveform Viewing | Surfer integration for VCD/FST/GHW files |
| File Upload | Vercel Blob storage with tiered limits |

### Missing for Complete Debug Workflow

- Signal correlation (RTL ↔ waveform)
- Register semantic understanding
- Testplan/coverage integration

---

## Phase 1: MVP Waveform Support ✅
{: .d-inline-block }

Complete
{: .label .label-green }

**Goal:** Basic waveform viewing to complete the debug workflow

### 1.1 File Upload Infrastructure ✅

- Waveform file upload endpoint (`/api/waveforms/upload`)
- Vercel Blob storage integration
- File type validation (VCD, FST, GHW)
- Tiered file size limits

### 1.2 Surfer Integration ✅

- Embedded Surfer viewer via iframe
- Vercel Blob URL passthrough
- Waveform file selection UI
- PostMessage API for viewer control
- Collapsible waveform panel

### 1.3 Database Updates ✅

- `waveform_files` table
- Debug session linking
- Migration applied

---

## Phase 2: Enhanced Integration
{: .d-inline-block }

In Progress
{: .label .label-yellow }

**Goal:** Deeper integration between waveforms, RTL, and AI

### 2.1 Self-Hosted Surfer WASM

- [ ] Download Surfer WASM build
- [ ] Host in `/public/surfer/`
- [ ] Full postMessage API communication
- [ ] Custom Etna-branded UI wrapper

### 2.2 Signal-RTL Correlation

- [ ] Extract signal names from waveform files
- [ ] Match signals to RTL module/port definitions
- [ ] Highlight correlated signals in both viewers
- [ ] "Jump to signal" navigation

### 2.3 AI Waveform Awareness

- [ ] Include signal list in AI context
- [ ] AI references specific time ranges
- [ ] Natural language waveform queries
- [ ] Smart signal suggestions

### 2.4 OpenTitan Integration - Quick Wins

- [ ] Hjson register file parsing
- [ ] Register access type semantics (rw, ro, rw1c)
- [ ] UVM template context for testbench generation

---

## Phase 3: Advanced Features
{: .d-inline-block }

Planned
{: .label .label-blue }

**Goal:** Professional-grade debugging capabilities

### 3.1 Waveform Analysis

- Automatic protocol detection (AXI, APB, etc.)
- Timing violation detection
- Clock domain crossing analysis
- Golden vs. actual comparison

### 3.2 Collaboration

- Shared debug sessions
- Waveform annotations
- Comment threads on signals/times
- Debug report export

### 3.3 CI/CD Integration

- API for automated waveform uploads
- Regression comparison
- Automated bug detection
- GitHub/GitLab integration

---

## Phase 4: Enterprise Features
{: .d-inline-block }

Future
{: .label .label-purple }

**Goal:** Support large-scale verification workflows

### 4.1 Server Mode

- Dedicated Surfer server deployment
- Streaming for large files (500MB+)
- Full FST format support
- No file size limits

### 4.2 Enterprise Security

- SSO/SAML integration
- On-premise deployment option
- Audit logging
- Data retention policies

### 4.3 Custom AI

- Fine-tuned models for specific designs
- RAG over internal documentation
- Custom assertion generation
- Formal verification integration

---

## Success Metrics

### Phase 1 (MVP) ✅
- Users can upload and view VCD files
- 50+ debug sessions with waveforms created
- < 5s load time for 10MB VCD

### Phase 2
- Average session includes both RTL + waveform
- AI references signals in 30%+ of responses
- Signal correlation accuracy > 90%

### Phase 3
- 10+ team accounts active
- CI/CD integration by 5+ teams
- Protocol detection accuracy > 85%

### Phase 4
- Enterprise contracts signed
- Files > 500MB successfully handled
- On-prem deployment completed

---

## Risk Mitigation

| Risk | Mitigation |
|:-----|:-----------|
| Surfer WASM breaks | Fallback to iframe + JS VCD parser |
| File size limits too restrictive | Early enterprise outreach |
| Performance with large files | Implement pagination/streaming |
| Surfer project abandoned | Fork and maintain, or switch to vcdrom |

---

## References

### Waveform & Visualization
- [Surfer Project](https://surfer-project.org/)
- [WaveDrom VCD Parser](https://github.com/wavedrom/vcd)

### OpenTitan
- [OpenTitan GitHub](https://github.com/lowRISC/opentitan)
- [Register Tool (reggen)](https://opentitan.org/book/util/reggen/index.html)
- [DV Methodology](https://opentitan.org/book/doc/contributing/dv/methodology/index.html)
