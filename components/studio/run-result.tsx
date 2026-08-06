'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, ThumbsUp, Flag, Sparkles, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { AgentRunResult, Finding, Severity } from '@/lib/studio/types'

const sev: Record<Severity, { color: string; bg: string; label: string }> = {
  high: { color: 'var(--color-status-red)', bg: 'var(--color-status-red-muted)', label: 'High' },
  medium: { color: 'var(--color-status-amber)', bg: 'var(--color-status-amber-muted)', label: 'Medium' },
  low: { color: 'var(--color-status-blue)', bg: 'var(--color-status-blue-muted)', label: 'Low' },
}

export function RunResult({
  result,
  engine,
  acted,
  onAccept,
  onDismiss,
}: {
  result: AgentRunResult
  engine: 'live' | 'simulated'
  acted: Record<string, 'accepted' | 'dismissed'>
  onAccept: (f: Finding) => void
  onDismiss: (f: Finding) => void
}) {
  const pct = Math.round(result.confidence * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      {/* Reasoning + engine + confidence */}
      <div className="flex items-start gap-2 rounded-[10px] border border-[var(--color-gold-border)] bg-[var(--color-gold-muted)] px-3 py-2">
        <Sparkles size={12} className="text-[var(--color-gold)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--color-text-secondary)] italic flex-1">{result.reasoning}</p>
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] flex-shrink-0" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
          {pct}% · {engine}
        </span>
      </div>

      {result.mode === 'review' ? (
        <>
          {/* Verdict */}
          <div
            className="flex items-center gap-2 rounded-[10px] px-3 py-2"
            style={{ background: result.verdict === 'flag' ? 'var(--color-status-red-muted)' : 'var(--color-status-green-muted)' }}
          >
            {result.verdict === 'flag' ? (
              <AlertTriangle size={15} className="text-[var(--color-status-red)]" />
            ) : (
              <CheckCircle2 size={15} className="text-[var(--color-status-green)]" />
            )}
            <span className="text-sm font-medium" style={{ color: result.verdict === 'flag' ? 'var(--color-status-red)' : 'var(--color-status-green)' }}>
              {result.verdict === 'flag'
                ? `${result.findings?.length ?? 0} risk${(result.findings?.length ?? 0) > 1 ? 's' : ''} to fix before this ships`
                : 'Clean — nothing flagged'}
            </span>
          </div>

          {/* Findings */}
          <div className="space-y-2">
            {(result.findings ?? []).map((f) => {
              const s = sev[f.severity]
              const state = acted[f.id]
              return (
                <div
                  key={f.id}
                  className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3"
                  style={state === 'dismissed' ? { opacity: 0.5 } : undefined}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{f.title}</p>
                  </div>
                  {f.quote && (
                    <p className="text-xs text-[var(--color-text-secondary)] italic border-l-2 border-[var(--color-status-red)] pl-2 mb-1.5">
                      &ldquo;{f.quote}&rdquo;
                    </p>
                  )}
                  {f.rule && <p className="text-xs text-[var(--color-text-tertiary)] mb-1">{f.rule}</p>}
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-status-green)]">Fix:</span> {f.suggestion}
                  </p>

                  {state ? (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-medium mt-2"
                      style={{ color: state === 'accepted' ? 'var(--color-status-green)' : 'var(--color-text-tertiary)' }}
                    >
                      {state === 'accepted' ? <ThumbsUp size={11} /> : <Flag size={11} />}
                      {state === 'accepted' ? 'Confirmed — remembered' : 'Dismissed — it won’t flag this again'}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        onClick={() => onAccept(f)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium rounded-[6px] border border-[var(--color-status-green)] text-[var(--color-status-green)] px-2 py-1 hover:bg-[var(--color-status-green-muted)] active:scale-95 transition-all cursor-pointer"
                      >
                        <ThumbsUp size={11} /> Correct — keep flagging
                      </button>
                      <button
                        onClick={() => onDismiss(f)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium rounded-[6px] border border-[var(--color-border-brand)] text-[var(--color-text-secondary)] px-2 py-1 hover:border-[var(--color-status-red)] hover:text-[var(--color-status-red)] active:scale-95 transition-all cursor-pointer"
                      >
                        <Flag size={11} /> False positive
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        /* generate mode */
        <div className="space-y-3">
          <div className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-4">
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
              <FileText size={11} /> Draft
            </p>
            <div className="text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap">{result.output}</div>
          </div>
          {result.notes && result.notes.length > 0 && (
            <div className="space-y-1">
              {result.notes.map((n, i) => (
                <p key={i} className="text-xs text-[var(--color-text-tertiary)] flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-text-tertiary)] flex-shrink-0 mt-1.5" />
                  {n}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
