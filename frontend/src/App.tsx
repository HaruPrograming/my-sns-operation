import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

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
            onClick={logout}
            className="text-sm text-gray-400 hover:text-gray-600 transition"
          >
            ログアウト
          </button>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-8">
        <p className="text-center text-gray-400">ここにコンテンツが入ります</p>
      </main>
    </div>
  );
}

export default App;
