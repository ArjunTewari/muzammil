'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from '@/components/shell/sidebar'
import { Topbar } from '@/components/shell/topbar'
import { BottomNav } from '@/components/shell/bottom-nav'
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay'
import { AmbientBackground } from '@/components/backdrop/ambient-background'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useTutorial } from '@/hooks/use-tutorial'
import { useAuth } from '@/hooks/use-auth'
import { MASTER_ONLY_ROUTES, homeForRole } from '@/lib/nav'

const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const { user, ready, logout } = useAuth()
  const { show, ready: tutReady, dismiss, restart } = useTutorial()
  const mainRef = useRef<HTMLElement | null>(null)

  // Auth + role guard
  useEffect(() => {
    if (!ready) return
    if (!user) {
      router.replace('/login')
      return
    }
    // Operators cannot open master-only routes
    if (user.role !== 'master' && MASTER_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
      router.replace('/my-work')
      return
    }
    // Master has no personal "My Work" — send to Overview
    if (user.role === 'master' && pathname.startsWith('/my-work')) {
      router.replace('/overview')
    }
  }, [ready, user, pathname, router])

  // While resolving auth, show a quiet loader (avoids flashing protected UI)
  if (!ready || !user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--color-ink)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border-brand)] border-t-[var(--color-gold)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative flex h-[100dvh] overflow-hidden bg-[var(--color-ink)]">
      {/* Living backdrop — parallaxes against the main scroll */}
      <AmbientBackground scrollRef={mainRef} />

      <Sidebar user={user} onLogout={logout} />
      <div className="relative z-10 flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar user={user} onHelpClick={restart} onLogout={logout} />
        {/* pb-16 on mobile to clear the fixed bottom nav */}
        <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.992 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReduced
                  ? { opacity: 0, transition: { duration: 0.1 } }
                  : { opacity: 0, y: -10, scale: 0.996, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }
              }
              transition={{ duration: prefersReduced ? 0.1 : 0.3, ease: EASE_PREMIUM }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomNav user={user} />

      {tutReady && show && <TutorialOverlay onDismiss={dismiss} />}
    </div>
  )
}
