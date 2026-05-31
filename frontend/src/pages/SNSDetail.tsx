import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import FollowerChart from '../components/FollowerChart'
import { snsAccounts } from '../data'
import type { SNSPlatform } from '../types'

const platformLabels: Record<SNSPlatform, string> = {
  x: 'X',
  instagram: 'Instagram',
  line: 'LINE',
  youtube: 'YouTube',
}

const platformColors: Record<SNSPlatform, string> = {
  x: '#1A1A1A',
  instagram: '#DD2A7B',
  line: '#06C755',
  youtube: '#FF0000',
}

type SortKey = 'popular' | 'newest'

export default function SNSDetail() {
  const location = useLocation()
  const platform = location.pathname.replace('/', '') as SNSPlatform
  const account = snsAccounts.find((a) => a.platform === platform)
  const [sort, setSort] = useState<SortKey>('newest')

  if (!account) return null

  const color = platformColors[platform]

  const sortedPosts = [...account.posts].sort((a, b) => {
    if (sort === 'popular') {
      return (b.stats.views ?? b.stats.likes) - (a.stats.views ?? a.stats.likes)
    }
    return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  })

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-lg p-4 text-white" style={{ backgroundColor: color }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-70">フォロワー</p>
            <p className="text-2xl font-bold">{account.followers.toLocaleString()}</p>
            <p className="text-xs text-[#1D9E75]">+{account.followerChange}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-70">インプレッション</p>
            <p className="text-xl font-bold">{account.impressions.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <p className="mb-2 text-sm font-medium text-gray-700">フォロワー推移</p>
        <div data-testid="follower-chart">
          <FollowerChart data={account.followerHistory} color={color} />
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">投稿パフォーマンス</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSort('popular')}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                sort === 'popular' ? 'text-white' : 'bg-gray-100 text-gray-600'
              }`}
              style={sort === 'popular' ? { backgroundColor: color } : undefined}
            >
              人気順
            </button>
            <button
              onClick={() => setSort('newest')}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                sort === 'newest' ? 'text-white' : 'bg-gray-100 text-gray-600'
              }`}
              style={sort === 'newest' ? { backgroundColor: color } : undefined}
            >
              新着順
            </button>
          </div>
        </div>
        <ul className="space-y-3">
          {sortedPosts.map((post) => (
            <li key={post.id} className="rounded-lg border border-gray-100 p-3">
              <p className="text-sm text-gray-800 line-clamp-2">{post.content}</p>
              <div className="mt-2 flex gap-4 text-xs text-gray-500">
                <span>❤ {post.stats.likes.toLocaleString()}</span>
                {post.stats.views != null && (
                  <span>👁 {post.stats.views.toLocaleString()}</span>
                )}
                <span>💬 {post.stats.comments.toLocaleString()}</span>
                <span>🔁 {post.stats.shares.toLocaleString()}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{post.postedAt}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <p className="mb-3 text-sm font-medium text-gray-700">
          {account.operationSummary.title}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {account.operationSummary.items.map((item) => (
            <div key={item.label} className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p
                className={`mt-1 text-lg font-bold ${
                  item.highlight ? 'text-[#1D9E75]' : 'text-gray-800'
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
