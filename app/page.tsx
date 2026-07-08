'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { homeForRole } from '@/lib/nav'

export default function Home() {
  const router = useRouter()
  const { user, ready } = useAuth()

  useEffect(() => {
    if (!ready) return
    if (user) router.replace(homeForRole(user.role))
    else router.replace('/login')
  }, [ready, user, router])

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--color-ink)]">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border-brand)] border-t-[var(--color-gold)] animate-spin" />
    </div>
  )
}
