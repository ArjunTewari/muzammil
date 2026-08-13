// The agency's OWN web + social presence — its own website and the
// company/founder social handles. (Client campaign channels live under
// Projects/Team, not here.)
// TODO: replace with GET /api/digital

export type SiteStatus = 'operational' | 'degraded' | 'maintenance'
export type SocialPlatform = 'LinkedIn' | 'Instagram' | 'Twitter' | 'YouTube'
export type SocialOwner = 'Agency' | 'Founder'
export type PostStatus = 'scheduled' | 'awaiting-approval' | 'published' | 'draft'

export interface SitePage {
  path: string
  label: string
  views30d: number
  changePct: number
}

export interface WebsiteHealth {
  domain: string
  status: SiteStatus
  uptime: number // %
  monthlyVisitors: number
  visitorChangePct: number
  avgSessionSec: number
  bounceRate: number // %
  leadsThisMonth: number
  pendingUpdates: string[]
  topPages: SitePage[]
}

export interface SocialAccount {
  id: string
  owner: SocialOwner
  platform: SocialPlatform
  handle: string
  followers: number
  growth30d: number // %
  engagementRate: number // %
  scheduledThisWeek: number
  awaitingApproval: number
}

export interface ScheduledPost {
  id: string
  owner: SocialOwner
  platform: SocialPlatform
  title: string
  date: string
  status: PostStatus
}

// The single company website Supra monitors.
export const agencySite: WebsiteHealth = {
  domain: 'youragency.com',
  status: 'operational',
  uptime: 99.97,
  monthlyVisitors: 8420,
  visitorChangePct: 12.4,
  avgSessionSec: 132,
  bounceRate: 41.8,
  leadsThisMonth: 14,
  pendingUpdates: [
    'Add 2 new case studies to /work',
    'Refresh the team page with 2 recent hires',
  ],
  topPages: [
    { path: '/', label: 'Home', views30d: 3120, changePct: 9.1 },
    { path: '/work', label: 'Work / Portfolio', views30d: 2040, changePct: 18.6 },
    { path: '/services', label: 'Services', views30d: 1180, changePct: 4.2 },
    { path: '/about', label: 'About / Team', views30d: 860, changePct: -3.4 },
    { path: '/blog', label: 'Blog', views30d: 740, changePct: 22.0 },
    { path: '/contact', label: 'Contact', views30d: 480, changePct: 6.8 },
  ],
}

// Agency company handles + the founder's personal handles.
export const socialAccounts: SocialAccount[] = [
  {
    id: 's1',
    owner: 'Founder',
    platform: 'LinkedIn',
    handle: 'The Founder',
    followers: 18900,
    growth30d: 6.8,
    engagementRate: 7.1,
    scheduledThisWeek: 2,
    awaitingApproval: 1,
  },
  {
    id: 's2',
    owner: 'Agency',
    platform: 'LinkedIn',
    handle: 'Your Agency',
    followers: 6200,
    growth30d: 5.4,
    engagementRate: 4.8,
    scheduledThisWeek: 3,
    awaitingApproval: 1,
  },
  {
    id: 's3',
    owner: 'Agency',
    platform: 'Instagram',
    handle: '@your.agency',
    followers: 3100,
    growth30d: 3.1,
    engagementRate: 3.2,
    scheduledThisWeek: 2,
    awaitingApproval: 2,
  },
  {
    id: 's4',
    owner: 'Founder',
    platform: 'Twitter',
    handle: '@thefounder',
    followers: 4500,
    growth30d: 2.2,
    engagementRate: 2.4,
    scheduledThisWeek: 1,
    awaitingApproval: 0,
  },
  {
    id: 's5',
    owner: 'Agency',
    platform: 'YouTube',
    handle: 'Your Agency',
    followers: 1250,
    growth30d: 1.5,
    engagementRate: 2.9,
    scheduledThisWeek: 0,
    awaitingApproval: 0,
  },
]

// The agency's OWN brand content pipeline (thought leadership, case studies, hiring).
export const contentCalendar: ScheduledPost[] = [
  {
    id: 'p1',
    owner: 'Agency',
    platform: 'LinkedIn',
    title: 'Case study: how we grew an AMC\'s SIP sign-ups 3x',
    date: '2026-06-23',
    status: 'awaiting-approval',
  },
  {
    id: 'p2',
    owner: 'Founder',
    platform: 'LinkedIn',
    title: 'Founder POV: compliance is a creative constraint, not a blocker',
    date: '2026-06-24',
    status: 'awaiting-approval',
  },
  {
    id: 'p3',
    owner: 'Agency',
    platform: 'Instagram',
    title: 'Behind the scenes: shooting a retirement reel',
    date: '2026-06-24',
    status: 'awaiting-approval',
  },
  {
    id: 'p4',
    owner: 'Agency',
    platform: 'LinkedIn',
    title: 'We\'re hiring: Senior Copywriter (BFSI)',
    date: '2026-06-25',
    status: 'scheduled',
  },
  {
    id: 'p5',
    owner: 'Founder',
    platform: 'Twitter',
    title: '3 SEBI rules every MF marketer gets wrong',
    date: '2026-06-26',
    status: 'draft',
  },
  {
    id: 'p6',
    owner: 'Agency',
    platform: 'Instagram',
    title: 'Team spotlight: meet the creative desk',
    date: '2026-06-27',
    status: 'draft',
  },
]

export function digitalSummary() {
  const totalFollowers = socialAccounts.reduce((s, a) => s + a.followers, 0)
  const postsAwaiting = contentCalendar.filter((p) => p.status === 'awaiting-approval').length
  const scheduled = contentCalendar.filter((p) => p.status === 'scheduled').length
  return {
    monthlyVisitors: agencySite.monthlyVisitors,
    visitorChangePct: agencySite.visitorChangePct,
    leadsThisMonth: agencySite.leadsThisMonth,
    totalFollowers,
    postsAwaiting,
    scheduled,
    uptime: agencySite.uptime,
    pendingUpdates: agencySite.pendingUpdates.length,
  }
}
