// Blueprint — a Zoho-style gated process. A project can't advance to the next
// stage until the current stage's requirements are met. This operationalizes
// the founder's judgment: e.g. nothing leaves Compliance without his sign-off.

export interface GateRequirement {
  id: string
  label: string
  kind: 'check' | 'approval' // approval = a founder judgment gate
}

export interface BlueprintStage {
  id: string
  label: string
  gate: GateRequirement[] // requirements to advance OUT of this stage
}

export const BLUEPRINT: BlueprintStage[] = [
  {
    id: 'clarify-objective',
    label: 'Clarify Objective',
    gate: [
      { id: 's0-decoded', label: 'Objective decoded & the real ask confirmed', kind: 'check' },
      { id: 's0-signoff', label: 'Founder confirms the brief', kind: 'approval' },
    ],
  },
  { id: 'research', label: 'Research', gate: [{ id: 's1-research', label: 'Category + competitor research attached', kind: 'check' }] },
  { id: 'category-scan', label: 'Category Scan', gate: [{ id: 's2-insight', label: 'Whitespace / insight identified', kind: 'check' }] },
  {
    id: 'creative-territory',
    label: 'Creative Territory',
    gate: [
      { id: 's3-territory', label: 'Territory options prepared', kind: 'check' },
      { id: 's3-pick', label: 'Founder picks the territory', kind: 'approval' },
    ],
  },
  {
    id: 'script',
    label: 'Script',
    gate: [
      { id: 's4-draft', label: 'Script drafted', kind: 'check' },
      { id: 's4-selfqa', label: 'Self-QA against the brief done', kind: 'check' },
    ],
  },
  { id: 'visual-treatment', label: 'Visual Treatment', gate: [{ id: 's5-visual', label: 'Visual treatment ready', kind: 'check' }] },
  {
    id: 'internal-review',
    label: 'Internal Review',
    gate: [
      { id: 's6-review', label: 'Internal review complete', kind: 'check' },
      { id: 's6-lead', label: 'Creative lead sign-off', kind: 'approval' },
    ],
  },
  {
    id: 'compliance-review',
    label: 'Compliance Review',
    gate: [
      { id: 's7-guardian', label: 'Compliance Guardian passed — no open flags', kind: 'check' },
      { id: 's7-founder', label: 'Founder compliance sign-off', kind: 'approval' },
    ],
  },
  { id: 'client-share', label: 'Client Share', gate: [{ id: 's8-shared', label: 'Shared with the client', kind: 'check' }] },
  { id: 'feedback', label: 'Feedback', gate: [{ id: 's9-feedback', label: 'Client feedback captured', kind: 'check' }] },
  { id: 'closure', label: 'Closure', gate: [] },
]
