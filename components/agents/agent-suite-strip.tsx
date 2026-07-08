'use client'

import { Workflow } from 'lucide-react'
import { AGENTS, MASTER_AGENT } from '@/lib/agents'
import { AGENT_ICON } from '@/components/agents/agent-icon'

export function AgentSuiteStrip() {
  return (
    <div className="rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-4 sm:p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-[9px] bg-[var(--color-gold)] flex items-center justify-center flex-shrink-0">
          <Workflow size={18} className="text-[var(--color-ink)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            The Maestro Agent Suite
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
            Every employee gets the full set. The {MASTER_AGENT.name} orchestrates routing and handoffs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {AGENTS.map((agent) => {
          const Icon = AGENT_ICON[agent.iconKey]
          return (
            <div
              key={agent.id}
              className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-2.5"
              title={agent.description}
            >
              <div
                className="w-7 h-7 rounded-[8px] flex items-center justify-center mb-2"
                style={{ background: `${agent.color}1f`, color: agent.color }}
              >
                <Icon size={15} />
              </div>
              <p className="text-xs font-medium text-[var(--color-text-primary)] leading-tight">
                {agent.name}
              </p>
              <p className="text-[10px] text-[var(--color-text-tertiary)] leading-snug mt-0.5">
                {agent.tagline}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
