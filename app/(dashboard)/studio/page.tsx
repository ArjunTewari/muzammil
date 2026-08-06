'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, ArrowRight, ScanSearch, PenLine, Workflow } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ValueBar } from '@/components/studio/value-bar'
import { AgentForm } from '@/components/studio/agent-form'
import { getAgents, getStats, createAgent, studioTotals, subscribeStudio } from '@/lib/studio/agent-store'
import type { StudioAgent } from '@/lib/studio/types'

export default function StudioPage() {
  const [, setTick] = useState(0)
  const [creating, setCreating] = useState(false)

  useEffect(() => subscribeStudio(() => setTick((t) => t + 1)), [])

  const agents = getAgents()
  const totals = studioTotals()

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[var(--color-gold)] flex items-center justify-center shadow-[var(--shadow-glow-gold)]">
            <Workflow size={20} className="text-[var(--color-ink)]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl text-[var(--color-text-primary)] leading-tight" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
              Agent Studio
            </h1>
            <p className="text-sm text-[var(--color-text-tertiary)]">Build an agent, give it your rules, and train it as you go</p>
          </div>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] bg-[var(--color-gold)] text-[var(--color-ink)] text-sm font-semibold hover:bg-[#d4b46a] hover:shadow-[var(--shadow-glow-gold)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <Plus size={15} /> New Agent
        </button>
      </motion.div>

      {/* Value */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}>
        <ValueBar runs={totals.runs} findingsCaught={totals.findingsCaught} minutesSaved={totals.minutesSaved} agents={totals.agents} />
      </motion.div>

      {/* Agents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {agents.map((agent, i) => {
          const stats = getStats(agent.id)
          const ModeIcon = agent.mode === 'review' ? ScanSearch : PenLine
          return (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 + i * 0.05 }}>
              <Link href={`/studio/${agent.id}`}>
                <Card goldRule className="p-4 group cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-9 h-9 rounded-[9px] bg-[var(--color-gold-muted)] border border-[var(--color-gold-border)] flex items-center justify-center flex-shrink-0">
                      <ModeIcon size={17} className="text-[var(--color-gold)]" />
                    </div>
                    <Badge variant={agent.mode === 'review' ? 'blue' : 'gold'}>{agent.mode === 'review' ? 'Review' : 'Generate'}</Badge>
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-gold)] transition-colors duration-100">
                    {agent.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1 leading-snug flex-1">{agent.goal}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border-brand)]">
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{agent.rules.length}</span> rules ·{' '}
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{stats.runs}</span> runs
                    </span>
                    <ArrowRight size={15} className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <AgentForm
        open={creating}
        onSave={(draft) => {
          const agent = createAgent(draft)
          setCreating(false)
          window.location.href = `/studio/${agent.id}`
        }}
        onClose={() => setCreating(false)}
      />
    </div>
  )
}
