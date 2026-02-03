# Project Etna

A modern AI-powered silicon debug assistant built with Next.js, Prisma, and multiple AI providers. Helps verification engineers debug RTL designs with AI chat, waveform viewing, and integrated tooling.

## 🚀 Quick Start

**New to this? Start here! 👇**

1. **📖 [STEP_BY_STEP.md](./STEP_BY_STEP.md)** - Super simple guide (like you're 10!)
2. **⚡ [QUICK_START.md](./QUICK_START.md)** - Fast 5-minute setup
3. **📚 [DATABASE_SETUP_SIMPLE.md](./DATABASE_SETUP_SIMPLE.md)** - Detailed database guide

**Or use the automated script:**
```bash
./scripts/setup-database.sh
```

## 📋 Next Steps

See [NEXT_STEPS.md](./NEXT_STEPS.md) for the development roadmap.

## 📚 Documentation

**[View Full Documentation](https://gaganmalik.github.io/project-etna/)** — Comprehensive guides and API reference

Quick links:
- [Getting Started](https://gaganmalik.github.io/project-etna/getting-started) - Installation guide
- [Soul Document](https://gaganmalik.github.io/project-etna/soul-doc) - Project values and priorities
- [API Reference](https://gaganmalik.github.io/project-etna/api/) - Complete API docs
- [Features](https://gaganmalik.github.io/project-etna/features) - Feature overview
- [Roadmap](https://gaganmalik.github.io/project-etna/roadmap) - What's coming next

Local docs:
- [docs/soul-doc.md](./docs/soul-doc.md) - Soul Document (values, priorities)
- [SETUP.md](./SETUP.md) - Complete setup guide
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database configuration
- [DEPENDENCIES.md](./DEPENDENCIES.md) - Installed dependencies
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Development roadmap

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL + Prisma ORM, pgvector |
| **Auth** | Auth.js v5 (NextAuth.js beta) |
| **AI** | OpenAI, Google Gemini, DeepSeek, Llama |
| **UI** | shadcn/ui (Maia style, neutral theme), Tailwind CSS, next-themes |
| **Storage** | Vercel Blob |

## ✨ Features

- 🤖 **AI Chat** — Multi-model chat (OpenAI, Gemini, DeepSeek, Llama) with streaming
- 📜 **Activity** — Chat and session history
- 📁 **Files** — Upload and manage design files (Verilog, SystemVerilog, VHDL)
- 📊 **Waveforms** — Surfer-based viewer for VCD, FST, GHW
- 🔗 **Integrations** — GitHub, Confluence, Microsoft Graph
- ⚙️ **Settings** — Sidebar settings, account, billing
- 🌓 **Dark mode** — System-aware theme (next-themes)
- 📱 **Responsive** — Works on desktop, tablet, and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (or Neon/Supabase)

### Installation

```bash
npm install
cp .env.example .env.local   # then edit with your keys
./scripts/setup-database.sh   # or: npx prisma generate && npx prisma db push
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
  ├── chat/          # Main AI chat interface
  ├── activity/      # History / activity
  ├── overview/      # Dashboard overview
  ├── files/         # Design file management
  ├── waveforms/     # Waveform viewer
  ├── integrations/  # GitHub, Confluence, etc.
  ├── settings/      # Settings (sidebar)
  ├── billing/       # Billing / subscription
  ├── account/       # Account management
  ├── login/         # Login
  └── signup/        # Signup

components/
  ├── app-sidebar.tsx    # Main application sidebar
  ├── sidebar-layout.tsx # Sidebar layout wrapper
  ├── chat/              # Chat UI (messages, model selector, etc.)
  ├── waveform/         # Waveform panel & Surfer viewer
  └── ui/                # shadcn/ui components
```

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Redirects to app (e.g. overview or chat) |
| `/chat` | Main AI chat interface |
| `/overview` | Dashboard overview |
| `/activity` | Chat and session history |
| `/files` | Design file management |
| `/waveforms` | Waveform viewer |
| `/integrations` | Integrations (GitHub, Confluence, etc.) |
| `/settings` | Settings page (includes Account, Billing & Invoices) |
| `/login` | Login |
| `/signup` | Sign up |

## ⏰ Cron Jobs & Slack Alerts

The project includes a health monitoring system that sends alerts to Slack.

### Configuration

1. **Set up Slack Webhook** - Add to your `.env.local`:
   ```bash
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

2. **Set Cron Secret** (optional, for production security):
   ```bash
   CRON_SECRET=your-secret-here
   ```

### Triggering Alerts

**Locally (dev server running):**
```bash
curl http://localhost:3000/api/cron/health
```

**On Vercel (production):**
- Automatically runs every 6 hours via Vercel Cron (configured in `vercel.json`)
- Manual trigger: `curl https://your-app.vercel.app/api/cron/health`

**Without Vercel (alternative methods):**
- **System crontab:**
  ```bash
  # Add to crontab -e (runs every 6 hours)
  0 */6 * * * curl -s https://your-app.com/api/cron/health
  ```
- **GitHub Actions** - Schedule workflows to hit the endpoint
- **External cron services** - cron-job.org, EasyCron, etc.

### Health Check Response

```json
{
  "success": true,
  "healthy": true,
  "checks": {
    "Database": "Healthy",
    "Environment": "production",
    "Timestamp": "2026-01-28T13:21:47.889Z"
  },
  "duration": "318ms"
}
```

### Slack Alert Functions

Available in `lib/slack.ts`:
- `sendSlackMessage()` - Send custom messages
- `sendCronAlert()` - Send cron job notifications (started/completed/failed)
- `sendErrorAlert()` - Send error notifications

## License

MIT
