'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MoreHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getNavForRole, type NavItem } from '@/lib/nav'
import type { AppUser } from '@/lib/users'

export function BottomNav({ user }: { user: AppUser }) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const all = getNavForRole(user.role)

  // If more than 5 items, show first 4 + a "More" button; otherwise show all.
  const overflow = all.length > 5
  const primary = overflow ? all.slice(0, 4) : all
  const extra = overflow ? all.slice(4) : []

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-border-brand)] bg-[var(--color-surface)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch h-16">
          {primary.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-medium transition-colors duration-150',
                  active ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-tertiary)]',
                )}
              >
                {active && (
                  <motion.div
                    layoutId="bottomActiveBar"
                    className="absolute top-0 inset-x-4 h-0.5 rounded-full bg-[var(--color-gold)]"
                    transition={{ duration: 0.2 }}
                  />
                )}
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {overflow && (
            <button
              onClick={() => setMoreOpen(true)}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-medium transition-colors duration-150 cursor-pointer',
                extra.some((e) => isActive(e.href))
                  ? 'text-[var(--color-gold)]'
                  : 'text-[var(--color-text-tertiary)]',
              )}
            >
              {extra.some((e) => isActive(e.href)) && (
                <motion.div
                  layoutId="bottomActiveBar"
                  className="absolute top-0 inset-x-4 h-0.5 rounded-full bg-[var(--color-gold)]"
                  transition={{ duration: 0.2 }}
                />
              )}
              <MoreHorizontal size={20} />
              <span>More</span>
            </button>
          )}
        </div>
      </nav>

      {/* More sheet */}
      <AnimatePresence>
        {moreOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 flex items-end"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={(e) => e.target === e.currentTarget && setMoreOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="w-full rounded-t-[20px] border-t border-[var(--color-border-brand)] bg-[var(--color-surface)] p-4"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">More</p>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {extra.map((item: NavItem) => {
                  const active = isActive(item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        'flex flex-col items-center justify-center gap-2 rounded-[12px] border p-4 transition-colors duration-150',
                        active
                          ? 'border-[var(--color-gold-border)] bg-[var(--color-gold-muted)] text-[var(--color-gold)]'
                          : 'border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]',
                      )}
                    >
                      <Icon size={20} />
                      <span className="text-xs font-medium text-center">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
