'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Send, Workflow, ArrowRight, CheckCircle2, Radio } from 'lucide-react'
import { ChatMessage, ThinkingIndicator, type UiMessage } from '@/components/architect/chat-message'
import { SlotChecklist } from '@/components/architect/slot-checklist'
import { BriefCard } from '@/components/architect/brief-card'
import { ReasonDialog } from '@/components/architect/reason-dialog'
import { getUserById } from '@/lib/users'
import { addMemory, memoryToPromptLines } from '@/lib/memory-store'
import { assignProject, getWorkloads, type AssignedProject } from '@/lib/project-store'
import type { ArchitectResponse, BriefSlots, ChatMessage as ChatMsg, ProjectBrief } from '@/lib/architect/types'

const CLIENT_CHIPS = ['Axis MF', 'Kotak MF', 'HDFC AMC', 'DSP MF', 'Motilal Oswal', 'Nippon MF', 'Tata MF', 'Invesco MF']

export default function ArchitectPage() {
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
  const startedRef = useRef(false)
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
        // Learn: capture Muzammil's verbatim instructions as memory.
        b.muzammilInstructions.forEach(
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

  // Kick off the interview the moment the page opens.
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    const first: UiMessage[] = [{ role: 'user', content: 'I want to create a new project.' }]
    setMessages(first)
    runTurn(toChat(first))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading, brief])

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
                <ChatMessage key={i} message={m} />
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
                <div className="flex items-center gap-2 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] px-3 py-2 transition-all focus-within:border-[var(--color-gold-border)] focus-within:shadow-[var(--shadow-glow-gold)]">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send(input)}
                    disabled={loading}
                    placeholder={loading ? 'The Architect is thinking…' : 'Type your answer…'}
                    className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none disabled:opacity-60"
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={loading || !input.trim()}
                    className="w-8 h-8 rounded-[8px] bg-[var(--color-gold)] flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Send"
                  >
                    <Send size={14} className="text-[var(--color-ink)]" />
                  </button>
                </div>
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
