'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeftClose, PanelLeft, LogOut, Plus, Search, Sparkles, Settings as SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { getNavForRole } from '@/lib/nav'
import { getUserById, type AppUser } from '@/lib/users'
import { allEmployeeProjects } from '@/lib/employee-projects'
import { getProjectsForEmployee, subscribeProjects } from '@/lib/project-store'

interface ProjectRow {
  id: string
  title: string
  subtitle: string
  href: string
  dot: string
  isNew: boolean
}

function openPalette() {
  window.dispatchEvent(new CustomEvent('maestro:open-command-palette'))
}

// Master sees one row per employee — the brief the Architect just assigned
// them takes priority, otherwise their running campaign. Operators see their
// own queue. Mirrors Claude's sidebar "Projects" list: short, live, clickable.
function useProjectRows(user: AppUser): ProjectRow[] {
  const [, setTick] = useState(0)
  useEffect(() => subscribeProjects(() => setTick((t) => t + 1)), [])

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
      }
    })
  }

  const assigned = getProjectsForEmployee(user.id)
  const rows: ProjectRow[] = assigned.map((a) => ({
    id: a.id,
    title: a.title,
    subtitle: a.client,
    href: '/my-work',
    dot: user.accentColor,
    isNew: a.status === 'new',
  }))
  if (rows.length === 0) {
    // Fall back to nothing extra — /my-work already shows their campaign.
  }
  return rows
}

export function Sidebar({ user, onLogout }: { user: AppUser; onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const prefersReduced = useReducedMotion()

  const navItems = getNavForRole(user.role)
  const projectRows = useProjectRows(user)
  const width = collapsed ? 64 : 264
  const duration = prefersReduced ? 0 : 0.25

  return (
    <motion.aside
      animate={{ width }}
      transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
      className="glass-rail relative z-10 hidden md:flex flex-col h-full border-r border-[var(--color-border-brand)] flex-shrink-0 overflow-hidden"
    >
      {/* Wordmark + collapse */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-[var(--color-border-brand)] flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0 px-1">
          <div className="flex-shrink-0 w-7 h-7 rounded-[6px] bg-[var(--color-gold)] flex items-center justify-center">
            <span className="text-[var(--color-ink)] text-xs font-semibold" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
              M
            </span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: prefersReduced ? 0 : 0.15 }}
                className="text-[var(--color-text-primary)] font-medium tracking-tight whitespace-nowrap overflow-hidden"
                style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: '17px' }}
              >
                Maestro
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-[7px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all duration-100 cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* New Project + Search — the two things Claude puts right under its logo */}
      <div className="px-2 pt-3 space-y-1.5 flex-shrink-0">
        {user.role === 'master' && (
          <Link
            href="/architect"
            onClick={(e) => {
              // Already home (a live chat with in-page state) — a same-route
              // Link nav won't reset it, so force a fresh start.
              if (pathname === '/architect') {
                e.preventDefault()
                window.location.reload()
              }
            }}
            className={cn(
              'flex items-center gap-2.5 rounded-[10px] bg-[var(--color-gold)] text-[var(--color-ink)] text-sm font-semibold hover:bg-[#d4b46a] hover:shadow-[var(--shadow-glow-gold)] active:scale-[0.98] transition-all duration-200 cursor-pointer',
              collapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-3 py-2.5',
            )}
            title="New Project"
          >
            <Plus size={16} className="flex-shrink-0" />
            {!collapsed && <span className="whitespace-nowrap overflow-hidden">New Project</span>}
          </Link>
        )}

        <button
          onClick={openPalette}
          className={cn(
            'flex items-center gap-2.5 w-full rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-gold-border)] transition-all duration-150 cursor-pointer',
            collapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-3 py-2',
          )}
          title="Search (⌘K)"
        >
          <Search size={15} className="flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left text-sm whitespace-nowrap overflow-hidden">Search…</span>
              <kbd className="text-[10px] bg-[var(--color-border-brand)] px-1.5 py-0.5 rounded font-mono flex-shrink-0">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      {/* Nav items */}
      <nav className="pt-3 px-2 space-y-0.5 flex-shrink-0">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.2, delay: prefersReduced ? 0 : i * 0.03 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2 rounded-[8px] transition-all duration-100 group',
                  isActive
                    ? 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]',
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-[var(--color-gold)]"
                    transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}

                <Icon
                  size={17}
                  className={cn(
                    'flex-shrink-0 transition-colors duration-100',
                    isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)]',
                  )}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: prefersReduced ? 0 : 0.12 }}
                      className="text-sm whitespace-nowrap overflow-hidden font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Projects — live, one row per person, Claude-style list */}
      {!collapsed && projectRows.length > 0 && (
        <div className="flex flex-col min-h-0 flex-1 mt-4 pt-3 border-t border-[var(--color-border-brand)]">
          <p className="px-4 pb-2 text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-medium flex-shrink-0">
            Projects
          </p>
          <div className="flex-1 min-h-0 overflow-y-auto px-2 space-y-0.5 pb-2">
            {projectRows.map((row) => {
              const isActive = pathname === row.href
              return (
                <Link
                  key={row.id}
                  href={row.href}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] transition-colors duration-100 group',
                    isActive ? 'bg-[var(--color-surface-elevated)]' : 'hover:bg-[var(--color-surface-elevated)]',
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: row.dot }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-[var(--color-text-primary)] truncate leading-tight group-hover:text-[var(--color-gold)] transition-colors">
                      {row.title}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-tertiary)] truncate">{row.subtitle}</p>
                  </div>
                  {row.isNew && <Sparkles size={11} className="text-[var(--color-gold)] flex-shrink-0" />}
                </Link>
              )
            })}
          </div>
        </div>
      )}
      {(collapsed || projectRows.length === 0) && <div className="flex-1" />}

      {/* Settings — everything not Dashboard/Projects lives behind here */}
      <div className="px-2 pt-2 flex-shrink-0">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-[8px] transition-all duration-100 group',
            pathname.startsWith('/settings')
              ? 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]',
            collapsed && 'justify-center px-0',
          )}
        >
          <SettingsIcon
            size={17}
            className={cn(
              'flex-shrink-0 transition-colors duration-100',
              pathname.startsWith('/settings') ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)]',
            )}
          />
          {!collapsed && <span className="text-sm whitespace-nowrap overflow-hidden font-medium">Settings</span>}
        </Link>
      </div>

      {/* User + logout */}
      <div className="px-2 pb-2 pt-2 border-t border-[var(--color-border-brand)] flex-shrink-0">
        <div className={cn('flex items-center gap-2.5 px-2 py-2 rounded-[8px]', collapsed && 'justify-center px-0')}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold"
            style={{ background: `${user.accentColor}22`, color: user.accentColor }}
          >
            {user.initials}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.12 }}
                className="min-w-0 flex-1"
              >
                <div className="text-sm font-medium text-[var(--color-text-primary)] leading-tight truncate">{user.name}</div>
                <div className="text-xs text-[var(--color-text-tertiary)] truncate">{user.title}</div>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button
              onClick={onLogout}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-[6px] text-[var(--color-text-tertiary)] hover:text-[var(--color-status-red)] hover:bg-[var(--color-surface-elevated)] transition-all duration-100 cursor-pointer"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
