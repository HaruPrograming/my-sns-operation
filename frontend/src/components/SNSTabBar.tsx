import type { SNSTabType } from '../types'

interface Props {
  activeTab: SNSTabType
  onTabChange: (tab: SNSTabType) => void
}

const tabs: { key: SNSTabType; label: string }[] = [
  { key: 'all', label: '全体' },
  { key: 'x', label: 'X' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'line', label: 'LINE' },
  { key: 'youtube', label: 'YouTube' },
]

export default function SNSTabBar({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex overflow-x-auto border-b border-gray-200 bg-white">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${
            activeTab === key
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
