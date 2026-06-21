'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { projects } from '@/lib/mock-data'
import type { ProjectStatus } from '@/lib/types'
import { formatLakhs, formatDateShort, daysUntil } from '@/lib/utils'

const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; bg: string; badgeVariant: 'green' | 'amber' | 'red' | 'blue' | 'default' }
> = {
  'on-track': { label: 'On Track', color: 'var(--color-status-green)', bg: 'var(--color-status-green-muted)', badgeVariant: 'green' },
  delayed: { label: 'Delayed', color: 'var(--color-status-amber)', bg: 'var(--color-status-amber-muted)', badgeVariant: 'amber' },
  blocked: { label: 'Blocked', color: 'var(--color-status-red)', bg: 'var(--color-status-red-muted)', badgeVariant: 'red' },
  'awaiting-client': { label: 'Awaiting Client', color: 'var(--color-status-blue)', bg: 'var(--color-status-blue-muted)', badgeVariant: 'blue' },
  'awaiting-review': { label: 'Awaiting Review', color: 'var(--color-gold)', bg: 'var(--color-gold-muted)', badgeVariant: 'default' },
  'awaiting-finance': { label: 'Awaiting Finance', color: 'var(--color-text-tertiary)', bg: 'var(--color-border-brand)', badgeVariant: 'default' },
}

const statusOrder: ProjectStatus[] = ['on-track', 'awaiting-client', 'awaiting-review', 'delayed', 'blocked', 'awaiting-finance']

export function ProjectHealth() {
  const [filter, setFilter] = useState<ProjectStatus | null>(null)

  const counts = statusOrder.reduce<Record<string, number>>((acc, s) => {
    acc[s] = projects.filter((p) => p.status === s).length
    return acc
  }, {})
  const total = projects.length

  const filtered = filter ? projects.filter((p) => p.status === filter) : projects

  return (
    <Card goldRule>
      <CardHeader>
        <CardTitle>Project Health</CardTitle>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{total} active projects</p>
      </CardHeader>
      <CardContent className="pt-3">
        {/* Stacked bar */}
        <div className="flex h-2.5 rounded-full overflow-hidden mb-3">
          {statusOrder.map((s) => (
            <div
              key={s}
              style={{
                width: `${(counts[s] / total) * 100}%`,
                background: statusConfig[s].color,
              }}
            />
          ))}
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFilter(null)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-100 cursor-pointer ${
              filter === null
                ? 'border-[var(--color-gold)] bg-[var(--color-gold-muted)] text-[var(--color-gold)]'
                : 'border-[var(--color-border-brand)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)]'
            }`}
          >
            All ({total})
          </button>
          {statusOrder.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(filter === s ? null : s)}
              className="text-xs px-2.5 py-1 rounded-full border transition-all duration-100 cursor-pointer"
              style={{
                borderColor: filter === s ? statusConfig[s].color : 'var(--color-border-brand)',
                background: filter === s ? statusConfig[s].bg : 'transparent',
                color: filter === s ? statusConfig[s].color : 'var(--color-text-secondary)',
              }}
            >
              {statusConfig[s].label} ({counts[s]})
            </button>
          ))}
        </div>

        {/* Project list */}
        <div className="space-y-0 divide-y divide-[var(--color-border-brand)]">
          {filtered.map((project) => {
            const cfg = statusConfig[project.status]
            const days = daysUntil(project.dueDate)
            return (
              <div
                key={project.id}
                className="flex items-center gap-4 py-3 hover:bg-[var(--color-surface-elevated)] -mx-5 px-5 transition-colors duration-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text-primary)] truncate">{project.name}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{project.clientName}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="text-xs hidden sm:block"
                    style={{ fontFamily: 'var(--font-jetbrains-mono)', color: days < 0 ? 'var(--color-status-red)' : days < 7 ? 'var(--color-status-amber)' : 'var(--color-text-tertiary)' }}
                  >
                    {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'today' : `${days}d`}
                  </span>
                  <Badge variant={cfg.badgeVariant}>{cfg.label}</Badge>
                  <div className="text-xs hidden md:block" style={{ fontFamily: 'var(--font-jetbrains-mono)', color: 'var(--color-text-tertiary)' }}>
                    {formatLakhs(project.budget)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
