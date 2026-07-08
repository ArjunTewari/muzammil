'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import { AiInsights } from '@/components/shared/ai-insights'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { clients } from '@/lib/mock-data'
import { clientsNextSteps } from '@/lib/ai-insights'
import { getClientWorkload, getClientAgents } from '@/lib/client-tasks'
import { formatLakhs } from '@/lib/utils'
import type { ClientStatus } from '@/lib/types'

const statusBadge: Record<ClientStatus, { variant: 'gold' | 'green' | 'amber' | 'default'; label: string }> = {
  'high-value': { variant: 'gold', label: 'High Value' },
  active: { variant: 'green', label: 'Active' },
  'at-risk': { variant: 'amber', label: 'At Risk' },
  'low-margin': { variant: 'default', label: 'Low Margin' },
}

export default function ClientsPage() {
  const totalTasks = clients.reduce((s, c) => s + getClientWorkload(c.shortName).length, 0)

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1
          className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          Clients
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          {clients.length} active relationships · {totalTasks} tasks across the team
        </p>
      </motion.div>

      {/* AI next steps */}
      <AiInsights steps={clientsNextSteps} subtitle="Account-level moves worth making" />

      {/* Client grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {clients.map((client, i) => {
          const workload = getClientWorkload(client.shortName)
          const agents = getClientAgents(client.shortName)
          const blocked = workload.filter((w) => w.task.status === 'blocked').length
          const sb = statusBadge[client.status]

          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
            >
              <Link href={`/clients/${client.id}`}>
                <Card goldRule className="p-4 group cursor-pointer h-full">
                  {/* Head */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-gold)] transition-colors duration-100">
                        {client.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                        {formatLakhs(client.retainerValue)}/mo · {client.activeProjects} projects
                      </p>
                    </div>
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                  </div>

                  {/* Agents on the account */}
                  <div className="mb-3">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] mb-1.5">
                      {agents.length > 0 ? `${agents.length} agents working` : 'Retainer maintenance'}
                    </p>
                    <div className="flex items-center">
                      {agents.map((a, idx) => (
                        <div
                          key={a.id}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold border-2 border-[var(--color-surface)]"
                          style={{
                            background: `${a.accentColor}22`,
                            color: a.accentColor,
                            marginLeft: idx === 0 ? 0 : -8,
                            zIndex: agents.length - idx,
                          }}
                          title={`${a.name} · ${a.title}`}
                        >
                          {a.initials}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-brand)]">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{workload.length}</span>{' '}
                        tasks
                      </Badge>
                      {blocked > 0 && (
                        <Badge variant="red">
                          <AlertTriangle size={10} />
                          <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{blocked}</span>
                        </Badge>
                      )}
                    </div>
                    <ArrowRight
                      size={15}
                      className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150"
                    />
                  </div>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
