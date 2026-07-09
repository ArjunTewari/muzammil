'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Quote, Check, Package, ShieldCheck, Database } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  getProjectsForEmployee,
  acceptProject,
  subscribeProjects,
  type AssignedProject,
} from '@/lib/project-store'
import { getRelevantMemories } from '@/lib/memory-store'
import { formatLakhs } from '@/lib/utils'

export function AssignedProjects({
  employeeId,
  viewedByMaster = false,
}: {
  employeeId: string
  viewedByMaster?: boolean
}) {
  const [projects, setProjects] = useState<AssignedProject[]>([])

  useEffect(() => {
    const refresh = () => setProjects(getProjectsForEmployee(employeeId))
    refresh()
    return subscribeProjects(refresh)
  }, [employeeId])

  if (projects.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={15} className="text-[var(--color-gold)]" />
        <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
          Assigned by Muzammil
        </h2>
        <Badge variant="gold">{projects.length}</Badge>
      </div>

      <AnimatePresence initial={false}>
        {projects.map((p) => {
          const memApplied = getRelevantMemories(p.client, 12).length
          const isNew = p.status === 'new'
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[14px] border border-[var(--color-gold-border)] overflow-hidden"
              style={{ background: 'linear-gradient(180deg, var(--color-gold-muted), var(--color-surface) 34%)' }}
            >
              <span aria-hidden className="gold-sweep" />

              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--color-gold)] font-semibold mb-0.5">
                      New brief · {p.client}
                    </p>
                    <h3 className="text-lg text-[var(--color-text-primary)] leading-tight" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
                      {p.title}
                    </h3>
                  </div>
                  <Badge variant={isNew ? 'gold' : 'green'}>{isNew ? 'New' : 'Accepted'}</Badge>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  {p.brief.decodedAsk}
                </p>

                {/* Deliverables + meta */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <Package size={13} className="text-[var(--color-text-tertiary)]" />
                  {p.brief.deliverables.map((d) => (
                    <span key={d} className="text-xs rounded-[6px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] px-2 py-0.5">
                      {d}
                    </span>
                  ))}
                  <span className="text-xs text-[var(--color-text-tertiary)] ml-1" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {formatLakhs(p.brief.budget)} · due {p.brief.dueDate}
                  </span>
                </div>

                {/* Muzammil's instructions */}
                {p.instructions.length > 0 && (
                  <div className="mb-3">
                    <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-medium mb-1.5">
                      <Quote size={11} /> Muzammil&apos;s instructions
                    </p>
                    <div className="space-y-1.5">
                      {p.instructions.map((q, i) => (
                        <p key={i} className="text-xs text-[var(--color-text-secondary)] italic border-l-2 border-[var(--color-gold-border)] pl-2.5 leading-snug">
                          &ldquo;{q}&rdquo;
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance + memory applied */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-tertiary)]">
                  {p.brief.complianceNotes?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={12} className="text-[var(--color-status-amber)]" />
                      {p.brief.complianceNotes.length} compliance notes
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Database size={12} className="text-[var(--color-gold)]" />
                    {memApplied} memories applied
                  </span>
                </div>

                {/* Accept */}
                {isNew && !viewedByMaster && (
                  <button
                    onClick={() => acceptProject(p.id)}
                    className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-[9px] bg-[var(--color-gold)] text-[var(--color-ink)] text-sm font-semibold hover:bg-[#d4b46a] hover:shadow-[var(--shadow-glow-gold)] active:scale-[0.97] transition-all duration-200 cursor-pointer"
                  >
                    <Check size={14} /> Accept & start
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
