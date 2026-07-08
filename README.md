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
- **Clients** — every client with its status and the agents on the account; open a client to see its work **divided task-by-task across the agents**, plus that client's invoices
- **Finance** — revenue, collections and billing, kept **in sync with Sneha (Finance Manager)** — her live finance queue is shown here with a link into her dashboard
- **Web & Social** — website management (uptime, traffic, pending updates), social channels (followers, growth, engagement, approvals) and a content calendar
- **Projects**, **Settings**

Every dashboard opens with an **AI · Recommended Next Steps** panel — prioritised (urgent / recommended / opportunity) actions generated from the live workspace state.

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
- `lib/operator-data.ts` — each operator's tasks, dependencies, handoffs, time breakdown, AI next steps
- `lib/mock-data.ts` — company-wide clients, projects, leads, revenue, invoices
- `lib/client-tasks.ts` — aggregates operator tasks per client (powers the Clients view)
- `lib/digital-data.ts` — websites, social channels, content calendar (Web & Social)
- `lib/ai-insights.ts` — AI "next step" recommendations per view
- `lib/nav.ts` — per-role navigation + route access

Everything is mock data with `// TODO: replace with GET /api/...`-style structure so it can later be swapped for real API calls.
