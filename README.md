# Project Etna

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

## License

MIT
