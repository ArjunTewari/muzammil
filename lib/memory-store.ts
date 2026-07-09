'use client'

import { allEmployeeProjects } from './employee-projects'

// Learning memory. Two sources: (1) Muzammil's instructions, (2) every
// approval/rejection WITH the reason why. Injected into every Architect
// session so the system gets sharper each job.
//
// Demo-grade: localStorage (all demo logins share one browser). Swap the
// four read/write functions for API calls to make it real + cross-device.

export type MemoryType = 'instruction' | 'approval' | 'rejection'

export interface MemoryEntry {
  id: string
  type: MemoryType
  content: string
  reason?: string
  client?: string
  projectId?: string
  source: string
  createdAt: number
}

const KEY = 'maestro-memory'
const listeners = new Set<() => void>()

function read(): MemoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as MemoryEntry[]
  } catch {
    /* ignore */
  }
  // First run → seed from the static per-project memory strings so /memory is alive.
  const seeded = seed()
  write(seeded)
  return seeded
}

function write(entries: MemoryEntry[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(entries))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

function seed(): MemoryEntry[] {
  const out: MemoryEntry[] = []
  let t = Date.now() - 1000 * 60 * 60 * 24 * 20 // ~3 weeks ago
  for (const p of allEmployeeProjects()) {
    for (const m of p.memory) {
      // "Remembered a recurring flag: never imply guaranteed returns." → rejection-style
      const isFlag = /flag|never|avoid|watch|creep|strict/i.test(m)
      out.push({
        id: `seed-${p.employeeId}-${out.length}`,
        type: isFlag ? 'rejection' : 'instruction',
        content: m,
        reason: isFlag ? 'Learned from a past compliance correction on this account.' : undefined,
        client: p.client,
        source: `${p.client} campaign`,
        createdAt: (t += 1000 * 60 * 30),
      })
    }
  }
  return out
}

export function getMemories(): MemoryEntry[] {
  return read().sort((a, b) => b.createdAt - a.createdAt)
}

export function addMemory(entry: Omit<MemoryEntry, 'id' | 'createdAt'>): MemoryEntry {
  const full: MemoryEntry = {
    ...entry,
    id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  }
  const all = read()
  write([full, ...all])
  return full
}

// Relevance = client match ×3 + type weight (rejection>instruction>approval) + recency.
// Returns plain strings ready to inject into the Architect system prompt.
export function getRelevantMemories(client?: string, limit = 12): MemoryEntry[] {
  const typeWeight: Record<MemoryType, number> = { rejection: 3, instruction: 2, approval: 1 }
  const now = Date.now()
  return read()
    .map((e) => {
      let score = typeWeight[e.type]
      if (client && e.client && e.client.toLowerCase() === client.toLowerCase()) score += 3
      const ageDays = (now - e.createdAt) / (1000 * 60 * 60 * 24)
      score += Math.max(0, 2 - ageDays / 20) // gentle recency boost
      return { e, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.e)
}

export function memoryToPromptLines(client?: string, limit = 12): string[] {
  return getRelevantMemories(client, limit).map((e) => {
    const tag = e.type === 'rejection' ? 'AVOID' : e.type === 'approval' ? 'APPROVED' : 'RULE'
    const reason = e.reason ? ` (why: ${e.reason})` : ''
    const who = e.client ? `[${e.client}] ` : ''
    return `${tag}: ${who}${e.content}${reason}`
  })
}

export function subscribeMemory(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function memoryCounts() {
  const all = read()
  return {
    total: all.length,
    instruction: all.filter((e) => e.type === 'instruction').length,
    approval: all.filter((e) => e.type === 'approval').length,
    rejection: all.filter((e) => e.type === 'rejection').length,
  }
}
