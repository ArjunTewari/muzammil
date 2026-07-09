'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Workflow,
  Send,
  Database,
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
  X,
  ChevronRight,
} from 'lucide-react'

const STEPS = [
  {
    icon: Sparkles,
    iconColor: 'var(--color-gold)',
    title: 'Welcome to Maestro',
    body: "Maestro takes Muzammil's judgment — his standards, his experience — out of his head and puts it into a system, so quality doesn't depend on him being in the room.",
  },
  {
    icon: Workflow,
    iconColor: 'var(--color-gold)',
    title: 'A suite of AI agents',
    body: 'Six specialist agents — brief decoder, researcher, copywriter, compliance guardian, client liaison, finance tracker — with a Master Agent orchestrating them. They pass context to each other so nothing falls through the gaps.',
  },
  {
    icon: Send,
    iconColor: '#60a5fa',
    title: 'Brief new work by talking',
    body: 'Hit "New Project" and the Architect interviews you — one sharp question at a time — until it can write a full brief, then assigns it to an employee with your instructions attached. A thinking agent, not a form.',
  },
  {
    icon: Database,
    iconColor: '#a78bfa',
    title: 'A memory that learns',
    body: 'Every instruction you give and every step you approve or flag — with the reason why — is remembered and applied on the next project. See it all under Memory. The system gets smarter with every job.',
  },
  {
    icon: LayoutDashboard,
    iconColor: 'var(--color-gold)',
    title: "The founder's one screen",
    body: 'Muzammil sees every employee, the campaign each is running, and exactly what their agents are producing — plus every invoice, approval and lead — without asking anyone for an update.',
  },
  {
    icon: CheckCircle2,
    iconColor: '#4ade80',
    title: "You're all set",
    body: 'Sign in as Muzammil to see the whole business, or as any employee to run a campaign with their agent suite. Re-open this tour anytime from the ? in the top bar.',
  },
]

interface TutorialOverlayProps {
  onDismiss: () => void
}

export function TutorialOverlay({ onDismiss }: TutorialOverlayProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1

  function next() {
    if (isLast) {
      onDismiss()
    } else {
      setStep((s) => s + 1)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onDismiss()}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full sm:max-w-md rounded-t-[20px] sm:rounded-[20px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-2xl"
          style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
        >
          {/* Close */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all duration-100 cursor-pointer"
            aria-label="Skip tutorial"
          >
            <X size={16} />
          </button>

          {/* Step label */}
          <p
            className="text-xs font-mono uppercase tracking-widest mb-5"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {step + 1} / {STEPS.length}
          </p>

          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border-brand)' }}
          >
            <Icon size={26} style={{ color: current.iconColor }} />
          </div>

          {/* Text */}
          <h2
            className="text-xl mb-3 leading-snug"
            style={{ fontFamily: 'var(--font-instrument-serif)', color: 'var(--color-text-primary)' }}
          >
            {current.title}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            {current.body}
          </p>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-6">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="transition-all duration-200 rounded-full cursor-pointer"
                style={{
                  width: i === step ? '20px' : '6px',
                  height: '6px',
                  background: i === step ? 'var(--color-gold)' : 'var(--color-border-brand)',
                }}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-medium text-sm transition-all duration-100 cursor-pointer"
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-ink)',
              }}
            >
              {isLast ? 'Start exploring' : 'Next'}
              {!isLast && <ChevronRight size={14} />}
            </button>
            {!isLast && (
              <button
                onClick={onDismiss}
                className="text-sm px-3 py-2 rounded-[10px] transition-all duration-100 cursor-pointer"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Skip
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
