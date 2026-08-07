'use client'

import { motion } from 'framer-motion'
import { KanbanBoard } from '@/components/pipeline/kanban-board'

export default function PipelinePage() {
  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
          Pipeline
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Drag a lead across stages to update it — or use the selector on each card.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}>
        <KanbanBoard />
      </motion.div>
    </div>
  )
}
