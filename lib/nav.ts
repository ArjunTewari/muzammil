import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Receipt,
  Settings,
  ClipboardList,
  Globe,
  Workflow,
  Database,
  type LucideIcon,
} from 'lucide-react'
import type { UserRole } from './users'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const MASTER_NAV: NavItem[] = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Architect', href: '/architect', icon: Workflow },
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Clients', href: '/clients', icon: ClipboardList },
  { label: 'Finance', href: '/finance', icon: Receipt },
  { label: 'Web & Social', href: '/digital', icon: Globe },
  { label: 'Memory', href: '/memory', icon: Database },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const OPERATOR_NAV: NavItem[] = [
  { label: 'My Work', href: '/my-work', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function getNavForRole(role: UserRole): NavItem[] {
  return role === 'master' ? MASTER_NAV : OPERATOR_NAV
}

// Routes only the master may open. Operators hitting these are redirected to /my-work.
export const MASTER_ONLY_ROUTES = ['/overview', '/architect', '/team', '/clients', '/finance', '/digital', '/memory']

// The landing route for a given role after login.
export function homeForRole(role: UserRole): string {
  return role === 'master' ? '/overview' : '/my-work'
}
