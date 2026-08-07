import { getUserById, type AppUser } from './users'
import { allEmployeeProjects } from './employee-projects'
import { getProjectsForEmployee } from './project-store'
import type { DeliverableType } from './deliverable-type'

export interface ProjectRow {
  id: string
  title: string
  subtitle: string
  href: string
  dot: string
  isNew: boolean
  deliverableType: DeliverableType
}

// Single source of truth for "what projects does this user have" — used by
// both the sidebar's live list and the command palette's search, so the two
// never drift out of sync.
export function getProjectRows(user: AppUser): ProjectRow[] {
  if (user.role === 'master') {
    return allEmployeeProjects().map((p) => {
      const owner = getUserById(p.employeeId)
      const assigned = getProjectsForEmployee(p.employeeId).find((a) => a.status === 'new')
      return {
        id: p.employeeId,
        title: assigned ? assigned.title : p.projectTitle,
        subtitle: `${owner?.name.split(' ')[0] ?? p.employeeId} · ${assigned ? assigned.client : p.client}`,
        href: `/team/${p.employeeId}`,
        dot: owner?.accentColor ?? 'var(--color-gold)',
        isNew: !!assigned,
        deliverableType: assigned ? assigned.brief.deliverableType : p.deliverableType,
      }
    })
  }

  return getProjectsForEmployee(user.id).map((a) => ({
    id: a.id,
    title: a.title,
    subtitle: a.client,
    href: '/my-work',
    dot: user.accentColor,
    isNew: a.status === 'new',
    deliverableType: a.brief.deliverableType,
  }))
}
