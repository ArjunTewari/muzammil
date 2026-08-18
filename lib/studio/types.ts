// Agent Studio — the founder builds a trainable agent by defining its goal, task
// and rules, then runs inputs, checks results, and corrects it. Corrections +
// rules become per-agent memory injected into every future run.

export type AgentMode = 'review' | 'generate'
export type Severity = 'high' | 'medium' | 'low'

export interface StudioAgent {
  id: string
  name: string
  goal: string
  task: string
  rules: string[]
  mode: AgentMode
  seeded?: boolean
  createdAt: number
}

export interface Finding {
  id: string
  severity: Severity
  title: string
  quote?: string
  rule?: string
  suggestion: string
}

export interface AgentRunResult {
  mode: AgentMode
  // review mode
  verdict?: 'pass' | 'flag'
  findings?: Finding[]
  // generate mode
  output?: string
  notes?: string[]
  // both
  confidence: number // 0..1
  reasoning: string
}

export type MemoryType = 'rule' | 'correction' | 'approval'

export interface AgentMemoryEntry {
  id: string
  agentId: string
  type: MemoryType
  content: string
  reason?: string
  createdAt: number
}

export interface AgentStats {
  runs: number
  findingsCaught: number
  minutesSaved: number
}

export interface RunRequest {
  agent: StudioAgent
  input: string
  memory: string[] // prompt-ready lines injected into the system prompt
}

export interface RunResponse {
  result: AgentRunResult
  engine: 'live' | 'simulated'
}

// Minutes of founder/reviewer time a single run is worth (for the value counter).
export const MINUTES_PER_RUN: Record<AgentMode, number> = {
  review: 8,
  generate: 15,
}
