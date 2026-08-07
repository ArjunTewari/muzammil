import { Image, GalleryHorizontal, Video, Sparkles, type LucideIcon } from 'lucide-react'

// The format every project's "work to be done" must be — always chosen at
// creation (step 2 of 3: Brief Cracking → Work to be done → Review & Delivery)
// and shown highlighted on every project, new or old.
export type DeliverableType = 'static' | 'carousel' | 'video' | 'ai-video'

export interface DeliverableTypeMeta {
  label: string
  icon: LucideIcon
  color: string
}

export const DELIVERABLE_TYPE_META: Record<DeliverableType, DeliverableTypeMeta> = {
  static: { label: 'Static', icon: Image, color: 'var(--color-status-blue)' },
  carousel: { label: 'Carousel', icon: GalleryHorizontal, color: 'var(--color-status-amber)' },
  video: { label: 'Video', icon: Video, color: 'var(--color-status-green)' },
  'ai-video': { label: 'AI Video', icon: Sparkles, color: 'var(--color-gold)' },
}

export const DELIVERABLE_TYPES: DeliverableType[] = ['static', 'carousel', 'video', 'ai-video']

// Best-effort mapping from a free-text answer (e.g. from the Architect
// interview or a deliverables string) to one of the four types.
export function inferDeliverableType(text: string): DeliverableType {
  const t = text.toLowerCase()
  if (/\bai[\s-]?video\b|\bai[\s-]?generated\b/.test(t)) return 'ai-video'
  if (/carousel|slide|swipe/.test(t)) return 'carousel'
  if (/video|reel|film|youtube|episode/.test(t)) return 'video'
  if (/static|poster|banner|deck|newsletter|report/.test(t)) return 'static'
  return 'video'
}
