'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  goldRule?: boolean
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, goldRule = false, hover = true, children, onMouseMove, ...props }, ref) => (
    <div
      ref={ref}
      onMouseMove={(e) => {
        // Feed the cursor spotlight (CSS vars, no re-render)
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
        onMouseMove?.(e)
      }}
      className={cn(
        'group/card relative rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] overflow-hidden',
        hover &&
          'transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[var(--color-gold-border)] hover:shadow-[var(--shadow-card-hover-gold)] cursor-default',
        className,
      )}
      style={{ boxShadow: 'var(--shadow-card)' }}
      {...props}
    >
      {/* Cursor spotlight — desktop pointers only (see .card-spot) */}
      <div
        aria-hidden
        className="card-spot pointer-events-none absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
      />
      {goldRule && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-gold)]" />
      )}
      {children}
    </div>
  ),
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1 px-5 pt-5', className)} {...props} />
  ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider', className)}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 pb-5', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center px-5 pb-5 pt-2 border-t border-[var(--color-border-brand)]', className)}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
