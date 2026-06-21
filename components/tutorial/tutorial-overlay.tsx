'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  TrendingUp,
  FolderKanban,
  Users,
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
    body: 'Your operating system for ZiWorks. Everything you need to run a BFSI marketing agency — clients, projects, revenue, and pipeline — in one command center.',
  },
  {
    icon: LayoutDashboard,
    iconColor: 'var(--color-gold)',
    title: 'Command Center Overview',
    body: 'The Overview tab shows 5 live headline metrics at the top — active clients, projects, leads, quarterly revenue, and project health. Numbers animate in on load so the data always feels fresh.',
  },
  {
    icon: TrendingUp,
    iconColor: '#4ade80',
    title: 'Revenue & Collections',
    body: 'Track monthly revenue against targets on the chart, see retainer breakdown by client, and catch overdue invoices before they become problems. Overdue rows are flagged in amber automatically.',
  },
  {
    icon: FolderKanban,
    iconColor: 'var(--color-gold)',
    title: 'Project Workspace',
    body: 'Head to Projects to see the Campaign Architect output for the Axis MF Retirement Reel. Decoded ask, creative territories, workflow tracker, deliverables — one view per campaign.',
  },
  {
    icon: Users,
    iconColor: '#60a5fa',
    title: 'Client Health at a Glance',
    body: 'Each client card is color-coded: gold for high-value, green for active, amber for at-risk. Spot which relationships need attention without opening a single file.',
  },
  {
    icon: CheckCircle2,
    iconColor: '#4ade80',
    title: "You're all set",
    body: 'Explore the dashboard. Click any section header to dive deeper. The sidebar collapses on desktop to give you more space — try it!',
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
