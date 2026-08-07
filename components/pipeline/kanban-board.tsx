'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GripVertical } from 'lucide-react'
import { leads } from '@/lib/mock-data'
import { formatLakhs } from '@/lib/utils'
import { getLeadStage, setLeadStage, subscribePipeline } from '@/lib/pipeline-store'
import type { LeadStage } from '@/lib/types'

const STAGES: { id: LeadStage; label: string; accent: string }[] = [
  { id: 'new', label: 'New', accent: 'var(--color-text-tertiary)' },
  { id: 'contacted', label: 'Contacted', accent: 'var(--color-status-blue)' },
  { id: 'meeting-set', label: 'Meeting Set', accent: 'var(--color-status-blue)' },
  { id: 'proposal-sent', label: 'Proposal Sent', accent: 'var(--color-gold)' },
  { id: 'negotiation', label: 'Negotiation', accent: 'var(--color-gold)' },
  { id: 'won', label: 'Won', accent: 'var(--color-status-green)' },
  { id: 'lost', label: 'Lost', accent: 'var(--color-status-red)' },
]

export function KanbanBoard() {
  const [, setTick] = useState(0)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<LeadStage | null>(null)

  useEffect(() => subscribePipeline(() => setTick((t) => t + 1)), [])

  const withStage = leads.map((l) => ({ ...l, currentStage: getLeadStage(l.id, l.stage) }))

  function drop(stage: LeadStage) {
    if (dragId) setLeadStage(dragId, stage)
    setDragId(null)
    setOverStage(null)
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max">
        {STAGES.map((stage) => {
          const inStage = withStage.filter((l) => l.currentStage === stage.id)
          const total = inStage.reduce((s, l) => s + l.expectedValue, 0)
          const isOver = overStage === stage.id
          return (
            <div
              key={stage.id}
              onDragOver={(e) => {
                e.preventDefault()
                setOverStage(stage.id)
              }}
              onDragLeave={() => setOverStage((s) => (s === stage.id ? null : s))}
              onDrop={() => drop(stage.id)}
              className="w-[260px] flex-shrink-0 rounded-[12px] border bg-[var(--color-surface)] transition-colors duration-150"
              style={{ borderColor: isOver ? 'var(--color-gold-border)' : 'var(--color-border-brand)', boxShadow: 'var(--shadow-card)' }}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-border-brand)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: stage.accent }} />
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">{stage.label}</span>
                  <span className="text-xs text-[var(--color-text-tertiary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {inStage.length}
                  </span>
                </div>
                {total > 0 && (
                  <span className="text-[11px] text-[var(--color-text-tertiary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {formatLakhs(total)}
                  </span>
                )}
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[120px]">
                {inStage.map((lead) => (
                  <motion.div
                    layout
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragId(lead.id)}
                    onDragEnd={() => setDragId(null)}
                    className={`group rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-2.5 cursor-grab active:cursor-grabbing transition-shadow ${
                      dragId === lead.id ? 'opacity-50' : 'hover:border-[var(--color-gold-border)]'
                    }`}
                  >
                    <div className="flex items-start gap-1.5">
                      <GripVertical size={13} className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] leading-tight truncate">{lead.company}</p>
                        <p className="text-xs text-[var(--color-text-tertiary)] truncate">{lead.contactName} · {lead.contactTitle}</p>
                      </div>
                      <span className="text-xs text-[var(--color-gold)] flex-shrink-0" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {formatLakhs(lead.expectedValue)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-snug">{lead.nextAction}</p>
                    {/* Accessible / mobile move control */}
                    <select
                      value={lead.currentStage}
                      onChange={(e) => setLeadStage(lead.id, e.target.value as LeadStage)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 w-full text-[11px] rounded-[6px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] text-[var(--color-text-tertiary)] px-1.5 py-1 outline-none focus:border-[var(--color-gold-border)] cursor-pointer"
                      aria-label={`Move ${lead.company}`}
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </motion.div>
                ))}
                {inStage.length === 0 && (
                  <p className="text-[11px] text-[var(--color-text-tertiary)] text-center py-4">Drop here</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
