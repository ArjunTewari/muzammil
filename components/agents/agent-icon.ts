import {
  Compass,
  Search,
  PenLine,
  ShieldCheck,
  MessageSquare,
  Receipt,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

export const AGENT_ICON: Record<string, LucideIcon> = {
  master: Workflow,
  compass: Compass,
  search: Search,
  pen: PenLine,
  shield: ShieldCheck,
  message: MessageSquare,
  receipt: Receipt,
}
