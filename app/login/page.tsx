'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { USERS } from '@/lib/users'
import { homeForRole } from '@/lib/nav'

export default function LoginPage() {
  const router = useRouter()
  const { user, ready, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  // Already signed in → bounce to the right home
  useEffect(() => {
    if (ready && user) router.replace(homeForRole(user.role))
  }, [ready, user, router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(username, password)
    if (!ok) {
      setError(true)
      return
    }
    const u = USERS.find((x) => x.username === username.trim().toLowerCase())
    router.replace(u ? homeForRole(u.role) : '/overview')
  }

  function quickFill(u: (typeof USERS)[number]) {
    setUsername(u.username)
    setPassword(u.password)
    setError(false)
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--color-ink)] px-4 py-10">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left — brand + login form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-sm mx-auto lg:mx-0"
        >
          {/* Wordmark */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-[8px] bg-[var(--color-gold)] flex items-center justify-center">
              <span
                className="text-[var(--color-ink)] text-lg font-semibold"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                M
              </span>
            </div>
            <span
              className="text-[var(--color-text-primary)] text-2xl"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              Maestro
            </span>
          </div>

          <h1
            className="text-3xl text-[var(--color-text-primary)] mb-1.5 leading-tight"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Sign in to your workspace
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-8">
            The operating system for ZiWorks Advertising.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5 font-medium">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError(false)
                }}
                autoComplete="username"
                placeholder="e.g. muzammil"
                className="w-full h-11 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] px-3.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-gold-border)] transition-colors duration-150"
              />
            </div>

            <div>
              <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full h-11 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] px-3.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-gold-border)] transition-colors duration-150"
              />
            </div>

            {error && (
              <p className="text-xs text-[var(--color-status-red)] flex items-center gap-1.5">
                <Lock size={12} /> Incorrect username or password. Try a demo account below.
              </p>
            )}

            <button
              type="submit"
              className="w-full h-11 rounded-[10px] bg-[var(--color-gold)] text-[var(--color-ink)] text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-150 cursor-pointer"
            >
              Sign in
              <ArrowRight size={15} />
            </button>
          </form>
        </motion.div>

        {/* Right — demo credentials */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-[16px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-5 sm:p-6"
        >
          <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-widest mb-1 font-medium">
            Demo accounts
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mb-4">
            Tap any account to auto-fill, then Sign in.
          </p>

          <div className="space-y-1.5">
            {USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => quickFill(u)}
                className="w-full flex items-center gap-3 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-2.5 text-left hover:border-[var(--color-gold-border)] transition-colors duration-150 cursor-pointer group"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold"
                  style={{ background: `${u.accentColor}22`, color: u.accentColor }}
                >
                  {u.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--color-text-primary)] font-medium truncate">
                      {u.name}
                    </span>
                    {u.role === 'master' && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-gold-muted)] text-[var(--color-gold)] font-semibold flex-shrink-0">
                        Master
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[var(--color-text-tertiary)]">{u.title}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-xs text-[var(--color-text-secondary)]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                  >
                    {u.username}
                  </div>
                  <div
                    className="text-[10px] text-[var(--color-text-tertiary)]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                  >
                    {u.password}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
