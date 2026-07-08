'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { getNavForRole } from '@/lib/nav'
import type { AppUser } from '@/lib/users'

export function Sidebar({ user, onLogout }: { user: AppUser; onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const prefersReduced = useReducedMotion()

  const navItems = getNavForRole(user.role)
  const width = collapsed ? 64 : 240
  const duration = prefersReduced ? 0 : 0.25

  return (
    <motion.aside
      animate={{ width }}
      transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
      className="glass-rail relative z-10 hidden md:flex flex-col h-full border-r border-[var(--color-border-brand)] flex-shrink-0 overflow-hidden"
    >
      {/* Wordmark */}
      <div className="flex items-center h-14 px-4 border-b border-[var(--color-border-brand)]">
        <div className="flex items-center gap-2 min-w-0">
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
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.2, delay: prefersReduced ? 0 : i * 0.04 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-all duration-100 group',
                  isActive
                    ? 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]',
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-[var(--color-gold)]"
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 400, damping: 32 }
                    }
                  />
                )}

                <Icon
                  size={18}
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

      {/* User + logout */}
      <div className="px-2 pb-2 border-t border-[var(--color-border-brand)] pt-2">
        <div
          className={cn(
            'flex items-center gap-2.5 px-2 py-2 rounded-[8px]',
            collapsed && 'justify-center px-0',
          )}
        >
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
                <div className="text-sm font-medium text-[var(--color-text-primary)] leading-tight truncate">
                  {user.name}
                </div>
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

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-1 flex items-center justify-center w-full h-8 rounded-[8px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all duration-100 cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  )
}
