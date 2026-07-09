'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader, Clock, AlertCircle, Workflow, ChevronRight, ThumbsUp, Flag } from 'lucide-react'
import { AGENTS, MASTER_AGENT, getAgent } from '@/lib/agents'
import { AGENT_ICON } from '@/components/agents/agent-icon'
import { ReasonDialog } from '@/components/architect/reason-dialog'
import { addMemory } from '@/lib/memory-store'
import type { EmployeeProject, AgentStatus } from '@/lib/employee-projects'
import type { AgentId } from '@/lib/agents'

const statusMeta: Record<
  AgentStatus,
  { label: string; color: string; bg: string; icon: typeof CheckCircle2; spin?: boolean }
> = {
  done: { label: 'Done', color: 'var(--color-status-green)', bg: 'var(--color-status-green-muted)', icon: CheckCircle2 },
  working: { label: 'Working', color: 'var(--color-gold)', bg: 'var(--color-gold-muted)', icon: Loader, spin: true },
  queued: { label: 'Queued', color: 'var(--color-text-tertiary)', bg: 'var(--color-surface-elevated)', icon: Clock },
  'needs-input': { label: 'Needs you', color: 'var(--color-status-red)', bg: 'var(--color-status-red-muted)', icon: AlertCircle },
}

export function AgentPipeline({ project }: { project: EmployeeProject }) {
  const stateFor = (agentId: string) => project.agentStates.find((s) => s.agentId === agentId)!

  // Human-in-the-loop: approve or flag a step that needs input. Each decision,
  // with its reason, becomes a memory the system learns from.
  const [acted, setActed] = useState<Record<string, 'approved' | 'flagged'>>({})
  const [dialog, setDialog] = useState<{ agentId: AgentId; action: 'approve' | 'flag' } | null>(null)

  function record(reason: string) {
    if (!dialog) return
    const agent = getAgent(dialog.agentId)
    if (dialog.action === 'approve') {
      addMemory({
        type: 'approval',
        content: `Approved ${agent.name}'s work on ${project.client} — ${project.projectTitle}`,
        reason: reason || undefined,
        client: project.client,
        source: `${agent.name} · pipeline`,
      })
      setActed((a) => ({ ...a, [dialog.agentId]: 'approved' }))
    } else {
      addMemory({
        type: 'rejection',
        content: `Flagged ${agent.name}'s output on ${project.client} — ${project.projectTitle}`,
        reason,
        client: project.client,
        source: `${agent.name} · pipeline`,
      })
      setActed((a) => ({ ...a, [dialog.agentId]: 'flagged' }))
    }
    setDialog(null)
  }

  return (
    <div className="relative rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-gold)] z-10" />

      {/* Master Agent header */}
      <div className="p-4 sm:p-5 border-b border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--color-gold-muted),transparent)]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[var(--color-gold)] flex items-center justify-center flex-shrink-0">
            <Workflow size={20} className="text-[var(--color-ink)]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                {MASTER_AGENT.name}
              </h3>
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[var(--color-gold)] text-[var(--color-ink)] font-bold">
                Orchestrating
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-1">
              {MASTER_AGENT.description}
            </p>
          </div>
        </div>
      </div>

      {/* Agent chain */}
      <div className="p-3 sm:p-4 space-y-2">
        {AGENTS.map((agent, i) => {
          const state = stateFor(agent.id)
          const meta = statusMeta[state.status]
          const StatusIcon = meta.icon
          const AgentGlyph = AGENT_ICON[agent.iconKey]
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <div className="flex items-start gap-3 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3">
                {/* Order + agent glyph */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className="w-9 h-9 rounded-[9px] flex items-center justify-center"
                    style={{ background: `${agent.color}1f`, color: agent.color }}
                  >
                    <AgentGlyph size={17} />
                  </div>
                  {i < AGENTS.length - 1 && (
                    <div className="w-px h-3 bg-[var(--color-border-brand)]" />
                  )}
                </div>

                {/* Body */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {agent.name}
                      </p>
                      <span className="hidden sm:inline text-xs text-[var(--color-text-tertiary)] truncate">
                        · {agent.tagline}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1.5 rounded-full px-2 py-0.5 flex-shrink-0"
                      style={{ background: meta.bg }}
                    >
                      <StatusIcon size={11} style={{ color: meta.color }} className={meta.spin ? 'animate-spin' : ''} />
                      <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 flex items-start gap-1">
                    <ChevronRight size={11} className="flex-shrink-0 mt-0.5 text-[var(--color-text-tertiary)]" />
                    {state.lastAction}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1 leading-relaxed pl-4">
                    {state.output}
                  </p>

                  {/* Human-in-the-loop on steps that need a decision */}
                  {state.status === 'needs-input' && (
                    <div className="pl-4 mt-2">
                      {acted[agent.id] ? (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-medium"
                          style={{ color: acted[agent.id] === 'approved' ? 'var(--color-status-green)' : 'var(--color-status-red)' }}
                        >
                          {acted[agent.id] === 'approved' ? <ThumbsUp size={11} /> : <Flag size={11} />}
                          {acted[agent.id] === 'approved' ? 'Approved — remembered' : 'Flagged — remembered'}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDialog({ agentId: agent.id, action: 'approve' })}
                            className="inline-flex items-center gap-1 text-[11px] font-medium rounded-[6px] border border-[var(--color-status-green)] text-[var(--color-status-green)] px-2 py-1 hover:bg-[var(--color-status-green-muted)] active:scale-95 transition-all cursor-pointer"
                          >
                            <ThumbsUp size={11} /> Approve
                          </button>
                          <button
                            onClick={() => setDialog({ agentId: agent.id, action: 'flag' })}
                            className="inline-flex items-center gap-1 text-[11px] font-medium rounded-[6px] border border-[var(--color-status-red)] text-[var(--color-status-red)] px-2 py-1 hover:bg-[var(--color-status-red-muted)] active:scale-95 transition-all cursor-pointer"
                          >
                            <Flag size={11} /> Flag
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <ReasonDialog
        open={dialog !== null}
        title={dialog?.action === 'flag' ? 'Flag this step' : 'Approve this step'}
        label={
          dialog?.action === 'flag'
            ? "What's wrong, and why? The Architect will avoid this next time."
            : 'Anything worth remembering about why this is good? (optional)'
        }
        placeholder={
          dialog?.action === 'flag'
            ? 'e.g. Return figure needs the standard disclaimer before it can go out.'
            : 'e.g. Nailed the calm, no-hype tone Axis wants.'
        }
        confirmLabel={dialog?.action === 'flag' ? 'Flag & remember' : 'Approve & remember'}
        confirmTone={dialog?.action === 'flag' ? 'red' : 'gold'}
        required={dialog?.action === 'flag'}
        onConfirm={record}
        onClose={() => setDialog(null)}
      />
    </div>
  )
}
