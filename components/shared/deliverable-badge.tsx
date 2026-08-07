import { DELIVERABLE_TYPE_META, type DeliverableType } from '@/lib/deliverable-type'

// The highlighted "work to be done" format — always shown on a project, new
// or old, so the format is legible at a glance everywhere a project appears.
export function DeliverableBadge({
  type,
  size = 'md',
}: {
  type: DeliverableType
  size?: 'sm' | 'md'
}) {
  const meta = DELIVERABLE_TYPE_META[type]
  const Icon = meta.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium flex-shrink-0 ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5 gap-0.5' : 'text-xs px-2 py-0.5'
      }`}
      style={{ background: `${meta.color}1f`, color: meta.color, border: `1px solid ${meta.color}44` }}
    >
      <Icon size={size === 'sm' ? 10 : 11} />
      {meta.label}
    </span>
  )
}
