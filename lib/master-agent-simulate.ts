// Deterministic client-side stand-in for the Master Agent's routing decision
// when an employee asks it something from their workspace chat. Keyword-based
// — good enough to demo "it figures out who should handle this" without a
// live model in the loop.

const AGENT_KEYWORDS: { agent: string; words: string[] }[] = [
  { agent: 'Compliance Guardian', words: ['compliance', 'sebi', 'amfi', 'disclaimer', 'risk'] },
  { agent: 'Client Liaison', words: ['client', 'update', 'email', 'send', 'reminder'] },
  { agent: 'Finance Tracker', words: ['budget', 'invoice', 'overdue', 'billing', 'cost'] },
  { agent: 'Category Researcher', words: ['research', 'competitor', 'category', 'benchmark'] },
  { agent: 'Copywriter', words: ['script', 'draft', 'write', 'copy', 'caption', 'hook'] },
  { agent: 'Brief Decoder', words: ['objective', 'brief', 'scope'] },
]

export interface MasterAgentReply {
  reasoning: string
  routed: string[]
  content: string
}

export function simulateMasterAgentReply(text: string): MasterAgentReply {
  const lower = text.toLowerCase()
  const matched = AGENT_KEYWORDS.filter((a) => a.words.some((w) => lower.includes(w))).map((a) => a.agent)
  const routed = matched.length > 0 ? matched : ['Brief Decoder', 'Copywriter']

  return {
    reasoning: `Reading this as a job for ${routed.join(' → ')} — routing with the project's context attached.`,
    routed,
    content: `On it. Routing to ${routed.join(' → ')}. Context from this project is passed automatically — results will land in the pipeline once each agent finishes.`,
  }
}
