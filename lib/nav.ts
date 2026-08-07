import {
  LayoutDashboard,
  Receipt,
  Globe,
  Bot,
  Database,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react'
import type { UserRole } from './users'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

// The founder's home is the chat (the Architect); Dashboard is the only
// persistent tab. Execution (/team) and Finance are clubbed back under
// Dashboard rather than getting their own top-nav tabs — reachable via the
// sidebar's live Projects list, "Back to Team" from any workspace, Settings,
// or the command palette (⌘K).
const MASTER_NAV: NavItem[] = [{ label: 'Dashboard', href: '/overview', icon: LayoutDashboard }]

const OPERATOR_NAV: NavItem[] = [{ label: 'My Work', href: '/my-work', icon: LayoutDashboard }]

// Reachable from the sidebar's Settings entry (and the command palette) —
// not top-level tabs, but still real, still master-only.
export const SETTINGS_NAV: NavItem[] = [
  { label: 'Finance', href: '/finance', icon: Receipt },
  { label: 'Web & Social', href: '/digital', icon: Globe },
  { label: 'Agent Studio', href: '/studio', icon: FlaskConical },
  { label: 'Agent Control', href: '/agent-control', icon: Bot },
  { label: 'Memory', href: '/memory', icon: Database },
]

export function getNavForRole(role: UserRole): NavItem[] {
  return role === 'master' ? MASTER_NAV : OPERATOR_NAV
}

// Routes only the master may open. Operators hitting these are redirected to /my-work.
// Kept broad even though some of these are no longer top-nav tabs — the pages
// still exist (reachable via Settings / search) and still need the guard.
export const MASTER_ONLY_ROUTES = [
  '/overview',
  '/architect',
  '/studio',
  '/agent-control',
  '/team',
  '/pipeline',
  '/clients',
  '/finance',
  '/digital',
  '/memory',
]

// The landing route for a given role after login. Master lands on the
// Architect — the chat is home, not a stats page.
export function homeForRole(role: UserRole): string {
  return role === 'master' ? '/architect' : '/my-work'
}
