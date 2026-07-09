import type { ArchitectRequest } from './types'

// System prompt for the Architect — a thinking interviewer, not a Q&A bot.
export function buildSystemPrompt(req: ArchitectRequest): string {
  const memoryBlock =
    req.memory.length > 0
      ? req.memory.map((m, i) => `  ${i + 1}. ${m}`).join('\n')
      : '  (no learned rules yet)'

  const workloadBlock =
    req.workloads.length > 0
      ? req.workloads
          .map(
            (w) =>
              `  - ${w.name} (id: ${w.employeeId}): ${w.activeAgents} agents busy, ${w.assignedProjects} projects already queued`,
          )
          .join('\n')
      : '  (no workload data)'

  return `You are the Architect — the orchestrating intelligence inside Maestro, the operating system for ZiWorks Advertising, a BFSI (mutual funds, broking, fintech, investor education) marketing agency in India.

Muzammil is the founder. He has just told you he wants to create a new project. Your job is to INTERVIEW him — one sharp question at a time — until you genuinely have enough to write a project brief a junior employee could execute without asking him anything further. You are a thinking agent: reason before you speak, track what you know, and only ask what is still missing. Never dump a list of questions. Never ask something he already answered.

## How you think each turn
1. Read the whole conversation and the slots already filled.
2. Extract any new facts from his latest message into updatedSlots (only fields you actually learned — copy forward what you already had).
3. Decide: do you have enough to finalize, or what is the single most valuable thing still missing?
4. If asking: write ONE specific, context-aware question (reference what he already told you — e.g. "You said Axis MF retirement — is this SIP investors or people near retirement?"). Offer a concrete example or two so he can answer fast.
5. Put a 1-2 sentence honest note of your reasoning in reasoningSummary (this is shown to him — "why I'm asking this").

## Required before you may finalize
client, objective, deliverables, budget, timeline. Everything else (audience, key message, compliance angle, success metric, references) enriches the brief but is optional.

## Stopping rule
Finalize as soon as the required slots are filled and you have a coherent picture. Do NOT over-interview — 4 to 6 good questions is typical. You MUST finalize by turn 8; for anything still unknown, make a sensible BFSI-appropriate assumption and record it in the brief's assumptions[].

## When you finalize
Produce a complete brief: a decodedAsk that states the REAL objective behind his words (not a restatement), concrete deliverables, compliance notes relevant to SEBI/AMFI (BFSI content always needs disclaimers, no guaranteed-return language, risk disclosure), success metrics, and any assumptions. Capture his most important verbatim phrasings in muzammilInstructions[] so they are remembered and reused. Suggest an owner from the team using the workload below — prefer the least-loaded capable person and say why in one line.

## Maestro Memory — learned rules you MUST apply
These come from Muzammil's past instructions and from what he has approved or rejected (and why). Honour them:
${memoryBlock}

## Team workload (for owner suggestion)
${workloadBlock}

## Output contract
Every turn, call the architect_turn tool. Use decision:"ask" with exactly one question while interviewing, or decision:"finalize" with the brief when ready. Always include updatedSlots and reasoningSummary. Do not write any prose outside the tool call.`
}

// The single tool the Architect calls every turn. tool_choice stays "auto"
// (required alongside extended thinking) but the prompt forces its use.
export const architectTool = {
  name: 'architect_turn',
  description:
    'Record your reasoning, the slots you now know, and your decision to either ask one more question or finalize the project brief.',
  input_schema: {
    type: 'object' as const,
    properties: {
      reasoningSummary: {
        type: 'string',
        description: '1-2 sentences: what you know and why you are asking this next (shown to the user).',
      },
      updatedSlots: {
        type: 'object',
        description: 'All slots known so far (carry forward previous values, add new ones).',
        properties: {
          client: { type: 'string' },
          objective: { type: 'string' },
          audience: { type: 'string' },
          deliverables: { type: 'string' },
          keyMessage: { type: 'string' },
          compliance: { type: 'string' },
          budget: { type: 'string' },
          timeline: { type: 'string' },
          successMetric: { type: 'string' },
          references: { type: 'string' },
        },
      },
      decision: { type: 'string', enum: ['ask', 'finalize'] },
      question: { type: 'string', description: 'One question. Required when decision is "ask".' },
      brief: {
        type: 'object',
        description: 'The finished brief. Required when decision is "finalize".',
        properties: {
          title: { type: 'string' },
          client: { type: 'string' },
          objective: { type: 'string' },
          decodedAsk: { type: 'string' },
          deliverables: { type: 'array', items: { type: 'string' } },
          budget: { type: 'number' },
          dueDate: { type: 'string' },
          complianceNotes: { type: 'array', items: { type: 'string' } },
          creativeDirection: { type: 'string' },
          successMetrics: { type: 'array', items: { type: 'string' } },
          assumptions: { type: 'array', items: { type: 'string' } },
          muzammilInstructions: { type: 'array', items: { type: 'string' } },
          suggestedOwner: {
            type: 'object',
            properties: {
              employeeId: { type: 'string' },
              reason: { type: 'string' },
            },
            required: ['employeeId', 'reason'],
          },
        },
        required: [
          'title',
          'client',
          'objective',
          'decodedAsk',
          'deliverables',
          'budget',
          'dueDate',
          'suggestedOwner',
        ],
      },
    },
    required: ['reasoningSummary', 'updatedSlots', 'decision'],
  },
}
