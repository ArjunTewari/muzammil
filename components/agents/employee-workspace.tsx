'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, Database, X } from 'lucide-react'
import { AssignedProjects } from '@/components/agents/assigned-projects'
import { ProjectMemory } from '@/components/agents/project-memory'
import { ChatMessage, ThinkingIndicator, type UiMessage } from '@/components/architect/chat-message'
import { Composer } from '@/components/shared/composer'
import { WorkflowTracker } from '@/components/project/workflow-tracker'
import { agentProgress, type EmployeeProject } from '@/lib/employee-projects'
import { simulateMasterAgentReply } from '@/lib/master-agent-simulate'
import { getFiles, subscribeFiles } from '@/lib/project-memory-store'
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
  const [memoryOpen, setMemoryOpen] = useState(false)
  const [fileCount, setFileCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const progress = agentProgress(project)

  useEffect(() => {
    const refresh = () => setFileCount(getFiles(user.id).length)
    refresh()
    return subscribeFiles(refresh)
  }, [user.id])

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

  const started = messages.length > 0

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Project timeline */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-4 flex-shrink-0"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          Project Timeline
        </p>
        <WorkflowTracker currentStageIndex={stageIndexFromPct(project.stagePct)} />
      </motion.div>

      {/* Slim project header — title, format, budget/due, and the memory trigger */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-wrap items-start justify-between gap-3 flex-shrink-0"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">
              {viewedByMaster ? `Viewing ${user.name.split(' ')[0]}'s workspace ·` : 'Running'}
            </p>
            <DeliverableBadge type={project.deliverableType} size="sm" />
          </div>
          <h1
            className="text-xl sm:text-2xl text-[var(--color-text-primary)] leading-tight"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            {project.client} — {project.projectTitle}
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1 max-w-xl">{project.objective}</p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-[10px] text-[var(--color-text-tertiary)]">Agents</p>
            <p className="text-sm text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              {progress.done}/{progress.total}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-1 justify-end">
              <CalendarClock size={10} /> Due
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              {new Date(project.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[var(--color-text-tertiary)]">Budget</p>
            <p className="text-sm text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              {formatLakhs(project.spent)}/{formatLakhs(project.budget)}
            </p>
          </div>
          <button
            onClick={() => setMemoryOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[9px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-gold-border)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer"
          >
            <Database size={13} className="text-[var(--color-gold)]" />
            Add files
            {fileCount > 0 && (
              <span className="text-[10px] text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                {fileCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Projects Muzammil assigned via the Architect */}
      <AssignedProjects employeeId={user.id} viewedByMaster={viewedByMaster} />

      {/* The chat — the single surface for the whole agent suite */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="rounded-[14px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] flex flex-col overflow-hidden min-h-[55vh]"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        {!started ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-6"
            >
              <h2
                className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                Your Agentic Agency, {user.name.split(' ')[0]}.
              </h2>
              <p className="text-sm text-[var(--color-text-tertiary)]">
                One chat — it reaches for whichever of the six agents the job needs.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="w-full max-w-2xl"
            >
              <Composer
                value={input}
                onChange={setInput}
                onSubmit={send}
                size="lg"
                placeholder="e.g. Draft 3 reel scripts and check them for compliance"
                submitLabel="Send"
                autoFocus
              />
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
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
            </motion.div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} userInitials={user.initials} />
              ))}
              {thinking && <ThinkingIndicator simulated />}
              <div ref={bottomRef} />
            </div>
            <div className="border-t border-[var(--color-border-brand)] p-3 sm:p-4">
              <Composer
                value={input}
                onChange={setInput}
                onSubmit={send}
                disabled={thinking}
                placeholder={thinking ? 'Routing to the right agents…' : 'Ask the agent suite for anything…'}
                autoFocus
              />
            </div>
          </>
        )}
      </motion.div>

      {/* Project Memory — tucked behind the "Add files" trigger, not always on screen */}
      {memoryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setMemoryOpen(false)}
        >
          <div className="w-full sm:max-w-md relative">
            <button
              onClick={() => setMemoryOpen(false)}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border-brand)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer z-10"
              aria-label="Close"
            >
              <X size={14} />
            </button>
            <ProjectMemory projectId={user.id} />
          </div>
        </div>
      )}
    </div>
  )
}
