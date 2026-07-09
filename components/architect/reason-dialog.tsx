'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function ReasonDialog({
  open,
  title,
  label,
  placeholder,
  confirmLabel,
  confirmTone = 'gold',
  required = true,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  label: string
  placeholder: string
  confirmLabel: string
  confirmTone?: 'gold' | 'red'
  required?: boolean
  onConfirm: (reason: string) => void
  onClose: () => void
}) {
  const [reason, setReason] = useState('')

  function confirm() {
    if (required && !reason.trim()) return
    onConfirm(reason.trim())
    setReason('')
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full sm:max-w-md rounded-t-[20px] sm:rounded-[16px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-5 sm:p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <h3
                className="text-lg text-[var(--color-text-primary)]"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all cursor-pointer"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <label className="block text-xs text-[var(--color-text-secondary)] mb-1.5 font-medium">
              {label}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={placeholder}
              rows={3}
              autoFocus
              className="w-full rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-gold-border)] transition-colors resize-none"
            />
            <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1.5">
              This becomes a memory the Architect applies to future work.
            </p>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={confirm}
                disabled={required && !reason.trim()}
                className={`flex-1 h-10 rounded-[10px] text-sm font-semibold flex items-center justify-center transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  confirmTone === 'red'
                    ? 'bg-[var(--color-status-red)] text-white hover:opacity-90'
                    : 'bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[#d4b46a]'
                }`}
              >
                {confirmLabel}
              </button>
              <button
                onClick={onClose}
                className="px-4 h-10 rounded-[10px] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
