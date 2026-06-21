'use client'

import { motion } from 'framer-motion'
import { useCountUp } from '@/hooks/use-count-up'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { formatLakhs } from '@/lib/utils'
import { clients, projects, leads, revenueData } from '@/lib/mock-data'

function MetricCard({
  label,
  value,
  subtext,
  index,
  children,
}: {
  label: string
  value?: string
  subtext?: string
  index: number
  children?: React.ReactNode
}) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      className="relative rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] overflow-hidden p-5 group transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--color-gold-border)]"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Gold rule */}
      <motion.div
        initial={{ height: '0%' }}
        animate={{ height: '100%' }}
        transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : 0.3 + index * 0.05 }}
        className="absolute left-0 top-0 w-0.5 bg-[var(--color-gold)]"
      />

      <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3 font-medium">
        {label}
      </p>

      {children ? (
        children
      ) : (
        <>
          <div
            className="text-2xl text-[var(--color-text-primary)] mb-1"
            style={{ fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 400 }}
          >
            {value}
          </div>
          {subtext && (
            <p className="text-xs text-[var(--color-text-tertiary)]">{subtext}</p>
          )}
        </>
      )}
    </motion.div>
  )
}

function CountUpNumber({
  target,
  delay,
  prefix = '',
  suffix = '',
}: {
  target: number
  delay: number
  prefix?: string
  suffix?: string
}) {
  const value = useCountUp(target, 1200, delay)
  return (
    <span
      className="text-2xl text-[var(--color-text-primary)]"
      style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
    >
      {prefix}{value.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

export function HeadlineStats() {
  const activeClients = clients.filter((c) => c.status !== 'at-risk').length
  const activeProjects = projects.filter((p) => p.status === 'on-track' || p.status === 'awaiting-review').length
  const openLeads = leads.filter((l) => l.stage !== 'won' && l.stage !== 'lost').length
  const q1Revenue = revenueData.slice(-3).reduce((s, d) => s + d.revenue, 0)
  const onTrack = projects.filter((p) => p.status === 'on-track').length
  const atRisk = projects.filter((p) => p.status !== 'on-track').length
  const total = onTrack + atRisk

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      <MetricCard label="Active Clients" subtext="across 8 AMC relationships" index={0}>
        <CountUpNumber target={activeClients} delay={300} />
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">across 8 AMC relationships</p>
      </MetricCard>

      <MetricCard label="Active Projects" subtext="across all clients" index={1}>
        <CountUpNumber target={activeProjects} delay={380} />
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{projects.length} total this quarter</p>
      </MetricCard>

      <MetricCard label="Open Leads" subtext="in pipeline" index={2}>
        <CountUpNumber target={openLeads} delay={460} />
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          ₹{Math.round(leads.filter(l => l.stage !== 'won' && l.stage !== 'lost').reduce((s, l) => s + l.expectedValue, 0) / 100000)}L pipeline value
        </p>
      </MetricCard>

      <MetricCard label="Q2 Revenue" index={3}>
        <span
          className="text-2xl text-[var(--color-text-primary)]"
          style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
        >
          {formatLakhs(q1Revenue)}
        </span>
        <p className="text-xs text-[var(--color-status-green)] mt-1">↑ 8.4% vs last quarter</p>
      </MetricCard>

      <MetricCard label="Project Health" index={4}>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-2 rounded-full bg-[var(--color-border-brand)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(onTrack / total) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="h-full bg-[var(--color-status-green)] rounded-full"
            />
          </div>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="text-[var(--color-status-green)]">
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{onTrack}</span> on track
          </span>
          <span className="text-[var(--color-status-amber)]">
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{atRisk}</span> need attention
          </span>
        </div>
      </MetricCard>
    </div>
  )
}
