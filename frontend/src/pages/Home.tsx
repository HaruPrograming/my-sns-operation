import { Link } from 'react-router-dom'
import { snsAccounts, platformLabels } from '../data'

const hint =
  'Xはハッシュタグを2〜3個使うと拡散しやすいです。Instagramはリールが最もリーチを伸ばしやすい形式です。'

export default function Home() {
  return (
    <div className="p-4 space-y-4">
      <div className="rounded-lg bg-blue-50 p-3">
        <p className="text-sm font-medium text-blue-800">💡 運用ヒント</p>
        <p className="mt-1 text-sm text-blue-700">{hint}</p>
      </div>

      {snsAccounts.map((account) => {
        const buzzPosts = [...account.posts]
          .sort(
            (a, b) =>
              (b.stats.views ?? b.stats.likes) - (a.stats.views ?? a.stats.likes),
          )
          .slice(0, 2)

        return (
          <div key={account.platform} className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{platformLabels[account.platform]}</h2>
                <span className="text-sm text-gray-500">{account.accountName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/${account.platform}`} className="text-sm text-blue-600">
                  詳細を見る
                </Link>
                <a
                  href={account.profileUrl}
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
                <p className="text-xl font-bold">{account.followers.toLocaleString()}</p>
                <p
                  className={`text-xs ${account.followerChange >= 0 ? 'text-[#1D9E75]' : 'text-[#E24B4A]'}`}
                >
                  {account.followerChange >= 0 ? '+' : ''}
                  {account.followerChange}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">インプレッション</p>
                <p className="text-xl font-bold">{account.impressions.toLocaleString()}</p>
              </div>
            </div>

            {buzzPosts.length > 0 && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <p className="text-xs font-medium text-gray-500">📊 バズ投稿</p>
                <div className="mt-2 space-y-2">
                  {buzzPosts.map((post, index) => (
                    <div key={post.id} className="flex items-start gap-2">
                      <span className="w-5 text-xs font-bold text-gray-400">
                        {index + 1}位
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-gray-700">{post.content}</p>
                        <p className="text-xs text-gray-400">
                          ❤ {post.stats.likes.toLocaleString()}
                          {post.stats.views != null &&
                            ` 👁 ${post.stats.views.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
