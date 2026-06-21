'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Target,
  Lock,
  Unlock,
  HelpCircle,
  GitBranch,
  Lightbulb,
  FileText,
  Sparkles,
} from 'lucide-react'
import type { CampaignArchitectOutput, CreativeTerritory } from '@/lib/types'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

interface AccordionItemProps {
  id: string
  icon: React.ReactNode
  title: string
  subtitle?: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function AccordionItem({ id, icon, title, subtitle, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const prefersReduced = useReducedMotion()

  return (
    <div className="border border-[var(--color-border-brand)] rounded-[10px] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--color-surface-elevated)] transition-colors duration-100 cursor-pointer"
      >
        <span className="flex-shrink-0 text-[var(--color-gold)]">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{title}</p>
          {subtitle && <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{subtitle}</p>}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={16} className="text-[var(--color-text-tertiary)]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5 pt-2 border-t border-[var(--color-border-brand)]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TerritoryCard({ territory, index }: { territory: CreativeTerritory; index: number }) {
  return (
    <div
      className="rounded-[10px] p-4 border"
      style={{
        background: 'var(--color-gold-muted)',
        borderColor: 'var(--color-gold-border)',
        borderLeft: `3px solid var(--color-gold)`,
      }}
    >
      <div className="flex items-start gap-2 mb-2">
        <Sparkles size={14} className="flex-shrink-0 mt-0.5 text-[var(--color-gold)]" />
        <div>
          <p
            className="text-sm text-[var(--color-text-primary)] mb-1"
            style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: '15px' }}
          >
            {territory.name}
          </p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border-brand)] text-[var(--color-text-tertiary)]">
            {territory.tonalQuality}
          </span>
        </div>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
        {territory.premise}
      </p>
      <div className="border-t border-[var(--color-gold-border)] pt-3">
        <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1.5">Example Treatment</p>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed italic">
          {territory.exampleTreatment}
        </p>
      </div>
    </div>
  )
}

export function CampaignArchitect({ output }: { output: CampaignArchitectOutput }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-[8px] bg-[var(--color-gold-muted)] border border-[var(--color-gold-border)] flex items-center justify-center">
          <Target size={16} className="text-[var(--color-gold)]" />
        </div>
        <div>
          <h2
            className="text-lg text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Campaign Architect
          </h2>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            AI-decoded strategic output · generated 14 Jun 2026
          </p>
        </div>
      </div>

      {/* Decoded Ask */}
      <AccordionItem
        id="decoded-ask"
        icon={<FileText size={16} />}
        title="Decoded Ask"
        subtitle="What the brief actually means"
        defaultOpen
      >
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {output.decodedAsk}
        </p>
      </AccordionItem>

      {/* Objective Hypothesis */}
      <AccordionItem
        id="objective"
        icon={<Target size={16} />}
        title="Objective Hypothesis"
        subtitle="What success looks like"
        defaultOpen
      >
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {output.objectiveHypothesis}
        </p>
      </AccordionItem>

      {/* Fixed Constraints */}
      <AccordionItem
        id="fixed"
        icon={<Lock size={16} />}
        title="Fixed Constraints"
        subtitle={`${output.fixedConstraints.length} non-negotiables identified`}
      >
        <ul className="space-y-2">
          {output.fixedConstraints.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-status-red-muted)] text-[var(--color-status-red)] text-xs flex items-center justify-center mt-0.5"
                style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
              >
                {i + 1}
              </span>
              <span className="leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>
      </AccordionItem>

      {/* Flexible Areas */}
      <AccordionItem
        id="flexible"
        icon={<Unlock size={16} />}
        title="Flexible Areas"
        subtitle={`${output.flexibleAreas.length} areas of creative latitude`}
      >
        <ul className="space-y-2">
          {output.flexibleAreas.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-status-green-muted)] text-[var(--color-status-green)] text-xs flex items-center justify-center mt-0.5"
                style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
              >
                {i + 1}
              </span>
              <span className="leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>
      </AccordionItem>

      {/* Missing Questions */}
      <AccordionItem
        id="questions"
        icon={<HelpCircle size={16} />}
        title="Missing Questions"
        subtitle={`${output.missingQuestions.length} clarifications needed before proceeding`}
      >
        <ul className="space-y-3">
          {output.missingQuestions.map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span
                className="flex-shrink-0 text-[var(--color-gold)] font-medium"
                style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
              >
                Q{i + 1}
              </span>
              <span className="text-[var(--color-text-secondary)] leading-relaxed">{q}</span>
            </li>
          ))}
        </ul>
      </AccordionItem>

      {/* Recommended Workflow */}
      <AccordionItem
        id="workflow"
        icon={<GitBranch size={16} />}
        title="Recommended Workflow"
        subtitle="Production approach recommendation"
      >
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {output.recommendedWorkflow}
        </p>
      </AccordionItem>

      {/* Creative Territories */}
      <AccordionItem
        id="territories"
        icon={<Lightbulb size={16} />}
        title="Initial Creative Territories"
        subtitle={`${output.creativeTerritories.length} directions explored — Territory A recommended`}
        defaultOpen
      >
        <p className="text-sm text-[var(--color-text-tertiary)] mb-4 leading-relaxed">
          {output.creativeTerritoriesIntro}
        </p>
        <div className="space-y-4">
          {output.creativeTerritories.map((territory, i) => (
            <TerritoryCard key={i} territory={territory} index={i} />
          ))}
        </div>
      </AccordionItem>
    </div>
  )
}
