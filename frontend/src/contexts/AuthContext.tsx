import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { XTweet } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

type User = {
  name: string;
  email: string;
  avatar: string | null;
  x_connected: boolean;
};

export type XProfile = {
  username: string;
  name: string;
  followers: number;
  following: number;
  tweet_count: number;
  avatar: string | null;
};

export type XFollowerPoint = { date: string; count: number };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  xProfile: XProfile | null;
  xTweets: XTweet[];
  xFollowerHistory: XFollowerPoint[];
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [xProfile, setXProfile] = useState<XProfile | null>(null);
  const [xTweets, setXTweets] = useState<XTweet[]>([]);
  const [xFollowerHistory, setXFollowerHistory] = useState<XFollowerPoint[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timer);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user?.x_connected) return;
    fetch(`${API_BASE}/sns/x/profile`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.connected) setXProfile(data); })
      .catch(() => {});
    fetch(`${API_BASE}/sns/x/tweets`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.tweets) setXTweets(data.tweets); })
      .catch(() => {});
    fetch(`${API_BASE}/sns/x/follower-history`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.data?.length) setXFollowerHistory(data.data); })
      .catch(() => {});
  }, [user?.x_connected]);

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
    setUser(null);
    setXProfile(null);
    setXTweets([]);
    setXFollowerHistory([]);
  };

  return (
    <AuthContext.Provider value={{ user, loading, xProfile, xTweets, xFollowerHistory, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
