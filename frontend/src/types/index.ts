export type SNSPlatform = 'x' | 'instagram' | 'line' | 'youtube'
export type AnalyticsPeriod = '週' | '月' | '3ヶ月'
export type PostFormat = 'thread' | 'image' | 'reel' | 'carousel' | 'feed' | 'story'
export type PostStatus = 'scheduled' | 'draft'
export type BadgeType = 'success' | 'error' | 'neutral'
export type TabType = 'home' | 'analytics' | 'schedule' | 'settings'
export type SNSTabType = SNSPlatform | 'all'

export interface FollowerDataPoint {
  date: string
  count: number
}

export interface PostStats {
  likes: number
  comments: number
  shares: number
  views?: number
  saves?: number
  openRate?: number
  retention?: number
}

export interface Post {
  id: string
  platform: SNSPlatform
  format: PostFormat
  content: string
  stats: PostStats
  postedAt: string
  hashtags: string[]
}

export interface ScheduledPost {
  id: string
  platform: SNSPlatform
  format: PostFormat
  status: PostStatus
  scheduledAt: string
  content: string
  hashtags: string[]
}

export interface SummaryItem {
  label: string
  value: string
  highlight?: boolean
}

export interface OperationSummary {
  title: string
  items: SummaryItem[]
}

export interface AnalyticsChartPoint {
  date: string
  x: number
  instagram: number
  line: number
  youtube: number
}

export interface BestPost {
  platform: SNSPlatform
  content: string
  likes: number
  views: number
}

export interface SNSAccount {
  platform: SNSPlatform
  accountName: string
  profileUrl: string
  followers: number
  followerChange: number
  followerChangeRate: number
  impressions: number
  posts: Post[]
  followerHistory: FollowerDataPoint[]
  operationSummary: OperationSummary
  analyticsMetrics: { label: string; value: string }[]
}
