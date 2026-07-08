'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, AlertCircle, Loader, CheckCircle2 } from 'lucide-react'
import { AiInsights } from '@/components/shared/ai-insights'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { clients } from '@/lib/mock-data'
import { clientsNextSteps } from '@/lib/ai-insights'
import { getEmployeeProjectByClient, agentProgress } from '@/lib/employee-projects'
import { getUserById } from '@/lib/users'
import { getAgent } from '@/lib/agents'
import { formatLakhs } from '@/lib/utils'
import type { ClientStatus } from '@/lib/types'

const statusBadge: Record<ClientStatus, { variant: 'gold' | 'green' | 'amber' | 'default'; label: string }> = {
  'high-value': { variant: 'gold', label: 'High Value' },
  active: { variant: 'green', label: 'Active' },
  'at-risk': { variant: 'amber', label: 'At Risk' },
  'low-margin': { variant: 'default', label: 'Low Margin' },
}

export default function ClientsPage() {
  const managed = clients.filter((c) => getEmployeeProjectByClient(c.shortName)).length

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
          {clients.length} relationships · {managed} with a live campaign on the agent suite
        </p>
      </motion.div>

      {/* AI next steps */}
      <AiInsights steps={clientsNextSteps} subtitle="Account-level moves worth making" />

      {/* Client grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {clients.map((client, i) => {
          const project = getEmployeeProjectByClient(client.shortName)
          const owner = project ? getUserById(project.employeeId) : null
          const progress = project ? agentProgress(project) : null
          const working = progress?.working ? getAgent(progress.working.agentId) : null
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

                  {project && owner && progress ? (
                    <>
                      {/* Owner + campaign */}
                      <div className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-2.5 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                            style={{ background: `${owner.accentColor}22`, color: owner.accentColor }}
                          >
                            {owner.initials}
                          </div>
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            {owner.name.split(' ')[0]} owns this campaign
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-text-tertiary)] leading-snug">
                          {project.projectTitle}
                        </p>
                      </div>

                      {/* Agent progress */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs text-[var(--color-text-secondary)]"
                            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                          >
                            {progress.done}/{progress.total} agents
                          </span>
                          {working ? (
                            <Badge variant="gold"><Loader size={10} className="animate-spin" />{working.name}</Badge>
                          ) : progress.needsInput > 0 ? (
                            <Badge variant="red"><AlertCircle size={10} />{progress.needsInput} needs you</Badge>
                          ) : (
                            <Badge variant="green"><CheckCircle2 size={10} />On track</Badge>
                          )}
                        </div>
                        <ArrowRight
                          size={15}
                          className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        Retainer maintenance · no live campaign
                      </span>
                      <ArrowRight
                        size={15}
                        className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-all duration-150"
                      />
                    </div>
                  )}
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
