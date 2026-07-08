'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { OperatorDashboard } from '@/components/operator/operator-dashboard'
import { getUserById } from '@/lib/users'
import { getOperatorData } from '@/lib/operator-data'

export default function TeamMemberPage({
  params,
}: {
  params: Promise<{ operatorId: string }>
}) {
  const { operatorId } = use(params)
  const user = getUserById(operatorId)
  const data = user ? getOperatorData(user.id) : null

  if (!user || !data) notFound()

  return (
    <div>
      {/* Back + member header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 max-w-[1400px] mx-auto">
        <Link
          href="/team"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors duration-100"
        >
          <ArrowLeft size={14} /> Back to Team
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 mt-4"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold flex-shrink-0"
            style={{ background: `${user.accentColor}22`, color: user.accentColor }}
          >
            {user.initials}
          </div>
          <div>
            <h1
              className="text-2xl text-[var(--color-text-primary)] leading-tight"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {user.name}
            </h1>
            <p className="text-sm text-[var(--color-text-tertiary)]">{user.title}</p>
          </div>
        </motion.div>
      </div>

      <OperatorDashboard user={user} data={data} viewedByMaster />
    </div>
  )
}
