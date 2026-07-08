'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { NextStep, StepPriority } from '@/lib/ai-insights'

const priorityMeta: Record<
  StepPriority,
  { label: string; color: string; bg: string; icon: typeof AlertTriangle }
> = {
  urgent: { label: 'Urgent', color: 'var(--color-status-red)', bg: 'var(--color-status-red-muted)', icon: AlertTriangle },
  recommended: { label: 'Recommended', color: 'var(--color-gold)', bg: 'var(--color-gold-muted)', icon: Lightbulb },
  opportunity: { label: 'Opportunity', color: 'var(--color-status-green)', bg: 'var(--color-status-green-muted)', icon: TrendingUp },
}

export function AiInsights({
  steps,
  subtitle = 'Prioritised from your live workspace',
}: {
  steps: NextStep[]
  subtitle?: string
}) {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className="relative rounded-[12px] border overflow-hidden"
      style={{
        borderColor: 'var(--color-gold-border)',
        background:
          'linear-gradient(180deg, var(--color-gold-muted) 0%, var(--color-surface) 42%)',
      }}
    >
      {/* Animated gold hairline along the top edge */}
      <span aria-hidden className="gold-sweep" />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
        <motion.div
          className="w-8 h-8 rounded-[8px] bg-[var(--color-gold)] flex items-center justify-center flex-shrink-0"
          animate={prefersReduced ? undefined : { scale: [1, 1.07, 1] }}
          transition={prefersReduced ? undefined : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles size={16} className="text-[var(--color-ink)]" />
        </motion.div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              AI · Recommended Next Steps
            </h3>
            <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[var(--color-gold)] text-[var(--color-ink)] font-bold">
              Live
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)]">{subtitle}</p>
        </div>
      </div>

      {/* Steps */}
      <div className="px-3 pb-3 space-y-1.5">
        {steps.map((step, i) => {
          const meta = priorityMeta[step.priority]
          const Icon = meta.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
              className="group flex items-start gap-3 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-3 hover:border-[var(--color-gold-border)] transition-colors duration-150"
            >
              <div
                className="w-6 h-6 rounded-[6px] flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: meta.bg }}
              >
                <Icon size={13} style={{ color: meta.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-[var(--color-text-primary)] font-medium leading-snug">
                    {step.action}
                  </p>
                  <span
                    className="text-[10px] uppercase tracking-wider font-semibold flex-shrink-0 mt-0.5"
                    style={{ color: meta.color }}
                  >
                    {meta.label}
                  </span>
                </div>
                {step.rationale && (
                  <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed mt-1">
                    {step.rationale}
                  </p>
                )}
              </div>
              <ArrowRight
                size={14}
                className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0 mt-1"
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
