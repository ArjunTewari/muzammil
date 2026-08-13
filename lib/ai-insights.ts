// AI-generated "next step" recommendations surfaced across dashboards.
// TODO: replace with GET /api/insights (LLM-generated from live workspace state)

export type StepPriority = 'urgent' | 'recommended' | 'opportunity'

export interface NextStep {
  action: string
  rationale?: string
  priority: StepPriority
}

export const overviewNextSteps: NextStep[] = [
  {
    action: 'Approve Axis MF Retirement Reel — Script v2',
    rationale:
      'Blocks Dipin\'s rework and Vikas\'s compliance re-check — 2 people idle downstream.',
    priority: 'urgent',
  },
  {
    action: 'Escalate Kotak MF & Invesco overdue invoices (₹15.9L, up to 52 days)',
    rationale:
      'Mupen\'s follow-ups have stalled at both AP teams. A founder-level nudge typically unblocks within 48 hours.',
    priority: 'urgent',
  },
  {
    action: 'Sign off Axis MF Q3 retainer scope',
    rationale: 'Kriti is waiting to renew — a delay risks a gap in the retainer between quarters.',
    priority: 'recommended',
  },
  {
    action: 'Pitch Motilal Oswal a ₹2L/mo amplification retainer',
    rationale: '3 organic posts hit +240% reach with no paid boost — clear appetite, no retainer in place.',
    priority: 'opportunity',
  },
  {
    action: 'Open the DSP Tiger Fund PR & media module',
    rationale: '25th-anniversary campaign goes live in Q3 with no amplification brief — ~₹8L potential.',
    priority: 'opportunity',
  },
]

export const financeNextSteps: NextStep[] = [
  {
    action: 'Collect Invesco MF · ZW-2026-0071 — ₹8.4L, 52 days overdue',
    rationale: 'Oldest outstanding. AP team stuck on "processing" for 3 weeks — needs escalation.',
    priority: 'urgent',
  },
  {
    action: 'Collect Kotak MF · ZW-2026-0089 — ₹7.5L, 32 days overdue',
    rationale: 'Kotak is already flagged at-risk; ageing AR compounds the relationship risk.',
    priority: 'urgent',
  },
  {
    action: 'Approve & issue July retainer invoices (8 clients)',
    rationale: 'Drafts are ready in Mupen\'s queue awaiting your sign-off.',
    priority: 'recommended',
  },
  {
    action: 'Raise HDFC AMC change order — 48-page annual report',
    rationale: 'Scope doubled from 24 pages with no change order — ₹3.5L currently unbilled.',
    priority: 'opportunity',
  },
]

export const clientsNextSteps: NextStep[] = [
  {
    action: 'Unblock Axis MF — 5 agents active, compliance is the bottleneck',
    rationale: 'Highest-value account with the most cross-team work; one approval frees the whole chain.',
    priority: 'urgent',
  },
  {
    action: 'Rebalance Kotak MF workload',
    rationale: 'At-risk client with overdue AR — Dipin is loaded while account chasing has stalled.',
    priority: 'recommended',
  },
  {
    action: 'Expand HDFC AMC scope',
    rationale: 'High-value, 5 projects, low active-task load — capacity for the IFA education series expansion.',
    priority: 'opportunity',
  },
]

export const teamNextSteps: NextStep[] = [
  {
    action: 'Clear the compliance bottleneck at Vikas',
    rationale: 'Axis MF Script v2 is holding up production. Vikas is waiting on Dipin\'s revised draft.',
    priority: 'urgent',
  },
  {
    action: 'Pull Dipin\'s Kotak newsletter forward',
    rationale: 'Blocked on Trisha\'s source notes — a quick handoff unblocks 4h of creative work.',
    priority: 'recommended',
  },
  {
    action: 'Trisha has research capacity this month',
    rationale: '22h logged vs 32h typical — room to pre-load Invesco Q3 research before the brief lands.',
    priority: 'opportunity',
  },
]

export const digitalNextSteps: NextStep[] = [
  {
    action: "Approve the SIP case-study post for the agency's LinkedIn",
    rationale: "It's the agency's strongest proof point and it's sitting in the approval queue.",
    priority: 'urgent',
  },
  {
    action: "Publish the founder's compliance POV",
    rationale: 'Founder-led posts drive the most inbound to the site — this one is written and waiting.',
    priority: 'recommended',
  },
  {
    action: 'Add 2 case studies to the site',
    rationale: '14 inbound leads this month against a thin portfolio page — more proof lifts conversion.',
    priority: 'opportunity',
  },
]
