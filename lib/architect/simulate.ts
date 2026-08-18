import type { ArchitectRequest, ArchitectTurn, BriefSlots } from './types'
import { REQUIRED_SLOTS } from './types'
import { inferDeliverableType } from '../deliverable-type'

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
  deliverableType: () =>
    'And which format is this, exactly — static, carousel, video, or AI video? This is step 2 of the project: Work to be done.',
  budget: () => 'Roughly what budget are we working with? (e.g. ₹2L, ₹5L)',
  timeline: () => 'When does this need to land? A go-live date or a rough deadline is fine.',
  audience: (s) =>
    `Who exactly are we talking to for ${s.client ?? 'this'} — first-time SIP investors, HNIs, IFAs, near-retirement?`,
  compliance: () => 'Any compliance angle to flag up front — return claims, disclaimers, a product under review?',
}

const REASONING: Record<string, string> = {
  client: 'Starting with the client anchors everything else — brand voice, compliance history, past winners.',
  objective: 'I have the client; now I need the real objective so the work is aimed, not decorative.',
  deliverables: 'Objective is clear — I need to know what we\'re producing to scope effort and route the right agents.',
  deliverableType: 'Every project needs its format pinned down explicitly — static, carousel, video, or AI video — before it can move to work.',
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

const KNOWN_CLIENTS = ['Axis MF', 'Kotak MF', 'HDFC AMC', 'DSP MF', 'Motilal Oswal', 'Nippon MF', 'Tata MF', 'Invesco MF']

// Pull whatever concrete signals are unambiguous wherever they appear in the
// message, so a client-chip click or a single information-dense message both
// register correctly instead of being swallowed whole by one slot.
function extractSignals(text: string): Partial<BriefSlots> {
  const found: Partial<BriefSlots> = {}
  const client = KNOWN_CLIENTS.find((c) => text.toLowerCase().includes(c.toLowerCase()))
  if (client) found.client = client
  const budget = text.match(/₹?\s*[\d.]+\s*(cr|crore|lakh|lac|l)\b/i)
  if (budget) found.budget = budget[0].trim()
  const timeline = text.match(/\b\d+\s*(day|week|month)s?\b/i)
  if (timeline) found.timeline = timeline[0].trim()
  const deliverables = text.match(/\b\d+\s*(?:[a-z]+\s+){0,2}(reels?|statics?|posts?|videos?|carousels?|creatives?)\b/i)
  if (deliverables) found.deliverables = deliverables[0].trim()
  return found
}

// Extract whatever signals we can find, then — for whichever slot the
// interview is still waiting on — fall back to the raw message as its
// answer. Deterministic and good enough for an offline demo.
function absorbAnswer(slots: BriefSlots, lastUser: string | undefined): BriefSlots {
  if (!lastUser) return slots
  const next = { ...slots, ...extractSignals(lastUser) }
  const order: (keyof BriefSlots)[] = [...REQUIRED_SLOTS, ...ENRICHERS]
  const pending = order.find((k) => !next[k])
  if (!pending) return next
  if (pending === 'deliverableType') return { ...next, deliverableType: inferDeliverableType(lastUser) }
  return { ...next, [pending]: lastUser.trim() }
}

export function simulateTurn(req: ArchitectRequest): { turn: ArchitectTurn; turnNumber: number } {
  const userTurns = req.messages.filter((m) => m.role === 'user').length
  const lastUser = [...req.messages].reverse().find((m) => m.role === 'user')?.content
  const slots = absorbAnswer({ ...req.slots }, lastUser)

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
  // Free-text answers can be a full sentence; when we splice them into a
  // template sentence, use just the first clause so the grammar holds up.
  const firstClause = (text: string | undefined, fallback: string, maxLen = 60): string => {
    if (!text) return fallback
    const clause = text.split(/[.!?]/)[0].trim()
    return clause.length > 0 ? clause.slice(0, maxLen) : fallback
  }
  const objectiveTitle = (slots.objective ?? 'New Campaign')
    .replace(new RegExp(`^${client.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[,\\s—-]*`, 'i'), '')
    .trim()
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
        title: `${client} — ${objectiveTitle.slice(0, 48) || 'New Campaign'}`,
        client,
        objective: slots.objective ?? 'Drive awareness and consideration.',
        decodedAsk: `Beyond the literal ask, the real objective is to move ${firstClause(slots.audience, 'the target investor')} from passive awareness to action for ${client}, using ${deliverables.join(', ')}.`,
        deliverables,
        deliverableType: slots.deliverableType ?? inferDeliverableType(slots.deliverables ?? ''),
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
        founderInstructions: instructions.length > 0 ? instructions : [slots.objective ?? ''],
        suggestedOwner: pickOwner(req, client),
      },
    },
  }
}
