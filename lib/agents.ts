// The Maestro agent suite. Every employee gets the full set; the Master Agent
// orchestrates routing, sequencing and handoffs between the six specialists.

export type AgentId = 'brief' | 'research' | 'copy' | 'compliance' | 'client' | 'finance'

export interface Agent {
  id: AgentId
  name: string
  tagline: string
  description: string
  iconKey: string // mapped to a lucide icon in the UI
  color: string
  order: number
}

export const MASTER_AGENT = {
  id: 'master' as const,
  name: 'Master Agent',
  tagline: 'Orchestrator',
  description:
    'Reads what the employee needs, then routes, sequences and hands off between the six specialist agents. Nobody has to know which agent to call or in what order.',
  iconKey: 'master',
  color: '#C9A85C',
}

export const AGENTS: Agent[] = [
  {
    id: 'brief',
    name: 'Brief Decoder',
    tagline: 'Maps the real objective behind the ask',
    description:
      'Decodes the client brief into the true objective, fixed constraints, flexible areas and the questions nobody asked. This is the Campaign Architect.',
    iconKey: 'compass',
    color: '#C9A85C',
    order: 1,
  },
  {
    id: 'research',
    name: 'Category Researcher',
    tagline: 'Scans the category and the competition',
    description:
      'Pulls category context, competitor campaigns and data points, so creative starts from evidence rather than a blank page.',
    iconKey: 'search',
    color: '#34d399',
    order: 2,
  },
  {
    id: 'copy',
    name: 'Copywriter',
    tagline: 'Writes in the brand voice',
    description:
      'Drafts scripts, copy and hooks in each client\'s approved voice, using the brand guide and past winners from memory.',
    iconKey: 'pen',
    color: '#a78bfa',
    order: 3,
  },
  {
    id: 'compliance',
    name: 'Compliance Guardian',
    tagline: 'SEBI / AMFI check before any human reads it',
    description:
      'Screens every line against SEBI and AMFI fair-communication rules and flags issues before the work reaches a person.',
    iconKey: 'shield',
    color: '#fb923c',
    order: 4,
  },
  {
    id: 'client',
    name: 'Client Liaison',
    tagline: 'Manages client communication',
    description:
      'Drafts client updates, chases feedback, and keeps the conversation moving so approvals never stall silently.',
    iconKey: 'message',
    color: '#60a5fa',
    order: 5,
  },
  {
    id: 'finance',
    name: 'Finance Tracker',
    tagline: 'Tracks billing and collections',
    description:
      'Raises invoices from project milestones, tracks dues and surfaces overdue payments automatically.',
    iconKey: 'receipt',
    color: '#f472b6',
    order: 6,
  },
]

export function getAgent(id: AgentId): Agent {
  return AGENTS.find((a) => a.id === id)!
}
