'use client'

import { TrendingUp, AlertTriangle, Star, TrendingDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { clients } from '@/lib/mock-data'
import type { ClientStatus } from '@/lib/types'
import { formatLakhs } from '@/lib/utils'

const statusConfig: Record<
  ClientStatus,
  {
    label: string
    icon: React.FC<{ size: number; className?: string; style?: React.CSSProperties }>
    badgeVariant: 'green' | 'amber' | 'red' | 'gold' | 'default'
    borderColor: string
  }
> = {
  'high-value': {
    label: 'High Value',
    icon: Star,
    badgeVariant: 'gold',
    borderColor: 'var(--color-gold)',
  },
  active: {
    label: 'Active',
    icon: TrendingUp,
    badgeVariant: 'green',
    borderColor: 'var(--color-status-green)',
  },
  'at-risk': {
    label: 'At Risk',
    icon: AlertTriangle,
    badgeVariant: 'amber',
    borderColor: 'var(--color-status-amber)',
  },
  'low-margin': {
    label: 'Low Margin',
    icon: TrendingDown,
    badgeVariant: 'default',
    borderColor: 'var(--color-text-tertiary)',
  },
}

export function ClientHealth() {
  return (
    <Card goldRule>
      <CardHeader>
        <CardTitle>Client Health</CardTitle>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{clients.length} active relationships</p>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {clients.map((client) => {
            const cfg = statusConfig[client.status]
            const Icon = cfg.icon
            return (
              <div
                key={client.id}
                className="rounded-[10px] border p-3 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md cursor-default"
                style={{
                  borderColor: cfg.borderColor,
                  background: 'var(--color-surface-elevated)',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">{client.shortName}</p>
                  <Icon
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: cfg.borderColor } as React.CSSProperties}
                  />
                </div>
                <Badge variant={cfg.badgeVariant} className="mb-2">{cfg.label}</Badge>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-text-tertiary)]">Retainer</span>
                    <span
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                    >
                      {formatLakhs(client.retainerValue)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-text-tertiary)]">Projects</span>
                    <span
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                    >
                      {client.activeProjects}
                    </span>
                  </div>
                  {client.outstandingInvoices > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-text-tertiary)]">Outstanding</span>
                      <span
                        className="text-[var(--color-status-amber)]"
                        style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                      >
                        {formatLakhs(client.outstandingInvoices)}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-[var(--color-text-tertiary)] pt-1">
                    {client.accountManager}
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
