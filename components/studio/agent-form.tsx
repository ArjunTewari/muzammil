'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, ScanSearch, PenLine } from 'lucide-react'
import type { AgentMode, StudioAgent } from '@/lib/studio/types'

type Draft = Pick<StudioAgent, 'name' | 'goal' | 'task' | 'rules' | 'mode'>

const EMPTY: Draft = { name: '', goal: '', task: '', rules: [''], mode: 'review' }

export function AgentForm({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean
  initial?: StudioAgent
  onSave: (draft: Draft) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<Draft>(
    initial ? { name: initial.name, goal: initial.goal, task: initial.task, rules: initial.rules.length ? initial.rules : [''], mode: initial.mode } : EMPTY,
  )

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }))
  const setRule = (i: number, v: string) => setDraft((d) => ({ ...d, rules: d.rules.map((r, j) => (j === i ? v : r)) }))
  const addRule = () => setDraft((d) => ({ ...d, rules: [...d.rules, ''] }))
  const removeRule = (i: number) => setDraft((d) => ({ ...d, rules: d.rules.filter((_, j) => j !== i) }))

  const valid = draft.name.trim() && draft.goal.trim() && draft.task.trim()

  function save() {
    if (!valid) return
    onSave({ ...draft, rules: draft.rules.map((r) => r.trim()).filter(Boolean) })
  }

  const field = 'w-full rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-gold-border)] transition-colors'

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-[20px] sm:rounded-[16px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-5 sm:p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
                  {initial ? 'Edit agent' : 'Build a new agent'}
                </h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Define its goal, task and rules — that becomes the agent.</p>
              </div>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all cursor-pointer" aria-label="Close">
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Mode */}
              <div>
                <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5 font-medium">What does it do?</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { m: 'review' as AgentMode, icon: ScanSearch, title: 'Review & flag', desc: 'Checks input against rules' },
                    { m: 'generate' as AgentMode, icon: PenLine, title: 'Generate', desc: 'Produces a draft' },
                  ]).map(({ m, icon: Icon, title, desc }) => (
                    <button
                      key={m}
                      onClick={() => set('mode', m)}
                      className={`text-left rounded-[10px] border p-3 transition-all cursor-pointer ${
                        draft.mode === m ? 'border-[var(--color-gold-border)] bg-[var(--color-gold-muted)]' : 'border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)]'
                      }`}
                    >
                      <Icon size={16} className="mb-1.5" style={{ color: draft.mode === m ? 'var(--color-gold)' : 'var(--color-text-tertiary)' }} />
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{title}</p>
                      <p className="text-[11px] text-[var(--color-text-tertiary)]">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5 font-medium">Name</label>
                <input value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Reel Script Reviewer" className={field} />
              </div>
              <div>
                <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5 font-medium">Goal</label>
                <input value={draft.goal} onChange={(e) => set('goal', e.target.value)} placeholder="The outcome it exists to deliver" className={field} />
              </div>
              <div>
                <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5 font-medium">Task</label>
                <textarea value={draft.task} onChange={(e) => set('task', e.target.value)} rows={2} placeholder="What it does with the input you give it" className={`${field} resize-none`} />
              </div>

              <div>
                <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5 font-medium">Rules (your judgment, codified)</label>
                <div className="space-y-2">
                  {draft.rules.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={r} onChange={(e) => setRule(i, e.target.value)} placeholder={`Rule ${i + 1}`} className={field} />
                      {draft.rules.length > 1 && (
                        <button onClick={() => removeRule(i)} className="w-9 h-9 flex items-center justify-center rounded-[8px] text-[var(--color-text-tertiary)] hover:text-[var(--color-status-red)] hover:bg-[var(--color-surface-elevated)] flex-shrink-0 cursor-pointer" aria-label="Remove rule">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addRule} className="inline-flex items-center gap-1.5 text-xs text-[var(--color-gold)] hover:underline cursor-pointer">
                    <Plus size={13} /> Add rule
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <button
                onClick={save}
                disabled={!valid}
                className="flex-1 h-11 rounded-[10px] bg-[var(--color-gold)] text-[var(--color-ink)] text-sm font-semibold hover:bg-[#d4b46a] hover:shadow-[var(--shadow-glow-gold)] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {initial ? 'Save changes' : 'Create agent'}
              </button>
              <button onClick={onClose} className="px-4 h-11 rounded-[10px] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
