import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'default'
  | 'gold'
  | 'green'
  | 'amber'
  | 'red'
  | 'blue'
  | 'outline'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-border-brand)] text-[var(--color-text-secondary)]',
  gold: 'bg-[var(--color-gold-muted)] text-[var(--color-gold)] border border-[var(--color-gold-border)]',
  green: 'bg-[var(--color-status-green-muted)] text-[var(--color-status-green)]',
  amber: 'bg-[var(--color-status-amber-muted)] text-[var(--color-status-amber)]',
  red: 'bg-[var(--color-status-red-muted)] text-[var(--color-status-red)]',
  blue: 'bg-[var(--color-status-blue-muted)] text-[var(--color-status-blue)]',
  outline: 'border border-[var(--color-border-brand)] text-[var(--color-text-secondary)]',
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[6px] px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
