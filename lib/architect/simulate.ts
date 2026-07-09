import type { ArchitectRequest, ArchitectTurn, BriefSlots } from './types'
import { REQUIRED_SLOTS } from './types'

// Deterministic fallback interviewer. Follows the SAME checklist and output
// contract as the live agent, so the demo never breaks without an API key.
// It is scripted, not thinking — the UI flags it with a "Simulation" chip.

const ENRICHERS: (keyof BriefSlots)[] = ['audience', 'compliance']

const QUESTIONS: Record<string, (s: BriefSlots) => string> = {
  client: () => 'Which client is this for? (e.g. Axis MF, Kotak MF, HDFC AMC…)',
  objective: (s) =>
    `What's the goal for ${s.client ?? 'this client'}? What should it make people think, feel, or do?`,
  deliverables: (s) =>
    `What are we actually producing for ${s.client ?? 'them'} — reels, statics, a newsletter, a film, a deck?`,
  budget: () => 'Roughly what budget are we working with? (e.g. ₹2L, ₹5L)',
  timeline: () => 'When does this need to land? A go-live date or a rough deadline is fine.',
  audience: (s) =>
    `Who exactly are we talking to for ${s.client ?? 'this'} — first-time SIP investors, HNIs, IFAs, near-retirement?`,
  compliance: () => 'Any compliance angle to flag up front — return claims, disclaimers, a product under review?',
}

const REASONING: Record<string, string> = {
  client: 'Starting with the client anchors everything else — brand voice, compliance history, past winners.',
  objective: 'I have the client; now I need the real objective so the work is aimed, not decorative.',
  deliverables: 'Objective is clear — I need the format to scope effort and route the right agents.',
  budget: 'Scope is taking shape; budget tells me how ambitious the production can be.',
  timeline: 'Almost there — the deadline drives sequencing and how much the agents parallelise.',
  audience: 'Core scope is locked. Nailing the audience sharpens the creative brief.',
  compliance: 'One last check on compliance so nothing gets flagged late in the pipeline.',
}

const OWNER_BY_CLIENT: Record<string, string> = {
  'axis mf': 'priya',
  'kotak mf': 'rohan',
  'dsp mf': 'divya',
  'motilal oswal': 'arjit',
  'hdfc amc': 'sneha',
  'nippon mf': 'karan',
}

function parseBudget(text?: string): { value: number; assumed: boolean } {
  if (!text) return { value: 500000, assumed: true }
  const t = text.toLowerCase().replace(/[, ]/g, '')
  const cr = t.match(/([\d.]+)\s*(cr|crore)/)
  if (cr) return { value: Math.round(parseFloat(cr[1]) * 10000000), assumed: false }
  const lakh = t.match(/([\d.]+)\s*(l|lakh|lac)/)
  if (lakh) return { value: Math.round(parseFloat(lakh[1]) * 100000), assumed: false }
  const rupees = t.match(/₹?([\d]{4,})/)
  if (rupees) return { value: parseInt(rupees[1], 10), assumed: false }
  return { value: 500000, assumed: true }
}

function pickOwner(req: ArchitectRequest, client?: string): { employeeId: string; reason: string } {
  const key = (client ?? '').toLowerCase()
  const byClient = Object.keys(OWNER_BY_CLIENT).find((k) => key.includes(k.split(' ')[0]))
  if (byClient) {
    const id = OWNER_BY_CLIENT[byClient]
    const name = req.workloads.find((w) => w.employeeId === id)?.name ?? id
    return { employeeId: id, reason: `${name} already owns the ${client} relationship and its brand context.` }
  }
  // Least-loaded fallback
  const sorted = [...req.workloads].sort(
    (a, b) => a.activeAgents + a.assignedProjects * 2 - (b.activeAgents + b.assignedProjects * 2),
  )
  const pick = sorted[0]
  if (pick) return { employeeId: pick.employeeId, reason: `${pick.name} has the most capacity right now.` }
  return { employeeId: 'divya', reason: 'Assigned to Divya as a capable generalist.' }
}

// Naive extraction: assign the latest user message to the first unfilled slot,
// in interview order. Deterministic and good enough for an offline demo.
function absorbAnswer(slots: BriefSlots, lastUser: string | undefined): BriefSlots {
  if (!lastUser) return slots
  const order: (keyof BriefSlots)[] = [...REQUIRED_SLOTS, ...ENRICHERS]
  const next = order.find((k) => !slots[k])
  if (!next) return slots
  return { ...slots, [next]: lastUser.trim() }
}

export function simulateTurn(req: ArchitectRequest): { turn: ArchitectTurn; turnNumber: number } {
  const userTurns = req.messages.filter((m) => m.role === 'user').length
  const lastUser = [...req.messages].reverse().find((m) => m.role === 'user')?.content

  // The first user message is "I want to create a new project" — treat as trigger,
  // not a slot answer, so don't absorb it into `client`.
  const slots =
    userTurns <= 1 ? { ...req.slots } : absorbAnswer({ ...req.slots }, lastUser)

  const missingRequired = REQUIRED_SLOTS.filter((k) => !slots[k])
  const nextEnricher = ENRICHERS.find((k) => !slots[k])
  const forceFinalize = userTurns >= 8

  const shouldFinalize = missingRequired.length === 0 && (nextEnricher === undefined || userTurns >= 6)

  if (!forceFinalize && !shouldFinalize) {
    const nextSlot = missingRequired[0] ?? nextEnricher!
    return {
      turnNumber: userTurns,
      turn: {
        reasoningSummary: REASONING[nextSlot] ?? 'Gathering one more detail before I can scope this.',
        updatedSlots: slots,
        decision: 'ask',
        question: QUESTIONS[nextSlot](slots),
      },
    }
  }

  // Finalize
  const client = slots.client ?? 'the client'
  const { value: budget, assumed: budgetAssumed } = parseBudget(slots.budget)
  const assumptions: string[] = []
  if (budgetAssumed) assumptions.push('Budget not specified — assumed ₹5L as a mid-range campaign default.')
  if (!slots.timeline) assumptions.push('No firm deadline given — assumed a 4-week turnaround.')
  if (!slots.audience) assumptions.push('Audience not specified — assumed the client’s core retail investor base.')

  const deliverables = (slots.deliverables ?? 'Social reels + statics')
    .split(/[,/+&]|\band\b/i)
    .map((d) => d.trim())
    .filter(Boolean)

  const instructions = req.messages
    .filter((m) => m.role === 'user')
    .slice(1)
    .map((m) => m.content.trim())
    .filter((c) => c.length > 12)
    .slice(0, 4)

  return {
    turnNumber: userTurns,
    turn: {
      reasoningSummary:
        'I have the client, objective, deliverables, budget and timeline — enough to brief this end-to-end.',
      updatedSlots: slots,
      decision: 'finalize',
      brief: {
        title: `${client} — ${(slots.objective ?? 'New Campaign').slice(0, 48)}`,
        client,
        objective: slots.objective ?? 'Drive awareness and consideration.',
        decodedAsk: `Beyond the literal ask, the real objective is to move ${slots.audience ?? 'the target investor'} from passive awareness to action for ${client}, using ${deliverables.join(', ')}.`,
        deliverables,
        budget,
        dueDate: slots.timeline ?? '4 weeks from kickoff',
        complianceNotes: [
          'BFSI content: include mandatory risk disclosure and scheme disclaimer.',
          'No guaranteed-return or assured-performance language (SEBI/AMFI).',
          slots.compliance ? `Founder flag: ${slots.compliance}` : 'Route through Compliance Guardian before client share.',
        ],
        creativeDirection:
          slots.keyMessage ?? `Lead with clarity and trust; make ${client}'s value tangible, not salesy.`,
        successMetrics: [slots.successMetric ?? 'Engagement + qualified lead lift vs last campaign'],
        assumptions,
        muzammilInstructions: instructions.length > 0 ? instructions : [slots.objective ?? ''],
        suggestedOwner: pickOwner(req, client),
      },
    },
  }
}
