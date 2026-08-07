'use client'

import { useEffect, useRef, useState } from 'react'
import { StickyNote, Receipt, Sparkles, TrendingUp, History, Send } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getNotes, addNote, subscribeNotes } from '@/lib/notes-store'
import { opportunityAlerts } from '@/lib/mock-data'
import { formatLakhs } from '@/lib/utils'
import type { Client, Invoice } from '@/lib/types'
import type { EmployeeProject } from '@/lib/employee-projects'
import type { LucideIcon } from 'lucide-react'

// The mock "now" the seeded relative timestamps are anchored to.
const MOCK_NOW = new Date('2026-06-21').getTime()

interface TimelineEvent {
  id: string
  ts: number
  icon: LucideIcon
  color: string
  title: string
  detail?: string
}

function parseAgo(s: string): number {
  const m = s.match(/(\d+)\s*(h|d|w)/i)
  if (!m) return MOCK_NOW
  const n = parseInt(m[1], 10)
  const unit = m[2].toLowerCase()
  const ms = unit === 'h' ? 3.6e6 : unit === 'd' ? 8.64e7 : 6.048e8
  return MOCK_NOW - n * ms
}

function fmt(ts: number): string {
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function ClientTimeline({
  client,
  project,
  invoices,
}: {
  client: Client
  project: EmployeeProject | null
  invoices: Invoice[]
}) {
  const [, setTick] = useState(0)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => subscribeNotes(() => setTick((t) => t + 1)), [])

  const events: TimelineEvent[] = []

  // Notes (real, recent)
  for (const n of getNotes(client.id)) {
    events.push({ id: n.id, ts: n.createdAt, icon: StickyNote, color: 'var(--color-gold)', title: n.text })
  }
  // Invoices
  for (const inv of invoices) {
    events.push({
      id: `inv-${inv.id}`,
      ts: new Date(inv.issuedDate).getTime(),
      icon: Receipt,
      color: inv.status === 'overdue' ? 'var(--color-status-red)' : 'var(--color-status-amber)',
      title: `Invoice ${inv.invoiceNumber} — ${formatLakhs(inv.amount)}`,
      detail: inv.status === 'overdue' ? `${inv.description} · ${inv.daysOverdue}d overdue` : `${inv.description} · ${inv.status}`,
    })
  }
  // Agent activity from the client's campaign
  if (project) {
    project.activity.forEach((a, i) =>
      events.push({
        id: `act-${i}`,
        ts: parseAgo(a.time),
        icon: Sparkles,
        color: 'var(--color-status-blue)',
        title: `${a.agent} ${a.action}`,
        detail: project.projectTitle,
      }),
    )
  }
  // Opportunity alert for this client
  opportunityAlerts
    .filter((o) => o.clientName === client.shortName)
    .forEach((o) =>
      events.push({
        id: `opp-${o.id}`,
        ts: MOCK_NOW - 3 * 3.6e6,
        icon: TrendingUp,
        color: 'var(--color-status-green)',
        title: `Opportunity: ${o.suggestedAction}`,
        detail: o.signal,
      }),
    )

  events.sort((a, b) => b.ts - a.ts)

  function submit() {
    if (!draft.trim()) return
    addNote(client.id, draft)
    setDraft('')
    inputRef.current?.focus()
  }

  return (
    <Card goldRule hover={false}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History size={15} className="text-[var(--color-gold)]" />
          <CardTitle>Activity &amp; Notes</CardTitle>
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Everything on this account, newest first</p>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Log a note */}
        <div className="flex items-center gap-2 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] px-3 py-2 mb-4 transition-all focus-within:border-[var(--color-gold-border)]">
          <StickyNote size={14} className="text-[var(--color-text-tertiary)] flex-shrink-0" />
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Log a note about this client…"
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
          />
          <button
            onClick={submit}
            disabled={!draft.trim()}
            className="w-7 h-7 rounded-[7px] bg-[var(--color-gold)] flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Add note"
          >
            <Send size={13} className="text-[var(--color-ink)]" />
          </button>
        </div>

        {/* Timeline */}
        <div className="relative pl-1">
          {events.map((e, i) => {
            const Icon = e.icon
            return (
              <div key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
                {/* connector */}
                {i < events.length - 1 && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-[var(--color-border-brand)]" />}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                  style={{ background: 'var(--color-surface-elevated)', border: `1px solid ${e.color}` }}
                >
                  <Icon size={14} style={{ color: e.color }} />
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-[var(--color-text-primary)] leading-snug">{e.title}</p>
                    <span className="text-[11px] text-[var(--color-text-tertiary)] flex-shrink-0" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                      {fmt(e.ts)}
                    </span>
                  </div>
                  {e.detail && <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 leading-snug">{e.detail}</p>}
                </div>
              </div>
            )
          })}
          {events.length === 0 && <p className="text-sm text-[var(--color-text-tertiary)] text-center py-6">No activity yet — log the first note above.</p>}
        </div>
      </CardContent>
    </Card>
  )
}
