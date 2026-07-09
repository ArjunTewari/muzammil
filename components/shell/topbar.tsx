'use client'

import { Search, Bell, LogOut, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { AppUser } from '@/lib/users'

const pageTitles: Record<string, string> = {
  '/overview': 'Overview',
  '/architect': 'The Architect',
  '/memory': 'Memory',
  '/team': 'Team',
  '/my-work': 'My Work',
  '/projects': 'Projects',
  '/clients': 'Clients',
  '/finance': 'Finance',
  '/settings': 'Settings',
}

function titleFor(pathname: string): string {
  if (pathname.startsWith('/team/')) return 'Team Member'
  const match = Object.keys(pageTitles).find((k) => pathname === k || pathname.startsWith(k + '/'))
  return match ? pageTitles[match] : 'Maestro'
}

export function Topbar({
  user,
  onHelpClick,
  onLogout,
}: {
  user: AppUser
  onHelpClick?: () => void
  onLogout?: () => void
}) {
  const pathname = usePathname()
  const pageTitle = titleFor(pathname)

  return (
    <header className="glass-bar relative z-10 h-14 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--color-border-brand)] flex-shrink-0">
      {/* Mobile: logo + page title | Desktop: search bar */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex-shrink-0 w-7 h-7 rounded-[6px] bg-[var(--color-gold)] flex items-center justify-center">
          <span
            className="text-[var(--color-ink)] text-xs font-semibold"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            M
          </span>
        </div>
        <span
          className="md:hidden text-base font-medium text-[var(--color-text-primary)]"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {pageTitle}
        </span>

        <div className="hidden md:flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border-brand)] rounded-[8px] px-3 py-2 w-72">
          <Search size={14} className="text-[var(--color-text-tertiary)] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search clients, projects, tasks..."
            className="bg-transparent text-sm text-[var(--color-text-secondary)] placeholder:text-[var(--color-text-tertiary)] outline-none w-full"
            readOnly
          />
          <kbd className="text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-border-brand)] px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Master primary CTA — start a new project via the Architect */}
        {user.role === 'master' && (
          <Link
            href="/architect"
            className="inline-flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-[8px] bg-[var(--color-gold)] text-[var(--color-ink)] text-xs font-semibold hover:bg-[#d4b46a] hover:shadow-[var(--shadow-glow-gold)] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Project</span>
          </Link>
        )}

        {onHelpClick && (
          <button
            onClick={onHelpClick}
            className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold border border-[var(--color-border-brand)] text-[var(--color-text-tertiary)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold-border)] transition-all duration-100 cursor-pointer"
            aria-label="Open tutorial"
            title="Open tutorial"
          >
            ?
          </button>
        )}

        <button className="md:hidden relative w-8 h-8 flex items-center justify-center rounded-[6px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all duration-100 cursor-pointer">
          <Search size={16} />
        </button>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-[6px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all duration-100 cursor-pointer">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold"
            style={{ background: `${user.accentColor}22`, color: user.accentColor }}
          >
            {user.initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-[var(--color-text-primary)] leading-none mb-0.5">
              {user.name}
            </div>
            <div className="text-xs text-[var(--color-text-tertiary)]">{user.title}</div>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-[6px] text-[var(--color-text-tertiary)] hover:text-[var(--color-status-red)] hover:bg-[var(--color-surface)] transition-all duration-100 cursor-pointer"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </header>
  )
}
