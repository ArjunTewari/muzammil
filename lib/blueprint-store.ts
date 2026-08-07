'use client'

import { BLUEPRINT } from './blueprint'

// Per-project blueprint state (current stage + satisfied requirements).
// localStorage for the demo; swap for the control service's run/approval state.

export interface ProjectBlueprintState {
  currentStageIndex: number
  satisfied: string[]
}

const KEY = 'maestro-blueprint'
const listeners = new Set<() => void>()

function readAll(): Record<string, ProjectBlueprintState> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Record<string, ProjectBlueprintState>
  } catch {
    /* ignore */
  }
  return {}
}
function writeAll(map: Record<string, ProjectBlueprintState>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function getBlueprintState(projectId: string, initialStageIndex: number): ProjectBlueprintState {
  return readAll()[projectId] ?? { currentStageIndex: initialStageIndex, satisfied: [] }
}

export function toggleRequirement(projectId: string, initialStageIndex: number, reqId: string) {
  const all = readAll()
  const cur = all[projectId] ?? { currentStageIndex: initialStageIndex, satisfied: [] }
  const satisfied = cur.satisfied.includes(reqId)
    ? cur.satisfied.filter((id) => id !== reqId)
    : [...cur.satisfied, reqId]
  all[projectId] = { ...cur, satisfied }
  writeAll(all)
}

export function canAdvance(state: ProjectBlueprintState): boolean {
  const gate = BLUEPRINT[state.currentStageIndex]?.gate ?? []
  return gate.every((r) => state.satisfied.includes(r.id))
}

export function advanceStage(projectId: string, initialStageIndex: number) {
  const all = readAll()
  const cur = all[projectId] ?? { currentStageIndex: initialStageIndex, satisfied: [] }
  if (!canAdvance(cur)) return
  if (cur.currentStageIndex >= BLUEPRINT.length - 1) return
  all[projectId] = { ...cur, currentStageIndex: cur.currentStageIndex + 1 }
  writeAll(all)
}

export function resetBlueprint(projectId: string, initialStageIndex: number) {
  const all = readAll()
  all[projectId] = { currentStageIndex: initialStageIndex, satisfied: [] }
  writeAll(all)
}

export function subscribeBlueprint(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
