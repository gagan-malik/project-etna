# Project Etna

A modern AI chat application built with Next.js, Prisma, and multiple AI providers.

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

**[View Full Documentation](https://gaganmalik.github.io/project-etna/)** - Comprehensive guides and API reference

Quick links:
- [Getting Started](https://gaganmalik.github.io/project-etna/getting-started) - Installation guide
- [API Reference](https://gaganmalik.github.io/project-etna/api/) - Complete API docs
- [Features](https://gaganmalik.github.io/project-etna/features) - Feature overview
- [Roadmap](https://gaganmalik.github.io/project-etna/roadmap) - What's coming next

Local docs:
- [SETUP.md](./SETUP.md) - Complete setup guide
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database configuration
- [DEPENDENCIES.md](./DEPENDENCIES.md) - Installed dependencies
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Development roadmap

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.7
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Auth.js v5 (NextAuth.js beta)
- **AI Models:** OpenAI, Google Gemini, DeepSeek, Llama
- **UI:** Shadcn UI + Tailwind CSS
- **Vector Search:** pgvector
- **Storage:** Vercel Blob

## 📦 Project Etna

A modern AI-powered chat application built with Next.js, React, TypeScript, and shadcn/ui.

## Features

- 🤖 AI Chat Interface - Interactive chat with AI models
- 📜 History - View and manage chat history
- ⚙️ Settings - Comprehensive settings with sidebar navigation
- 🌓 Dark Mode - System-aware theme switching
- 📱 Responsive Design - Works on all devices
- 🎨 Modern UI - Built with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Theme**: next-themes for dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:3000

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
  ├── chat/          # Main chat interface
  ├── activity/      # History page
  ├── settings/      # Settings page with sidebar-13
  ├── login/         # Login page (login-04)
  └── signup/        # Signup page

components/
  ├── app-sidebar.tsx    # Main application sidebar
  ├── sidebar-layout.tsx # Sidebar layout wrapper
  └── ui/                # shadcn/ui components
```

## Available Routes

- `/` - Redirects to `/chat`
- `/chat` - Main chat interface
- `/activity` - Chat history
- `/settings` - Settings page
- `/login` - Login page
- `/signup` - Signup page

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
