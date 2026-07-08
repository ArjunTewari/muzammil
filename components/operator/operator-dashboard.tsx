'use client'

import { motion } from 'framer-motion'
import {
  Clock,
  CheckCircle2,
  Layers,
  Timer,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AppUser } from '@/lib/users'
import type { OperatorData, TaskStatus, TaskPriority } from '@/lib/operator-data'

const statusBadge: Record<TaskStatus, { variant: 'blue' | 'red' | 'amber' | 'green'; label: string }> = {
  'in-progress': { variant: 'blue', label: 'In progress' },
  blocked: { variant: 'red', label: 'Blocked' },
  waiting: { variant: 'amber', label: 'Waiting' },
  done: { variant: 'green', label: 'Done' },
}

const priorityDot: Record<TaskPriority, string> = {
  urgent: 'var(--color-status-red)',
  normal: 'var(--color-gold)',
  low: 'var(--color-text-tertiary)',
}

const handoffBadge: Record<string, 'green' | 'blue' | 'amber'> = {
  approved: 'green',
  delivered: 'blue',
  'in-review': 'amber',
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  index,
  accent,
}: {
  label: string
  value: string
  sub?: string
  icon: typeof Clock
  index: number
  accent?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card goldRule hover={false} className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-medium">
            {label}
          </p>
          <Icon size={15} style={{ color: accent ?? 'var(--color-text-tertiary)' }} />
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

export function OperatorDashboard({
  user,
  data,
  viewedByMaster = false,
}: {
  user: AppUser
  data: OperatorData
  viewedByMaster?: boolean
}) {
  const totalHours = data.timeBreakdown.reduce((s, b) => s + b.hours, 0)
  const maxBar = Math.max(...data.timeBreakdown.map((b) => b.hours), 1)
  const blocked = data.tasks.filter((t) => t.status === 'blocked').length

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      {!viewedByMaster && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1
            className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Good morning, {user.name.split(' ')[0]}.
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            {user.title} · {data.stats.activeCount} active tasks
            {blocked > 0 && (
              <span className="text-[var(--color-status-red)]"> · {blocked} blocked</span>
            )}
          </p>
        </motion.div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          index={0}
          label="Hours this month"
          value={`${data.stats.hoursThisMonth}h`}
          sub={`vs ${data.stats.avgPerMonth}h typical`}
          icon={Clock}
          accent={user.accentColor}
        />
        <StatCard
          index={1}
          label="Time saved"
          value={`${Math.max(data.stats.avgPerMonth - data.stats.hoursThisMonth, 0)}h`}
          sub="with Maestro this month"
          icon={Timer}
          accent="var(--color-status-green)"
        />
        <StatCard
          index={2}
          label="Completed"
          value={`${data.stats.completedThisMonth}`}
          sub="tasks this month"
          icon={CheckCircle2}
          accent="var(--color-status-green)"
        />
        <StatCard
          index={3}
          label="Active"
          value={`${data.stats.activeCount}`}
          sub={blocked > 0 ? `${blocked} blocked` : 'all moving'}
          icon={Layers}
          accent="var(--color-gold)"
        />
      </div>

      {/* Active tasks + time breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <Card goldRule hover={false}>
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                {data.tasks.length} in your queue
              </p>
            </CardHeader>
            <CardContent className="pt-2 space-y-2">
              {data.tasks.map((task) => {
                const sb = statusBadge[task.status]
                return (
                  <div
                    key={task.id}
                    className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3 transition-colors duration-100 hover:border-[var(--color-gold-border)]"
                    style={
                      task.status === 'blocked'
                        ? { background: 'var(--color-status-red-muted)' }
                        : undefined
                    }
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: priorityDot[task.priority] }}
                        title={`${task.priority} priority`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-[var(--color-text-primary)] leading-snug">
                          {task.title}
                        </p>
                        <div className="flex items-center flex-wrap gap-2 mt-1.5">
                          <Badge variant="outline">{task.client}</Badge>
                          <Badge variant={sb.variant}>{sb.label}</Badge>
                          <span
                            className="text-xs text-[var(--color-text-tertiary)]"
                            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                          >
                            ~{task.estimatedHours}h
                          </span>
                        </div>
                        {task.note && (
                          <p className="text-xs text-[var(--color-text-tertiary)] mt-1.5 flex items-start gap-1">
                            <AlertCircle size={11} className="flex-shrink-0 mt-0.5" />
                            {task.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Time breakdown */}
        <Card goldRule hover={false}>
          <CardHeader>
            <CardTitle>Where time goes</CardTitle>
            <p
              className="text-xl text-[var(--color-text-primary)] mt-1"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {totalHours}{' '}
              <span
                className="text-sm text-[var(--color-text-secondary)]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                hours / month
              </span>
            </p>
          </CardHeader>
          <CardContent className="pt-3 space-y-3">
            {data.timeBreakdown.map((b, i) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-secondary)]">{b.label}</span>
                  <span
                    className="text-[var(--color-text-tertiary)]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                  >
                    {b.hours}h
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--color-border-brand)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(b.hours / maxBar) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: user.accentColor }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Waiting on + Handoffs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card goldRule hover={false}>
          <CardHeader>
            <CardTitle>Waiting On Others</CardTitle>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              {data.waiting.length} upstream dependencies
            </p>
          </CardHeader>
          <CardContent className="pt-2 space-y-2">
            {data.waiting.map((w, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-[10px] border border-[var(--color-border-brand)] p-3"
                style={w.urgent ? { borderColor: 'var(--color-status-red)' } : undefined}
              >
                <ArrowDownLeft
                  size={15}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: w.urgent ? 'var(--color-status-red)' : 'var(--color-text-tertiary)' }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--color-text-primary)] leading-snug">{w.title}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                    from <span className="text-[var(--color-text-secondary)]">{w.from}</span> ·{' '}
                    {w.sinceDays}d ago
                  </p>
                </div>
                {w.urgent && <Badge variant="red">Urgent</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card goldRule hover={false}>
          <CardHeader>
            <CardTitle>My Handoffs</CardTitle>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              work passed downstream
            </p>
          </CardHeader>
          <CardContent className="pt-2 space-y-2">
            {data.handoffs.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-[10px] border border-[var(--color-border-brand)] p-3"
              >
                <ArrowUpRight
                  size={15}
                  className="flex-shrink-0 mt-0.5 text-[var(--color-text-tertiary)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--color-text-primary)] leading-snug">{h.title}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                    to <span className="text-[var(--color-text-secondary)]">{h.to}</span> · {h.daysAgo}
                    d ago
                  </p>
                </div>
                <Badge variant={handoffBadge[h.status] ?? 'default'}>{h.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Maestro insight */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-[12px] border border-[var(--color-gold-border)] bg-[var(--color-gold-muted)] p-4 sm:p-5 flex items-start gap-3"
      >
        <div className="w-9 h-9 rounded-[8px] bg-[var(--color-gold)] flex items-center justify-center flex-shrink-0">
          <Sparkles size={17} className="text-[var(--color-ink)]" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--color-gold)] font-semibold mb-1">
            How Maestro helps {user.name.split(' ')[0]}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{data.insight}</p>
        </div>
      </motion.div>
    </div>
  )
}
