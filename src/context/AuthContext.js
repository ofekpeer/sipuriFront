import { createContext, useContext, useEffect, useState } from 'react';

import {
  getCurrentUserRequest,
  loginRequest,
  registerRequest,
} from '../services/authApi';

const AuthContext = createContext(null);
const TOKEN_KEY = 'sipuri.authToken';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUserRequest(token);
        setUser(response.data || response.user);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  function startSession(response) {
    const nextToken = response.token || response.data?.token;
    const nextUser = response.user || response.data?.user || response.data;

    if (!nextToken) {
      throw new Error('השרת לא החזיר אסימון התחברות');
    }

    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }

  async function login(email, password) {
    const response = await loginRequest(email, password);
    startSession(response);
  }

  async function register(name, email, password) {
    const response = await registerRequest(name, email, password);
    startSession(response);
  }

  async function completeGoogleLogin(nextToken) {
    const response = await getCurrentUserRequest(nextToken);
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(response.data || response.user);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  const value = { user, token, loading, login, register, completeGoogleLogin, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
