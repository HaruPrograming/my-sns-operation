import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './components/LoginPage'
import SNSTabBar from './components/SNSTabBar'
import Home from './pages/Home'
import SNSDetail from './pages/SNSDetail'
import Analytics from './pages/Analytics'
import Schedule from './pages/Schedule'
import Settings from './pages/Settings'
import TabBar from './components/TabBar'
import type { SNSTabType, TabType } from './types'

interface AuthenticatedAppProps {
  user: { name: string; avatar?: string }
  onLogout: () => void
}

function AuthenticatedApp({ user, onLogout }: AuthenticatedAppProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab: SNSTabType = (() => {
    if (location.pathname === '/x') return 'x'
    if (location.pathname === '/instagram') return 'instagram'
    if (location.pathname === '/line') return 'line'
    if (location.pathname === '/youtube') return 'youtube'
    return 'all'
  })()

  const activeBottomTab: TabType = (() => {
    if (location.pathname === '/analytics') return 'analytics'
    if (location.pathname === '/schedule') return 'schedule'
    if (location.pathname === '/settings') return 'settings'
    return 'home'
  })()

  const handleSNSTabChange = (tab: SNSTabType) => {
    navigate(tab === 'all' ? '/' : `/${tab}`)
  }

  const handleBottomTabChange = (tab: TabType) => {
    navigate(tab === 'home' ? '/' : `/${tab}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">My SNS</h1>
          <div className="flex items-center gap-3">
            {user.avatar && (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
            )}
            <span className="text-sm text-gray-600">{user.name}</span>
            <button
              onClick={onLogout}
              className="text-sm text-gray-400 hover:text-gray-600 transition"
            >
              ログアウト
            </button>
          </div>
        </header>
        {activeBottomTab === 'home' && (
          <SNSTabBar activeTab={activeTab} onTabChange={handleSNSTabChange} />
        )}
      </div>
      <main className="pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/x" element={<SNSDetail />} />
          <Route path="/instagram" element={<SNSDetail />} />
          <Route path="/line" element={<SNSDetail />} />
          <Route path="/youtube" element={<SNSDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <TabBar activeTab={activeBottomTab} onTabChange={handleBottomTabChange} />
    </div>
  )
}

function App() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <BrowserRouter>
      <AuthenticatedApp user={{ ...user, avatar: user.avatar ?? undefined }} onLogout={logout} />
    </BrowserRouter>
  )
}

export default App
