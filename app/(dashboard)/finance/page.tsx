'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, AlertCircle, TrendingUp, Wallet, Receipt } from 'lucide-react'
import { RevenueSnapshot } from '@/components/overview/revenue-snapshot'
import { Collections } from '@/components/overview/collections'
import { AiInsights } from '@/components/shared/ai-insights'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { invoices } from '@/lib/mock-data'
import { getOperatorData } from '@/lib/operator-data'
import { getUserById } from '@/lib/users'
import { financeNextSteps } from '@/lib/ai-insights'
import { formatLakhs } from '@/lib/utils'

const statusBadge = {
  'in-progress': { variant: 'blue' as const, label: 'In progress' },
  blocked: { variant: 'red' as const, label: 'Blocked' },
  waiting: { variant: 'amber' as const, label: 'Waiting' },
  done: { variant: 'green' as const, label: 'Done' },
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  index,
}: {
  label: string
  value: string
  sub?: string
  icon: typeof Wallet
  accent: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card goldRule hover={false} className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-medium">
            {label}
          </p>
          <Icon size={15} style={{ color: accent }} />
        </div>
        <div
          className="text-2xl text-[var(--color-text-primary)]"
          style={{ fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 400 }}
        >
          {value}
        </div>
        {sub && <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{sub}</p>}
      </Card>
    </motion.div>
  )
}

export default function FinancePage() {
  const sneha = getUserById('sneha')!
  const snehaData = getOperatorData('sneha')!

  const open = invoices.filter((i) => i.status !== 'paid')
  const totalOutstanding = open.reduce((s, i) => s + i.amount, 0)
  const overdue = invoices.filter((i) => i.status === 'overdue')
  const totalOverdue = overdue.reduce((s, i) => s + i.amount, 0)

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <h1
            className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Finance
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Revenue, collections & billing · {open.length} invoices open
          </p>
        </div>
        {/* Synced with finance manager */}
        <Link
          href="/team/sneha"
          className="group inline-flex items-center gap-2.5 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] px-3 py-2 hover:border-[var(--color-gold-border)] transition-colors duration-150"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
            style={{ background: `${sneha.accentColor}22`, color: sneha.accentColor }}
          >
            {sneha.initials}
          </div>
          <div className="leading-tight">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Managed by
            </p>
            <p className="text-xs text-[var(--color-text-primary)] font-medium group-hover:text-[var(--color-gold)] transition-colors duration-100">
              {sneha.name}
            </p>
          </div>
          <ArrowRight size={14} className="text-[var(--color-text-tertiary)]" />
        </Link>
      </motion.div>

      {/* AI next steps */}
      <AiInsights steps={financeNextSteps} subtitle="Prioritised across collections & billing" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard index={0} label="Outstanding" value={formatLakhs(totalOutstanding)} sub="across all open invoices" icon={Wallet} accent="var(--color-gold)" />
        <StatCard index={1} label="Overdue" value={formatLakhs(totalOverdue)} sub={`${overdue.length} invoices past due`} icon={AlertCircle} accent="var(--color-status-red)" />
        <StatCard index={2} label="Q2 Revenue" value="₹92.4L" sub="↑ 8.4% vs last quarter" icon={TrendingUp} accent="var(--color-status-green)" />
        <StatCard index={3} label="In finance queue" value={`${snehaData.tasks.length}`} sub={`${snehaData.tasks.filter((t) => t.status === 'blocked').length} blocked`} icon={Receipt} accent={sneha.accentColor} />
      </div>

      {/* Revenue + Sneha's queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <RevenueSnapshot />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card goldRule hover={false}>
            <CardHeader>
              <CardTitle>Finance Queue</CardTitle>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                {sneha.name}&apos;s live tasks
              </p>
            </CardHeader>
            <CardContent className="pt-2 space-y-2">
              {snehaData.tasks.map((task) => {
                const sb = statusBadge[task.status]
                return (
                  <div
                    key={task.id}
                    className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3"
                    style={task.status === 'blocked' ? { background: 'var(--color-status-red-muted)' } : undefined}
                  >
                    <p className="text-sm text-[var(--color-text-primary)] leading-snug">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline">{task.client}</Badge>
                      <Badge variant={sb.variant}>{sb.label}</Badge>
                    </div>
                  </div>
                )
              })}
              <Link
                href="/team/sneha"
                className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-gold)] pt-2 hover:underline"
              >
                Open {sneha.name.split(' ')[0]}&apos;s full dashboard <ArrowRight size={12} />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Collections table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Collections />
      </motion.div>
    </div>
  )
}
