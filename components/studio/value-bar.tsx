'use client'

import { Zap, ShieldCheck, Clock } from 'lucide-react'

function fmtTime(min: number): string {
  if (min >= 60) return `${(min / 60).toFixed(min % 60 === 0 ? 0 : 1)} hrs`
  return `${min} min`
}

export function ValueBar({
  runs,
  findingsCaught,
  minutesSaved,
  agents,
}: {
  runs: number
  findingsCaught: number
  minutesSaved: number
  agents?: number
}) {
  const items = [
    ...(agents !== undefined ? [{ icon: Zap, label: 'Agents', value: `${agents}`, color: 'var(--color-gold)' }] : []),
    { icon: Zap, label: 'Runs', value: `${runs}`, color: 'var(--color-status-blue)' },
    { icon: ShieldCheck, label: 'Risks caught', value: `${findingsCaught}`, color: 'var(--color-status-green)' },
    { icon: Clock, label: 'Time saved', value: fmtTime(minutesSaved), color: 'var(--color-gold)' },
  ]
  return (
    <div className="rounded-[12px] border border-[var(--color-gold-border)] bg-[linear-gradient(180deg,var(--color-gold-muted),var(--color-surface)_40%)] p-3 sm:p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((it) => {
          const Icon = it.icon
          return (
            <div key={it.label} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[var(--color-surface)] border border-[var(--color-border-brand)] flex items-center justify-center flex-shrink-0">
                <Icon size={15} style={{ color: it.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-lg text-[var(--color-text-primary)] leading-none" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                  {it.value}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] mt-1">{it.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
