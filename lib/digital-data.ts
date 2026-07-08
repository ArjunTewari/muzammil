// Website + social media management data for the master's Web & Social view.
// TODO: replace with GET /api/digital

export type SiteStatus = 'live' | 'staging' | 'in-dev' | 'maintenance'
export type SocialPlatform = 'Instagram' | 'LinkedIn' | 'YouTube' | 'Twitter'
export type PostStatus = 'scheduled' | 'awaiting-approval' | 'published' | 'draft'

export interface WebsiteEntry {
  id: string
  client: string
  siteName: string
  url: string
  status: SiteStatus
  uptime: number // %
  monthlyVisitors: number
  pendingUpdates: number
  owner: string
}

export interface SocialAccount {
  id: string
  client: string
  platform: SocialPlatform
  handle: string
  followers: number
  growth30d: number // %
  engagementRate: number // %
  scheduledThisWeek: number
  awaitingApproval: number
  manager: string
}

export interface ScheduledPost {
  id: string
  client: string
  platform: SocialPlatform
  title: string
  date: string
  status: PostStatus
  owner: string
}

export const websites: WebsiteEntry[] = [
  {
    id: 'w1',
    client: 'Axis MF',
    siteName: 'Retirement Planning Microsite',
    url: 'retire.axismf-campaign.in',
    status: 'staging',
    uptime: 99.98,
    monthlyVisitors: 42800,
    pendingUpdates: 3,
    owner: 'Karan Malhotra',
  },
  {
    id: 'w2',
    client: 'HDFC AMC',
    siteName: 'IFA Education Hub',
    url: 'learn.hdfcamc-ifa.in',
    status: 'live',
    uptime: 99.99,
    monthlyVisitors: 118400,
    pendingUpdates: 1,
    owner: 'Karan Malhotra',
  },
  {
    id: 'w3',
    client: 'DSP MF',
    siteName: 'Tiger Fund 25th Anniversary',
    url: 'tiger25.dspmf-campaign.in',
    status: 'in-dev',
    uptime: 100,
    monthlyVisitors: 0,
    pendingUpdates: 6,
    owner: 'Divya Nair',
  },
  {
    id: 'w4',
    client: 'Motilal Oswal',
    siteName: 'SIP Calculator + Landing',
    url: 'sip.motilaloswal-mf.in',
    status: 'live',
    uptime: 99.94,
    monthlyVisitors: 87200,
    pendingUpdates: 2,
    owner: 'Karan Malhotra',
  },
  {
    id: 'w5',
    client: 'Kotak MF',
    siteName: 'Flexi Cap Campaign Page',
    url: 'flexicap.kotakmf-campaign.in',
    status: 'maintenance',
    uptime: 98.71,
    monthlyVisitors: 23100,
    pendingUpdates: 4,
    owner: 'Karan Malhotra',
  },
]

export const socialAccounts: SocialAccount[] = [
  {
    id: 's1',
    client: 'Axis MF',
    platform: 'Instagram',
    handle: '@axismf.official',
    followers: 214000,
    growth30d: 4.2,
    engagementRate: 3.8,
    scheduledThisWeek: 5,
    awaitingApproval: 2,
    manager: 'Divya Nair',
  },
  {
    id: 's2',
    client: 'Axis MF',
    platform: 'LinkedIn',
    handle: 'Axis Mutual Fund',
    followers: 96500,
    growth30d: 2.1,
    engagementRate: 5.4,
    scheduledThisWeek: 3,
    awaitingApproval: 1,
    manager: 'Priya Mehta',
  },
  {
    id: 's3',
    client: 'Motilal Oswal',
    platform: 'Instagram',
    handle: '@motilaloswalamc',
    followers: 178300,
    growth30d: 6.8,
    engagementRate: 6.1,
    scheduledThisWeek: 4,
    awaitingApproval: 0,
    manager: 'Divya Nair',
  },
  {
    id: 's4',
    client: 'Nippon MF',
    platform: 'Instagram',
    handle: '@nipponindiamf',
    followers: 142900,
    growth30d: 3.4,
    engagementRate: 4.0,
    scheduledThisWeek: 3,
    awaitingApproval: 3,
    manager: 'Karan Malhotra',
  },
  {
    id: 's5',
    client: 'HDFC AMC',
    platform: 'YouTube',
    handle: 'HDFC AMC',
    followers: 312000,
    growth30d: 1.9,
    engagementRate: 2.7,
    scheduledThisWeek: 2,
    awaitingApproval: 1,
    manager: 'Karan Malhotra',
  },
  {
    id: 's6',
    client: 'DSP MF',
    platform: 'LinkedIn',
    handle: 'DSP Mutual Fund',
    followers: 71200,
    growth30d: 2.8,
    engagementRate: 4.9,
    scheduledThisWeek: 2,
    awaitingApproval: 0,
    manager: 'Priya Mehta',
  },
]

export const contentCalendar: ScheduledPost[] = [
  {
    id: 'p1',
    client: 'Nippon MF',
    platform: 'Instagram',
    title: 'SIP-day retirement reel (1 of 3)',
    date: '2026-06-22',
    status: 'awaiting-approval',
    owner: 'Karan Malhotra',
  },
  {
    id: 'p2',
    client: 'Nippon MF',
    platform: 'Instagram',
    title: 'SIP-day retirement reel (2 of 3)',
    date: '2026-06-22',
    status: 'awaiting-approval',
    owner: 'Karan Malhotra',
  },
  {
    id: 'p3',
    client: 'Nippon MF',
    platform: 'Instagram',
    title: 'SIP-day retirement reel (3 of 3)',
    date: '2026-06-22',
    status: 'awaiting-approval',
    owner: 'Karan Malhotra',
  },
  {
    id: 'p4',
    client: 'Axis MF',
    platform: 'Instagram',
    title: 'Retirement myth-buster carousel',
    date: '2026-06-23',
    status: 'scheduled',
    owner: 'Divya Nair',
  },
  {
    id: 'p5',
    client: 'Axis MF',
    platform: 'LinkedIn',
    title: 'Founder POV: Why retirement is a math problem',
    date: '2026-06-24',
    status: 'awaiting-approval',
    owner: 'Priya Mehta',
  },
  {
    id: 'p6',
    client: 'Motilal Oswal',
    platform: 'Instagram',
    title: 'SIP compounding explainer (boost candidate)',
    date: '2026-06-24',
    status: 'scheduled',
    owner: 'Divya Nair',
  },
  {
    id: 'p7',
    client: 'HDFC AMC',
    platform: 'YouTube',
    title: 'IFA education — Episode 4',
    date: '2026-06-25',
    status: 'draft',
    owner: 'Karan Malhotra',
  },
  {
    id: 'p8',
    client: 'DSP MF',
    platform: 'LinkedIn',
    title: 'Tiger Fund 25th anniversary teaser',
    date: '2026-06-26',
    status: 'draft',
    owner: 'Divya Nair',
  },
]

export function digitalSummary() {
  const liveSites = websites.filter((w) => w.status === 'live').length
  const totalFollowers = socialAccounts.reduce((s, a) => s + a.followers, 0)
  const postsAwaiting =
    contentCalendar.filter((p) => p.status === 'awaiting-approval').length
  const pendingSiteUpdates = websites.reduce((s, w) => s + w.pendingUpdates, 0)
  const avgUptime =
    websites.reduce((s, w) => s + w.uptime, 0) / (websites.length || 1)
  return { liveSites, totalSites: websites.length, totalFollowers, postsAwaiting, pendingSiteUpdates, avgUptime }
}
