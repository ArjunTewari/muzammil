'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import { ProcessFlow } from '@/components/operator/process-flow'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { USERS } from '@/lib/users'
import { getOperatorData } from '@/lib/operator-data'

const OPERATOR_IDS = ['priya', 'rohan', 'divya', 'arjit', 'sneha', 'karan']

export default function TeamPage() {
  const operators = OPERATOR_IDS.map((id) => USERS.find((u) => u.id === id)!)

  const totalActive = OPERATOR_IDS.reduce(
    (s, id) => s + (getOperatorData(id)?.tasks.length ?? 0),
    0,
  )
  const totalBlocked = OPERATOR_IDS.reduce(
    (s, id) => s + (getOperatorData(id)?.tasks.filter((t) => t.status === 'blocked').length ?? 0),
    0,
  )

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
          6 operators · {totalActive} active tasks
          {totalBlocked > 0 && (
            <span className="text-[var(--color-status-red)]"> · {totalBlocked} blocked</span>
          )}
        </p>
      </motion.div>

      {/* Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ProcessFlow />
      </motion.div>

      {/* Operator grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {operators.map((user, i) => {
          const data = getOperatorData(user.id)!
          const blocked = data.tasks.filter((t) => t.status === 'blocked').length
          const waiting = data.waiting.length
          const hoursPct = Math.round((data.stats.hoursThisMonth / data.stats.avgPerMonth) * 100)

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
                  <div className="flex items-center gap-3 mb-4">
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

                  {/* Hours bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--color-text-tertiary)]">Hours this month</span>
                      <span
                        className="text-[var(--color-text-secondary)]"
                        style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                      >
                        {data.stats.hoursThisMonth}h / {data.stats.avgPerMonth}h
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-border-brand)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(hoursPct, 100)}%`, background: user.accentColor }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {data.tasks.length}
                      </span>{' '}
                      active
                    </Badge>
                    {waiting > 0 && (
                      <Badge variant="amber">
                        <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{waiting}</span>{' '}
                        waiting
                      </Badge>
                    )}
                    {blocked > 0 && (
                      <Badge variant="red">
                        <AlertTriangle size={10} />
                        <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{blocked}</span>{' '}
                        blocked
                      </Badge>
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
