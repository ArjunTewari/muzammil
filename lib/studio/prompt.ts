import type { StudioAgent } from './types'

// System prompt for a user-defined Studio agent. The founder's goal/task/rules
// ARE the agent — plus the memory it has learned from his corrections.
export function buildAgentPrompt(agent: StudioAgent, memory: string[]): string {
  const rules = agent.rules.length ? agent.rules.map((r, i) => `  ${i + 1}. ${r}`).join('\n') : '  (none specified)'
  const mem = memory.length ? memory.map((m) => `  - ${m}`).join('\n') : '  (nothing learned yet)'

  const modeContract =
    agent.mode === 'review'
      ? `This is a REVIEW agent. Read the input and judge it against the goal and rules.
- Set verdict to "flag" if anything violates a rule or the goal, otherwise "pass".
- For every issue, add a finding: severity (high/medium/low), a short title, the exact offending quote from the input, the rule it breaks, and a concrete compliant suggestion. Do not invent issues that aren't there — a clean input should return "pass" with no findings.`
      : `This is a GENERATE agent. Produce the output the task asks for, obeying every rule.
- Put the deliverable in "output" as clean markdown.
- Use "notes" for any assumptions or choices the founder should know about.`

  return `You are "${agent.name}", an agent inside Maestro — the operating system for ZiWorks Advertising, a BFSI (mutual funds, broking, fintech, investor education) marketing agency in India. Muzammil, the founder, built you to do one job to his standard so it doesn't depend on him being in the room.

## Your goal
${agent.goal}

## Your task
${agent.task}

## Your rules (always obey; these encode Muzammil's judgment)
${rules}

## What you've learned (Muzammil's instructions + his past corrections — honour these; a "correction" means you previously got this wrong, so adjust)
${mem}

## How to respond
${modeContract}

Think before you answer, be precise, and stay strictly within your goal and rules. Always respond by calling the agent_run tool — no prose outside it. Give an honest confidence (0-1) and a one- to two-sentence reasoning the founder can read.`
}

// Single structured-output tool. tool_choice stays "auto" (required with
// extended thinking); the prompt forces its use.
export const agentRunTool = {
  name: 'agent_run',
  description: "Return the agent's result: for a review agent a verdict + findings, for a generate agent the output. Always include confidence and reasoning.",
  input_schema: {
    type: 'object' as const,
    properties: {
      reasoning: { type: 'string', description: '1-2 sentences the founder can read.' },
      confidence: { type: 'number', description: '0 to 1.' },
      verdict: { type: 'string', enum: ['pass', 'flag'], description: 'Review agents only.' },
      findings: {
        type: 'array',
        description: 'Review agents only. Empty when verdict is pass.',
        items: {
          type: 'object',
          properties: {
            severity: { type: 'string', enum: ['high', 'medium', 'low'] },
            title: { type: 'string' },
            quote: { type: 'string', description: 'The exact offending text from the input.' },
            rule: { type: 'string', description: 'Which rule/standard it breaks.' },
            suggestion: { type: 'string', description: 'A concrete compliant fix.' },
          },
          required: ['severity', 'title', 'suggestion'],
        },
      },
      output: { type: 'string', description: 'Generate agents only. The deliverable, as markdown.' },
      notes: { type: 'array', items: { type: 'string' }, description: 'Generate agents only. Assumptions/choices.' },
    },
    required: ['reasoning', 'confidence'],
  },
}
