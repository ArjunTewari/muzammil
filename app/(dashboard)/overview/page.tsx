'use client'

import { motion } from 'framer-motion'
import { HeadlineStats } from '@/components/overview/headline-stats'
import { RevenueSnapshot } from '@/components/overview/revenue-snapshot'
import { ProjectHealth } from '@/components/overview/project-health'
import { PipelineLeads } from '@/components/overview/pipeline-leads'
import { Collections } from '@/components/overview/collections'
import { Approvals } from '@/components/overview/approvals'
import { ClientHealth } from '@/components/overview/client-health'
import { OpportunityAlerts } from '@/components/overview/opportunity-alerts'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

function SectionWrapper({
  children,
  delay,
}: {
  children: React.ReactNode
  delay: number
}) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function OverviewPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1
          className="text-3xl text-[var(--color-text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          Good morning, Muzammil.
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Saturday, 21 June 2026 · ZiWorks Advertising
        </p>
      </motion.div>

      {/* Headline stats */}
      <SectionWrapper delay={0.1}>
        <HeadlineStats />
      </SectionWrapper>

      {/* Two-column grid: Revenue + Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionWrapper delay={0.2}>
          <div className="lg:col-span-2">
            <RevenueSnapshot />
          </div>
        </SectionWrapper>
        <SectionWrapper delay={0.25}>
          <Approvals />
        </SectionWrapper>
      </div>

      {/* Project Health */}
      <SectionWrapper delay={0.3}>
        <ProjectHealth />
      </SectionWrapper>

      {/* Two-column: Pipeline + Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionWrapper delay={0.35}>
          <PipelineLeads />
        </SectionWrapper>
        <SectionWrapper delay={0.4}>
          <Collections />
        </SectionWrapper>
      </div>

      {/* Client Health */}
      <SectionWrapper delay={0.45}>
        <ClientHealth />
      </SectionWrapper>

      {/* Opportunity Alerts */}
      <SectionWrapper delay={0.5}>
        <OpportunityAlerts />
      </SectionWrapper>
    </div>
  )
}
