'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Workflow, Wand2 } from 'lucide-react'
import { RunResult } from '@/components/studio/run-result'
import { ReasonDialog } from '@/components/architect/reason-dialog'
import { addMemory, memoryLines, recordRun } from '@/lib/studio/agent-store'
import type { AgentRunResult, Finding, StudioAgent } from '@/lib/studio/types'

const SAMPLE: Record<StudioAgent['mode'], string> = {
  review:
    'Invest in the Bluechip Growth Fund today and enjoy guaranteed 15% returns every year — the best mutual fund in India. Start now and double your money by retirement!',
  generate:
    'Write a 15-second Instagram reel script for Axis MF encouraging young earners to start a retirement SIP. Warm, no hype.',
}

export function RunConsole({ agent }: { agent: StudioAgent }) {
  const [input, setInput] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<AgentRunResult | null>(null)
  const [engine, setEngine] = useState<'live' | 'simulated'>('simulated')
  const [acted, setActed] = useState<Record<string, 'accepted' | 'dismissed'>>({})
  const [dismissTarget, setDismissTarget] = useState<Finding | null>(null)

  async function run() {
    if (!input.trim() || running) return
    setRunning(true)
    setResult(null)
    setActed({})
    try {
      const res = await fetch('/api/studio/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ agent, input, memory: memoryLines(agent.id) }),
      })
      const data = (await res.json()) as { result: AgentRunResult; engine: 'live' | 'simulated' }
      setResult(data.result)
      setEngine(data.engine)
      recordRun(agent, data.result.findings?.length ?? 0)
    } catch {
      setResult({ mode: agent.mode, verdict: 'pass', findings: [], confidence: 0, reasoning: 'The run failed to reach the agent — try again.' })
    } finally {
      setRunning(false)
    }
  }

  function accept(f: Finding) {
    addMemory({ agentId: agent.id, type: 'approval', content: `Confirmed: ${f.title}` })
    setActed((a) => ({ ...a, [f.id]: 'accepted' }))
  }

  function confirmDismiss(reason: string) {
    if (!dismissTarget) return
    addMemory({ agentId: agent.id, type: 'correction', content: `Do not flag: "${dismissTarget.title}"`, reason })
    setActed((a) => ({ ...a, [dismissTarget.id]: 'dismissed' }))
    setDismissTarget(null)
  }

  return (
    <div className="glass-panel rounded-[14px] border border-[var(--color-border-brand)] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Run console</p>
        <button
          onClick={() => setInput(SAMPLE[agent.mode])}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-gold)] hover:underline cursor-pointer"
        >
          <Wand2 size={12} /> Try a sample
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
        placeholder={agent.mode === 'review' ? 'Paste a script, caption, or copy to check…' : 'Describe what you want the agent to produce…'}
        className="w-full rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-gold-border)] focus:shadow-[var(--shadow-glow-gold)] transition-all resize-y"
      />

      <button
        onClick={run}
        disabled={running || !input.trim()}
        className="mt-3 w-full h-11 rounded-[10px] bg-[var(--color-gold)] text-[var(--color-ink)] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#d4b46a] hover:shadow-[var(--shadow-glow-gold)] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {running ? (
          <>
            <Workflow size={15} className="animate-spin" /> {agent.name} is thinking…
          </>
        ) : (
          <>
            <Play size={15} /> Run {agent.name}
          </>
        )}
      </button>

      {result && (
        <div className="mt-4">
          <RunResult result={result} engine={engine} acted={acted} onAccept={accept} onDismiss={(f) => setDismissTarget(f)} />
        </div>
      )}

      {!result && !running && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-xs text-[var(--color-text-tertiary)] text-center py-6"
        >
          {agent.mode === 'review'
            ? 'Paste something and Run — the agent checks it against your rules and flags risks with fixes.'
            : 'Describe what you need and Run — the agent drafts it, obeying your rules.'}
        </motion.p>
      )}

      <ReasonDialog
        open={dismissTarget !== null}
        title="Mark as false positive"
        label="Why shouldn't this be flagged? The agent will remember and stop flagging it."
        placeholder='e.g. "Tax-saving" is factual for ELSS funds — it is not a misleading claim.'
        confirmLabel="Dismiss & teach"
        confirmTone="red"
        onConfirm={confirmDismiss}
        onClose={() => setDismissTarget(null)}
      />
    </div>
  )
}
