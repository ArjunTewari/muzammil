'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Workflow, ArrowRight, CheckCircle2, Radio } from 'lucide-react'
import { ChatMessage, ThinkingIndicator, type UiMessage } from '@/components/architect/chat-message'
import { SlotChecklist } from '@/components/architect/slot-checklist'
import { BriefCard } from '@/components/architect/brief-card'
import { ReasonDialog } from '@/components/architect/reason-dialog'
import { Composer } from '@/components/shared/composer'
import { getUserById } from '@/lib/users'
import { addMemory, memoryToPromptLines } from '@/lib/memory-store'
import { assignProject, getWorkloads, type AssignedProject } from '@/lib/project-store'
import type { ArchitectResponse, BriefSlots, ChatMessage as ChatMsg, ProjectBrief } from '@/lib/architect/types'
import { useCurrentUser } from '@/hooks/use-current-user'

const CLIENT_CHIPS = ['Axis MF', 'Kotak MF', 'HDFC AMC', 'DSP MF', 'Motilal Oswal', 'Nippon MF', 'Tata MF', 'Invesco MF']

export default function ArchitectPage() {
  const currentUser = useCurrentUser()
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [slots, setSlots] = useState<BriefSlots>({})
  const [brief, setBrief] = useState<ProjectBrief | null>(null)
  const [mode, setMode] = useState<'live' | 'simulated' | null>(null)
  const [assigning, setAssigning] = useState(false)
  const [assigned, setAssigned] = useState<AssignedProject | null>(null)
  const [reviseOpen, setReviseOpen] = useState(false)

  const slotsRef = useRef<BriefSlots>({})
  const bottomRef = useRef<HTMLDivElement>(null)

  const toChat = (m: UiMessage[]): ChatMsg[] => m.map((x) => ({ role: x.role, content: x.content }))

  async function runTurn(msgs: ChatMsg[]) {
    setLoading(true)
    try {
      const res = await fetch('/api/architect', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: msgs,
          slots: slotsRef.current,
          memory: memoryToPromptLines(slotsRef.current.client),
          workloads: getWorkloads(),
        }),
      })
      const data = (await res.json()) as ArchitectResponse
      setMode(data.mode)
      slotsRef.current = data.turn.updatedSlots
      setSlots(data.turn.updatedSlots)

      if (data.turn.decision === 'finalize' && data.turn.brief) {
        const b = data.turn.brief
        // Learn: capture the founder's verbatim instructions as memory.
        b.founderInstructions.forEach(
          (q) => q && addMemory({ type: 'instruction', content: q, client: b.client, source: 'Architect interview' }),
        )
        setBrief(b)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I've got everything I need. Here's the brief — review it and assign it to your team.",
            reasoning: data.turn.reasoningSummary,
            mode: data.mode,
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.turn.question ?? '…', reasoning: data.turn.reasoningSummary, mode: data.mode },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something interrupted me — say that again?', mode: 'simulated' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading, brief])

  // The very first send starts the interview — no auto-fired trigger message,
  // this page opens blank (a real "home") until the founder actually types.
  function send(text: string) {
    const t = text.trim()
    if (!t || loading || brief) return
    const next: UiMessage[] = [...messages, { role: 'user', content: t }]
    setMessages(next)
    setInput('')
    runTurn(toChat(next))
  }

  function handleAssign(employeeId: string) {
    if (!brief) return
    setAssigning(true)
    const proj = assignProject(brief, employeeId)
    addMemory({
      type: 'approval',
      content: `Approved & assigned "${brief.title}" to ${getUserById(employeeId)?.name ?? employeeId}`,
      client: brief.client,
      projectId: proj.id,
      source: 'Architect',
    })
    setAssigned(proj)
    setAssigning(false)
  }

  function handleRevise(reason: string) {
    if (!brief) return
    addMemory({
      type: 'rejection',
      content: `Revised the brief for "${brief.title}"`,
      reason,
      client: brief.client,
      source: 'Architect',
    })
    setReviseOpen(false)
    setBrief(null)
    const next: UiMessage[] = [...messages, { role: 'user', content: `Please revise the brief. ${reason}` }]
    setMessages(next)
    runTurn(toChat(next))
  }

  const showClientChips = !slots.client && !loading && !brief && messages.length <= 2
  const owner = assigned ? getUserById(assigned.assignedTo) : null
  const started = messages.length > 0

  // Idle "home" state — quiet, no chrome, just a greeting and the composer.
  // Mirrors Claude's blank homepage; becomes the chat once you send something.
  if (!started) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-6"
        >
          <h1
            className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Good morning, Founder.
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">What are we building today?</p>
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
            placeholder="Describe a new project and the Architect will take it from here…"
            submitLabel="Start with the Architect"
            autoFocus
          />
          <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
            {CLIENT_CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="text-xs text-[var(--color-text-secondary)] rounded-full border border-[var(--color-border-brand)] bg-[var(--color-surface)] px-2.5 py-1 hover:border-[var(--color-gold-border)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-4 sm:mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[var(--color-gold)] flex items-center justify-center shadow-[var(--shadow-glow-gold)]">
            <Workflow size={20} className="text-[var(--color-ink)]" />
          </div>
          <div>
            <h1 className="text-2xl text-[var(--color-text-primary)] leading-tight" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
              The Architect
            </h1>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Thinking interviewer — it questions you until it can brief the work
            </p>
          </div>
        </div>
        {mode && (
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full ${
              mode === 'live'
                ? 'bg-[var(--color-status-green-muted)] text-[var(--color-status-green)]'
                : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-tertiary)] border border-[var(--color-border-brand)]'
            }`}
          >
            <Radio size={10} /> {mode === 'live' ? 'Live agent' : 'Simulation'}
          </span>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chat column */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="glass-panel rounded-[14px] border border-[var(--color-border-brand)] flex flex-col overflow-hidden" style={{ minHeight: '60vh' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} userInitials={currentUser?.initials} />
              ))}
              {loading && <ThinkingIndicator simulated={mode === 'simulated'} />}

              {/* Brief on finalize */}
              {brief && !assigned && (
                <div className="pt-2">
                  <BriefCard brief={brief} assigning={assigning} onAssign={handleAssign} onRevise={() => setReviseOpen(true)} />
                </div>
              )}

              {/* Success */}
              {assigned && owner && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[14px] border border-[var(--color-status-green)] bg-[var(--color-status-green-muted)] p-5 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-status-green)] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} className="text-white" />
                  </div>
                  <p className="text-base text-[var(--color-text-primary)] font-medium mb-1">
                    Project created & assigned
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    &ldquo;{assigned.title}&rdquo; is now on {owner.name}&apos;s dashboard with your instructions.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/team/${owner.id}`}
                      className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] bg-[var(--color-gold)] text-[var(--color-ink)] text-sm font-semibold hover:bg-[#d4b46a] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Open {owner.name.split(' ')[0]}&apos;s workspace <ArrowRight size={14} />
                    </Link>
                    <button
                      onClick={() => window.location.reload()}
                      className="h-10 px-4 rounded-[10px] border border-[var(--color-border-brand)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                    >
                      New project
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {!brief && !assigned && (
              <div className="border-t border-[var(--color-border-brand)] p-3 sm:p-4">
                {showClientChips && (
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {CLIENT_CHIPS.map((c) => (
                      <button
                        key={c}
                        onClick={() => send(c)}
                        className="text-xs text-[var(--color-text-secondary)] rounded-full border border-[var(--color-border-brand)] bg-[var(--color-surface)] px-2.5 py-1 hover:border-[var(--color-gold-border)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
                <Composer
                  value={input}
                  onChange={setInput}
                  onSubmit={send}
                  disabled={loading}
                  placeholder={loading ? 'The Architect is thinking…' : 'Type your answer…'}
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        {/* Checklist rail */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <SlotChecklist slots={slots} />
        </div>
      </div>

      <ReasonDialog
        open={reviseOpen}
        title="Revise the brief"
        label="What should the Architect change, and why?"
        placeholder="e.g. Budget is too high — cap it at ₹3L, and lead with the tax-saving angle."
        confirmLabel="Send revision"
        onConfirm={handleRevise}
        onClose={() => setReviseOpen(false)}
      />
    </div>
  )
}
