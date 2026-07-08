'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, AlertCircle, Loader } from 'lucide-react'
import { AgentSuiteStrip } from '@/components/agents/agent-suite-strip'
import { AiInsights } from '@/components/shared/ai-insights'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { USERS } from '@/lib/users'
import { getEmployeeProject, agentProgress } from '@/lib/employee-projects'
import { getAgent } from '@/lib/agents'
import { teamNextSteps } from '@/lib/ai-insights'

const EMPLOYEE_IDS = ['priya', 'rohan', 'divya', 'arjit', 'sneha', 'karan']

export default function TeamPage() {
  const employees = EMPLOYEE_IDS.map((id) => USERS.find((u) => u.id === id)!)

  const totalNeedsInput = EMPLOYEE_IDS.reduce((s, id) => {
    const p = getEmployeeProject(id)
    return s + (p ? agentProgress(p).needsInput : 0)
  }, 0)

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
          Team
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          6 employees · each running a full campaign on the agent suite
          {totalNeedsInput > 0 && (
            <span className="text-[var(--color-status-red)]"> · {totalNeedsInput} agents need a human</span>
          )}
        </p>
      </motion.div>

      {/* Agent suite explainer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <AgentSuiteStrip />
      </motion.div>

      {/* AI next steps */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
      >
        <AiInsights steps={teamNextSteps} subtitle="Where to intervene across the team" />
      </motion.div>

      {/* Employee grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {employees.map((user, i) => {
          const project = getEmployeeProject(user.id)!
          const progress = agentProgress(project)
          const workingAgent = progress.working ? getAgent(progress.working.agentId) : null

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
            >
              <Link href={`/team/${user.id}`}>
                <Card goldRule className="p-4 group cursor-pointer h-full">
                  {/* Head */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                      style={{ background: `${user.accentColor}22`, color: user.accentColor }}
                    >
                      {user.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-gold)] transition-colors duration-100">
                        {user.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">{user.title}</p>
                    </div>
                    <ArrowRight
                      size={15}
                      className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0"
                    />
                  </div>

                  {/* Project */}
                  <div className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-2.5 mb-3">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Running · {project.client}
                    </p>
                    <p className="text-sm text-[var(--color-text-primary)] leading-snug mt-0.5">
                      {project.projectTitle}
                    </p>
                  </div>

                  {/* Agent progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--color-text-tertiary)]">Agents complete</span>
                      <span
                        className="text-[var(--color-text-secondary)]"
                        style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                      >
                        {progress.done}/{progress.total}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-border-brand)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--color-gold)]"
                        style={{ width: `${(progress.done / progress.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Status row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {workingAgent && (
                      <Badge variant="gold">
                        <Loader size={10} className="animate-spin" />
                        {workingAgent.name}
                      </Badge>
                    )}
                    {progress.needsInput > 0 && (
                      <Badge variant="red">
                        <AlertCircle size={10} />
                        {progress.needsInput} needs you
                      </Badge>
                    )}
                    {!workingAgent && progress.needsInput === 0 && (
                      <Badge variant="green">On track</Badge>
                    )}
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
