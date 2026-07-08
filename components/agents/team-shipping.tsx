'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Loader, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { USERS } from '@/lib/users'
import { getEmployeeProject, agentProgress } from '@/lib/employee-projects'
import { getAgent } from '@/lib/agents'

const EMPLOYEE_IDS = ['priya', 'rohan', 'divya', 'arjit', 'sneha', 'karan']

export function TeamShipping() {
  return (
    <Card goldRule hover={false}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>What Your Team Is Shipping</CardTitle>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              Every employee&apos;s campaign and where their agents are right now
            </p>
          </div>
          <Link
            href="/team"
            className="text-xs text-[var(--color-gold)] hover:underline flex items-center gap-1 flex-shrink-0"
          >
            All employees <ArrowRight size={12} />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {EMPLOYEE_IDS.map((id, i) => {
            const user = USERS.find((u) => u.id === id)!
            const project = getEmployeeProject(id)!
            const progress = agentProgress(project)
            const working = progress.working ? getAgent(progress.working.agentId) : null

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={`/team/${id}`}
                  className="group flex items-center gap-3 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3 hover:border-[var(--color-gold-border)] transition-colors duration-150"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ background: `${user.accentColor}22`, color: user.accentColor }}
                  >
                    {user.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-gold)] transition-colors duration-100">
                        {user.name.split(' ')[0]}
                      </p>
                      <span className="text-xs text-[var(--color-text-tertiary)] truncate">
                        · {project.client}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                      {project.projectTitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs text-[var(--color-text-secondary)]"
                      style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                    >
                      {progress.done}/{progress.total}
                    </span>
                    {progress.needsInput > 0 ? (
                      <AlertCircle size={15} className="text-[var(--color-status-red)]" />
                    ) : working ? (
                      <Loader size={15} className="text-[var(--color-gold)] animate-spin" />
                    ) : (
                      <CheckCircle2 size={15} className="text-[var(--color-status-green)]" />
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
