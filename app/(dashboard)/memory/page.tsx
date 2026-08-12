'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Database, BookMarked, ThumbsUp, ShieldAlert } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getMemories,
  memoryCounts,
  subscribeMemory,
  type MemoryEntry,
  type MemoryType,
} from '@/lib/memory-store'

const typeMeta: Record<MemoryType, { label: string; icon: typeof BookMarked; variant: 'gold' | 'green' | 'red'; color: string }> = {
  instruction: { label: 'Instruction', icon: BookMarked, variant: 'gold', color: 'var(--color-gold)' },
  approval: { label: 'Approved', icon: ThumbsUp, variant: 'green', color: 'var(--color-status-green)' },
  rejection: { label: 'Correction', icon: ShieldAlert, variant: 'red', color: 'var(--color-status-red)' },
}

function timeAgo(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 1000)
  if (d < 60) return 'just now'
  if (d < 3600) return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  return `${Math.floor(d / 86400)}d ago`
}

export default function MemoryPage() {
  const [entries, setEntries] = useState<MemoryEntry[]>([])
  const [counts, setCounts] = useState({ total: 0, instruction: 0, approval: 0, rejection: 0 })

  useEffect(() => {
    const refresh = () => {
      setEntries(getMemories())
      setCounts(memoryCounts())
    }
    refresh()
    return subscribeMemory(refresh)
  }, [])

  const stats = [
    { label: 'Total memories', value: counts.total, icon: Database, color: 'var(--color-gold)' },
    { label: 'Instructions', value: counts.instruction, icon: BookMarked, color: 'var(--color-gold)' },
    { label: 'Approvals', value: counts.approval, icon: ThumbsUp, color: 'var(--color-status-green)' },
    { label: 'Corrections', value: counts.rejection, icon: ShieldAlert, color: 'var(--color-status-red)' },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
          Memory
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          What Maestro has learned — from your instructions and from every approval &amp; correction. Injected into every Architect session.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}>
              <Card goldRule hover={false} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-medium">{s.label}</p>
                  <Icon size={15} style={{ color: s.color }} />
                </div>
                <div className="text-2xl text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 400 }}>
                  {s.value}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Entries */}
      <Card goldRule hover={false}>
        <div className="px-5 pt-5 pb-3 border-b border-[var(--color-border-brand)]">
          <p className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            Learned Rules
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
            Newest first · corrections carry the most weight
          </p>
        </div>
        <div className="p-3 sm:p-4 space-y-2">
          {entries.length === 0 ? (
            <p className="text-sm text-[var(--color-text-tertiary)] text-center py-8">No memories yet.</p>
          ) : (
            entries.map((e, i) => {
              const meta = typeMeta[e.type]
              const Icon = meta.icon
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                  className="flex items-start gap-3 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3"
                >
                  <div
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${meta.color} 14%, transparent)` }}
                  >
                    <Icon size={15} style={{ color: meta.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      {e.client && <span className="text-[11px] text-[var(--color-text-tertiary)]">{e.client}</span>}
                      <span className="text-[11px] text-[var(--color-text-tertiary)] ml-auto">{timeAgo(e.createdAt)}</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-primary)] leading-snug">{e.content}</p>
                    {e.reason && (
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1 leading-snug">
                        <span className="text-[var(--color-text-secondary)]">Why:</span> {e.reason}
                      </p>
                    )}
                    <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1 uppercase tracking-wider">
                      {e.source}
                    </p>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}
