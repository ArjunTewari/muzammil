'use client'

import { FileText, Eye, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Deliverable, DeliverableStatus } from '@/lib/types'
import { formatDateShort } from '@/lib/utils'

const statusConfig: Record<
  DeliverableStatus,
  { label: string; variant: 'green' | 'amber' | 'red' | 'blue' | 'default' | 'gold' }
> = {
  approved: { label: 'Approved', variant: 'green' },
  'in-review': { label: 'In Review', variant: 'blue' },
  draft: { label: 'Draft', variant: 'default' },
  'needs-revision': { label: 'Needs Revision', variant: 'amber' },
  final: { label: 'Final', variant: 'gold' },
}

export function DeliverablesList({ deliverables }: { deliverables: Deliverable[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border-brand)]">
            {['Deliverable', 'Type', 'Version', 'Status', 'Last Updated', 'Actions'].map((h) => (
              <th
                key={h}
                className="text-left text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider pb-3 font-medium pr-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border-brand)]">
          {deliverables.map((d) => {
            const cfg = statusConfig[d.status]
            const isNeedsRevision = d.status === 'needs-revision'
            return (
              <tr
                key={d.id}
                className="hover:bg-[var(--color-surface-elevated)] transition-colors duration-100 group"
                style={isNeedsRevision ? { background: 'var(--color-status-amber-muted)' } : {}}
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[var(--color-text-tertiary)] flex-shrink-0" />
                    <span className="text-[var(--color-text-primary)] text-xs font-medium truncate max-w-[200px]">
                      {d.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs text-[var(--color-text-tertiary)] capitalize">{d.type}</span>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className="text-xs text-[var(--color-text-secondary)]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                  >
                    v{d.version}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </td>
                <td className="py-3 pr-4">
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {formatDateShort(d.lastUpdated)}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{d.updatedBy}</p>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost">
                      <Eye size={12} /> View
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MessageSquare size={12} /> Comment
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
