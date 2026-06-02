import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { snsAccounts, analyticsChartData, analyticsBestPosts, platformColors, platformLabels } from '../data'
import { useAuth } from '../contexts/AuthContext'
import type { AnalyticsPeriod } from '../types'

const periods: AnalyticsPeriod[] = ['週', '月', '3ヶ月']

export default function Analytics() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('月')
  const { xProfile, xTweets, xFollowerHistory } = useAuth()

  const xFollowerChange = (() => {
    if (xFollowerHistory.length < 2) return null
    return xFollowerHistory[xFollowerHistory.length - 1].count - xFollowerHistory[0].count
  })()

  const xBestTweet = xTweets.length > 0
    ? [...xTweets].sort((a, b) => b.likes - a.likes)[0]
    : null

  const bestPosts = analyticsBestPosts.map((post) => {
    if (post.platform === 'x' && xBestTweet) {
      return { ...post, content: xBestTweet.content, likes: xBestTweet.likes, views: 0 }
    }
    return post
  })

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            aria-pressed={period === p}
            className={`rounded-full px-4 py-1 text-sm font-medium transition ${
              period === p
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <p className="mb-2 text-sm font-medium text-gray-700">フォロワー推移</p>
        <div data-testid="analytics-chart">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={analyticsChartData[period]} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {Object.keys(platformColors).map((platform) => (
                <Line
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  name={platformLabels[platform]}
                  stroke={platformColors[platform]}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        {snsAccounts.map((account) => {
          const isX = account.platform === 'x'
          const color = platformColors[account.platform]
          const displayFollowers = isX && xProfile ? xProfile.followers : account.followers
          const changeNum = isX ? (xFollowerChange ?? account.followerChange) : account.followerChange
          const changeLabel = isX && xFollowerChange === null
            ? '-'
            : `${changeNum >= 0 ? '+' : ''}${changeNum}`

          return (
            <div key={account.platform} className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded px-2 py-0.5 text-xs font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {platformLabels[account.platform]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isX && xProfile ? `@${xProfile.username}` : account.accountName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-800">
                    {displayFollowers.toLocaleString()}
                  </span>
                  <span className={`ml-2 text-xs ${changeNum >= 0 ? 'text-[#1D9E75]' : 'text-[#E24B4A]'}`}>
                    {changeLabel}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
                {account.analyticsMetrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-xs text-gray-500">{m.label}</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-800">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <p className="mb-3 text-sm font-medium text-gray-700">今月のベスト投稿</p>
        <div className="space-y-3">
          {bestPosts.map((post, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 rounded px-1.5 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: platformColors[post.platform] }}
              >
                {platformLabels[post.platform]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-gray-800">{post.content}</p>
                <p className="text-xs text-gray-400">
                  ❤ {post.likes.toLocaleString()}
                  {post.views > 0 && ` 👁 ${post.views.toLocaleString()}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
