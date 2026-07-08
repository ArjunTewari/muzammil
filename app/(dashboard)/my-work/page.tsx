'use client'

import { useAuth } from '@/hooks/use-auth'
import { getOperatorData } from '@/lib/operator-data'
import { OperatorDashboard } from '@/components/operator/operator-dashboard'

export default function MyWorkPage() {
  const { user, ready } = useAuth()

  if (!ready || !user) return null

  const data = getOperatorData(user.id)
  if (!data) {
    return (
      <div className="p-6 text-sm text-[var(--color-text-tertiary)]">
        No personal workspace for this account.
      </div>
    )
  }

  return <OperatorDashboard user={user} data={data} />
}
