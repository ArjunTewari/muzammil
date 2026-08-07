'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, CornerDownLeft, Plus, FlaskConical, ClipboardList, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getNavForRole, type NavItem } from '@/lib/nav'
import { clients } from '@/lib/mock-data'
import { getAgents } from '@/lib/studio/agent-store'
import type { LucideIcon } from 'lucide-react'

interface CmdItem {
  id: string
  label: string
  sublabel?: string
  group: string
  icon: LucideIcon
  href: string
}

export function CommandPalette() {
  const { user, ready } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const isMaster = user?.role === 'master'

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  const items = useMemo<CmdItem[]>(() => {
    if (!user) return []
    const out: CmdItem[] = []

    if (isMaster) {
      out.push(
        { id: 'a-newproject', label: 'New Project', sublabel: 'Interview the Architect', group: 'Actions', icon: Plus, href: '/architect' },
        { id: 'a-newagent', label: 'New Agent', sublabel: 'Build a trainable agent', group: 'Actions', icon: Plus, href: '/studio/new' },
        { id: 'a-compliance', label: 'Run a compliance check', sublabel: 'SEBI/AMFI Guardian', group: 'Actions', icon: FlaskConical, href: '/studio/seed-compliance' },
      )
    }

    // Pages
    getNavForRole(user.role).forEach((n: NavItem) =>
      out.push({ id: `p-${n.href}`, label: n.label, group: 'Go to', icon: n.icon, href: n.href }),
    )

    if (isMaster) {
      // Clients
      clients.forEach((c) =>
        out.push({ id: `c-${c.id}`, label: c.name, sublabel: `${c.shortName} · client`, group: 'Clients', icon: ClipboardList, href: `/clients/${c.id}` }),
      )
      // Agents (localStorage)
      try {
        getAgents().forEach((a) =>
          out.push({ id: `ag-${a.id}`, label: a.name, sublabel: 'agent', group: 'Agents', icon: FlaskConical, href: `/studio/${a.id}` }),
        )
      } catch {
        /* ignore */
      }
    }
    return out
  }, [user, isMaster])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items.filter((i) => i.group === 'Actions' || i.group === 'Go to')
    return items
      .map((i) => {
        const hay = `${i.label} ${i.sublabel ?? ''}`.toLowerCase()
        const idx = hay.indexOf(q)
        return { i, score: idx === -1 ? -1 : (hay.startsWith(q) ? 0 : 1) + idx * 0.01 }
      })
      .filter((x) => x.score >= 0)
      .sort((a, b) => a.score - b.score)
      .map((x) => x.i)
      .slice(0, 20)
  }, [items, query])

  useEffect(() => {
    if (active >= filtered.length) setActive(0)
  }, [filtered, active])

  function go(item: CmdItem) {
    setOpen(false)
    router.push(item.href)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && filtered[active]) {
      e.preventDefault()
      go(filtered[active])
    }
  }

  // Never render on the auth screen or before we know who the user is.
  if (!ready || !user || pathname === '/login') return null

  // Group the filtered items in stable order.
  const groups = ['Actions', 'Go to', 'Clients', 'Agents']
  let runningIndex = -1

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl rounded-[14px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] overflow-hidden"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
          >
            {/* Search input */}
            <div className="flex items-center gap-2.5 px-4 border-b border-[var(--color-border-brand)]">
              <Search size={16} className="text-[var(--color-text-tertiary)] flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search clients, agents, pages, actions…"
                className="flex-1 bg-transparent py-3.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
              />
              <kbd className="text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-border-brand)] px-1.5 py-0.5 rounded font-mono flex-shrink-0">esc</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[52vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-sm text-[var(--color-text-tertiary)] text-center py-8">No matches for “{query}”.</p>
              ) : (
                groups.map((g) => {
                  const inGroup = filtered.filter((i) => i.group === g)
                  if (inGroup.length === 0) return null
                  return (
                    <div key={g} className="px-2 pb-1">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] px-2 py-1">{g}</p>
                      {inGroup.map((item) => {
                        runningIndex += 1
                        const idx = runningIndex
                        const Icon = item.icon
                        const isActive = idx === active
                        return (
                          <button
                            key={item.id}
                            onMouseEnter={() => setActive(idx)}
                            onClick={() => go(item)}
                            className={`w-full flex items-center gap-3 rounded-[9px] px-2.5 py-2 text-left transition-colors ${
                              isActive ? 'bg-[var(--color-gold-muted)]' : ''
                            }`}
                          >
                            <div className="w-7 h-7 rounded-[7px] bg-[var(--color-surface-elevated)] border border-[var(--color-border-brand)] flex items-center justify-center flex-shrink-0">
                              <Icon size={14} className={isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-tertiary)]'} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm truncate ${isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-primary)]'}`}>{item.label}</p>
                              {item.sublabel && <p className="text-xs text-[var(--color-text-tertiary)] truncate">{item.sublabel}</p>}
                            </div>
                            {isActive && <CornerDownLeft size={13} className="text-[var(--color-text-tertiary)] flex-shrink-0" />}
                            {!isActive && <ArrowRight size={13} className="text-[var(--color-text-tertiary)] opacity-0 flex-shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
