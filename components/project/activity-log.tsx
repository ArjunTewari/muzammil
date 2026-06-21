'use client'

import type { ActivityEntry } from '@/lib/types'
import { timeAgo } from '@/lib/utils'
import {
  MessageSquare,
  Upload,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react'

const typeIcon: Record<ActivityEntry['type'], React.ReactNode> = {
  comment: <MessageSquare size={11} />,
  upload: <Upload size={11} />,
  'stage-change': <ArrowRight size={11} />,
  approval: <CheckCircle size={11} />,
  feedback: <AlertCircle size={11} />,
  review: <Eye size={11} />,
}

export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <div className="space-y-0">
      {sorted.map((entry, i) => (
        <div
          key={entry.id}
          className="flex items-start gap-3 py-3 hover:bg-[var(--color-surface-elevated)] -mx-5 px-5 transition-colors duration-100 group"
        >
          {/* Avatar */}
          <div
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold"
            style={{
              background: entry.actorColor + '22',
              color: entry.actorColor,
              border: `1px solid ${entry.actorColor}44`,
              fontFamily: 'var(--font-jetbrains-mono)',
            }}
          >
            {entry.actorInitials}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
              <span className="font-medium">{entry.actorName}</span>
              <span className="text-[var(--color-text-secondary)]"> {entry.action}</span>
            </p>
            {entry.target && (
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 truncate">
                {entry.target}
              </p>
            )}
          </div>

          {/* Timestamp + type */}
          <div className="flex-shrink-0 flex flex-col items-end gap-1 pt-0.5">
            <span className="text-xs text-[var(--color-text-tertiary)]">
              {timeAgo(entry.timestamp)}
            </span>
            <span className="text-[var(--color-text-tertiary)] opacity-60">
              {typeIcon[entry.type]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
