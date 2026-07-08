'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getNavForRole } from '@/lib/nav'
import type { AppUser } from '@/lib/users'

export function BottomNav({ user }: { user: AppUser }) {
  const pathname = usePathname()
  // Cap at 5 for a comfortable mobile bar
  const navItems = getNavForRole(user.role).slice(0, 5)

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-border-brand)] bg-[var(--color-surface)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-medium transition-colors duration-150',
                isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-tertiary)]',
              )}
            >
              {isActive && (
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
      </div>
    </nav>
  )
}
