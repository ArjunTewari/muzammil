'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { CampaignArchitect } from '@/components/project/campaign-architect'
import { WorkflowTracker } from '@/components/project/workflow-tracker'
import { DeliverablesList } from '@/components/project/deliverables-list'
import { ActivityLog } from '@/components/project/activity-log'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { axisProjectData } from '@/lib/mock-data'
import { formatLakhs, formatDate } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

function Section({
  title,
  children,
  delay,
}: {
  title: string
  children: React.ReactNode
  delay: number
}) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.section
      initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.section>
  )
}

export default function ProjectsPage() {
  const project = axisProjectData
  const spent = project.spent
  const budget = project.budget
  const spentPct = Math.round((spent / budget) * 100)

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/overview"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors duration-100"
      >
        <ArrowLeft size={14} /> Back to Overview
      </Link>

      {/* Project header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border border-[var(--color-border-brand)] rounded-[12px] bg-[var(--color-surface)] p-6"
        style={{ borderLeft: '3px solid var(--color-gold)' }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-[var(--color-gold)] uppercase tracking-wider mb-1">
              {project.clientName}
            </p>
            <h1
              className="text-2xl text-[var(--color-text-primary)] mb-2"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {project.name}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              {project.briefSummary}
            </p>
          </div>
          <Badge variant="green">On Track</Badge>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-[var(--color-border-brand)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <Calendar size={12} className="text-[var(--color-text-tertiary)]" />
            Due {formatDate(project.dueDate)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <DollarSign size={12} className="text-[var(--color-text-tertiary)]" />
            Budget: {formatLakhs(project.budget)}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-24 h-1.5 rounded-full bg-[var(--color-border-brand)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--color-gold)]"
                style={{ width: `${spentPct}%` }}
              />
            </div>
            <span
              className="text-[var(--color-text-tertiary)]"
              style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
            >
              {spentPct}% spent
            </span>
          </div>
          <div className="text-xs text-[var(--color-text-secondary)]">
            Account: <span className="text-[var(--color-text-primary)]">Priya Mehta</span>
          </div>
        </div>
      </motion.div>

      {/* Workflow Tracker */}
      <Section title="Workflow" delay={0.1}>
        <Card goldRule>
          <CardHeader>
            <CardTitle>Workflow Progress</CardTitle>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              Stage 5 of 11 · Currently in Script
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <WorkflowTracker currentStageIndex={project.currentStageIndex} />
          </CardContent>
        </Card>
      </Section>

      {/* Campaign Architect — the headline screen */}
      <Section title="Campaign Architect" delay={0.15}>
        <Card goldRule>
          <CardContent className="pt-5">
            <CampaignArchitect output={project.campaignArchitect} />
          </CardContent>
        </Card>
      </Section>

      {/* Two-column: Deliverables + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Deliverables" delay={0.2}>
          <Card goldRule>
            <CardHeader>
              <CardTitle>Deliverables</CardTitle>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                {project.deliverables.length} files · {project.deliverables.filter((d) => d.status === 'approved').length} approved
              </p>
            </CardHeader>
            <CardContent className="pt-3">
              <DeliverablesList deliverables={project.deliverables} />
            </CardContent>
          </Card>
        </Section>

        <Section title="Activity" delay={0.25}>
          <Card goldRule>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                {project.activityLog.length} events
              </p>
            </CardHeader>
            <CardContent className="pt-3">
              <ActivityLog entries={project.activityLog} />
            </CardContent>
          </Card>
        </Section>
      </div>
    </div>
  )
}
