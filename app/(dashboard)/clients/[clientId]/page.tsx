'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, AlertCircle, Layers, Wallet, UserRound } from 'lucide-react'
import { AgentPipeline } from '@/components/agents/agent-pipeline'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { clients, invoices } from '@/lib/mock-data'
import { getEmployeeProjectByClient, agentProgress } from '@/lib/employee-projects'
import { getUserById } from '@/lib/users'
import { formatLakhs, formatDateShort } from '@/lib/utils'
import type { ClientStatus } from '@/lib/types'

const clientStatusBadge: Record<ClientStatus, { variant: 'gold' | 'green' | 'amber' | 'default'; label: string }> = {
  'high-value': { variant: 'gold', label: 'High Value' },
  active: { variant: 'green', label: 'Active' },
  'at-risk': { variant: 'amber', label: 'At Risk' },
  'low-margin': { variant: 'default', label: 'Low Margin' },
}

const invoiceBadge = {
  paid: 'green',
  due: 'blue',
  overdue: 'red',
  disputed: 'amber',
} as const

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = use(params)
  const client = clients.find((c) => c.id === clientId)
  if (!client) notFound()

  const project = getEmployeeProjectByClient(client.shortName)
  const owner = project ? getUserById(project.employeeId) : null
  const progress = project ? agentProgress(project) : null
  const clientInvoices = invoices.filter((inv) => inv.clientId === client.id)
  const outstanding = clientInvoices
    .filter((i) => i.status !== 'paid')
    .reduce((s, i) => s + i.amount, 0)
  const sb = clientStatusBadge[client.status]

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Back */}
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors duration-100"
      >
        <ArrowLeft size={14} /> Back to Clients
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <h1
            className="text-2xl sm:text-3xl text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            {client.name}
          </h1>
          <Badge variant={sb.variant}>{sb.label}</Badge>
        </div>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          {client.industry} · {formatLakhs(client.retainerValue)}/mo retainer
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Campaign Owner', value: owner ? owner.name.split(' ')[0] : '—', icon: UserRound, accent: owner?.accentColor ?? 'var(--color-text-tertiary)' },
          { label: 'Agents Complete', value: progress ? `${progress.done}/${progress.total}` : '—', icon: Layers, accent: 'var(--color-gold)' },
          { label: 'Needs You', value: progress ? `${progress.needsInput}` : '0', icon: AlertCircle, accent: (progress?.needsInput ?? 0) > 0 ? 'var(--color-status-red)' : 'var(--color-text-tertiary)' },
          { label: 'Outstanding', value: formatLakhs(outstanding), icon: Wallet, accent: 'var(--color-status-amber)' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <Card goldRule hover={false} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-medium">
                    {s.label}
                  </p>
                  <Icon size={15} style={{ color: s.accent }} />
                </div>
                <div
                  className="text-2xl text-[var(--color-text-primary)]"
                  style={{ fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 400 }}
                >
                  {s.value}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Campaign run by the agent suite */}
      {project && owner ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              {project.projectTitle}
            </h2>
            <Link
              href={`/team/${owner.id}`}
              className="text-xs text-[var(--color-gold)] hover:underline flex items-center gap-1"
            >
              Open {owner.name.split(' ')[0]}&apos;s workspace <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            Run end-to-end by <span className="text-[var(--color-text-primary)]">{owner.name}</span> on the Maestro
            agent suite. {project.objective}
          </p>
          <AgentPipeline project={project} />
        </div>
      ) : (
        <Card hover={false} className="p-8 text-center">
          <p className="text-sm text-[var(--color-text-tertiary)]">
            No live campaign — this account is running at retainer-maintenance level.
          </p>
        </Card>
      )}

      {/* Invoices */}
      {clientInvoices.length > 0 && (
        <Card goldRule hover={false}>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              {clientInvoices.length} on record · {formatLakhs(outstanding)} outstanding
            </p>
          </CardHeader>
          <CardContent className="pt-2 space-y-2">
            {clientInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-3 rounded-[10px] border border-[var(--color-border-brand)] p-3"
                style={inv.status === 'overdue' ? { background: 'var(--color-status-red-muted)' } : undefined}
              >
                <div className="min-w-0">
                  <p className="text-sm text-[var(--color-text-primary)] truncate">{inv.description}</p>
                  <p
                    className="text-xs text-[var(--color-text-tertiary)]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                  >
                    {inv.invoiceNumber} · due {formatDateShort(inv.dueDate)}
                    {inv.daysOverdue > 0 && (
                      <span className="text-[var(--color-status-red)]"> · {inv.daysOverdue}d overdue</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="text-sm text-[var(--color-text-primary)]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                  >
                    {formatLakhs(inv.amount)}
                  </span>
                  <Badge variant={invoiceBadge[inv.status]}>{inv.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
