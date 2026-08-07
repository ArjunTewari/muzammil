'use client'

import { useEffect, useRef } from 'react'
import { ArrowUp, Loader2, Paperclip } from 'lucide-react'

// A single, reusable "Claude-style" composer: rounded pill, auto-growing
// textarea, an attach stub on the left, a circular send button on the right.
// Enter submits, Shift+Enter inserts a newline. Used everywhere Maestro asks
// the founder (or an agent) a free-text question, so every text interaction
// in the app feels like one consistent chat surface.

export function Composer({
  value,
  onChange,
  onSubmit,
  placeholder = 'Message Maestro…',
  disabled = false,
  busy = false,
  autoFocus = false,
  showAttach = true,
  size = 'md',
  submitLabel = 'Send',
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: (text: string) => void
  placeholder?: string
  disabled?: boolean
  busy?: boolean
  autoFocus?: boolean
  showAttach?: boolean
  size?: 'md' | 'lg'
  submitLabel?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, size === 'lg' ? 200 : 140)}px`
  }, [value, size])

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  function submit() {
    const t = value.trim()
    if (!t || disabled || busy) return
    onSubmit(t)
  }

  return (
    <div
      className={`flex items-end gap-2 rounded-[26px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] transition-all duration-200 focus-within:border-[var(--color-gold-border)] focus-within:shadow-[var(--shadow-glow-gold)] ${
        size === 'lg' ? 'px-4 py-3' : 'px-3 py-2'
      }`}
    >
      {showAttach && (
        <button
          type="button"
          disabled
          title="Attachments — coming soon"
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] opacity-50 cursor-not-allowed"
          aria-label="Attach a file (coming soon)"
        >
          <Paperclip size={16} />
        </button>
      )}

      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
        disabled={disabled}
        rows={1}
        placeholder={placeholder}
        className={`flex-1 resize-none bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none disabled:opacity-60 py-1.5 ${
          size === 'lg' ? 'text-base' : 'text-sm'
        }`}
      />

      <button
        type="button"
        onClick={submit}
        disabled={disabled || busy || !value.trim()}
        aria-label={submitLabel}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-gold)] flex items-center justify-center hover:bg-[#d4b46a] active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-gold)]"
      >
        {busy ? (
          <Loader2 size={15} className="text-[var(--color-ink)] animate-spin" />
        ) : (
          <ArrowUp size={16} className="text-[var(--color-ink)]" strokeWidth={2.5} />
        )}
      </button>
    </div>
  )
}
