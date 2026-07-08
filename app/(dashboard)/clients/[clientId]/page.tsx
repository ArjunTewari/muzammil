'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertCircle, Users, Layers, Wallet } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { clients, invoices } from '@/lib/mock-data'
import { getClientWorkload, getClientAgents } from '@/lib/client-tasks'
import { formatLakhs, formatDateShort } from '@/lib/utils'
import type { ClientStatus } from '@/lib/types'
import type { TaskStatus } from '@/lib/operator-data'

const clientStatusBadge: Record<ClientStatus, { variant: 'gold' | 'green' | 'amber' | 'default'; label: string }> = {
  'high-value': { variant: 'gold', label: 'High Value' },
  active: { variant: 'green', label: 'Active' },
  'at-risk': { variant: 'amber', label: 'At Risk' },
  'low-margin': { variant: 'default', label: 'Low Margin' },
}

const taskStatusBadge: Record<TaskStatus, { variant: 'blue' | 'red' | 'amber' | 'green'; label: string }> = {
  'in-progress': { variant: 'blue', label: 'In progress' },
  blocked: { variant: 'red', label: 'Blocked' },
  waiting: { variant: 'amber', label: 'Waiting' },
  done: { variant: 'green', label: 'Done' },
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

  const workload = getClientWorkload(client.shortName)
  const agents = getClientAgents(client.shortName)
  const blocked = workload.filter((w) => w.task.status === 'blocked').length
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
        className="flex flex-wrap items-start justify-between gap-3"
      >
        <div>
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
            {client.industry} · {formatLakhs(client.retainerValue)}/mo retainer · Account:{' '}
            {client.accountManager}
          </p>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Active Tasks', value: `${workload.length}`, icon: Layers, accent: 'var(--color-gold)' },
          { label: 'Agents Involved', value: `${agents.length}`, icon: Users, accent: 'var(--color-status-blue)' },
          { label: 'Blocked', value: `${blocked}`, icon: AlertCircle, accent: blocked > 0 ? 'var(--color-status-red)' : 'var(--color-text-tertiary)' },
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

      {/* Work divided across the team */}
      <div>
        <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          Work divided across the team
        </h2>

        {agents.length === 0 ? (
          <Card hover={false} className="p-8 text-center">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              No active production tasks — this account is running at retainer-maintenance level.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {agents.map((agent, ai) => {
              const agentTasks = workload
                .filter((w) => w.operatorId === agent.id)
                .map((w) => w.task)
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + ai * 0.06 }}
                >
                  <Card goldRule hover={false}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                          style={{ background: `${agent.accentColor}22`, color: agent.accentColor }}
                        >
                          {agent.initials}
                        </div>
                        <div>
                          <Link
                            href={`/team/${agent.id}`}
                            className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-gold)] transition-colors duration-100"
                          >
                            {agent.name}
                          </Link>
                          <p className="text-xs text-[var(--color-text-tertiary)]">{agent.title}</p>
                        </div>
                        <span
                          className="ml-auto text-xs text-[var(--color-text-tertiary)]"
                          style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                        >
                          {agentTasks.length} task{agentTasks.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2 space-y-2">
                      {agentTasks.map((task) => {
                        const tb = taskStatusBadge[task.status]
                        return (
                          <div
                            key={task.id}
                            className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3"
                            style={task.status === 'blocked' ? { background: 'var(--color-status-red-muted)' } : undefined}
                          >
                            <p className="text-sm text-[var(--color-text-primary)] leading-snug">
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge variant={tb.variant}>{tb.label}</Badge>
                              <span
                                className="text-xs text-[var(--color-text-tertiary)]"
                                style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                              >
                                ~{task.estimatedHours}h
                              </span>
                            </div>
                            {task.note && (
                              <p className="text-xs text-[var(--color-text-tertiary)] mt-1.5">
                                {task.note}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

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
