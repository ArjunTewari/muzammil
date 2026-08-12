'use client'

import type { LeadStage } from './types'

// Persists drag-and-drop stage moves for leads without mutating the mock data.
// localStorage for the demo; swap for PATCH /api/v1/leads/:id later.

const KEY = 'supra-pipeline-stages'
const listeners = new Set<() => void>()

function read(): Record<string, LeadStage> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Record<string, LeadStage>
  } catch {
    /* ignore */
  }
  return {}
}
function write(map: Record<string, LeadStage>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function getStageOverrides(): Record<string, LeadStage> {
  return read()
}
export function getLeadStage(leadId: string, fallback: LeadStage): LeadStage {
  return read()[leadId] ?? fallback
}
export function setLeadStage(leadId: string, stage: LeadStage) {
  write({ ...read(), [leadId]: stage })
}
export function subscribePipeline(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
