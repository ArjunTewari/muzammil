export type ClientStatus = 'active' | 'at-risk' | 'high-value' | 'low-margin'

export interface Client {
  id: string
  name: string
  shortName: string
  status: ClientStatus
  retainerValue: number
  activeProjects: number
  outstandingInvoices: number
  accountManager: string
  industry: string
  lastActivity: string
}

export type ProjectStatus =
  | 'on-track'
  | 'delayed'
  | 'blocked'
  | 'awaiting-client'
  | 'awaiting-review'
  | 'awaiting-finance'

export type DeliverableType = 'reels' | 'statics' | 'newsletter' | 'deck' | 'mixed' | 'video'

export type WorkflowStage =
  | 'clarify-objective'
  | 'research'
  | 'category-scan'
  | 'creative-territory'
  | 'script'
  | 'visual-treatment'
  | 'internal-review'
  | 'compliance-review'
  | 'client-share'
  | 'feedback'
  | 'closure'

export interface Project {
  id: string
  clientId: string
  clientName: string
  name: string
  status: ProjectStatus
  budget: number
  spent: number
  dueDate: string
  deliverableType: DeliverableType
  workflowStage: WorkflowStage
  description: string
}

export type LeadStage =
  | 'new'
  | 'contacted'
  | 'meeting-set'
  | 'proposal-sent'
  | 'negotiation'
  | 'won'
  | 'lost'

export interface Lead {
  id: string
  company: string
  contactName: string
  contactTitle: string
  stage: LeadStage
  expectedValue: number
  nextAction: string
  nextActionDate: string
  source: string
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  target: number
}

export type ApprovalPriority = 'urgent' | 'normal'

export interface ApprovalItem {
  id: string
  clientName: string
  projectName: string
  itemDescription: string
  waitingOn: string
  daysWaiting: number
  priority: ApprovalPriority
}

export type InvoiceStatus = 'paid' | 'due' | 'overdue' | 'disputed'

export interface Invoice {
  id: string
  clientId: string
  clientName: string
  amount: number
  dueDate: string
  issuedDate: string
  status: InvoiceStatus
  daysOverdue: number
  invoiceNumber: string
  description: string
}

export interface OpportunityAlert {
  id: string
  clientName: string
  signal: string
  suggestedAction: string
  potentialValue: number
  urgency: 'high' | 'medium' | 'low'
}

export type DeliverableStatus = 'draft' | 'in-review' | 'approved' | 'needs-revision' | 'final'

export interface Deliverable {
  id: string
  name: string
  type: DeliverableType | 'script' | 'storyboard' | 'deck'
  version: number
  status: DeliverableStatus
  lastUpdated: string
  updatedBy: string
}

export interface ActivityEntry {
  id: string
  actorName: string
  actorInitials: string
  actorColor: string
  action: string
  target: string
  timestamp: string
  type: 'comment' | 'upload' | 'stage-change' | 'approval' | 'feedback' | 'review'
}

export interface CreativeTerritory {
  name: string
  premise: string
  exampleTreatment: string
  tonalQuality: string
}

export interface CampaignArchitectOutput {
  decodedAsk: string
  objectiveHypothesis: string
  fixedConstraints: string[]
  flexibleAreas: string[]
  missingQuestions: string[]
  recommendedWorkflow: string
  creativeTerritoriesIntro: string
  creativeTerritories: CreativeTerritory[]
}

export interface AxisProject extends Project {
  briefSummary: string
  campaignArchitect: CampaignArchitectOutput
  deliverables: Deliverable[]
  activityLog: ActivityEntry[]
  currentStageIndex: number
}
