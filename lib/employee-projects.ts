import type { AgentId } from './agents'
import type { NextStep } from './ai-insights'

// Each employee owns one client campaign and runs it end-to-end through the
// full agent suite. The Master Agent orchestrates; these are the per-agent
// states on that employee's live project.

export type AgentStatus = 'done' | 'working' | 'queued' | 'needs-input'

export interface AgentState {
  agentId: AgentId
  status: AgentStatus
  lastAction: string
  output: string
}

export interface ActivityItem {
  agent: string
  action: string
  time: string
}

export interface EmployeeProject {
  employeeId: string
  client: string
  projectTitle: string
  objective: string
  dueDate: string
  budget: number
  spent: number
  stagePct: number
  agentStates: AgentState[]
  memory: string[]
  activity: ActivityItem[]
  nextSteps: NextStep[]
  commandExamples: string[]
}

const PROJECTS: Record<string, EmployeeProject> = {
  priya: {
    employeeId: 'priya',
    client: 'Axis MF',
    projectTitle: 'Retirement Planning — 10-part Reel IP',
    objective:
      'Make retirement planning feel urgent and personal to 30-something SIP investors, without fear-mongering.',
    dueDate: '2026-07-04',
    budget: 850000,
    spent: 470000,
    stagePct: 62,
    agentStates: [
      { agentId: 'brief', status: 'done', lastAction: 'Decoded the ask into 7 sub-objectives + 3 creative territories', output: 'Real objective: shift retirement from "someday" to "this SIP". 3 territories delivered — "The Math Nobody Showed You" chosen.' },
      { agentId: 'research', status: 'done', lastAction: 'Benchmarked Mirae, HDFC & SBI retirement creative', output: 'Gap found: every competitor leads with fear. Whitespace = empowerment through simple math.' },
      { agentId: 'copy', status: 'working', lastAction: 'Drafting Script v2 after compliance flags', output: 'Reels 1-4 scripted. Reworking return-claim language flagged by Compliance.' },
      { agentId: 'compliance', status: 'needs-input', lastAction: 'Flagged 4 issues in Script v1', output: 'Return claims, risk disclosure, source citation & past-performance disclaimer need fixing before client share.' },
      { agentId: 'client', status: 'queued', lastAction: 'Holding client update until Script v2 clears', output: 'Draft update to Axis marketing head ready to send once compliance passes.' },
      { agentId: 'finance', status: 'working', lastAction: 'Tracked ₹4.7L of ₹8.5L budget spent', output: 'June retainer invoiced. Production advance milestone due on client sign-off.' },
    ],
    memory: [
      'Applied Axis MF brand voice guide v3 (calm, precise, never salesy).',
      'Reused the "retirement math" angle Muzammil approved for Axis last quarter.',
      'Remembered: Axis compliance always requires a past-performance disclaimer on return figures.',
    ],
    activity: [
      { agent: 'Compliance Guardian', action: 'flagged 4 issues in Script v1', time: '2h ago' },
      { agent: 'Copywriter', action: 'started Script v2 rework', time: '1h ago' },
      { agent: 'Master Agent', action: 'routed rework to Copywriter, paused Client Liaison', time: '1h ago' },
      { agent: 'Brief Decoder', action: 'locked creative territory "The Math Nobody Showed You"', time: '1d ago' },
    ],
    nextSteps: [
      { action: 'Review Script v2 the moment the Copywriter finishes', rationale: 'Compliance re-check and client share are both queued behind it.', priority: 'urgent' },
      { action: 'Approve the Client Liaison\'s drafted update to Axis', rationale: 'Ready to send — keeps the client warm while v2 clears.', priority: 'recommended' },
      { action: 'Confirm the production-advance milestone with Finance', rationale: 'Unlocks the next ₹2.5L tranche on sign-off.', priority: 'opportunity' },
    ],
    commandExamples: [
      'Rewrite reels 1-4 to fix the compliance flags',
      'Draft a client update on where we are',
      'What did competitors do on retirement last year?',
    ],
  },

  rohan: {
    employeeId: 'rohan',
    client: 'Kotak MF',
    projectTitle: 'Flexi Cap — Reel Campaign (6-part)',
    objective:
      'Explain flexi-cap flexibility to first-time equity investors without jargon.',
    dueDate: '2026-07-10',
    budget: 500000,
    spent: 180000,
    stagePct: 34,
    agentStates: [
      { agentId: 'brief', status: 'done', lastAction: 'Mapped the ask to "flexibility = one fund, all market caps"', output: 'Objective: reduce choice-paralysis. Angle: let the fund manager decide, you just stay invested.' },
      { agentId: 'research', status: 'working', lastAction: 'Scanning flexi-cap category leaders', output: 'Comparing PPFAS, HDFC & Quant flexi-cap creative. Pulling 3-yr flow data (AMFI portal access pending).' },
      { agentId: 'copy', status: 'queued', lastAction: 'Waiting on research handoff', output: 'Script framework drafted; needs the category evidence to lock hooks.' },
      { agentId: 'compliance', status: 'queued', lastAction: 'Nothing to review yet', output: 'Standing by for first copy draft.' },
      { agentId: 'client', status: 'working', lastAction: 'Sent Kotak the concept note', output: 'Concept note shared; awaiting Kotak feedback before scripting.' },
      { agentId: 'finance', status: 'needs-input', lastAction: 'Flagged ₹7.5L overdue (32 days)', output: 'Milestone 2 invoice ZW-2026-0089 is 32 days overdue — Finance recommends escalation before more work ships.' },
    ],
    memory: [
      'Kotak prefers a softer, education-first tone — no performance claims up front.',
      'Reused the "one fund, all caps" explainer that tested well for a prior AMC.',
      'Remembered Kotak is flagged at-risk: keep the founder in the loop on scope.',
    ],
    activity: [
      { agent: 'Finance Tracker', action: 'flagged ₹7.5L overdue on Kotak', time: '3h ago' },
      { agent: 'Category Researcher', action: 'pulled competitor flexi-cap reels', time: '2h ago' },
      { agent: 'Client Liaison', action: 'sent concept note to Kotak', time: '1d ago' },
    ],
    nextSteps: [
      { action: 'Escalate the ₹7.5L overdue to Muzammil before shipping more', rationale: 'Finance flagged it; Kotak is already at-risk.', priority: 'urgent' },
      { action: 'Unblock AMFI portal access for the Researcher', rationale: 'The category data pull is the only thing gating the Copywriter.', priority: 'recommended' },
      { action: 'Chase Kotak on the concept note', rationale: 'Client Liaison can send a nudge to keep scripting on schedule.', priority: 'opportunity' },
    ],
    commandExamples: [
      'Summarise what competitors did on flexi-cap',
      'Draft 6 reel hooks once research is in',
      'Send Kotak a gentle feedback reminder',
    ],
  },

  divya: {
    employeeId: 'divya',
    client: 'DSP MF',
    projectTitle: 'Tiger Fund — 25th Anniversary Campaign',
    objective:
      'Celebrate 25 years of DSP Tiger Fund and turn heritage into fresh relevance.',
    dueDate: '2026-07-18',
    budget: 720000,
    spent: 240000,
    stagePct: 40,
    agentStates: [
      { agentId: 'brief', status: 'done', lastAction: 'Framed heritage as "25 years of staying invested"', output: 'Objective: convert legacy into proof of long-term compounding, not nostalgia.' },
      { agentId: 'research', status: 'done', lastAction: 'Pulled 25-yr NAV journey + investor stories', output: 'Data hook: ₹1L at launch → ₹X today. Three real investor arcs surfaced for storytelling.' },
      { agentId: 'copy', status: 'working', lastAction: 'Writing anniversary film script + 3 territories', output: 'Concept "Stories from 2045" in progress — imagining today\'s SIP investor 25 years out.' },
      { agentId: 'compliance', status: 'queued', lastAction: 'Awaiting first script', output: 'Will need to check the 25-yr return visualisation carefully.' },
      { agentId: 'client', status: 'working', lastAction: 'Aligned DSP on the anniversary concept', output: 'DSP loved the heritage-to-future angle; awaiting script for formal sign-off.' },
      { agentId: 'finance', status: 'done', lastAction: 'Advance invoiced & received', output: 'Tiger Fund campaign advance ZW-2026-0110 paid. On budget.' },
    ],
    memory: [
      'DSP loves data-led storytelling — lead with the 25-year NAV journey.',
      'Reused the compounding-visual style approved on a prior DSP deck.',
      'Remembered: DSP legal wants the disclaimer on-screen, not just in caption.',
    ],
    activity: [
      { agent: 'Category Researcher', action: 'delivered 25-yr NAV + investor stories', time: '5h ago' },
      { agent: 'Copywriter', action: 'started "Stories from 2045" script', time: '3h ago' },
      { agent: 'Client Liaison', action: 'confirmed DSP alignment on concept', time: '1d ago' },
    ],
    nextSteps: [
      { action: 'Review the anniversary film script draft', rationale: 'DSP is waiting to sign off on it before production.', priority: 'urgent' },
      { action: 'Pre-clear the 25-yr return visual with Compliance', rationale: 'Long-horizon return figures always need a disclaimer pass.', priority: 'recommended' },
      { action: 'Explore a PR module for the launch', rationale: 'Anniversary is a natural earned-media moment DSP hasn\'t briefed yet.', priority: 'opportunity' },
    ],
    commandExamples: [
      'Turn the 25-yr NAV data into a hero visual',
      'Draft the anniversary film voiceover',
      'Check the return figures against SEBI rules',
    ],
  },

  arjit: {
    employeeId: 'arjit',
    client: 'Motilal Oswal',
    projectTitle: 'SIP Compounding — Explainer Series',
    objective:
      'Make compounding tangible for young investors through simple, correct math.',
    dueDate: '2026-07-12',
    budget: 650000,
    spent: 300000,
    stagePct: 52,
    agentStates: [
      { agentId: 'brief', status: 'done', lastAction: 'Decoded ask into a 5-part compounding ladder', output: 'Objective: replace "start early" cliché with a concrete rupee-by-rupee ladder.' },
      { agentId: 'research', status: 'done', lastAction: 'Validated the math scenarios', output: 'Three SIP scenarios modelled and fact-checked; assumptions documented for compliance.' },
      { agentId: 'copy', status: 'done', lastAction: 'Delivered 5 explainer scripts', output: 'Scripts written; math kept conservative and clearly labelled as illustrative.' },
      { agentId: 'compliance', status: 'working', lastAction: 'Fair-communication pass in progress', output: 'Checking each return illustration carries assumptions + disclaimer. 1 minor fix pending.' },
      { agentId: 'client', status: 'queued', lastAction: 'Update drafted, holding for compliance', output: 'Client update ready to send once the last disclaimer fix lands.' },
      { agentId: 'finance', status: 'working', lastAction: 'Milestone billing on track', output: 'Motilal retainer current; performance-amplification upsell flagged separately.' },
    ],
    memory: [
      'Motilal is strict on illustrative-only math — label every projection.',
      'Reused the compounding-ladder framework from an approved past series.',
      'Remembered a recurring flag: never imply guaranteed returns.',
    ],
    activity: [
      { agent: 'Copywriter', action: 'delivered all 5 explainer scripts', time: '4h ago' },
      { agent: 'Compliance Guardian', action: 'started fair-comms pass', time: '2h ago' },
      { agent: 'Master Agent', action: 'queued Client Liaison behind compliance', time: '2h ago' },
    ],
    nextSteps: [
      { action: 'Approve the final disclaimer fix from Compliance', rationale: 'It is the only thing holding the client update.', priority: 'urgent' },
      { action: 'Send the client update once cleared', rationale: 'Motilal is expecting the scripts this week.', priority: 'recommended' },
      { action: 'Pitch the performance-amplification retainer', rationale: 'Finance flagged strong organic reach with no retainer in place.', priority: 'opportunity' },
    ],
    commandExamples: [
      'Check all 5 scripts against AMFI rules',
      'Draft the client update for Motilal',
      'Model a 10-year SIP scenario at 12%',
    ],
  },

  sneha: {
    employeeId: 'sneha',
    client: 'HDFC AMC',
    projectTitle: 'IFA Education Series (YouTube, 6 episodes)',
    objective:
      'Equip independent financial advisors with shareable, compliant explainer content.',
    dueDate: '2026-07-20',
    budget: 920000,
    spent: 360000,
    stagePct: 45,
    agentStates: [
      { agentId: 'brief', status: 'done', lastAction: 'Scoped 6 episodes across the advisor journey', output: 'Objective: make HDFC the IFA\'s content partner, not just an AMC.' },
      { agentId: 'research', status: 'working', lastAction: 'Building the fact pack for episodes 4-6', output: 'Sourcing data + fact-checking claims for the second half of the series.' },
      { agentId: 'copy', status: 'working', lastAction: 'Scripting episodes 4-6', output: 'Episodes 1-3 approved; 4-6 in draft, waiting on the research fact pack.' },
      { agentId: 'compliance', status: 'done', lastAction: 'Cleared episodes 1-3', output: 'First three episodes passed with minor notes; template disclaimer locked for the series.' },
      { agentId: 'client', status: 'working', lastAction: 'Coordinating HDFC scope expansion', output: 'HDFC wants a 48-page companion report — change order not yet raised.' },
      { agentId: 'finance', status: 'needs-input', lastAction: 'Flagged unbilled scope expansion', output: 'The report scope doubled from 24→48 pages with no change order — ₹3.5L unbilled.' },
    ],
    memory: [
      'HDFC IFA content must be plain-language and screen-share friendly.',
      'Reused the locked series disclaimer template across all episodes.',
      'Remembered HDFC scope tends to creep — watch for uncharged expansions.',
    ],
    activity: [
      { agent: 'Compliance Guardian', action: 'cleared episodes 1-3', time: '6h ago' },
      { agent: 'Finance Tracker', action: 'flagged unbilled 48-page scope', time: '3h ago' },
      { agent: 'Copywriter', action: 'started episode 4 script', time: '2h ago' },
    ],
    nextSteps: [
      { action: 'Raise the HDFC change order for the 48-page report', rationale: 'Finance flagged ₹3.5L of scope shipping unbilled.', priority: 'urgent' },
      { action: 'Feed the research fact pack to the Copywriter', rationale: 'Episodes 4-6 scripts are gated on it.', priority: 'recommended' },
      { action: 'Package episodes 1-3 for IFA distribution', rationale: 'They are cleared — start the advisor rollout now.', priority: 'opportunity' },
    ],
    commandExamples: [
      'Draft the change order for the 48-page report',
      'Script episode 4 on goal-based investing',
      'Fact-check the SWP claims in episode 5',
    ],
  },

  karan: {
    employeeId: 'karan',
    client: 'Nippon MF',
    projectTitle: 'SIP-Day Reels (3-part Instagram burst)',
    objective:
      'Turn the monthly SIP debit date into a habit-reinforcing content moment.',
    dueDate: '2026-06-22',
    budget: 340000,
    spent: 210000,
    stagePct: 78,
    agentStates: [
      { agentId: 'brief', status: 'done', lastAction: 'Reframed SIP day as a "win" not a debit', output: 'Objective: make the auto-debit feel like progress, not an expense.' },
      { agentId: 'research', status: 'done', lastAction: 'Found the behavioural hook', output: 'Insight: investors who "see" the SIP grow stay invested 3x longer.' },
      { agentId: 'copy', status: 'done', lastAction: 'Wrote all 3 reel scripts + captions', output: 'Punchy 15-sec scripts, caption pack, and hashtag set delivered.' },
      { agentId: 'compliance', status: 'done', lastAction: 'Cleared all 3 reels', output: 'Passed — no return claims, disclaimer in caption. Ready to post.' },
      { agentId: 'client', status: 'done', lastAction: 'Nippon approved the reels', output: 'Client sign-off received. Scheduled for tomorrow, SIP day.' },
      { agentId: 'finance', status: 'working', lastAction: 'Milestone invoice queued on delivery', output: 'Final invoice will auto-raise when the reels publish.' },
    ],
    memory: [
      'Nippon posts land best at 9am on SIP day — schedule accordingly.',
      'Reused the "watch it grow" visual motif from a prior winning reel.',
      'Remembered Nippon wants the disclaimer in the caption, not burned in.',
    ],
    activity: [
      { agent: 'Client Liaison', action: 'secured Nippon sign-off', time: '5h ago' },
      { agent: 'Compliance Guardian', action: 'cleared all 3 reels', time: '7h ago' },
      { agent: 'Master Agent', action: 'scheduled reels for SIP day 9am', time: '4h ago' },
    ],
    nextSteps: [
      { action: 'Give final go on the 3 reels scheduled for tomorrow', rationale: 'Everything is cleared — this is the last human gate before they post.', priority: 'urgent' },
      { action: 'Confirm the auto-invoice triggers on publish', rationale: 'Finance queued it against the delivery milestone.', priority: 'recommended' },
      { action: 'Template this SIP-day format for other AMCs', rationale: 'It is a repeatable monthly content engine.', priority: 'opportunity' },
    ],
    commandExamples: [
      'Schedule the 3 reels for 9am tomorrow',
      'Write 5 caption variants for reel 2',
      'Check reel 3 against SEBI rules',
    ],
  },
}

export function getEmployeeProject(employeeId: string): EmployeeProject | null {
  return PROJECTS[employeeId] ?? null
}

// A client's campaign is owned by exactly one employee (or none).
export function getEmployeeProjectByClient(clientShortName: string): EmployeeProject | null {
  return Object.values(PROJECTS).find((p) => p.client === clientShortName) ?? null
}

export function allEmployeeProjects(): EmployeeProject[] {
  return Object.values(PROJECTS)
}

export function agentProgress(project: EmployeeProject) {
  const done = project.agentStates.filter((a) => a.status === 'done').length
  const working = project.agentStates.find((a) => a.status === 'working')
  const needsInput = project.agentStates.filter((a) => a.status === 'needs-input').length
  return { done, total: project.agentStates.length, working, needsInput }
}
