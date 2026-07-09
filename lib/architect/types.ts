// Shared types for the Architect agent — the thinking interviewer that
// turns Muzammil's intent into a structured, assignable project brief.

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// The information checklist the agent fills over the interview.
// Required to finalize: client, objective, deliverables, budget, timeline.
export interface BriefSlots {
  client?: string
  objective?: string
  audience?: string
  deliverables?: string
  keyMessage?: string
  compliance?: string
  budget?: string
  timeline?: string
  successMetric?: string
  references?: string
}

export const REQUIRED_SLOTS: (keyof BriefSlots)[] = [
  'client',
  'objective',
  'deliverables',
  'budget',
  'timeline',
]

export const SLOT_LABELS: Record<keyof BriefSlots, string> = {
  client: 'Client',
  objective: 'Objective',
  deliverables: 'Deliverables',
  budget: 'Budget',
  timeline: 'Timeline',
  audience: 'Audience',
  keyMessage: 'Key message',
  compliance: 'Compliance',
  successMetric: 'Success metric',
  references: 'References',
}

export interface OwnerSuggestion {
  employeeId: string
  reason: string
}

export interface ProjectBrief {
  title: string
  client: string
  objective: string
  decodedAsk: string
  deliverables: string[]
  budget: number
  dueDate: string
  complianceNotes: string[]
  creativeDirection: string
  successMetrics: string[]
  assumptions: string[]
  muzammilInstructions: string[] // verbatim quotes worth remembering
  suggestedOwner: OwnerSuggestion
}

// The agent's structured decision on every turn.
export interface ArchitectTurn {
  reasoningSummary: string
  updatedSlots: BriefSlots
  decision: 'ask' | 'finalize'
  question?: string
  brief?: ProjectBrief
}

// Lightweight workload signal so the agent can suggest the least-loaded owner.
export interface WorkloadSignal {
  employeeId: string
  name: string
  activeAgents: number // agents still working/queued on their current campaign
  assignedProjects: number // new projects already assigned but not accepted
}

export interface ArchitectRequest {
  messages: ChatMessage[]
  slots: BriefSlots
  memory: string[]
  workloads: WorkloadSignal[]
}

export interface ArchitectResponse {
  turn: ArchitectTurn
  mode: 'live' | 'simulated'
  turnNumber: number
}
