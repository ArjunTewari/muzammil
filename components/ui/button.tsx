import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-gold)] text-[var(--color-ink)] font-medium hover:bg-[#d4b46a] active:bg-[#b8943e]',
  secondary:
    'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-brand)] hover:bg-[var(--color-border-brand)]',
  ghost:
    'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]',
  danger:
    'bg-[var(--color-status-red-muted)] text-[var(--color-status-red)] border border-[var(--color-status-red)] hover:bg-[var(--color-status-red)] hover:text-white',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-[6px]',
  md: 'px-4 py-2 text-sm rounded-[8px]',
  lg: 'px-6 py-2.5 text-sm rounded-[10px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
