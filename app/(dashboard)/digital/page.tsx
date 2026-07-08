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
  Wrench,
  ExternalLink,
} from 'lucide-react'
import { AiInsights } from '@/components/shared/ai-insights'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  websites,
  socialAccounts,
  contentCalendar,
  digitalSummary,
  type SiteStatus,
  type SocialPlatform,
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

const siteStatusBadge: Record<SiteStatus, { variant: 'green' | 'blue' | 'amber' | 'default'; label: string }> = {
  live: { variant: 'green', label: 'Live' },
  staging: { variant: 'blue', label: 'Staging' },
  'in-dev': { variant: 'amber', label: 'In Dev' },
  maintenance: { variant: 'default', label: 'Maintenance' },
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

export default function DigitalPage() {
  const summary = digitalSummary()

  const statCards = [
    { label: 'Live sites', value: `${summary.liveSites}/${summary.totalSites}`, sub: `${summary.avgUptime.toFixed(2)}% avg uptime`, icon: Globe, accent: 'var(--color-status-green)' },
    { label: 'Total reach', value: fmtNum(summary.totalFollowers), sub: 'followers across channels', icon: Users2, accent: 'var(--color-status-blue)' },
    { label: 'Awaiting approval', value: `${summary.postsAwaiting}`, sub: 'posts need your sign-off', icon: CheckCircle2, accent: 'var(--color-status-amber)' },
    { label: 'Site updates', value: `${summary.pendingSiteUpdates}`, sub: 'pending across sites', icon: Wrench, accent: 'var(--color-gold)' },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1
          className="text-2xl sm:text-3xl text-[var(--color-text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          Web &amp; Social
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          {websites.length} client sites · {socialAccounts.length} social channels under management
        </p>
      </motion.div>

      {/* AI next steps */}
      <AiInsights steps={digitalNextSteps} subtitle="Across websites & social channels" />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <Card goldRule hover={false} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-medium">
                    {s.label}
                  </p>
                  <Icon size={15} style={{ color: s.accent }} />
                </div>
                <div
                  className="text-2xl text-[var(--color-text-primary)]"
                  style={{ fontFamily: 'var(--font-jetbrains-mono)', fontWeight: 400 }}
                >
                  {s.value}
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{s.sub}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Websites */}
      <Card goldRule hover={false}>
        <CardHeader>
          <CardTitle>Website Management</CardTitle>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
            Campaign microsites & client properties
          </p>
        </CardHeader>
        <CardContent className="pt-2 space-y-2">
          {websites.map((site) => {
            const sb = siteStatusBadge[site.status]
            return (
              <div
                key={site.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {site.siteName}
                    </p>
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                  </div>
                  <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1 mt-0.5">
                    <ExternalLink size={10} /> {site.url} · {site.client}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-tertiary)]">Visitors / mo</p>
                  <p className="text-sm text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {fmtNum(site.monthlyVisitors)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-tertiary)]">Uptime</p>
                  <p className="text-sm text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {site.uptime}%
                  </p>
                </div>
                {site.pendingUpdates > 0 && (
                  <Badge variant="amber">
                    <Wrench size={10} /> {site.pendingUpdates} pending
                  </Badge>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Social accounts */}
      <Card goldRule hover={false}>
        <CardHeader>
          <CardTitle>Social Media Management</CardTitle>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
            Channels, growth & engagement
          </p>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {socialAccounts.map((acc) => {
              const Icon = platformIcon[acc.platform]
              return (
                <div
                  key={acc.id}
                  className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-3"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-[8px] bg-[var(--color-surface)] border border-[var(--color-border-brand)] flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-[var(--color-text-secondary)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {acc.client}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                        {acc.handle}
                      </p>
                    </div>
                    {acc.awaitingApproval > 0 && (
                      <Badge variant="amber" className="ml-auto flex-shrink-0">
                        {acc.awaitingApproval}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {fmtNum(acc.followers)}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider">Followers</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-status-green)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                        +{acc.growth30d}%
                      </p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider">30d</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {acc.engagementRate}%
                      </p>
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
            <CardTitle>Content Calendar</CardTitle>
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
            Upcoming scheduled posts · {summary.postsAwaiting} awaiting your approval
          </p>
        </CardHeader>
        <CardContent className="pt-2 space-y-2">
          {contentCalendar.map((post) => {
            const pb = postStatusBadge[post.status]
            const Icon = platformIcon[post.platform]
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
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    {post.client} · {post.owner}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-xs text-[var(--color-text-secondary)]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                  >
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
