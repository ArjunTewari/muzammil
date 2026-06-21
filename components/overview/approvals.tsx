'use client'

import { AlertCircle, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { approvals } from '@/lib/mock-data'

export function Approvals() {
  const urgent = approvals.filter((a) => a.priority === 'urgent')
  const normal = approvals.filter((a) => a.priority === 'normal')
  const sorted = [...urgent, ...normal]

  return (
    <Card goldRule>
      <CardHeader>
        <CardTitle>Approvals Needed</CardTitle>
        <div className="flex items-center gap-2 mt-1">
          {urgent.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-status-red)]">
              <AlertCircle size={12} />
              {urgent.length} urgent
            </span>
          )}
          <span className="text-xs text-[var(--color-text-tertiary)]">{sorted.length} items waiting</span>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-2">
          {sorted.map((item) => {
            const isUrgent = item.priority === 'urgent'
            const daysColor =
              item.daysWaiting > 7
                ? 'var(--color-status-red)'
                : item.daysWaiting > 3
                ? 'var(--color-status-amber)'
                : 'var(--color-text-tertiary)'
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-[8px] border transition-all duration-100 hover:bg-[var(--color-surface-elevated)]"
                style={{
                  borderColor: isUrgent ? 'var(--color-status-red)' : 'var(--color-border-brand)',
                  background: isUrgent ? 'var(--color-status-red-muted)' : 'transparent',
                }}
              >
                {/* Priority indicator */}
                <div className="flex-shrink-0 mt-0.5">
                  {isUrgent ? (
                    <AlertCircle size={14} className="text-[var(--color-status-red)]" />
                  ) : (
                    <Clock size={14} className="text-[var(--color-text-tertiary)]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text-primary)] leading-snug">
                    <span className="text-[var(--color-gold)]">{item.clientName}</span>
                    {' — '}
                    {item.itemDescription}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {item.projectName} · Waiting on: {item.waitingOn}
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  <span
                    className="text-xs"
                    style={{ fontFamily: 'var(--font-jetbrains-mono)', color: daysColor }}
                  >
                    {item.daysWaiting}d
                  </span>
                  <Button size="sm" variant={isUrgent ? 'primary' : 'secondary'}>
                    Review
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
