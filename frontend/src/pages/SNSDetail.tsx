import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import FollowerChart from '../components/FollowerChart'
import { snsAccounts, platformColors } from '../data'
import { useAuth } from '../contexts/AuthContext'
import type { SNSPlatform, XTweet } from '../types'

type SortKey = 'popular' | 'newest'

type XSummary = {
  posts_this_week: number
  reply_rate: number
  best_hour: string
  top_format: string
}

export default function SNSDetail() {
  const location = useLocation()
  const platform = location.pathname.replace('/', '') as SNSPlatform
  const account = snsAccounts.find((a) => a.platform === platform)
  const { xProfile, xTweets, xFollowerHistory } = useAuth()
  const [sort, setSort] = useState<SortKey>('newest')
  const [xSummary, setXSummary] = useState<XSummary | null>(null)

  useEffect(() => {
    if (platform !== 'x') return
    fetch('/api/sns/x/summary', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.connected) setXSummary(data) })
      .catch(() => {})
  }, [platform])

  if (!account) return null

  const color = platformColors[platform]
  const isX = platform === 'x'
  const displayFollowers = isX && xProfile ? xProfile.followers : account.followers
  const displayName = isX && xProfile ? xProfile.name : null

  const xFollowerChange = (() => {
    if (!isX || xFollowerHistory.length < 2) return null
    const diff = xFollowerHistory[xFollowerHistory.length - 1].count - xFollowerHistory[0].count
    return diff >= 0 ? `+${diff}` : String(diff)
  })()
  const displayFollowerChange = isX && xProfile
    ? (xFollowerChange ?? '-')
    : `+${account.followerChange}`

  const sortedPosts = isX && xTweets.length > 0
    ? [...xTweets].sort((a, b) => {
        if (sort === 'popular') return b.likes - a.likes
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
      })
    : [...account.posts].sort((a, b) => {
        if (sort === 'popular') return (b.stats.views ?? b.stats.likes) - (a.stats.views ?? a.stats.likes)
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      })

  const isXTweets = isX && xTweets.length > 0

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-lg p-4 text-white" style={{ backgroundColor: color }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isX && xProfile?.avatar && (
              <img src={xProfile.avatar} alt="X" className="w-10 h-10 rounded-full border-2 border-white/30" />
            )}
            <div>
              {displayName && <p className="text-sm font-medium opacity-90">{displayName}</p>}
              <p className="text-xs opacity-70">フォロワー</p>
              <p className="text-2xl font-bold">{displayFollowers.toLocaleString()}</p>
              <p className="text-xs text-[#1D9E75]">{displayFollowerChange}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            {isX && xProfile ? (
              <>
                <div>
                  <p className="text-xs opacity-70">フォロー中</p>
                  <p className="text-xl font-bold">{xProfile.following.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">総投稿数</p>
                  <p className="text-lg font-bold">{xProfile.tweet_count.toLocaleString()}</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <p className="mb-2 text-sm font-medium text-gray-700">フォロワー推移</p>
        <div data-testid="follower-chart">
          {isX && xFollowerHistory.length === 0
            ? <p className="text-xs text-gray-400 py-10 text-center">データ収集中です（翌日以降に表示されます）</p>
            : <FollowerChart data={isX ? xFollowerHistory : account.followerHistory} color={color} />
          }
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
          {isXTweets
            ? (sortedPosts as XTweet[]).map((tweet) => (
                <li key={tweet.id} className="rounded-lg border border-gray-100 p-3">
                  <p className="text-sm text-gray-800 line-clamp-2">{tweet.content}</p>
                  <div className="mt-2 flex gap-4 text-xs text-gray-500">
                    <span>❤ {tweet.likes.toLocaleString()}</span>
                    <span>💬 {tweet.replies.toLocaleString()}</span>
                    <span>🔁 {tweet.retweets.toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{tweet.posted_at}</p>
                </li>
              ))
            : (sortedPosts as typeof account.posts).map((post) => (
                <li key={post.id} className="rounded-lg border border-gray-100 p-3">
                  <p className="text-sm text-gray-800 line-clamp-2">{post.content}</p>
                  <div className="mt-2 flex gap-4 text-xs text-gray-500">
                    <span>❤ {post.stats.likes.toLocaleString()}</span>
                    <span>💬 {post.stats.comments.toLocaleString()}</span>
                    <span>🔁 {post.stats.shares.toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{post.postedAt}</p>
                </li>
              ))
          }
        </ul>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <p className="mb-3 text-sm font-medium text-gray-700">今週の運用サマリー</p>
        <div className="grid grid-cols-2 gap-3">
          {(isX && xSummary
            ? [
                { label: '投稿数', value: String(xSummary.posts_this_week), highlight: false },
                { label: '返信率', value: `${xSummary.reply_rate}%`, highlight: false },
                { label: 'ベスト時間帯', value: xSummary.best_hour, highlight: true },
                { label: 'ベストフォーマット', value: xSummary.top_format, highlight: true },
              ]
            : account.operationSummary.items
          ).map((item) => (
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
