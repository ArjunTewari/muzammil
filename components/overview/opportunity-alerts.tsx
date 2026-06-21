'use client'

import { Zap, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { opportunityAlerts } from '@/lib/mock-data'
import { formatLakhs } from '@/lib/utils'

const urgencyColor = {
  high: 'var(--color-gold)',
  medium: 'var(--color-status-amber)',
  low: 'var(--color-text-tertiary)',
}

export function OpportunityAlerts() {
  return (
    <Card goldRule>
      <CardHeader>
        <CardTitle>Opportunity Alerts</CardTitle>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
          {opportunityAlerts.length} signals detected
        </p>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-3">
          {opportunityAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-[10px] border border-[var(--color-border-brand)] p-4 hover:bg-[var(--color-surface-elevated)] transition-all duration-100 group"
              style={{
                borderLeft: `2px solid ${urgencyColor[alert.urgency]}`,
              }}
            >
              <div className="flex items-start gap-3">
                <Zap
                  size={14}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: urgencyColor[alert.urgency] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium mb-1" style={{ color: urgencyColor[alert.urgency] }}>
                    {alert.clientName}
                    {' — '}
                    <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                      {formatLakhs(alert.potentialValue)}
                    </span>
                    {' opportunity'}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                    {alert.signal}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--color-text-tertiary)] italic">
                      → {alert.suggestedAction}
                    </p>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Act <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
