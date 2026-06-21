'use client'

import { Search, Bell } from 'lucide-react'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/overview': 'Overview',
  '/projects': 'Projects',
  '/clients': 'Clients',
  '/finance': 'Finance',
  '/settings': 'Settings',
}

export function Topbar({ onHelpClick }: { onHelpClick?: () => void }) {
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] ?? 'Maestro'

  return (
    <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--color-border-brand)] bg-[var(--color-ink)] flex-shrink-0">
      {/* Mobile: logo + page title | Desktop: search bar */}
      <div className="flex items-center gap-3">
        {/* Logo mark — mobile only */}
        <div className="md:hidden flex-shrink-0 w-7 h-7 rounded-[6px] bg-[var(--color-gold)] flex items-center justify-center">
          <span
            className="text-[var(--color-ink)] text-xs font-semibold"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            M
          </span>
        </div>
        {/* Page title — mobile only */}
        <span
          className="md:hidden text-base font-medium text-[var(--color-text-primary)]"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {pageTitle}
        </span>

        {/* Search bar — desktop only */}
        <div className="hidden md:flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border-brand)] rounded-[8px] px-3 py-2 w-72">
          <Search size={14} className="text-[var(--color-text-tertiary)] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search clients, projects, leads..."
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
        {/* Help / Tutorial button */}
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

        {/* Search icon — mobile only */}
        <button className="md:hidden relative w-8 h-8 flex items-center justify-center rounded-[6px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all duration-100 cursor-pointer">
          <Search size={16} />
        </button>

        {/* Notification bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-[6px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all duration-100 cursor-pointer">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[#a07830] flex items-center justify-center flex-shrink-0">
            <span
              className="text-[var(--color-ink)] text-xs font-semibold"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              ZW
            </span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-[var(--color-text-primary)] leading-none mb-0.5 group-hover:text-[var(--color-gold)] transition-colors duration-100">
              Muzammil
            </div>
            <div className="text-xs text-[var(--color-text-tertiary)]">Founder & CEO</div>
          </div>
        </div>
      </div>
    </header>
  )
}
