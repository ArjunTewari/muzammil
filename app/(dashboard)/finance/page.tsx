export default function FinancePage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1
        className="text-3xl text-[var(--color-text-primary)] mb-2"
        style={{ fontFamily: 'var(--font-instrument-serif)' }}
      >
        Finance
      </h1>
      <p className="text-sm text-[var(--color-text-tertiary)]">
        Invoicing, P&L, and cash flow — coming in the next sprint.
      </p>
      <div className="mt-8 rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-gold-muted)] border border-[var(--color-gold-border)] flex items-center justify-center mx-auto mb-4">
          <span className="text-[var(--color-gold)] text-xl" style={{ fontFamily: 'var(--font-instrument-serif)' }}>₹</span>
        </div>
        <p className="text-[var(--color-text-secondary)] text-sm">Full financial dashboard with P&L, cash flow, and invoice management will live here.</p>
      </div>
    </div>
  )
}
