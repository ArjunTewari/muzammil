# Maestro — CEO/Founder Dashboard Demo

Interactive demo of the Maestro business operating system for ZiWorks Advertising. A visual command center for the CEO/founder role.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

```bash
vercel deploy
```

No env vars required. No config edits needed. Standard Next.js App Router project.

```bash
# Or link to a Vercel project first, then deploy to production:
vercel link
vercel deploy --prod
```

## Views

- **Overview** (`/overview`) — CEO command center: 5 headline metrics, revenue chart, project health, pipeline, collections, approvals, client health, opportunity alerts
- **Projects** (`/projects`) — Axis MF Retirement Reel IP: Campaign Architect output, workflow tracker, deliverables, activity log
- **Clients / Finance / Settings** — Placeholder (next sprint)

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Recharts · lucide-react
