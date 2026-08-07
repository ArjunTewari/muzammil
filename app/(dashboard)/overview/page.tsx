'use client'

import { motion } from 'framer-motion'
import { HeadlineStats } from '@/components/overview/headline-stats'
import { Approvals } from '@/components/overview/approvals'
import { TeamShipping } from '@/components/agents/team-shipping'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

function SectionWrapper({
  children,
  delay,
  className,
}: {
  children: React.ReactNode
  delay: number
  className?: string
}) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      className={className}
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
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1
          className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          Good morning, Muzzammil.
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Saturday, 21 June 2026 · ZiWorks Advertising
        </p>
      </motion.div>

      {/* Headline stats */}
      <SectionWrapper delay={0.1}>
        <HeadlineStats />
      </SectionWrapper>

      {/* Needs your decision */}
      <SectionWrapper delay={0.15}>
        <Approvals />
      </SectionWrapper>

      {/* What the team is shipping via their agents */}
      <SectionWrapper delay={0.2}>
        <TeamShipping />
      </SectionWrapper>
    </div>
  )
}
