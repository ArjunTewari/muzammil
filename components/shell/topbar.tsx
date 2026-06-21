'use client'

import { Search, Bell } from 'lucide-react'

export function Topbar() {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-[var(--color-border-brand)] bg-[var(--color-ink)] flex-shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border-brand)] rounded-[8px] px-3 py-2 w-72">
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

      {/* Right side */}
      <div className="flex items-center gap-3">
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
