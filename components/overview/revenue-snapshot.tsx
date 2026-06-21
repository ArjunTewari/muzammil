'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { revenueData, clients } from '@/lib/mock-data'
import { formatLakhs } from '@/lib/utils'

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] px-3 py-2 text-xs shadow-lg">
      <p className="text-[var(--color-text-secondary)] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-medium" style={{ fontFamily: 'var(--font-jetbrains-mono)', color: p.color }}>
          {p.dataKey === 'revenue' ? 'Actual' : 'Target'}: {formatLakhs(p.value)}
        </p>
      ))}
    </div>
  )
}

export function RevenueSnapshot() {
  const q2Revenue = revenueData.slice(-3).reduce((s, d) => s + d.revenue, 0)
  const q2Target = revenueData.slice(-3).reduce((s, d) => s + d.target, 0)
  const progress = Math.min((q2Revenue / q2Target) * 100, 100)

  // Client revenue breakdown (mocked from retainer values)
  const topClients = clients
    .sort((a, b) => b.retainerValue - a.retainerValue)
    .slice(0, 5)
  const maxRetainer = topClients[0]?.retainerValue ?? 1

  const chartData = revenueData.map((d) => ({
    ...d,
    revenueL: d.revenue / 100000,
    targetL: d.target / 100000,
  }))

  return (
    <Card goldRule>
      <CardHeader>
        <CardTitle>Revenue Snapshot</CardTitle>
        <p
          className="text-2xl text-[var(--color-text-primary)] mt-1"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {formatLakhs(q2Revenue)}{' '}
          <span className="text-base text-[var(--color-text-secondary)] font-normal" style={{ fontFamily: 'var(--font-inter)' }}>
            this quarter
          </span>
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Quarter progress */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1.5">
            <span>Q2 target: {formatLakhs(q2Target)}</span>
            <span
              className={progress >= 100 ? 'text-[var(--color-status-green)]' : 'text-[var(--color-status-amber)]'}
              style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--color-border-brand)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-gold)] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Chart */}
        <div className="h-48 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-brand)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: 'var(--color-text-tertiary)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => v.split(' ')[0]}
              />
              <YAxis
                tick={{ fill: 'var(--color-text-tertiary)', fontSize: 10, fontFamily: 'var(--font-jetbrains-mono)' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="targetL"
                stroke="var(--color-text-tertiary)"
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
                name="Target"
              />
              <Line
                type="monotone"
                dataKey="revenueL"
                stroke="var(--color-gold)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'var(--color-gold)', strokeWidth: 0 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Client breakdown */}
        <div className="mt-5 pt-4 border-t border-[var(--color-border-brand)]">
          <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">Top Clients by Retainer</p>
          <div className="space-y-2.5">
            {topClients.map((client) => (
              <div key={client.id} className="flex items-center gap-3">
                <div className="text-xs text-[var(--color-text-secondary)] w-24 truncate">{client.shortName}</div>
                <div className="flex-1 h-1.5 rounded-full bg-[var(--color-border-brand)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-gold-border)] transition-all"
                    style={{ width: `${(client.retainerValue / maxRetainer) * 100}%`, background: 'var(--color-gold)' }}
                  />
                </div>
                <div
                  className="text-xs text-[var(--color-text-secondary)] w-16 text-right"
                  style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                >
                  {formatLakhs(client.retainerValue)}/mo
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
