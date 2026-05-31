import { Home, BarChart2, Calendar, Settings } from 'lucide-react'
import type { TabType } from '../types'

interface Props {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: { key: TabType; label: string; Icon: React.ElementType }[] = [
  { key: 'home', label: 'ホーム', Icon: Home },
  { key: 'analytics', label: '分析', Icon: BarChart2 },
  { key: 'schedule', label: '予定', Icon: Calendar },
  { key: 'settings', label: '設定', Icon: Settings },
]

export default function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex mx-auto">
      {tabs.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs ${
            activeTab === key ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </nav>
  )
}
