# Changelog

All notable changes to Project Etna will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Settings UI** – Full-page settings at `/settings` with sidebar nav, search, and panels (General, Agents, Rules, Hooks, Models, Network, etc.). Centered content (`max-w-2xl mx-auto`) and full-width scrollable pane.
- **Shared layout components** – `PageTitle` (sticky page header) and `PageSection` (muted section block) in `components/ui/` for consistent page layout across the app.
- **Consistent page layout** – Compact spacing (`px-5 py-5`, `space-y-6`), sticky titles, and muted sections applied to Overview, Account, Billing, Activity, Files, Integrations, Waveforms, and Test API pages; docs-app doc page uses compact title and spacing.

### Changed
- **Settings pane** – Layout uses full width (`w-full`) so the scrollbar sits at the right edge; panel content is centered with `max-w-2xl mx-auto`.
- **Docs app** – Doc page uses `text-xl` title, `px-5 py-5`, and `mt-6` for body.

## [0.2.0] - 2026-01-28

### Added - Waveform Viewer Integration (Phase 1 Complete)

#### Surfer Waveform Viewer
- Integrated [Surfer](https://surfer-project.org/) waveform viewer via iframe
- Support for VCD, FST, and GHW waveform file formats
- postMessage API for programmatic viewer control
- Fullscreen mode and external link options

#### Waveform File Management
- New `/waveforms` page for managing waveform files
- Drag-and-drop file upload with progress indicator
- File size validation based on user plan tier
- Waveform file list with metadata display

#### API Endpoints
- `POST /api/waveforms/upload` - Upload waveform files to Vercel Blob
- `GET /api/waveforms` - List user's waveform files
- `DELETE /api/waveforms?id=` - Delete a waveform file

#### Database
- New `waveform_files` table for storing waveform metadata
- Added `waveformFileId` foreign key to `debug_sessions`
- Migration: `20260128000000_add_waveform_files`

#### Components
- `SurferViewer` - Surfer iframe wrapper with controls
- `WaveformUploader` - Drag-and-drop upload component
- `WaveformPanel` - Collapsible panel for debug sessions
- `useSurferControls` - Hook for programmatic Surfer control

#### Pricing Tiers
- Free: 25 MB max file size, 5 files, VCD only
- Pro: 200 MB max file size, 50 files, VCD + FST
- Team: 500 MB max file size, unlimited files, all formats

#### UI Updates
- Added "Waveforms" link to sidebar navigation
- Added `alert-dialog` UI component

### Technical Details
- Uses Vercel Blob for file storage
- Surfer hosted mode (app.surfer-project.org) - no WASM build required
- Self-hosted WASM setup documented in `/public/surfer/README.md`

---

## [0.1.0] - 2025-12-05

### Added - Initial Release
- AI-powered chat with silicon debugging prompts
- RTL file parsing (Verilog, SystemVerilog, VHDL)
- Design file viewer with syntax highlighting
- Module hierarchy visualization
- Debug session management
- User authentication (NextAuth.js)
- Multi-model AI support (OpenAI, Gemini, DeepSeek, Llama)
- Vercel deployment configuration
- Prisma database schema with Neon PostgreSQL
