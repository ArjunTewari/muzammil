# Maestro — ZiWorks agent platform

Maestro is a human-controlled marketing operations platform. The existing Next.js dashboard remains on Vercel; a Python control service owns CRM data and approval state on Google Cloud; Google ADK specialists execute one authorized stage at a time on Vertex AI Agent Engine.

## Production architecture

- **Vercel / Next.js 16:** dashboard, secure HTTP-only session cookies, and the `/api/v1` server gateway.
- **Cloud Run / FastAPI:** CRM, onboarding, uploads, calibrations, runs, approvals, memory governance, audit records, metrics, and vault synchronization.
- **Vertex AI Agent Engine:** Architect → Researcher → Copywriter → Compliance Guardian. Production failures remain visible; the old Architect simulation is not a fallback for this workflow.
- **Cloud SQL PostgreSQL + pgvector:** source of truth for operational data, agent versions, artifacts, approvals, and approved memory.
- **Memory Bank:** semantic copy of approved memory. PostgreSQL remains authoritative if this preview service is unavailable.
- **Private Git-backed Obsidian vault:** a sanitized Markdown mirror of owner-approved knowledge. Incoming vault edits are proposals only.
- **Cloud Tasks, Pub/Sub, Storage, Secret Manager:** retryable execution, events, training files, and secrets.

Every stage pauses at `awaiting_owner`. Version 1 has no tools that publish, send, invoice, or mutate third-party systems.

## Local dashboard

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local`. With no control-service URL, development login remains available for local UI work only. Production returns an error instead of falling back to demo authentication.

## MVP wedge — Agent Studio (`/studio`)

A **self-contained**, ship-today slice built to prove instant value to the owner (no control service required). Muzammil **builds a trainable agent himself**: he defines its **goal, task, and rules**, then runs inputs, checks the result, and corrects it — corrections and rules become per-agent memory injected into every future run, so it visibly gets smarter. A live counter (runs · risks caught · time saved) makes the ROI obvious. It ships seeded with a ready-to-use **SEBI & AMFI Compliance Guardian**, but agents aren't fixed to any preset roles.

- **Runtime:** `app/api/studio/run/route.ts` calls the Anthropic Messages API directly with **extended thinking** (mirrors `/api/architect`); falls back to a deterministic BFSI red-flag simulation when `ANTHROPIC_API_KEY` is absent, so the demo never breaks.
- **State:** `lib/studio/*` on `localStorage` for the demo — shapes are forward-compatible with the control service's agent-scoped memory (`PlatformMemory.scope:'agent'`), so this can migrate onto `/api/v1` later without a redesign.
- **Env:** set `ANTHROPIC_API_KEY` (and optional `MAESTRO_MODEL`, default `claude-sonnet-5`) to make it a live thinking agent.

This is deliberately separate from the production **Agent Control** / Vertex pipeline above: the Studio is the wedge that gets a "yes"; the control service is the platform it grows into.

## Local control service

From `services/control`:

```bash
uv sync --extra dev
uv run uvicorn app.main:app --reload
uv run pytest -q -p no:cacheprovider
```

Copy `services/control/.env.example` to `.env`. SQLite is suitable for local workflow tests; production uses the Cloud SQL URL injected by Secret Manager.

## Deployment order

1. Create a Google Cloud project with billing and set the Terraform variables documented in `infra/terraform/README.md`.
2. Build `services/control/Dockerfile`, push it to Artifact Registry, and apply Terraform.
3. Create the owner in Identity Platform and set `owner_identity_uid` to that account's Firebase UID.
4. Run `python -m app.migrate` against Cloud SQL to create tables, pgvector indexes, the four agent records, and the owner role.
5. Deploy `services/control/agents/agent.py` with the ADK Agent Engine CLI in `asia-south1`, then set `agent_engine_id` and re-apply Terraform.
6. Set `control_service_url` to Terraform's first `control_api_url` output and re-apply so Cloud Tasks can call the private job endpoint.
7. Copy the `vercel_environment` output into the Vercel production environment and redeploy.
8. Configure the private vault repository and GitHub webhook only after core run acceptance passes.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
cd services/control
uv run --extra dev ruff check app agents tests
uv run --extra dev pytest -q -p no:cacheprovider
```

The owner should pilot one real client through training, five calibrations per agent, activation, all four approval gates, a revision, approved memory, and vault synchronization before expanding the suite.
