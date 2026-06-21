'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { leads } from '@/lib/mock-data'
import type { LeadStage } from '@/lib/types'
import { formatLakhs, formatDateShort } from '@/lib/utils'

const stageConfig: Record<LeadStage, { label: string; color: string }> = {
  new: { label: 'New', color: 'var(--color-text-tertiary)' },
  contacted: { label: 'Contacted', color: 'var(--color-status-blue)' },
  'meeting-set': { label: 'Meeting Set', color: 'var(--color-status-blue)' },
  'proposal-sent': { label: 'Proposal Sent', color: 'var(--color-gold)' },
  negotiation: { label: 'Negotiation', color: 'var(--color-status-amber)' },
  won: { label: 'Won', color: 'var(--color-status-green)' },
  lost: { label: 'Lost', color: 'var(--color-status-red)' },
}

const stageOrder: LeadStage[] = ['new', 'contacted', 'meeting-set', 'proposal-sent', 'negotiation', 'won', 'lost']

export function PipelineLeads() {
  const openLeads = leads.filter((l) => l.stage !== 'won' && l.stage !== 'lost')
  const totalValue = openLeads.reduce((s, l) => s + l.expectedValue, 0)

  return (
    <Card goldRule>
      <CardHeader>
        <CardTitle>Pipeline & Leads</CardTitle>
        <div className="flex items-baseline gap-2 mt-1">
          <span
            className="text-2xl text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            {formatLakhs(totalValue)}
          </span>
          <span className="text-xs text-[var(--color-text-tertiary)]">open pipeline value</span>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        {/* Stage summary row */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 border-b border-[var(--color-border-brand)]">
          {stageOrder.slice(0, 5).map((stage) => {
            const stageleads = leads.filter((l) => l.stage === stage)
            const stageValue = stageleads.reduce((s, l) => s + l.expectedValue, 0)
            const cfg = stageConfig[stage]
            return (
              <div
                key={stage}
                className="flex-shrink-0 rounded-[8px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] px-3 py-2 min-w-[110px]"
              >
                <p className="text-xs mb-1" style={{ color: cfg.color }}>{cfg.label}</p>
                <p
                  className="text-base text-[var(--color-text-primary)]"
                  style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                >
                  {stageleads.length}
                </p>
                {stageValue > 0 && (
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{formatLakhs(stageValue)}</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Lead rows */}
        <div className="space-y-0 divide-y divide-[var(--color-border-brand)]">
          {leads
            .filter((l) => l.stage !== 'lost')
            .sort((a, b) => stageOrder.indexOf(b.stage) - stageOrder.indexOf(a.stage))
            .map((lead) => {
              const cfg = stageConfig[lead.stage]
              return (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 py-3 hover:bg-[var(--color-surface-elevated)] -mx-5 px-5 transition-colors duration-100"
                >
                  {/* Stage dot */}
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: cfg.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--color-text-primary)] truncate">{lead.company}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)] truncate mt-0.5">{lead.nextAction}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="text-sm text-[var(--color-text-secondary)]"
                      style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                    >
                      {formatLakhs(lead.expectedValue)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: cfg.color }}>{cfg.label}</p>
                  </div>
                </div>
              )
            })}
        </div>
      </CardContent>
    </Card>
  )
}
