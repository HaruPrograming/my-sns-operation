import type { SNSAccount, SNSPlatform, AnalyticsPeriod, AnalyticsChartPoint, BestPost } from '../types'

export const platformColors: Record<SNSPlatform, string> = {
  x: '#1A1A1A',
  instagram: '#DD2A7B',
  line: '#06C755',
  youtube: '#FF0000',
}

export const platformLabels: Record<SNSPlatform, string> = {
  x: 'X',
  instagram: 'Instagram',
  line: 'LINE',
  youtube: 'YouTube',
}

export const snsAccounts: SNSAccount[] = [
  {
    platform: 'x',
    accountName: '@haru_x',
    profileUrl: 'https://x.com/haru_x',
    followers: 12500,
    followerChange: 120,
    followerChangeRate: 0.97,
    impressions: 45200,
    posts: [
      {
        id: 'x-1',
        platform: 'x',
        format: 'thread',
        content: 'Xのアルゴリズム変更について徹底解説スレッド。インプレを伸ばすには…',
        stats: { likes: 1200, comments: 89, shares: 234, views: 45000 },
        postedAt: '2025-06-15',
        hashtags: ['X', 'SNS運用'],
      },
      {
        id: 'x-2',
        platform: 'x',
        format: 'image',
        content: 'インフォグラフィック：SNS運用のコツ10選',
        stats: { likes: 890, comments: 56, shares: 178, views: 32000 },
        postedAt: '2025-06-10',
        hashtags: ['SNS', 'マーケティング'],
      },
    ],
    followerHistory: [
      { date: '2025-04', count: 12100 },
      { date: '2025-05', count: 12380 },
      { date: '2025-06', count: 12500 },
    ],
    operationSummary: {
      title: '今週の運用サマリー',
      items: [
        { label: '今週の投稿数', value: '3 / 5' },
        { label: '返信率', value: '82%', highlight: true },
        { label: 'ベストな時間帯', value: '19〜21時' },
        { label: '伸びたフォーマット', value: 'スレッド' },
      ],
    },
    analyticsMetrics: [
      { label: '今月の投稿数', value: '12件' },
      { label: '平均いいね', value: '1,045' },
      { label: '返信率', value: '7.4%' },
    ],
  },
  {
    platform: 'instagram',
    accountName: '@haru_ig',
    profileUrl: 'https://instagram.com/haru_ig',
    followers: 8900,
    followerChange: 85,
    followerChangeRate: 0.96,
    impressions: 28400,
    posts: [
      {
        id: 'ig-1',
        platform: 'instagram',
        format: 'reel',
        content: '朝のルーティン動画：生産性を上げる5つの習慣',
        stats: { likes: 2100, comments: 134, shares: 0, views: 18000, saves: 450 },
        postedAt: '2025-06-14',
        hashtags: ['朝活', '生産性'],
      },
      {
        id: 'ig-2',
        platform: 'instagram',
        format: 'carousel',
        content: 'SNSマーケティング入門：初心者が知るべき基礎知識',
        stats: { likes: 980, comments: 67, shares: 0, views: 9200, saves: 320 },
        postedAt: '2025-06-08',
        hashtags: ['マーケティング', 'SNS'],
      },
    ],
    followerHistory: [
      { date: '2025-04', count: 8650 },
      { date: '2025-05', count: 8815 },
      { date: '2025-06', count: 8900 },
    ],
    operationSummary: {
      title: '今週の運用サマリー',
      items: [
        { label: '今週の投稿数', value: '4 / 5' },
        { label: '保存率', value: '21%', highlight: true },
        { label: 'ベストな時間帯', value: '12〜14時' },
        { label: '伸びたフォーマット', value: 'リール' },
      ],
    },
    analyticsMetrics: [
      { label: '今月の投稿数', value: '8件' },
      { label: '平均いいね', value: '1,540' },
      { label: '保存率', value: '21%' },
    ],
  },
  {
    platform: 'line',
    accountName: '@haru_line',
    profileUrl: 'https://line.me/R/ti/p/@haru_line',
    followers: 3200,
    followerChange: 45,
    followerChangeRate: 1.42,
    impressions: 12800,
    posts: [
      {
        id: 'line-1',
        platform: 'line',
        format: 'image',
        content: '【週刊SNSレポート】今週のトレンドをまとめました',
        stats: { likes: 0, comments: 23, shares: 0, openRate: 68 },
        postedAt: '2025-06-14',
        hashtags: [],
      },
      {
        id: 'line-2',
        platform: 'line',
        format: 'image',
        content: '【お知らせ】新サービス開始のご案内',
        stats: { likes: 0, comments: 15, shares: 0, openRate: 72 },
        postedAt: '2025-06-07',
        hashtags: [],
      },
    ],
    followerHistory: [
      { date: '2025-04', count: 3100 },
      { date: '2025-05', count: 3155 },
      { date: '2025-06', count: 3200 },
    ],
    operationSummary: {
      title: '今週の配信サマリー',
      items: [
        { label: '今週の配信数', value: '2 / 3' },
        { label: '開封率', value: '68%', highlight: true },
        { label: 'ベストな時間帯', value: '18〜20時' },
        { label: '伸びたフォーマット', value: 'テキスト' },
      ],
    },
    analyticsMetrics: [
      { label: '今月の配信数', value: '5件' },
      { label: '平均開封率', value: '68%' },
      { label: 'クリック率', value: '12%' },
    ],
  },
  {
    platform: 'youtube',
    accountName: '@haru_tube',
    profileUrl: 'https://youtube.com/@haru_tube',
    followers: 5600,
    followerChange: 210,
    followerChangeRate: 3.89,
    impressions: 62000,
    posts: [
      {
        id: 'yt-1',
        platform: 'youtube',
        format: 'image',
        content: '【完全版】SNS運用で月100万円を稼ぐ方法',
        stats: { likes: 3400, comments: 289, shares: 156, views: 48000, retention: 62 },
        postedAt: '2025-06-12',
        hashtags: ['SNS副業', 'YouTube'],
      },
      {
        id: 'yt-2',
        platform: 'youtube',
        format: 'image',
        content: 'X・Instagram・LINE・YouTube 4社比較！2025年最新版',
        stats: { likes: 2100, comments: 178, shares: 89, views: 31000, retention: 55 },
        postedAt: '2025-06-05',
        hashtags: ['SNS比較', 'YouTube'],
      },
    ],
    followerHistory: [
      { date: '2025-04', count: 5100 },
      { date: '2025-05', count: 5390 },
      { date: '2025-06', count: 5600 },
    ],
    operationSummary: {
      title: '今週の運用サマリー',
      items: [
        { label: '今週の投稿数', value: '1 / 2' },
        { label: '平均視聴維持率', value: '62%', highlight: true },
        { label: 'ベストな投稿時間', value: '金曜18時' },
        { label: '伸びたフォーマット', value: '解説動画' },
      ],
    },
    analyticsMetrics: [
      { label: '今月の投稿数', value: '3件' },
      { label: '平均視聴数', value: '26,333' },
      { label: '平均維持率', value: '59%' },
    ],
  },
]

export const analyticsChartData: Record<AnalyticsPeriod, AnalyticsChartPoint[]> = {
  週: [
    { date: '6/9',  x: 12350, instagram: 8820, line: 3170, youtube: 5480 },
    { date: '6/10', x: 12370, instagram: 8840, line: 3175, youtube: 5500 },
    { date: '6/11', x: 12380, instagram: 8850, line: 3180, youtube: 5520 },
    { date: '6/12', x: 12410, instagram: 8860, line: 3185, youtube: 5550 },
    { date: '6/13', x: 12440, instagram: 8870, line: 3190, youtube: 5570 },
    { date: '6/14', x: 12470, instagram: 8885, line: 3195, youtube: 5590 },
    { date: '6/15', x: 12500, instagram: 8900, line: 3200, youtube: 5600 },
  ],
  月: [
    { date: '5/19', x: 12200, instagram: 8700, line: 3120, youtube: 5200 },
    { date: '5/26', x: 12300, instagram: 8780, line: 3150, youtube: 5350 },
    { date: '6/2',  x: 12380, instagram: 8830, line: 3170, youtube: 5470 },
    { date: '6/9',  x: 12440, instagram: 8870, line: 3190, youtube: 5550 },
    { date: '6/15', x: 12500, instagram: 8900, line: 3200, youtube: 5600 },
  ],
  '3ヶ月': [
    { date: '4月', x: 12100, instagram: 8650, line: 3100, youtube: 5100 },
    { date: '5月', x: 12380, instagram: 8815, line: 3155, youtube: 5390 },
    { date: '6月', x: 12500, instagram: 8900, line: 3200, youtube: 5600 },
  ],
}

export const analyticsBestPosts: BestPost[] = [
  { platform: 'x', content: 'Xのアルゴリズム変更について徹底解説スレッド', likes: 1200, views: 45000 },
  { platform: 'instagram', content: '朝のルーティン動画：生産性を上げる5つの習慣', likes: 2100, views: 18000 },
  { platform: 'youtube', content: '【完全版】SNS運用で月100万円を稼ぐ方法', likes: 3400, views: 48000 },
]
