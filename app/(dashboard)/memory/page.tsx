'use client'

import { useCallback, useEffect, useState } from 'react'
import { BookMarked, CheckCircle2, Database, RefreshCcw, ShieldAlert, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { platformFetch, PlatformApiError } from '@/lib/platform/api'
import type { PlatformMemory } from '@/lib/platform/types'

const statusMeta = {
  candidate: { label: 'Needs review', variant: 'amber' as const, icon: ShieldAlert },
  approved: { label: 'Approved', variant: 'green' as const, icon: CheckCircle2 },
  rejected: { label: 'Rejected', variant: 'red' as const, icon: XCircle },
  superseded: { label: 'Superseded', variant: 'default' as const, icon: BookMarked },
}

export default function MemoryPage() {
  const [entries, setEntries] = useState<PlatformMemory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { setEntries(await platformFetch<PlatformMemory[]>('/memories')); setError(null) }
    catch (reason) { setError(reason instanceof PlatformApiError && reason.status === 503 ? 'Connect the Supra control service to review durable memories.' : reason instanceof Error ? reason.message : 'Unable to load memory.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { queueMicrotask(() => void load()) }, [load])

  async function decide(entry: PlatformMemory, action: 'approve' | 'reject') {
    setBusy(entry.id)
    try { await platformFetch(`/memories/${entry.id}/${action}`, { method: 'POST', body: '{}' }); await load() }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Memory decision failed') }
    finally { setBusy(null) }
  }

  const counts = {
    total: entries.length,
    candidate: entries.filter((entry) => entry.status === 'candidate').length,
    approved: entries.filter((entry) => entry.status === 'approved').length,
    rejected: entries.filter((entry) => entry.status === 'rejected').length,
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3"><div><h1 className="text-2xl sm:text-3xl text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-instrument-serif)' }}>Memory Governance</h1><p className="text-sm text-[var(--color-text-tertiary)] mt-1">Only owner-approved knowledge can influence an agent or sync to Obsidian.</p></div><Button variant="secondary" onClick={() => void load()} disabled={loading}><RefreshCcw size={14} /> Refresh</Button></div>
      {error && <div className="rounded-[10px] border border-[var(--color-status-amber)]/30 bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">{error}</div>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: counts.total, icon: Database },
          { label: 'Needs review', value: counts.candidate, icon: ShieldAlert },
          { label: 'Approved', value: counts.approved, icon: CheckCircle2 },
          { label: 'Rejected', value: counts.rejected, icon: XCircle },
        ].map(({ label, value, icon: Icon }) => <Card key={label} goldRule hover={false} className="p-4"><div className="flex justify-between"><p className="text-xs uppercase tracking-wider text-[var(--color-text-tertiary)]">{label}</p><Icon size={15} className="text-[var(--color-gold)]" /></div><p className="text-2xl text-[var(--color-text-primary)] mt-3 font-mono">{value}</p></Card>)}
      </div>
      <Card goldRule hover={false}>
        <div className="px-5 py-4 border-b border-[var(--color-border-brand)]"><p className="text-sm font-medium text-[var(--color-text-primary)]">Memory ledger</p><p className="text-xs text-[var(--color-text-tertiary)] mt-1">PostgreSQL is authoritative; approved entries are replicated to Google Memory Bank and the private vault.</p></div>
        <div className="p-4 space-y-2">
          {entries.length === 0 && <p className="text-sm text-[var(--color-text-tertiary)] text-center py-8">{loading ? 'Loading memory…' : 'No durable memories yet.'}</p>}
          {entries.map((entry) => {
            const meta = statusMeta[entry.status]; const Icon = meta.icon
            return <div key={entry.id} className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-[8px] bg-[var(--color-gold-muted)] flex items-center justify-center flex-shrink-0"><Icon size={15} className="text-[var(--color-gold)]" /></div>
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge variant={meta.variant}>{meta.label}</Badge><Badge variant="outline">{entry.scope}{entry.scope_id ? ` · ${entry.scope_id}` : ''}</Badge><span className="text-[11px] text-[var(--color-text-tertiary)] ml-auto">v{entry.version}</span></div><p className="text-sm text-[var(--color-text-primary)] mt-2">{entry.content}</p>{entry.reason && <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Why: {entry.reason}</p>}
                {entry.status === 'candidate' && <div className="flex gap-2 mt-3"><Button size="sm" onClick={() => void decide(entry, 'approve')} disabled={busy === entry.id}>Approve & sync</Button><Button size="sm" variant="danger" onClick={() => void decide(entry, 'reject')} disabled={busy === entry.id}>Reject</Button></div>}
              </div>
            </div>
          })}
        </div>
      </Card>
    </div>
  )
}
