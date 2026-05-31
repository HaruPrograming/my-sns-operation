import { useState } from 'react'
import { platformLabels, platformColors } from '../data'
import type { SNSPlatform } from '../types'

const PLATFORMS: SNSPlatform[] = ['x', 'instagram', 'line', 'youtube']

type ConnectionStatus = Record<SNSPlatform, boolean>
type GoalRecord = Record<SNSPlatform, number>

export default function Settings() {
  const [notifications, setNotifications] = useState<Record<SNSPlatform, boolean>>({
    x: true, instagram: true, line: true, youtube: true,
  })
  const [connected, setConnected] = useState<ConnectionStatus>({
    x: true, instagram: true, line: false, youtube: false,
  })
  const [goalFollowers, setGoalFollowers] = useState<GoalRecord>({
    x: 20000, instagram: 15000, line: 5000, youtube: 10000,
  })
  const [goalPosts, setGoalPosts] = useState<GoalRecord>({
    x: 20, instagram: 15, line: 8, youtube: 4,
  })
  const [modalPlatform, setModalPlatform] = useState<SNSPlatform | null>(null)

  const toggleConnection = (platform: SNSPlatform) => {
    setConnected((prev) => ({ ...prev, [platform]: !prev[platform] }))
    setModalPlatform(null)
  }

  return (
    <div className="p-4 space-y-6">
      {/* SNSアカウント連携 */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-700">SNSアカウント連携</h2>
        <div className="rounded-xl bg-white shadow divide-y divide-gray-100">
          {PLATFORMS.map((platform) => (
            <button
              key={platform}
              onClick={() => setModalPlatform(platform)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm text-gray-800">{platformLabels[platform]}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  connected[platform]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {connected[platform] ? '連携済み' : '未連携'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 目標設定 */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-700">目標設定</h2>
        <div className="rounded-xl bg-white shadow divide-y divide-gray-100">
          {PLATFORMS.map((platform) => (
            <div key={platform} className="px-4 py-3 space-y-2">
              <p
                className="text-xs font-bold"
                style={{ color: platformColors[platform] }}
              >
                {platformLabels[platform]}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="text-xs text-gray-400">目標フォロワー数</span>
                  <input
                    type="number"
                    value={goalFollowers[platform]}
                    onChange={(e) =>
                      setGoalFollowers((prev) => ({
                        ...prev,
                        [platform]: Number(e.target.value),
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-800 focus:outline-none focus:border-blue-400"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs text-gray-400">目標投稿数/月</span>
                  <input
                    type="number"
                    value={goalPosts[platform]}
                    onChange={(e) =>
                      setGoalPosts((prev) => ({
                        ...prev,
                        [platform]: Number(e.target.value),
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-800 focus:outline-none focus:border-blue-400"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 通知設定 */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-700">通知設定</h2>
        <div className="rounded-xl bg-white shadow divide-y divide-gray-100">
          {PLATFORMS.map((platform) => (
            <div key={platform} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-800">{platformLabels[platform]}</span>
              <button
                role="switch"
                aria-label={platformLabels[platform]}
                aria-checked={notifications[platform]}
                onClick={() =>
                  setNotifications((prev) => ({ ...prev, [platform]: !prev[platform] }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  notifications[platform] ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    notifications[platform] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 連携モーダル */}
      {modalPlatform && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
          onClick={() => setModalPlatform(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-t-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-gray-800">
              {platformLabels[modalPlatform]} 連携設定
            </h3>
            <p className="text-sm text-gray-500">
              {connected[modalPlatform]
                ? `${platformLabels[modalPlatform]} との連携を解除しますか？`
                : `${platformLabels[modalPlatform]} と連携します。`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModalPlatform(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={() => toggleConnection(modalPlatform)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium text-white ${
                  connected[modalPlatform] ? 'bg-red-500' : 'bg-blue-500'
                }`}
              >
                {connected[modalPlatform] ? '連携解除' : '連携する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
