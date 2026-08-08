'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock } from 'lucide-react'
import { AssignedProjects } from '@/components/agents/assigned-projects'
import { ProjectMemory } from '@/components/agents/project-memory'
import { ChatMessage, ThinkingIndicator, type UiMessage } from '@/components/architect/chat-message'
import { Composer } from '@/components/shared/composer'
import { WorkflowTracker } from '@/components/project/workflow-tracker'
import { agentProgress, type EmployeeProject } from '@/lib/employee-projects'
import { simulateMasterAgentReply } from '@/lib/master-agent-simulate'
import type { AppUser } from '@/lib/users'
import { formatLakhs } from '@/lib/utils'
import { DeliverableBadge } from '@/components/shared/deliverable-badge'

// The 11-stage rail only has whole indices — scale the project's rough
// completion percentage onto it for a reasonable "where are we" read.
function stageIndexFromPct(pct: number): number {
  return Math.max(0, Math.min(10, Math.round((pct / 100) * 10)))
}

export function EmployeeWorkspace({
  user,
  project,
  viewedByMaster = false,
}: {
  user: AppUser
  project: EmployeeProject
  viewedByMaster?: boolean
}) {
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const progress = agentProgress(project)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  function send(text: string) {
    const t = text.trim()
    if (!t || thinking) return
    setMessages((prev) => [...prev, { role: 'user', content: t }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      const reply = simulateMasterAgentReply(t)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply.content, reasoning: reply.reasoning, mode: 'simulated' }])
      setThinking(false)
    }, 700)
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Project timeline */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-4"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          Project Timeline
        </p>
        <WorkflowTracker currentStageIndex={stageIndexFromPct(project.stagePct)} />
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
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

      {/* Projects Muzammil assigned via the Architect */}
      <AssignedProjects employeeId={user.id} viewedByMaster={viewedByMaster} />

      {/* Project banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="relative rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-4 sm:p-5 overflow-hidden"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-gold)]" />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">Running</p>
              <DeliverableBadge type={project.deliverableType} size="sm" />
            </div>
            <h2
              className="text-xl text-[var(--color-text-primary)] leading-tight"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {project.client} — {project.projectTitle}
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

      {/* Chat — the employee's own composer to the agent suite */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="rounded-[14px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] flex flex-col overflow-hidden"
        style={{ boxShadow: 'var(--shadow-card)', minHeight: messages.length > 0 ? '420px' : 'auto' }}
      >
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4" style={{ maxHeight: '480px' }}>
          {messages.length === 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.commandExamples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => send(ex)}
                  className="text-xs text-[var(--color-text-secondary)] rounded-full border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] px-2.5 py-1 hover:border-[var(--color-gold-border)] hover:text-[var(--color-text-primary)] transition-colors duration-100 cursor-pointer"
                >
                  {ex}
                </button>
              ))}
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} userInitials={user.initials} />
              ))}
              {thinking && <ThinkingIndicator simulated />}
              <div ref={bottomRef} />
            </>
          )}
        </div>
        <div className="border-t border-[var(--color-border-brand)] p-3 sm:p-4">
          <Composer
            value={input}
            onChange={setInput}
            onSubmit={send}
            disabled={thinking}
            placeholder={thinking ? 'Routing to the right agents…' : 'e.g. Draft 3 reel scripts and check them for compliance'}
          />
        </div>
      </motion.div>

      {/* Files attached to this project — its uploadable memory */}
      <ProjectMemory projectId={user.id} />
    </div>
  )
}
