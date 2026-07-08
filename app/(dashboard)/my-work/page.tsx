'use client'

import { useAuth } from '@/hooks/use-auth'
import { getEmployeeProject } from '@/lib/employee-projects'
import { EmployeeWorkspace } from '@/components/agents/employee-workspace'

export default function MyWorkPage() {
  const { user, ready } = useAuth()

  if (!ready || !user) return null

  const project = getEmployeeProject(user.id)
  if (!project) {
    return (
      <div className="p-6 text-sm text-[var(--color-text-tertiary)]">
        No campaign assigned to this account.
      </div>
    )
  }

  return <EmployeeWorkspace user={user} project={project} />
}
