import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await storage.getItem('token');
        const savedUser = await storage.getItem('user');

        if (savedToken) {
          setToken(savedToken);
        }

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.warn('Failed to restore auth session', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (authData: { token: string; user: any }) => {
    setToken(authData.token);
    setUser(authData.user);
    await storage.setItem('token', authData.token);
    await storage.setItem('user', JSON.stringify(authData.user));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await storage.removeItem('token');
    await storage.removeItem('user');
  };

  const value = useMemo(
    () => ({ token, user, login, logout, loading }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}
