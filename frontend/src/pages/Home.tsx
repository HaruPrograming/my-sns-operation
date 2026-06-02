import { Link } from 'react-router-dom'
import { snsAccounts, platformLabels } from '../data'
import { useAuth } from '../contexts/AuthContext'

const hint =
  'Xはハッシュタグを2〜3個使うと拡散しやすいです。Instagramはリールが最もリーチを伸ばしやすい形式です。'

export default function Home() {
  const { xProfile, xTweets, xFollowerHistory } = useAuth()

  const xFollowerChange = (() => {
    if (xFollowerHistory.length < 2) return null
    return xFollowerHistory[xFollowerHistory.length - 1].count - xFollowerHistory[0].count
  })()

  const xBuzzTweets = [...xTweets].sort((a, b) => b.likes - a.likes).slice(0, 2)

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-lg bg-blue-50 p-3">
        <p className="text-sm font-medium text-blue-800">💡 運用ヒント</p>
        <p className="mt-1 text-sm text-blue-700">{hint}</p>
      </div>

      {snsAccounts.map((account) => {
        const isX = account.platform === 'x'
        const displayAccountName = isX && xProfile ? `@${xProfile.username}` : account.accountName
        const displayProfileUrl = isX && xProfile ? `https://x.com/${xProfile.username}` : account.profileUrl
        const displayFollowers = isX && xProfile ? xProfile.followers : account.followers

        const followerChangeNum = isX
          ? (xFollowerChange ?? account.followerChange)
          : account.followerChange
        const followerChangeLabel = isX && xFollowerChange === null
          ? '-'
          : `${followerChangeNum >= 0 ? '+' : ''}${followerChangeNum}`

        const buzzPosts = isX && xBuzzTweets.length > 0
          ? null
          : [...account.posts]
              .sort((a, b) => (b.stats.views ?? b.stats.likes) - (a.stats.views ?? a.stats.likes))
              .slice(0, 2)

        return (
          <div key={account.platform} className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isX && xProfile?.avatar && (
                  <img src={xProfile.avatar} alt="X" className="w-6 h-6 rounded-full" />
                )}
                <h2 className="text-lg font-bold">{platformLabels[account.platform]}</h2>
                <span className="text-sm text-gray-500">{displayAccountName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/${account.platform}`} className="text-sm text-blue-600">
                  詳細を見る
                </Link>
                <a
                  href={displayProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${platformLabels[account.platform]}アプリで見る`}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  ↗
                </a>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">フォロワー</p>
                <p className="text-xl font-bold">{displayFollowers.toLocaleString()}</p>
                <p className={`text-xs ${followerChangeNum >= 0 ? 'text-[#1D9E75]' : 'text-[#E24B4A]'}`}>
                  {followerChangeLabel}
                </p>
              </div>
              {isX && xProfile ? (
                <div className="text-right space-y-1">
                  <div>
                    <p className="text-xs text-gray-500">フォロー中</p>
                    <p className="text-xl font-bold">{xProfile.following.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">総投稿数</p>
                    <p className="text-lg font-bold">{xProfile.tweet_count.toLocaleString()}</p>
                  </div>
                </div>
              ) : !isX ? (
                <div>
                  <p className="text-xs text-gray-500">インプレッション</p>
                  <p className="text-xl font-bold">{account.impressions.toLocaleString()}</p>
                </div>
              ) : null}
            </div>

            {isX && xBuzzTweets.length > 0 ? (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <p className="text-xs font-medium text-gray-500">📊 バズ投稿</p>
                <div className="mt-2 space-y-2">
                  {xBuzzTweets.map((tweet, index) => (
                    <div key={tweet.id} className="flex items-start gap-2">
                      <span className="w-5 text-xs font-bold text-gray-400">{index + 1}位</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-gray-700">{tweet.content}</p>
                        <p className="text-xs text-gray-400">❤ {tweet.likes.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : buzzPosts && buzzPosts.length > 0 ? (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <p className="text-xs font-medium text-gray-500">📊 バズ投稿</p>
                <div className="mt-2 space-y-2">
                  {buzzPosts.map((post, index) => (
                    <div key={post.id} className="flex items-start gap-2">
                      <span className="w-5 text-xs font-bold text-gray-400">{index + 1}位</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-gray-700">{post.content}</p>
                        <p className="text-xs text-gray-400">
                          ❤ {post.stats.likes.toLocaleString()}
                          {post.stats.views != null && ` 👁 ${post.stats.views.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
