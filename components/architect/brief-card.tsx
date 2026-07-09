'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, RotateCcw, ShieldCheck, Quote, Lightbulb, Target, Package, UserRound } from 'lucide-react'
import { USERS, getUserById } from '@/lib/users'
import { formatLakhs } from '@/lib/utils'
import type { ProjectBrief } from '@/lib/architect/types'

const EMPLOYEES = USERS.filter((u) => u.role !== 'master')

function Section({ icon: Icon, title, children }: { icon: typeof Target; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-medium mb-1.5">
        <Icon size={11} /> {title}
      </p>
      {children}
    </div>
  )
}

export function BriefCard({
  brief,
  assigning,
  onAssign,
  onRevise,
}: {
  brief: ProjectBrief
  assigning?: boolean
  onAssign: (employeeId: string) => void
  onRevise: () => void
}) {
  const [owner, setOwner] = useState(brief.suggestedOwner.employeeId)
  const suggested = getUserById(brief.suggestedOwner.employeeId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[14px] border border-[var(--color-gold-border)] overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--color-gold-muted), var(--color-surface) 30%)' }}
    >
      <span aria-hidden className="gold-sweep" />

      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-[var(--color-border-brand)]">
        <p className="text-[10px] uppercase tracking-widest text-[var(--color-gold)] font-semibold mb-1">
          Project Brief · ready to assign
        </p>
        <h2 className="text-xl text-[var(--color-text-primary)] leading-tight" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
          {brief.title}
        </h2>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          {brief.client} · {formatLakhs(brief.budget)} · due {brief.dueDate}
        </p>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <Section icon={Target} title="Decoded ask">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{brief.decodedAsk}</p>
        </Section>

        <Section icon={Package} title="Deliverables">
          <div className="flex flex-wrap gap-1.5">
            {brief.deliverables.map((d) => (
              <span key={d} className="text-xs rounded-[6px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] px-2 py-0.5">
                {d}
              </span>
            ))}
          </div>
        </Section>

        {brief.creativeDirection && (
          <Section icon={Lightbulb} title="Creative direction">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{brief.creativeDirection}</p>
          </Section>
        )}

        {brief.complianceNotes?.length > 0 && (
          <Section icon={ShieldCheck} title="Compliance">
            <ul className="space-y-1">
              {brief.complianceNotes.map((c, i) => (
                <li key={i} className="text-xs text-[var(--color-text-secondary)] flex items-start gap-1.5 leading-snug">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-status-amber)] flex-shrink-0 mt-1.5" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {brief.muzammilInstructions?.length > 0 && (
          <Section icon={Quote} title="Your instructions (remembered)">
            <div className="space-y-1.5">
              {brief.muzammilInstructions.map((q, i) => (
                <p key={i} className="text-xs text-[var(--color-text-secondary)] italic border-l-2 border-[var(--color-gold-border)] pl-2.5 leading-snug">
                  &ldquo;{q}&rdquo;
                </p>
              ))}
            </div>
          </Section>
        )}

        {brief.assumptions?.length > 0 && (
          <Section icon={Lightbulb} title="Assumptions made">
            <ul className="space-y-1">
              {brief.assumptions.map((a, i) => (
                <li key={i} className="text-xs text-[var(--color-text-tertiary)] leading-snug">— {a}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* Owner assignment */}
        <div className="pt-3 border-t border-[var(--color-border-brand)]">
          <Section icon={UserRound} title="Assign to">
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full h-10 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] px-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-gold-border)] cursor-pointer"
            >
              {EMPLOYEES.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.title}
                </option>
              ))}
            </select>
            {suggested && (
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1.5 flex items-start gap-1">
                <span className="text-[var(--color-gold)]">Architect suggests {suggested.name.split(' ')[0]}:</span>{' '}
                {brief.suggestedOwner.reason}
              </p>
            )}
          </Section>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onAssign(owner)}
            disabled={assigning}
            className="flex-1 h-11 rounded-[10px] bg-[var(--color-gold)] text-[var(--color-ink)] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#d4b46a] hover:shadow-[var(--shadow-glow-gold)] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <Check size={15} /> {assigning ? 'Creating…' : 'Approve & Assign'}
          </button>
          <button
            onClick={onRevise}
            disabled={assigning}
            className="px-4 h-11 rounded-[10px] border border-[var(--color-border-brand)] text-sm text-[var(--color-text-secondary)] flex items-center gap-2 hover:text-[var(--color-text-primary)] hover:border-[var(--color-gold-border)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <RotateCcw size={14} /> Revise
          </button>
        </div>
      </div>
    </motion.div>
  )
}
