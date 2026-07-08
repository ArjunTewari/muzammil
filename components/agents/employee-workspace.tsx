'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Database, Activity, CornerDownRight, CalendarClock } from 'lucide-react'
import { AgentPipeline } from '@/components/agents/agent-pipeline'
import { AiInsights } from '@/components/shared/ai-insights'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { agentProgress, type EmployeeProject } from '@/lib/employee-projects'
import type { AppUser } from '@/lib/users'
import { formatLakhs } from '@/lib/utils'

export function EmployeeWorkspace({
  user,
  project,
  viewedByMaster = false,
}: {
  user: AppUser
  project: EmployeeProject
  viewedByMaster?: boolean
}) {
  const [input, setInput] = useState('')
  const [routed, setRouted] = useState<string | null>(null)
  const progress = agentProgress(project)

  function runCommand(text: string) {
    if (!text.trim()) return
    setRouted(text.trim())
    setInput('')
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {viewedByMaster ? (
          <p className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] mb-1">
            Viewing {user.name.split(' ')[0]}&apos;s agent workspace
          </p>
        ) : (
          <>
            <h1
              className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              Your Agentic Agency, {user.name.split(' ')[0]}.
            </h1>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              The full Maestro agent suite, running your campaign end-to-end.
            </p>
          </>
        )}
      </motion.div>

      {/* Project banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="relative rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-4 sm:p-5 overflow-hidden"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-gold)]" />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] mb-1">
              Running · {project.client}
            </p>
            <h2
              className="text-xl text-[var(--color-text-primary)] leading-tight"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {project.projectTitle}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-xl">{project.objective}</p>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="text-xs text-[var(--color-text-tertiary)]">Agents done</p>
              <p className="text-lg text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                {progress.done}/{progress.total}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1 justify-end">
                <CalendarClock size={11} /> Due
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                {new Date(project.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
        </div>
        {/* Budget bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[var(--color-text-tertiary)] mb-1">
            <span>Budget · {formatLakhs(project.spent)} of {formatLakhs(project.budget)}</span>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{project.stagePct}% complete</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--color-border-brand)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.stagePct}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-[var(--color-gold)]"
            />
          </div>
        </div>
      </motion.div>

      {/* Command bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="rounded-[12px] border border-[var(--color-gold-border)] bg-[linear-gradient(180deg,var(--color-gold-muted),var(--color-surface))] p-4 sm:p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={15} className="text-[var(--color-gold)]" />
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            Ask the Master Agent
          </p>
          <span className="text-xs text-[var(--color-text-tertiary)]">
            — describe what you need, it routes the rest
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runCommand(input)}
            placeholder="e.g. Draft 3 reel scripts and check them for compliance"
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
          />
          <button
            onClick={() => runCommand(input)}
            className="w-8 h-8 rounded-[8px] bg-[var(--color-gold)] flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
            aria-label="Send to Master Agent"
          >
            <Send size={14} className="text-[var(--color-ink)]" />
          </button>
        </div>

        {/* Example chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {project.commandExamples.map((ex) => (
            <button
              key={ex}
              onClick={() => runCommand(ex)}
              className="text-xs text-[var(--color-text-secondary)] rounded-full border border-[var(--color-border-brand)] bg-[var(--color-surface)] px-2.5 py-1 hover:border-[var(--color-gold-border)] hover:text-[var(--color-text-primary)] transition-colors duration-100 cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Routing result */}
        <AnimatePresence>
          {routed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-3"
            >
              <p className="text-xs text-[var(--color-text-tertiary)] mb-1.5 flex items-center gap-1.5">
                <Sparkles size={11} className="text-[var(--color-gold)]" /> Master Agent received:{' '}
                <span className="text-[var(--color-text-secondary)] italic">&ldquo;{routed}&rdquo;</span>
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 flex-wrap">
                <CornerDownRight size={11} className="text-[var(--color-gold)]" />
                Routing → <span className="text-[var(--color-text-primary)]">Brief Decoder</span> →{' '}
                <span className="text-[var(--color-text-primary)]">Copywriter</span> →{' '}
                <span className="text-[var(--color-text-primary)]">Compliance Guardian</span>. Context passed
                automatically; results will appear in the pipeline below.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* AI next steps */}
      <AiInsights steps={project.nextSteps} subtitle="From your agents — what needs you" />

      {/* Agent pipeline */}
      <div>
        <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          Your agent suite on this campaign
        </h2>
        <AgentPipeline project={project} />
      </div>

      {/* Memory + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card goldRule hover={false}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database size={15} className="text-[var(--color-gold)]" />
              <CardTitle>Maestro Memory</CardTitle>
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              What the system remembered and applied to this project
            </p>
          </CardHeader>
          <CardContent className="pt-2 space-y-2">
            {project.memory.map((m, i) => (
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
            {project.activity.map((a, i) => (
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
    </div>
  )
}
