export type TaskStatus = 'in-progress' | 'blocked' | 'waiting' | 'done'
export type TaskPriority = 'urgent' | 'normal' | 'low'

export interface TaskItem {
  id: string
  title: string
  client: string
  priority: TaskPriority
  status: TaskStatus
  estimatedHours: number
  note?: string
}

export interface WaitingItem {
  title: string
  from: string
  sinceDays: number
  urgent: boolean
}

export interface HandoffItem {
  title: string
  to: string
  daysAgo: number
  status: 'delivered' | 'in-review' | 'approved'
}

export interface OperatorStats {
  hoursThisMonth: number
  avgPerMonth: number
  completedThisMonth: number
  activeCount: number
}

export interface OperatorData {
  tasks: TaskItem[]
  waiting: WaitingItem[]
  handoffs: HandoffItem[]
  stats: OperatorStats
  insight: string
  timeBreakdown: { label: string; hours: number }[]
}

const DATA: Record<string, OperatorData> = {
  priya: {
    tasks: [
      { id: 'p1', title: 'Send clarification email to Kotak MF — Q3 Newsletter brief', client: 'Kotak MF', priority: 'normal', status: 'in-progress', estimatedHours: 1.5 },
      { id: 'p2', title: 'Schedule strategy review with Motilal Oswal — SIP campaign', client: 'Motilal Oswal', priority: 'normal', status: 'waiting', estimatedHours: 0.5, note: 'Waiting on client calendar' },
      { id: 'p3', title: 'Collect client feedback on Axis MF Retirement Reel v2', client: 'Axis MF', priority: 'urgent', status: 'blocked', estimatedHours: 1, note: 'Awaiting client response since 3 days' },
      { id: 'p4', title: 'Draft revised brief for DSP MF — Tiger Fund anniversary campaign', client: 'DSP MF', priority: 'normal', status: 'in-progress', estimatedHours: 2 },
      { id: 'p5', title: 'Renew Nippon MF retainer — Q3 scope documentation', client: 'Nippon MF', priority: 'low', status: 'waiting', estimatedHours: 3, note: 'Pending internal review by Muzammil' },
    ],
    waiting: [
      { title: 'Creative output from Divya for Tata MF retirement deck', from: 'Divya Nair', sinceDays: 3, urgent: true },
      { title: 'Compliance clearance for Nippon MF social posts (x3)', from: 'Arjit Singh', sinceDays: 2, urgent: false },
      { title: 'Research package for Invesco Q3 brief', from: 'Rohan Sharma', sinceDays: 1, urgent: false },
    ],
    handoffs: [
      { title: 'Invesco Q3 brief → Research kick-off', to: 'Rohan Sharma', daysAgo: 2, status: 'in-review' },
      { title: 'Axis MF approval request → Founder sign-off', to: 'Muzammil Rashid', daysAgo: 1, status: 'in-review' },
      { title: 'DSP Tiger Fund brief → Creative team', to: 'Divya Nair', daysAgo: 4, status: 'in-review' },
    ],
    stats: { hoursThisMonth: 18, avgPerMonth: 35, completedThisMonth: 12, activeCount: 5 },
    insight: 'Priya spends ~10 hrs/month chasing client status. Maestro sends automated follow-up nudges and surfaces blockers before they delay delivery.',
    timeBreakdown: [
      { label: 'Brief clarification', hours: 12 },
      { label: 'Client comms', hours: 8 },
      { label: 'Waiting for approvals', hours: 14 },
      { label: 'Research handoffs', hours: 4 },
      { label: 'Status chasing', hours: 6 },
    ],
  },

  rohan: {
    tasks: [
      { id: 'r1', title: 'Category scan: Tata MF retirement vertical vs top 5 competitors', client: 'Tata MF', priority: 'normal', status: 'in-progress', estimatedHours: 4 },
      { id: 'r2', title: 'Competitor deep-dive: Mirae Asset vs Axis MF — SIP positioning', client: 'Axis MF', priority: 'urgent', status: 'in-progress', estimatedHours: 6, note: 'Needed for Divya\'s creative brief by EOD' },
      { id: 'r3', title: 'Pull AMFI flow data for DSP MF newsletter (Jul 2026)', client: 'DSP MF', priority: 'normal', status: 'waiting', estimatedHours: 2, note: 'AMFI data portal access issue' },
      { id: 'r4', title: 'Market sentiment report: Post-election retail MF behaviour', client: 'Internal', priority: 'low', status: 'in-progress', estimatedHours: 8 },
    ],
    waiting: [
      { title: 'Final brief from Priya for Invesco Q3 scope', from: 'Priya Mehta', sinceDays: 1, urgent: false },
      { title: 'Category direction from Divya before starting visual research', from: 'Divya Nair', sinceDays: 1, urgent: false },
    ],
    handoffs: [
      { title: 'Axis MF research package → Creative brief', to: 'Divya Nair', daysAgo: 3, status: 'delivered' },
      { title: 'Kotak MF source notes + data → Creative', to: 'Divya Nair', daysAgo: 1, status: 'in-review' },
    ],
    stats: { hoursThisMonth: 22, avgPerMonth: 32, completedThisMonth: 8, activeCount: 4 },
    insight: 'Rohan spends 16 hrs/month on first-draft research that gets partially reused. Maestro surfaces relevant prior research automatically, cutting this to ~6 hrs.',
    timeBreakdown: [
      { label: 'Research', hours: 16 },
      { label: 'First drafts', hours: 6 },
      { label: 'Compliance & rework', hours: 4 },
      { label: 'Brief clarification', hours: 4 },
      { label: 'Waiting for approvals', hours: 2 },
    ],
  },

  divya: {
    tasks: [
      { id: 'd1', title: 'Axis MF Retirement Reel — Script v2 (post-compliance rework)', client: 'Axis MF', priority: 'urgent', status: 'in-progress', estimatedHours: 3, note: 'Arjit flagged 4 compliance points in v1' },
      { id: 'd2', title: 'Tata MF — 3-part retirement reel series: storyboard + scripts', client: 'Tata MF', priority: 'normal', status: 'in-progress', estimatedHours: 8 },
      { id: 'd3', title: 'Kotak MF — Q3 Newsletter copy (6 sections, 2000 words)', client: 'Kotak MF', priority: 'normal', status: 'waiting', estimatedHours: 4, note: 'Waiting on Rohan\'s source notes' },
      { id: 'd4', title: 'Nippon MF — Social hooks (Instagram + LinkedIn x3)', client: 'Nippon MF', priority: 'normal', status: 'in-progress', estimatedHours: 2 },
      { id: 'd5', title: 'DSP MF Tiger Fund 25th anniversary concept + territory', client: 'DSP MF', priority: 'low', status: 'in-progress', estimatedHours: 6 },
    ],
    waiting: [
      { title: 'Research package for Motilal Oswal SIP creative', from: 'Rohan Sharma', sinceDays: 2, urgent: true },
      { title: 'Client brief for Invesco Q3 visual identity', from: 'Priya Mehta', sinceDays: 2, urgent: false },
    ],
    handoffs: [
      { title: 'Axis MF Script v1 → Compliance review', to: 'Arjit Singh', daysAgo: 5, status: 'in-review' },
      { title: 'DSP MF campaign deck draft → Compliance', to: 'Arjit Singh', daysAgo: 2, status: 'in-review' },
      { title: 'Kotak newsletter draft → Compliance', to: 'Arjit Singh', daysAgo: 1, status: 'approved' },
    ],
    stats: { hoursThisMonth: 14, avgPerMonth: 30, completedThisMonth: 9, activeCount: 5 },
    insight: 'Divya spends ~10 hrs/month redoing work after compliance flags things post-first-draft. Maestro pre-screens creative for SEBI guidelines before it hits compliance.',
    timeBreakdown: [
      { label: 'First drafts', hours: 20 },
      { label: 'Compliance & rework', hours: 10 },
      { label: 'Brief clarification', hours: 6 },
      { label: 'Client comms', hours: 4 },
      { label: 'Waiting for approvals', hours: 14 },
    ],
  },

  arjit: {
    tasks: [
      { id: 'a1', title: 'Axis MF Retirement Reel Script v2 — SEBI fair comms check', client: 'Axis MF', priority: 'urgent', status: 'in-progress', estimatedHours: 2, note: '4 v1 flags: return claims, risk disclosure, source citation, past performance disclaimer' },
      { id: 'a2', title: 'DSP MF Tiger Fund campaign deck — Disclaimer placement review', client: 'DSP MF', priority: 'normal', status: 'in-progress', estimatedHours: 1.5 },
      { id: 'a3', title: 'Nippon MF social posts (x3) — Regulatory clearance', client: 'Nippon MF', priority: 'normal', status: 'waiting', estimatedHours: 1, note: 'Waiting on revised Nippon draft from Divya' },
      { id: 'a4', title: 'Motilal Oswal SIP ads — Fair communication standard check', client: 'Motilal Oswal', priority: 'low', status: 'in-progress', estimatedHours: 2 },
    ],
    waiting: [
      { title: 'Revised Axis MF Script v2 from Divya (post v1 feedback)', from: 'Divya Nair', sinceDays: 1, urgent: true },
      { title: 'Nippon revised social post drafts', from: 'Divya Nair', sinceDays: 2, urgent: false },
    ],
    handoffs: [
      { title: 'DSP MF social posts → Production (cleared)', to: 'Karan Malhotra', daysAgo: 3, status: 'approved' },
      { title: 'Kotak newsletter → Production (cleared, minor notes)', to: 'Karan Malhotra', daysAgo: 1, status: 'approved' },
      { title: 'Invesco statics → Account Manager (cleared)', to: 'Priya Mehta', daysAgo: 4, status: 'approved' },
    ],
    stats: { hoursThisMonth: 8, avgPerMonth: 15, completedThisMonth: 6, activeCount: 4 },
    insight: 'Arjit manually reviews every piece of content against SEBI guidelines — 15 hrs/month. Maestro pre-flags potential violations in first draft, cutting review time by 60%.',
    timeBreakdown: [
      { label: 'Compliance review', hours: 10 },
      { label: 'Compliance & rework', hours: 4 },
      { label: 'Brief clarification', hours: 2 },
      { label: 'Waiting for drafts', hours: 3 },
      { label: 'Client comms', hours: 1 },
    ],
  },

  sneha: {
    tasks: [
      { id: 's1', title: 'Follow up: Kotak MF Invoice ZW-2024-042 — ₹3.2L (52 days overdue)', client: 'Kotak MF', priority: 'urgent', status: 'blocked', estimatedHours: 0.5, note: 'Finance contact unresponsive. Escalate to Priya for client nudge.' },
      { id: 's2', title: 'Follow up: Invesco MF Invoice ZW-2024-039 — ₹2L (52 days overdue)', client: 'Invesco MF', priority: 'urgent', status: 'blocked', estimatedHours: 0.5, note: 'AP team says "processing" for 3 weeks.' },
      { id: 's3', title: 'Prepare July billing for all 8 active clients (8 invoices)', client: 'Internal', priority: 'normal', status: 'in-progress', estimatedHours: 4 },
      { id: 's4', title: 'Motilal Oswal retainer renewal — updated scope & billing terms', client: 'Motilal Oswal', priority: 'normal', status: 'waiting', estimatedHours: 1, note: 'Pending scope doc from Priya' },
      { id: 's5', title: 'Reconcile June payments against bank statement', client: 'Internal', priority: 'normal', status: 'in-progress', estimatedHours: 2 },
    ],
    waiting: [
      { title: 'Project completion confirmation from Karan for Tata MF billing', from: 'Karan Malhotra', sinceDays: 1, urgent: false },
      { title: 'Retainer renewal scope from Priya for Motilal billing', from: 'Priya Mehta', sinceDays: 2, urgent: false },
    ],
    handoffs: [
      { title: 'July invoice drafts (8) → Founder review', to: 'Muzammil Rashid', daysAgo: 0, status: 'in-review' },
      { title: 'HDFC AMC payment confirmed → Accounts closed', to: 'Muzammil Rashid', daysAgo: 2, status: 'approved' },
    ],
    stats: { hoursThisMonth: 6, avgPerMonth: 15, completedThisMonth: 4, activeCount: 5 },
    insight: 'Sneha tracks 8+ client invoices manually each month. Maestro auto-generates invoices from project milestones and sends payment reminders, saving 8+ hrs/month.',
    timeBreakdown: [
      { label: 'Finance tracking', hours: 8 },
      { label: 'Client status chasing', hours: 4 },
      { label: 'Compliance & billing', hours: 3 },
      { label: 'Waiting for inputs', hours: 3 },
      { label: 'Business review', hours: 2 },
    ],
  },

  karan: {
    tasks: [
      { id: 'k1', title: 'Axis MF Retirement Reel — Final render + export (BLOCKED on compliance)', client: 'Axis MF', priority: 'urgent', status: 'blocked', estimatedHours: 4, note: 'Cannot proceed until Arjit clears Script v2' },
      { id: 'k2', title: 'Kotak MF Q3 Newsletter — Final layout, PDF + digital export, upload', client: 'Kotak MF', priority: 'normal', status: 'in-progress', estimatedHours: 2 },
      { id: 'k3', title: 'Nippon MF social reels (x3) — Post-production polish + caption pack', client: 'Nippon MF', priority: 'normal', status: 'in-progress', estimatedHours: 3 },
      { id: 'k4', title: 'DSP Tiger Fund deck — Version control + final file naming convention', client: 'DSP MF', priority: 'low', status: 'in-progress', estimatedHours: 1 },
      { id: 'k5', title: 'Tata MF retirement visuals — Asset organisation in shared drive', client: 'Tata MF', priority: 'normal', status: 'waiting', estimatedHours: 2, note: 'Waiting on design source files from Divya' },
    ],
    waiting: [
      { title: 'Compliance clearance for Axis MF Reel (Script v2)', from: 'Arjit Singh', sinceDays: 2, urgent: true },
      { title: 'Design source files from Divya for Tata MF visuals', from: 'Divya Nair', sinceDays: 1, urgent: false },
    ],
    handoffs: [
      { title: 'DSP MF social media pack (6 assets) → Client delivery folder', to: 'Priya Mehta', daysAgo: 2, status: 'delivered' },
      { title: 'Motilal SIP static pack (4 formats) → Client delivery', to: 'Priya Mehta', daysAgo: 4, status: 'delivered' },
      { title: 'Invesco brand refresh assets → Delivered', to: 'Priya Mehta', daysAgo: 5, status: 'approved' },
    ],
    stats: { hoursThisMonth: 6, avgPerMonth: 20, completedThisMonth: 7, activeCount: 5 },
    insight: 'Karan spends ~14 hrs/month waiting for upstream approvals before he can start production. Maestro\'s automated workflow gates notify him the moment compliance clears.',
    timeBreakdown: [
      { label: 'First drafts / production', hours: 20 },
      { label: 'Waiting for approvals', hours: 14 },
      { label: 'Compliance & rework', hours: 6 },
      { label: 'Client comms', hours: 4 },
      { label: 'Brief clarification', hours: 4 },
    ],
  },
}

export function getOperatorData(userId: string): OperatorData | null {
  return DATA[userId] ?? null
}
