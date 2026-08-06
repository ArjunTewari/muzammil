'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Pencil, ScanSearch, PenLine, Database, Target, ListChecks, BookMarked, ShieldAlert, ThumbsUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RunConsole } from '@/components/studio/run-console'
import { ValueBar } from '@/components/studio/value-bar'
import { AgentForm } from '@/components/studio/agent-form'
import { getAgent, getMemory, getStats, updateAgent, subscribeStudio } from '@/lib/studio/agent-store'
import type { MemoryType } from '@/lib/studio/types'

const memMeta: Record<MemoryType, { icon: typeof BookMarked; variant: 'gold' | 'red' | 'green'; label: string }> = {
  rule: { icon: BookMarked, variant: 'gold', label: 'Rule' },
  correction: { icon: ShieldAlert, variant: 'red', label: 'Correction' },
  approval: { icon: ThumbsUp, variant: 'green', label: 'Confirmed' },
}

export default function AgentWorkbenchPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = use(params)
  const [, setTick] = useState(0)
  const [editing, setEditing] = useState(false)

  useEffect(() => subscribeStudio(() => setTick((t) => t + 1)), [])

  const agent = getAgent(agentId)
  if (!agent) notFound()
  const memory = getMemory(agentId)
  const stats = getStats(agentId)
  const ModeIcon = agent.mode === 'review' ? ScanSearch : PenLine

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      <Link href="/studio" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors duration-100">
        <ArrowLeft size={14} /> Back to Studio
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[var(--color-gold-muted)] border border-[var(--color-gold-border)] flex items-center justify-center flex-shrink-0">
            <ModeIcon size={19} className="text-[var(--color-gold)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl text-[var(--color-text-primary)] leading-tight" style={{ fontFamily: 'var(--font-instrument-serif)' }}>{agent.name}</h1>
              <Badge variant={agent.mode === 'review' ? 'blue' : 'gold'}>{agent.mode === 'review' ? 'Review' : 'Generate'}</Badge>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)]">{agent.goal}</p>
          </div>
        </div>
        <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[9px] border border-[var(--color-border-brand)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-gold-border)] active:scale-95 transition-all cursor-pointer">
          <Pencil size={13} /> Edit
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Run console */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="lg:col-span-2">
          <RunConsole agent={agent} />
        </motion.div>

        {/* Definition + brain */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-4">
          <ValueBar runs={stats.runs} findingsCaught={stats.findingsCaught} minutesSaved={stats.minutesSaved} />

          {/* Definition */}
          <Card goldRule hover={false} className="p-4">
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-medium mb-2"><Target size={11} /> Task</p>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">{agent.task}</p>
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-medium mb-2"><ListChecks size={11} /> Rules</p>
            <ul className="space-y-1.5">
              {agent.rules.map((r, i) => (
                <li key={i} className="text-xs text-[var(--color-text-secondary)] flex items-start gap-1.5 leading-snug">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-gold)] flex-shrink-0 mt-1.5" />
                  {r}
                </li>
              ))}
            </ul>
          </Card>

          {/* Memory */}
          <Card goldRule hover={false} className="p-4">
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-medium mb-3">
              <Database size={11} /> What it&apos;s learned
            </p>
            {memory.length === 0 ? (
              <p className="text-xs text-[var(--color-text-tertiary)]">Nothing yet — correct a result and it remembers.</p>
            ) : (
              <div className="space-y-2">
                {memory.map((m) => {
                  const meta = memMeta[m.type]
                  const Icon = meta.icon
                  return (
                    <div key={m.id} className="rounded-[9px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={12} style={{ color: meta.variant === 'red' ? 'var(--color-status-red)' : meta.variant === 'green' ? 'var(--color-status-green)' : 'var(--color-gold)' }} />
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </div>
                      <p className="text-xs text-[var(--color-text-primary)] leading-snug">{m.content}</p>
                      {m.reason && <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">Why: {m.reason}</p>}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <AgentForm
        open={editing}
        initial={agent}
        onSave={(draft) => {
          updateAgent(agent.id, draft)
          setEditing(false)
        }}
        onClose={() => setEditing(false)}
      />
    </div>
  )
}
