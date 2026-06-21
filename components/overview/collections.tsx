'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { invoices } from '@/lib/mock-data'
import { formatLakhs, formatDateShort } from '@/lib/utils'

export function Collections() {
  const totalOutstanding = invoices
    .filter((i) => i.status !== 'paid')
    .reduce((s, i) => s + i.amount, 0)
  const overdue = invoices.filter((i) => i.status === 'overdue')
  const totalOverdue = overdue.reduce((s, i) => s + i.amount, 0)

  const sorted = [...invoices]
    .filter((i) => i.status !== 'paid')
    .sort((a, b) => b.daysOverdue - a.daysOverdue)

  return (
    <Card goldRule>
      <CardHeader>
        <CardTitle>Collections</CardTitle>
        <div className="flex items-center gap-4 mt-1">
          <div>
            <p
              className="text-2xl text-[var(--color-text-primary)]"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {formatLakhs(totalOutstanding)}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">total outstanding</p>
          </div>
          <div className="w-px h-8 bg-[var(--color-border-brand)]" />
          <div>
            <p
              className="text-xl text-[var(--color-status-red)]"
              style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
            >
              {formatLakhs(totalOverdue)}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">overdue</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border-brand)]">
                {['Invoice', 'Client', 'Amount', 'Due', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider pb-2 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-brand)]">
              {sorted.map((inv) => {
                const isOverdue = inv.status === 'overdue'
                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-[var(--color-surface-elevated)] -mx-5 transition-colors duration-100 group"
                    style={isOverdue ? { background: 'var(--color-status-red-muted)' } : {}}
                  >
                    <td className="py-3 pr-4">
                      <span
                        className="text-xs text-[var(--color-text-tertiary)]"
                        style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                      >
                        {inv.invoiceNumber}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-sm text-[var(--color-text-primary)]">{inv.clientName}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)] truncate max-w-[180px]">{inv.description}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="text-sm"
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono)',
                          color: isOverdue ? 'var(--color-status-red)' : 'var(--color-text-primary)',
                        }}
                      >
                        {formatLakhs(inv.amount)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {formatDateShort(inv.dueDate)}
                      </span>
                      {isOverdue && (
                        <p
                          className="text-xs text-[var(--color-status-red)] mt-0.5"
                          style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                        >
                          +{inv.daysOverdue}d
                        </p>
                      )}
                    </td>
                    <td className="py-3">
                      <Badge variant={isOverdue ? 'red' : 'blue'}>
                        {isOverdue ? 'Overdue' : 'Due'}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
