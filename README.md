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
- **Overview** — CEO command center: headline metrics, revenue, "what your team is shipping", project health, pipeline, collections, approvals, client health, opportunity alerts
- **The Architect** — a **thinking agent** that interviews you to spin up a new project (see below)
- **Team** — the agent suite + a card per employee showing their campaign and agent progress. Open any employee to see their full agent workspace.
- **Clients** — every client with its owning employee and agent progress; open a client to see the agent pipeline running that campaign, plus invoices
- **Finance** — revenue, collections and billing, run by the **Finance Agent** across every campaign
- **Web & Social** — website management, social channels, and a content calendar
- **Memory** — everything the system has learned (see below)
- **Projects**, **Settings**

Each employee runs a full client campaign end-to-end through the **agent suite** (Brief Decoder → Researcher → Copywriter → Compliance Guardian → Client Liaison → Finance Tracker, orchestrated by the Master Agent). Every dashboard opens with an **AI · Recommended Next Steps** panel.

## The Architect (thinking agent) + learning memory

Click **New Project**. The Architect interviews Muzammil one question at a time, tracking a live checklist of what it knows, showing its reasoning each turn, and **deciding for itself** when it has enough — then it writes a structured brief, suggests the least-loaded capable owner, and (on approval) drops the project onto that employee's dashboard with the verbatim instructions attached.

**It is a real agent, not a one-shot LLM call:**
- **Extended thinking** on every turn (`app/api/architect/route.ts` → Anthropic Messages API), so it reasons before it speaks.
- A forced-schema `architect_turn` decision each turn: `reasoningSummary`, `updatedSlots`, and `ask` vs `finalize`.
- Explicit interview state, a stopping rule, and a hard finalize by turn 8 with assumptions listed.

**Memory learns from two sources** and is injected into every future interview (`lib/memory-store.ts`):
1. **Muzammil's instructions** (captured verbatim from interviews).
2. **Every approval / correction, with the reason why** — approve or flag any agent step in a workspace, or revise a brief with a reason, and it becomes a weighted memory (corrections outrank approvals). Browse it all under **Memory**.

### Why Anthropic API and not SageMaker

SageMaker's no-code (Canvas) is AutoML for tabular/forecasting and model hosting — it does **not** orchestrate a multi-turn thinking agent, so you'd still build all the interview/memory/stopping logic yourself, on top of an always-on GPU endpoint and weaker models. The "thinking" comes from the **agent design** here, not the hosting. The AWS-native path for agents is **Amazon Bedrock** (the same Claude models); this route is written so the transport can be swapped Anthropic ↔ Bedrock in ~20 lines if a BFSI client later needs AWS residency.

## Environment

The demo runs with **no keys** — the Architect falls back to a deterministic simulation (flagged "Simulation" in the UI) so it never breaks. To make it a live thinking agent, add on Vercel (Project → Settings → Environment Variables):

```
ANTHROPIC_API_KEY = sk-ant-...        # required for the live agent
MAESTRO_MODEL      = claude-sonnet-5  # optional, this is the default
```

**Operators** each see **My Work** — their personal dashboard:
- Hours this month vs typical, time saved, completed, active
- Active task queue (with priority, status, blockers)
- Where their time goes (breakdown bars)
- Waiting-on-others and their own handoffs downstream
- A per-person note on how Maestro helps them

Operators are restricted to their own routes; master-only pages redirect them back to My Work.

## Deploy to Vercel

Standard Next.js App Router project. Deploy as usual, then add `ANTHROPIC_API_KEY` in the project's Environment Variables (see **Environment** above) to enable the live Architect. Without it, everything still works in simulation mode.

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Recharts · lucide-react · Anthropic Messages API (extended thinking)

## How it's wired

- `lib/users.ts` — the 7 accounts (1 master + 6 employees), roles, credentials
- `lib/agents.ts` — the 6-agent suite + Master Agent
- `lib/employee-projects.ts` — each employee's campaign + per-agent state, memory, activity
- `lib/architect/` — the thinking-agent types, system prompt, and simulation fallback
- `app/api/architect/route.ts` — the agent loop (Anthropic API + fallbacks)
- `lib/memory-store.ts` — the learning memory (instructions + approvals/corrections)
- `lib/project-store.ts` — briefs assigned to employees + workload signal
- `lib/mock-data.ts` — company-wide clients, projects, leads, revenue, invoices
- `lib/digital-data.ts` — websites, social channels, content calendar
- `lib/ai-insights.ts` — AI "next step" recommendations per view
- `lib/nav.ts` — per-role navigation + route access

Memory and assigned projects use `localStorage` for the demo (documented in-file as swap-for-DB later). Everything else is mock data with `// TODO: replace with GET /api/...` markers.

## Out of scope (next steps)

Real DB + cross-device memory sync · SSE streaming of the agent's turns · Bedrock transport (designed swap-ready) · production auth hardening.
