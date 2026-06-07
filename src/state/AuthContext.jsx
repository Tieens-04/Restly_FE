import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem('apilens_token'));
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(Boolean(token));

  const setToken = useCallback((nextToken) => {
    if (nextToken) {
      localStorage.setItem('apilens_token', nextToken);
    } else {
      localStorage.removeItem('apilens_token');
    }

    setTokenState(nextToken);
  }, []);

  const loadUser = useCallback(async () => {
    if (!localStorage.getItem('apilens_token')) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      setToken(null);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, [setToken]);

  useEffect(() => {
    loadUser();
  }, [loadUser, token]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  const value = useMemo(
    () => ({
      token,
      user,
      loadingUser,
      isAuthenticated: Boolean(token),
      setToken,
      loadUser,
      logout,
    }),
    [token, user, loadingUser, setToken, loadUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
};
