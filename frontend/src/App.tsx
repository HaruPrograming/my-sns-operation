import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './components/LoginPage'
import SNSTabBar from './components/SNSTabBar'
import Home from './pages/Home'
import SNSDetail from './pages/SNSDetail'
import type { SNSTabType } from './types'

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

  const handleSNSTabChange = (tab: SNSTabType) => {
    navigate(tab === 'all' ? '/' : `/${tab}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
      <SNSTabBar activeTab={activeTab} onTabChange={handleSNSTabChange} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/x" element={<SNSDetail />} />
          <Route path="/instagram" element={<SNSDetail />} />
          <Route path="/line" element={<SNSDetail />} />
          <Route path="/youtube" element={<SNSDetail />} />
        </Routes>
      </main>
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
      <AuthenticatedApp user={user} onLogout={logout} />
    </BrowserRouter>
  )
}

export default App
