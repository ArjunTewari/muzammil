'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STAGES = [
  { id: 'clarify-objective', label: 'Clarify Objective' },
  { id: 'research', label: 'Research' },
  { id: 'category-scan', label: 'Category Scan' },
  { id: 'creative-territory', label: 'Creative Territory' },
  { id: 'script', label: 'Script' },
  { id: 'visual-treatment', label: 'Visual Treatment' },
  { id: 'internal-review', label: 'Internal Review' },
  { id: 'compliance-review', label: 'Compliance Review' },
  { id: 'client-share', label: 'Client Share' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'closure', label: 'Closure' },
]

interface WorkflowTrackerProps {
  currentStageIndex: number
}

export function WorkflowTracker({ currentStageIndex }: WorkflowTrackerProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center min-w-max gap-0">
        {STAGES.map((stage, index) => {
          const isDone = index < currentStageIndex
          const isCurrent = index === currentStageIndex
          const isFuture = index > currentStageIndex

          return (
            <div key={stage.id} className="flex items-center">
              {/* Stage circle */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all border',
                    isDone && 'bg-[var(--color-status-green-muted)] border-[var(--color-status-green)] text-[var(--color-status-green)]',
                    isCurrent && 'bg-[var(--color-gold-muted)] border-[var(--color-gold)] text-[var(--color-gold)] ring-2 ring-[var(--color-gold)] ring-offset-2 ring-offset-[var(--color-surface)]',
                    isFuture && 'bg-transparent border-[var(--color-border-brand)] text-[var(--color-text-tertiary)]',
                  )}
                  style={
                    isCurrent
                      ? { fontFamily: 'var(--font-jetbrains-mono)' }
                      : { fontFamily: 'var(--font-jetbrains-mono)' }
                  }
                >
                  {isDone ? (
                    <Check size={12} strokeWidth={2.5} />
                  ) : (
                    <span style={{ fontSize: '10px' }}>{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] text-center whitespace-nowrap max-w-[70px] leading-tight',
                    isDone && 'text-[var(--color-status-green)]',
                    isCurrent && 'text-[var(--color-gold)] font-medium',
                    isFuture && 'text-[var(--color-text-tertiary)]',
                  )}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connector line */}
              {index < STAGES.length - 1 && (
                <div
                  className="w-8 h-px mx-1 flex-shrink-0 mb-5"
                  style={{
                    background:
                      index < currentStageIndex
                        ? 'var(--color-status-green)'
                        : 'var(--color-border-brand)',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
