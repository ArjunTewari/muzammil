'use client'

import type { ProjectBrief, WorkloadSignal } from './architect/types'
import { USERS } from './users'
import { getEmployeeProject, agentProgress } from './employee-projects'

// Projects created by the Architect and assigned to an employee. localStorage
// for the demo (swap for an API + DB later — same four functions).

export type AssignedStatus = 'new' | 'in-progress'

export interface AssignedProject {
  id: string
  title: string
  client: string
  brief: ProjectBrief
  instructions: string[] // Muzammil's verbatim instructions
  assignedTo: string // employeeId
  status: AssignedStatus
  createdAt: number
}

const KEY = 'maestro-projects'
const listeners = new Set<() => void>()

function read(): AssignedProject[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as AssignedProject[]
  } catch {
    /* ignore */
  }
  return []
}

function write(projects: AssignedProject[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(projects))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function getAssignedProjects(): AssignedProject[] {
  return read().sort((a, b) => b.createdAt - a.createdAt)
}

export function getProjectsForEmployee(employeeId: string): AssignedProject[] {
  return read()
    .filter((p) => p.assignedTo === employeeId)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function assignProject(
  brief: ProjectBrief,
  assignedTo: string,
): AssignedProject {
  const project: AssignedProject = {
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: brief.title,
    client: brief.client,
    brief,
    instructions: brief.muzammilInstructions.filter(Boolean),
    assignedTo,
    status: 'new',
    createdAt: Date.now(),
  }
  write([project, ...read()])
  return project
}

export function acceptProject(id: string) {
  write(read().map((p) => (p.id === id ? { ...p, status: 'in-progress' } : p)))
}

export function newProjectCount(employeeId: string): number {
  return read().filter((p) => p.assignedTo === employeeId && p.status === 'new').length
}

export function subscribeProjects(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

// Workload signal for the Architect's owner suggestion: agents still busy on the
// current mock campaign + projects already queued (assigned, not yet accepted).
export function getWorkloads(): WorkloadSignal[] {
  return USERS.filter((u) => u.role !== 'master').map((u) => {
    const proj = getEmployeeProject(u.id)
    const prog = proj ? agentProgress(proj) : { total: 6, done: 6, needsInput: 0, working: undefined }
    const activeAgents = prog.total - prog.done
    return {
      employeeId: u.id,
      name: u.name,
      activeAgents,
      assignedProjects: newProjectCount(u.id),
    }
  })
}
