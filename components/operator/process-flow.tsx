'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { USERS } from '@/lib/users'
import { getOperatorData } from '@/lib/operator-data'

// The linear delivery pipeline, in handoff order.
const PIPELINE_IDS = ['priya', 'rohan', 'divya', 'arjit', 'karan']
const STAGE_LABEL: Record<string, string> = {
  priya: 'Account',
  rohan: 'Research',
  divya: 'Creative',
  arjit: 'Compliance',
  karan: 'Production',
}

function Node({ userId, index }: { userId: string; index: number }) {
  const user = USERS.find((u) => u.id === userId)!
  const data = getOperatorData(userId)
  const active = data?.tasks.length ?? 0
  const blocked = data?.tasks.filter((t) => t.status === 'blocked').length ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="flex items-center gap-2 sm:gap-3"
    >
      <Link
        href={`/team/${userId}`}
        className="group flex flex-col items-center gap-2 min-w-[92px] sm:min-w-[104px]"
      >
        <div className="relative">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-transform duration-150 group-hover:scale-105"
            style={{
              background: `${user.accentColor}22`,
              color: user.accentColor,
              borderColor: blocked > 0 ? 'var(--color-status-red)' : `${user.accentColor}55`,
            }}
          >
            {user.initials}
          </div>
          {blocked > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-status-red)] text-white text-[10px] font-bold flex items-center justify-center"
              style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
              title={`${blocked} blocked`}
            >
              {blocked}
            </span>
          )}
        </div>
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-medium">
            {STAGE_LABEL[userId]}
          </p>
          <p className="text-xs text-[var(--color-text-primary)] font-medium leading-tight mt-0.5 group-hover:text-[var(--color-gold)] transition-colors duration-100">
            {user.name.split(' ')[0]}
          </p>
          <p
            className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5"
            style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
          >
            {active} active
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

export function ProcessFlow() {
  const finance = USERS.find((u) => u.id === 'sneha')!
  const financeData = getOperatorData('sneha')
  const financeActive = financeData?.tasks.length ?? 0
  const financeBlocked = financeData?.tasks.filter((t) => t.status === 'blocked').length ?? 0

  return (
    <div className="rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-4 sm:p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            Delivery Pipeline
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
            How work flows through the team · click any stage to open
          </p>
        </div>
      </div>

      {/* Linear pipeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-1 sm:gap-2 min-w-max">
          {PIPELINE_IDS.map((id, i) => (
            <div key={id} className="flex items-center gap-1 sm:gap-2">
              <Node userId={id} index={i} />
              {i < PIPELINE_IDS.length - 1 && (
                <ChevronRight
                  size={18}
                  className="text-[var(--color-text-tertiary)] flex-shrink-0"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Finance parallel lane */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border-brand)]">
        <Link
          href="/team/sneha"
          className="group inline-flex items-center gap-3 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-2.5 pr-4 hover:border-[var(--color-gold-border)] transition-colors duration-150"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold border-2 flex-shrink-0"
            style={{
              background: `${finance.accentColor}22`,
              color: finance.accentColor,
              borderColor: financeBlocked > 0 ? 'var(--color-status-red)' : `${finance.accentColor}55`,
            }}
          >
            {finance.initials}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-medium">
              Finance · runs alongside every stage
            </p>
            <p className="text-sm text-[var(--color-text-primary)] font-medium leading-tight group-hover:text-[var(--color-gold)] transition-colors duration-100">
              {finance.name} · {financeActive} active
              {financeBlocked > 0 && (
                <span className="text-[var(--color-status-red)]"> · {financeBlocked} blocked</span>
              )}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
