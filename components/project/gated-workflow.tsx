'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Circle, CheckCircle2, Lock, ShieldCheck, ChevronRight, GitBranch, RotateCcw, PartyPopper } from 'lucide-react'
import { WorkflowTracker } from '@/components/project/workflow-tracker'
import { BLUEPRINT } from '@/lib/blueprint'
import { getBlueprintState, toggleRequirement, canAdvance, advanceStage, resetBlueprint, subscribeBlueprint } from '@/lib/blueprint-store'

export function GatedWorkflow({ projectId, initialStageIndex }: { projectId: string; initialStageIndex: number }) {
  const [, setTick] = useState(0)
  useEffect(() => subscribeBlueprint(() => setTick((t) => t + 1)), [])

  const state = getBlueprintState(projectId, initialStageIndex)
  const stage = BLUEPRINT[state.currentStageIndex]
  const next = BLUEPRINT[state.currentStageIndex + 1]
  const gate = stage?.gate ?? []
  const met = gate.filter((r) => state.satisfied.includes(r.id)).length
  const ready = canAdvance(state)
  const isTerminal = state.currentStageIndex >= BLUEPRINT.length - 1

  return (
    <div className="space-y-4">
      {/* Stage rail */}
      <WorkflowTracker currentStageIndex={state.currentStageIndex} />

      {/* Gate panel */}
      <div className="rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <GitBranch size={14} className="text-[var(--color-gold)] flex-shrink-0" />
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {isTerminal ? 'Final stage' : `Gate: ${stage.label} → ${next.label}`}
            </p>
          </div>
          <button
            onClick={() => resetBlueprint(projectId, initialStageIndex)}
            className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer flex-shrink-0"
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>

        {isTerminal ? (
          <div className="flex items-center gap-2 rounded-[10px] bg-[var(--color-status-green-muted)] px-3 py-3">
            <PartyPopper size={16} className="text-[var(--color-status-green)]" />
            <p className="text-sm text-[var(--color-status-green)] font-medium">Campaign complete — every gate cleared.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
              This stage can&apos;t advance until every requirement below is met.
            </p>

            <div className="space-y-2 mb-4">
              {gate.map((r) => {
                const done = state.satisfied.includes(r.id)
                const isApproval = r.kind === 'approval'
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-[10px] border p-2.5"
                    style={{
                      borderColor: done ? (isApproval ? 'var(--color-status-green)' : 'var(--color-border-brand)') : isApproval ? 'var(--color-gold-border)' : 'var(--color-border-brand)',
                      background: isApproval && !done ? 'var(--color-gold-muted)' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {isApproval ? (
                        done ? <ShieldCheck size={15} className="text-[var(--color-status-green)] flex-shrink-0" /> : <Lock size={15} className="text-[var(--color-gold)] flex-shrink-0" />
                      ) : done ? (
                        <CheckCircle2 size={15} className="text-[var(--color-status-green)] flex-shrink-0" />
                      ) : (
                        <Circle size={15} className="text-[var(--color-text-tertiary)] flex-shrink-0" />
                      )}
                      <span className={`text-sm min-w-0 ${done ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-primary)]'}`}>
                        {r.label}
                        {isApproval && <span className="ml-1.5 text-[10px] uppercase tracking-wider text-[var(--color-gold)]">founder gate</span>}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleRequirement(projectId, initialStageIndex, r.id)}
                      className={`text-xs font-medium rounded-[7px] px-2.5 py-1 flex-shrink-0 active:scale-95 transition-all cursor-pointer ${
                        done
                          ? 'border border-[var(--color-border-brand)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                          : isApproval
                            ? 'bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[#d4b46a]'
                            : 'border border-[var(--color-border-brand)] text-[var(--color-text-secondary)] hover:border-[var(--color-gold-border)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {done ? 'Undo' : isApproval ? 'Approve' : 'Mark done'}
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileTap={ready ? { scale: 0.98 } : undefined}
                onClick={() => advanceStage(projectId, initialStageIndex)}
                disabled={!ready}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] bg-[var(--color-gold)] text-[var(--color-ink)] text-sm font-semibold hover:bg-[#d4b46a] hover:shadow-[var(--shadow-glow-gold)] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Advance to {next.label} <ChevronRight size={15} />
              </motion.button>
              {!ready && (
                <span className="text-xs text-[var(--color-text-tertiary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                  {met}/{gate.length} met
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
