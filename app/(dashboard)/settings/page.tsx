'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Database, Activity, Settings as SettingsIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useCurrentUser } from '@/hooks/use-current-user'
import { SETTINGS_NAV } from '@/lib/nav'
import { getEmployeeProject } from '@/lib/employee-projects'

const DESCRIPTIONS: Record<string, string> = {
  '/finance': 'Revenue, collections and billing — run by the Finance Agent across every campaign.',
  '/digital': "Your agency's own website health and social presence.",
  '/studio': 'Build and train your own agents — define a goal, task and rules.',
  '/agent-control': 'Production agent runs, approvals and calibration.',
  '/memory': "Everything Supra has learned — instructions, approvals, corrections.",
}

export default function SettingsPage() {
  const user = useCurrentUser()
  const isMaster = user?.role === 'master'
  const ownProject = user && !isMaster ? getEmployeeProject(user.id) : null

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1
          className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          Settings
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          {isMaster
            ? 'Everything beyond Dashboard lives here.'
            : 'What Supra has learned about your campaign, and what your agents have been doing.'}
        </p>
      </motion.div>

      {isMaster ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {SETTINGS_NAV.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
              >
                <Link href={item.href}>
                  <Card goldRule className="p-4 group cursor-pointer h-full flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-[var(--color-gold-muted)] border border-[var(--color-gold-border)] flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[var(--color-gold)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-gold)] transition-colors duration-100">
                        {item.label}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 leading-snug">
                        {DESCRIPTIONS[item.href]}
                      </p>
                    </div>
                    <ArrowRight
                      size={15}
                      className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0 mt-1"
                    />
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      ) : ownProject ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card goldRule hover={false}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database size={15} className="text-[var(--color-gold)]" />
                <CardTitle>Supra Memory</CardTitle>
              </div>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                What the system remembered and applied to this project
              </p>
            </CardHeader>
            <CardContent className="pt-2 space-y-2">
              {ownProject.memory.map((m, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] flex-shrink-0 mt-1.5" />
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{m}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card goldRule hover={false}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-[var(--color-gold)]" />
                <CardTitle>Agent Activity</CardTitle>
              </div>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Latest actions across the suite</p>
            </CardHeader>
            <CardContent className="pt-2 space-y-2">
              {ownProject.activity.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-green)] flex-shrink-0 mt-1.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--color-text-secondary)] leading-snug">
                      <span className="text-[var(--color-text-primary)] font-medium">{a.agent}</span> {a.action}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--color-gold-muted)] border border-[var(--color-gold-border)] flex items-center justify-center mx-auto mb-4">
            <SettingsIcon size={20} className="text-[var(--color-gold)]" />
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm">
            No campaign assigned to this account yet.
          </p>
        </div>
      )}
    </div>
  )
}
