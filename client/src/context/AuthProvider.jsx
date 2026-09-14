import { useCallback, useEffect, useMemo, useState } from 'react';
import { onUnauthorized } from '../api/client';
import { authApi } from '../api/endpoints';
import { clearToken, getToken, setToken } from '../lib/token';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // With a stored token we can't render protected pages until we know who it belongs to
  const [isRestoringSession, setIsRestoringSession] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;

    let cancelled = false;
    authApi
      .getMe()
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) clearToken();
      })
      .finally(() => {
        if (!cancelled) setIsRestoringSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => onUnauthorized(() => setUser(null)), []);

  const startSession = useCallback(({ token, user: signedInUser }) => {
    setToken(token);
    setUser(signedInUser);
    return signedInUser;
  }, []);

  const login = useCallback(
    async (credentials) => startSession(await authApi.login(credentials)),
    [startSession],
  );

  const register = useCallback(
    async (details) => startSession(await authApi.register(details)),
    [startSession],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isRestoringSession, login, register, logout, setUser }),
    [user, isRestoringSession, login, register, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
