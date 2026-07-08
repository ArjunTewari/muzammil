'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { EmployeeWorkspace } from '@/components/agents/employee-workspace'
import { getUserById } from '@/lib/users'
import { getEmployeeProject } from '@/lib/employee-projects'

export default function TeamMemberPage({
  params,
}: {
  params: Promise<{ operatorId: string }>
}) {
  const { operatorId } = use(params)
  const user = getUserById(operatorId)
  const project = user ? getEmployeeProject(user.id) : null

  if (!user || !project) notFound()

  return (
    <div>
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 max-w-[1400px] mx-auto">
        <Link
          href="/team"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors duration-100"
        >
          <ArrowLeft size={14} /> Back to Team
        </Link>
      </div>
      <EmployeeWorkspace user={user} project={project} viewedByMaster />
    </div>
  )
}
