'use client'

import { Sidebar } from '@/components/shell/sidebar'
import { Topbar } from '@/components/shell/topbar'
import { BottomNav } from '@/components/shell/bottom-nav'
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useTutorial } from '@/hooks/use-tutorial'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prefersReduced = useReducedMotion()
  const { show, ready, dismiss, restart } = useTutorial()

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--color-ink)]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onHelpClick={restart} />
        {/* pb-16 on mobile to clear the fixed bottom nav */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 16 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: prefersReduced ? 0.1 : 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* Tutorial overlay — only after hydration to avoid SSR mismatch */}
      {ready && show && <TutorialOverlay onDismiss={dismiss} />}
    </div>
  )
}
