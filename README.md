# Maestro — ZiWorks Operating System (Demo)

Interactive demo of Maestro, the internal business operating system for ZiWorks Advertising (a BFSI marketing agency). Role-based dashboards for the founder and every operator in the delivery pipeline.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000  (redirects to /login)
```

## Demo Accounts

Sign in at `/login`. On the login screen you can **tap any account to auto-fill** the credentials.

| Name | Role | Username | Password | Lands on |
|------|------|----------|----------|----------|
| **Muzammil Rashid** | Founder & CEO (master) | `muzammil` | `maestro2026` | Overview + Team |
| Priya Mehta | Account Manager | `priya` | `ziworks123` | My Work |
| Rohan Sharma | Research Analyst | `rohan` | `ziworks123` | My Work |
| Divya Nair | Creative Lead | `divya` | `ziworks123` | My Work |
| Arjit Singh | Compliance Officer | `arjit` | `ziworks123` | My Work |
| Sneha Patel | Finance Manager | `sneha` | `ziworks123` | My Work |
| Karan Malhotra | Content & Production | `karan` | `ziworks123` | My Work |

> Auth is a client-side demo (localStorage). No real backend, no server-side sessions — safe to deploy as a static/edge app.

## Roles & Views

**Master (Muzammil)** sees the whole company:
- **Overview** — CEO command center: headline metrics, revenue, project health, pipeline, collections, approvals, client health, opportunity alerts
- **Team** — the delivery pipeline (Account → Research → Creative → Compliance → Production, with Finance alongside) plus a card per operator. Click any operator to open their full dashboard.
- **Projects**, **Clients**, **Finance**, **Settings**

**Operators** each see **My Work** — their personal dashboard:
- Hours this month vs typical, time saved, completed, active
- Active task queue (with priority, status, blockers)
- Where their time goes (breakdown bars)
- Waiting-on-others and their own handoffs downstream
- A per-person note on how Maestro helps them

Operators are restricted to their own routes; master-only pages redirect them back to My Work.

## Deploy to Vercel

```bash
vercel deploy          # preview
vercel deploy --prod   # production
```

No env vars. No config edits. Standard Next.js App Router project.

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Recharts · lucide-react

## How the demo data is wired

- `lib/users.ts` — the 7 accounts (1 master + 6 operators), roles, credentials
- `lib/operator-data.ts` — each operator's tasks, dependencies, handoffs, time breakdown
- `lib/mock-data.ts` — company-wide clients, projects, leads, revenue, invoices
- `lib/nav.ts` — per-role navigation + route access

Everything is mock data with `// TODO: replace with GET /api/...`-style structure so it can later be swapped for real API calls.
