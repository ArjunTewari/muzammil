'use client'

import {
  MINUTES_PER_RUN,
  type AgentMemoryEntry,
  type AgentStats,
  type MemoryType,
  type StudioAgent,
} from './types'

// localStorage-backed store for the Agent Studio (demo). Swap these functions
// for /api/v1 calls to make it durable + cross-device later.

const AGENTS_KEY = 'maestro-studio-agents'
const MEM_KEY = 'maestro-studio-memory'
const STATS_KEY = 'maestro-studio-stats'
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}
export function subscribeStudio(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    /* ignore */
  }
  return fallback
}
function writeJSON(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

// ---- seed: one ready-to-use agent so the Studio has value on first open ----

const SEED_AGENT: StudioAgent = {
  id: 'seed-compliance',
  name: 'SEBI & AMFI Compliance Guardian',
  goal: 'Catch every SEBI/AMFI compliance risk in BFSI marketing content before it reaches a human or a client.',
  task: 'Read a piece of marketing copy (reel script, caption, static, newsletter) and flag anything that breaks mutual-fund advertising rules — with the exact phrase and a compliant rewrite.',
  rules: [
    "Never allow 'guaranteed', 'assured' or 'risk-free' return language.",
    'Any return figure or performance claim must carry the risk disclaimer and "past performance is not indicative of future results".',
    'No superlatives like "best fund" or "number one" without a verifiable, cited basis.',
    'Every piece must carry: "Mutual fund investments are subject to market risks, read all scheme related documents carefully."',
    'No language implying quick or effortless wealth ("double your money", "grow fast").',
  ],
  mode: 'review',
  seeded: true,
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
}

const SEED_MEMORY: AgentMemoryEntry[] = [
  {
    id: 'sm1',
    agentId: 'seed-compliance',
    type: 'rule',
    content: 'Axis MF wants the disclaimer burned on-screen, not only in the caption.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'sm2',
    agentId: 'seed-compliance',
    type: 'correction',
    content: 'Do not flag: "tax-saving" for ELSS funds — it is factual.',
    reason: 'ELSS genuinely offers 80C benefit; flagging it was a false positive.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
]

function ensureSeed() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(AGENTS_KEY) === null) {
    writeJSON(AGENTS_KEY, [SEED_AGENT])
    writeJSON(MEM_KEY, SEED_MEMORY)
    writeJSON(STATS_KEY, { 'seed-compliance': { runs: 6, findingsCaught: 11, minutesSaved: 48 } })
  }
}

// ---- agents ----

export function getAgents(): StudioAgent[] {
  ensureSeed()
  return readJSON<StudioAgent[]>(AGENTS_KEY, []).sort((a, b) => b.createdAt - a.createdAt)
}
export function getAgent(id: string): StudioAgent | null {
  return getAgents().find((a) => a.id === id) ?? null
}
export function createAgent(input: Omit<StudioAgent, 'id' | 'createdAt'>): StudioAgent {
  const agent: StudioAgent = { ...input, id: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdAt: Date.now() }
  writeJSON(AGENTS_KEY, [agent, ...getAgents()])
  emit()
  return agent
}
export function updateAgent(id: string, patch: Partial<StudioAgent>) {
  writeJSON(AGENTS_KEY, getAgents().map((a) => (a.id === id ? { ...a, ...patch } : a)))
  emit()
}
export function deleteAgent(id: string) {
  writeJSON(AGENTS_KEY, getAgents().filter((a) => a.id !== id))
  emit()
}

// ---- per-agent memory ----

export function getMemory(agentId: string): AgentMemoryEntry[] {
  ensureSeed()
  return readJSON<AgentMemoryEntry[]>(MEM_KEY, [])
    .filter((m) => m.agentId === agentId)
    .sort((a, b) => b.createdAt - a.createdAt)
}
export function addMemory(entry: Omit<AgentMemoryEntry, 'id' | 'createdAt'>): AgentMemoryEntry {
  const full: AgentMemoryEntry = { ...entry, id: `am-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdAt: Date.now() }
  writeJSON(MEM_KEY, [full, ...readJSON<AgentMemoryEntry[]>(MEM_KEY, [])])
  emit()
  return full
}
// Prompt-ready lines injected into the system prompt each run.
export function memoryLines(agentId: string): string[] {
  return getMemory(agentId).map((m) => {
    const tag = m.type === 'correction' ? 'CORRECTION' : m.type === 'approval' ? 'APPROVED' : 'RULE'
    return `${tag}: ${m.content}${m.reason ? ` (why: ${m.reason})` : ''}`
  })
}

// ---- stats / value counter ----

export function getStats(agentId: string): AgentStats {
  const all = readJSON<Record<string, AgentStats>>(STATS_KEY, {})
  return all[agentId] ?? { runs: 0, findingsCaught: 0, minutesSaved: 0 }
}
export function recordRun(agent: StudioAgent, findingsCaught: number) {
  const all = readJSON<Record<string, AgentStats>>(STATS_KEY, {})
  const cur = all[agent.id] ?? { runs: 0, findingsCaught: 0, minutesSaved: 0 }
  all[agent.id] = {
    runs: cur.runs + 1,
    findingsCaught: cur.findingsCaught + findingsCaught,
    minutesSaved: cur.minutesSaved + MINUTES_PER_RUN[agent.mode],
  }
  writeJSON(STATS_KEY, all)
  emit()
}
export function studioTotals(): AgentStats & { agents: number } {
  const agents = getAgents()
  const all = readJSON<Record<string, AgentStats>>(STATS_KEY, {})
  return agents.reduce(
    (acc, a) => {
      const s = all[a.id] ?? { runs: 0, findingsCaught: 0, minutesSaved: 0 }
      acc.runs += s.runs
      acc.findingsCaught += s.findingsCaught
      acc.minutesSaved += s.minutesSaved
      return acc
    },
    { runs: 0, findingsCaught: 0, minutesSaved: 0, agents: agents.length },
  )
}
