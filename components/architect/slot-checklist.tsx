'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
import { REQUIRED_SLOTS, SLOT_LABELS, type BriefSlots } from '@/lib/architect/types'

const ENRICHERS: (keyof BriefSlots)[] = [
  'audience',
  'keyMessage',
  'compliance',
  'successMetric',
  'references',
]

export function SlotChecklist({ slots }: { slots: BriefSlots }) {
  const requiredDone = REQUIRED_SLOTS.filter((k) => slots[k]).length
  const filledEnrichers = ENRICHERS.filter((k) => slots[k])

  return (
    <div className="rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          What I know
        </p>
        <span className="text-[11px] text-[var(--color-text-tertiary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
          {requiredDone}/{REQUIRED_SLOTS.length}
        </span>
      </div>

      {/* Required slots */}
      <div className="space-y-1.5">
        {REQUIRED_SLOTS.map((key) => {
          const done = !!slots[key]
          return (
            <div key={key} className="flex items-start gap-2.5">
              <div
                className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                  done ? 'bg-[var(--color-gold)]' : 'border border-[var(--color-border-brand)]'
                }`}
              >
                {done ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
                    <Check size={11} className="text-[var(--color-ink)]" strokeWidth={3} />
                  </motion.span>
                ) : (
                  <Circle size={6} className="text-[var(--color-text-tertiary)]" />
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-medium ${done ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}`}>
                  {SLOT_LABELS[key]}
                </p>
                <AnimatePresence>
                  {done && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-[11px] text-[var(--color-text-tertiary)] leading-snug truncate"
                    >
                      {slots[key]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      {/* Enrichers picked up along the way */}
      {filledEnrichers.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border-brand)]">
          <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
            Also captured
          </p>
          <div className="flex flex-wrap gap-1.5">
            {filledEnrichers.map((k) => (
              <span
                key={k}
                className="text-[10px] rounded-full border border-[var(--color-gold-border)] bg-[var(--color-gold-muted)] text-[var(--color-gold)] px-2 py-0.5"
              >
                {SLOT_LABELS[k]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
