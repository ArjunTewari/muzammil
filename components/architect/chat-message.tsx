'use client'

import { motion } from 'framer-motion'
import { Sparkles, Workflow } from 'lucide-react'

export interface UiMessage {
  role: 'user' | 'assistant'
  content: string
  reasoning?: string
  mode?: 'live' | 'simulated'
}

export function ChatMessage({ message }: { message: UiMessage }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-[9px] bg-[var(--color-gold)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[var(--shadow-glow-gold)]">
          <Workflow size={16} className="text-[var(--color-ink)]" />
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
        {/* Reasoning chip — the visible "thinking" */}
        {!isUser && message.reasoning && (
          <div className="flex items-start gap-1.5 rounded-[8px] border border-[var(--color-gold-border)] bg-[var(--color-gold-muted)] px-2.5 py-1.5">
            <Sparkles size={11} className="text-[var(--color-gold)] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug text-[var(--color-text-secondary)] italic">
              {message.reasoning}
            </p>
          </div>
        )}

        <div
          className={
            isUser
              ? 'rounded-[14px] rounded-br-[4px] bg-[var(--color-gold)] text-[var(--color-ink)] px-3.5 py-2.5 text-sm leading-relaxed'
              : 'rounded-[14px] rounded-bl-[4px] bg-[var(--color-surface-elevated)] border border-[var(--color-border-brand)] text-[var(--color-text-primary)] px-3.5 py-2.5 text-sm leading-relaxed'
          }
        >
          {message.content}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[#a07830] flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-[var(--color-ink)] text-[10px] font-semibold" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
            MR
          </span>
        </div>
      )}
    </motion.div>
  )
}

export function ThinkingIndicator({ simulated }: { simulated?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5 justify-start"
    >
      <div className="w-8 h-8 rounded-[9px] bg-[var(--color-gold)] flex items-center justify-center flex-shrink-0">
        <Workflow size={16} className="text-[var(--color-ink)]" />
      </div>
      <div className="rounded-[14px] rounded-bl-[4px] bg-[var(--color-surface-elevated)] border border-[var(--color-border-brand)] px-4 py-3 flex items-center gap-2">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.16, ease: 'easeInOut' }}
            />
          ))}
        </span>
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {simulated ? 'Thinking (simulation)…' : 'Thinking…'}
        </span>
      </div>
    </motion.div>
  )
}
