'use client'

import { motion } from 'framer-motion'
import {
  Globe,
  Camera,
  Briefcase,
  Video,
  MessageCircle,
  Users2,
  CalendarClock,
  CheckCircle2,
  TrendingUp,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
} from 'lucide-react'
import { AiInsights } from '@/components/shared/ai-insights'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ziworksSite,
  socialAccounts,
  contentCalendar,
  digitalSummary,
  type SiteStatus,
  type SocialPlatform,
  type SocialOwner,
  type PostStatus,
} from '@/lib/digital-data'
import { digitalNextSteps } from '@/lib/ai-insights'
import { formatDateShort } from '@/lib/utils'

const platformIcon: Record<SocialPlatform, typeof Camera> = {
  Instagram: Camera,
  LinkedIn: Briefcase,
  YouTube: Video,
  Twitter: MessageCircle,
}

const siteStatusBadge: Record<SiteStatus, { variant: 'green' | 'amber' | 'default'; label: string }> = {
  operational: { variant: 'green', label: 'Operational' },
  degraded: { variant: 'amber', label: 'Degraded' },
  maintenance: { variant: 'default', label: 'Maintenance' },
}

const ownerMeta: Record<SocialOwner, { color: string }> = {
  ZiWorks: { color: 'var(--color-gold)' },
  Muzammil: { color: 'var(--color-status-blue)' },
}

const postStatusBadge: Record<PostStatus, { variant: 'amber' | 'blue' | 'green' | 'default'; label: string }> = {
  'awaiting-approval': { variant: 'amber', label: 'Needs approval' },
  scheduled: { variant: 'blue', label: 'Scheduled' },
  published: { variant: 'green', label: 'Published' },
  draft: { variant: 'default', label: 'Draft' },
}

function fmtNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return `${n}`
}

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

export default function DigitalPage() {
  const summary = digitalSummary()
  const status = siteStatusBadge[ziworksSite.status]

  const statCards = [
    {
      label: 'Site visitors / mo',
      value: fmtNum(summary.monthlyVisitors),
      sub: `↑ ${summary.visitorChangePct}% vs last month`,
      icon: TrendingUp,
      accent: 'var(--color-status-green)',
    },
    {
      label: 'Inbound leads',
      value: `${summary.leadsThisMonth}`,
      sub: 'from ziworks.in this month',
      icon: MousePointerClick,
      accent: 'var(--color-gold)',
    },
    {
      label: 'Social reach',
      value: fmtNum(summary.totalFollowers),
      sub: 'ZiWorks + founder followers',
      icon: Users2,
      accent: 'var(--color-status-blue)',
    },
    {
      label: 'Awaiting approval',
      value: `${summary.postsAwaiting}`,
      sub: 'brand posts need your sign-off',
      icon: CheckCircle2,
      accent: 'var(--color-status-amber)',
    },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
          Web &amp; Social
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          ZiWorks&apos;s own website and the team&apos;s social presence — how the agency markets itself
        </p>
      </motion.div>

      {/* AI next steps */}
      <AiInsights steps={digitalNextSteps} subtitle="Across ziworks.in and the team's handles" />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}>
              <Card goldRule hover={false} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-medium">{s.label}</p>
                  <Icon size={15} style={{ color: s.accent }} />
                </div>
                <div className="text-2xl text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 400 }}>
                  {s.value}
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{s.sub}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Company website */}
      <Card goldRule hover={false}>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-[var(--color-gold)]" />
              <CardTitle>Company Website</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                {ziworksSite.domain}
              </span>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          {/* Health metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { k: 'Uptime', v: `${ziworksSite.uptime}%` },
              { k: 'Avg. session', v: fmtDuration(ziworksSite.avgSessionSec) },
              { k: 'Bounce rate', v: `${ziworksSite.bounceRate}%` },
              { k: 'Leads / mo', v: `${ziworksSite.leadsThisMonth}` },
            ].map((m) => (
              <div key={m.k} className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)]">{m.k}</p>
                <p className="text-lg text-[var(--color-text-primary)] mt-0.5" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                  {m.v}
                </p>
              </div>
            ))}
          </div>

          {/* Top pages */}
          <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Top pages · last 30 days</p>
          <div className="space-y-1.5 mb-4">
            {ziworksSite.topPages.map((p) => {
              const up = p.changePct >= 0
              return (
                <div key={p.path} className="flex items-center gap-3 rounded-[8px] px-2.5 py-2 hover:bg-[var(--color-surface-elevated)] transition-colors">
                  <span className="text-sm text-[var(--color-text-primary)] flex-1 min-w-0 truncate">
                    {p.label} <span className="text-[var(--color-text-tertiary)] text-xs" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{p.path}</span>
                  </span>
                  <span className="text-sm text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {fmtNum(p.views30d)}
                  </span>
                  <span
                    className="flex items-center gap-0.5 text-xs w-16 justify-end"
                    style={{ color: up ? 'var(--color-status-green)' : 'var(--color-status-red)', fontFamily: 'var(--font-jetbrains-mono)' }}
                  >
                    {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(p.changePct)}%
                  </span>
                </div>
              )
            })}
          </div>

          {/* Pending updates */}
          {ziworksSite.pendingUpdates.length > 0 && (
            <div className="pt-3 border-t border-[var(--color-border-brand)]">
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
                <Wrench size={11} /> Pending updates
              </p>
              <div className="space-y-1.5">
                {ziworksSite.pendingUpdates.map((u, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-amber)] flex-shrink-0" />
                    {u}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social handles */}
      <Card goldRule hover={false}>
        <CardHeader>
          <CardTitle>Social Presence</CardTitle>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
            ZiWorks company handles &amp; Muzammil&apos;s founder accounts
          </p>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {socialAccounts.map((acc) => {
              const Icon = platformIcon[acc.platform]
              const oc = ownerMeta[acc.owner].color
              return (
                <div key={acc.id} className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-[8px] bg-[var(--color-surface)] border border-[var(--color-border-brand)] flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-[var(--color-text-secondary)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{acc.handle}</p>
                      </div>
                      <span
                        className="text-[10px] uppercase tracking-wider font-semibold"
                        style={{ color: oc }}
                      >
                        {acc.owner} · {acc.platform}
                      </span>
                    </div>
                    {acc.awaitingApproval > 0 && (
                      <Badge variant="amber" className="ml-auto flex-shrink-0">
                        {acc.awaitingApproval} to approve
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{fmtNum(acc.followers)}</p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider">Followers</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-status-green)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>+{acc.growth30d}%</p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider">30d</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>{acc.engagementRate}%</p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider">Engmt</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content calendar */}
      <Card goldRule hover={false}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarClock size={15} className="text-[var(--color-gold)]" />
            <CardTitle>Brand Content Calendar</CardTitle>
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
            ZiWorks&apos;s own posts · {summary.postsAwaiting} awaiting your approval
          </p>
        </CardHeader>
        <CardContent className="pt-2 space-y-2">
          {contentCalendar.map((post) => {
            const pb = postStatusBadge[post.status]
            const Icon = platformIcon[post.platform]
            const oc = ownerMeta[post.owner].color
            return (
              <div
                key={post.id}
                className="flex items-center gap-3 rounded-[10px] border border-[var(--color-border-brand)] p-3"
                style={post.status === 'awaiting-approval' ? { background: 'var(--color-status-amber-muted)' } : undefined}
              >
                <div className="w-8 h-8 rounded-[8px] bg-[var(--color-surface-elevated)] border border-[var(--color-border-brand)] flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-[var(--color-text-secondary)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--color-text-primary)] truncate">{post.title}</p>
                  <p className="text-xs" style={{ color: oc }}>
                    {post.owner} · {post.platform}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[var(--color-text-secondary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {formatDateShort(post.date)}
                  </p>
                  <Badge variant={pb.variant} className="mt-0.5">{pb.label}</Badge>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
