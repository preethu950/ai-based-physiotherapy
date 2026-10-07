import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import api, { type User } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; ageRange?: string; goal?: string }) => Promise<void>;
  logout: () => void;
  error: string | null;
  fieldErrors: { field: string; message: string }[] | null;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ field: string; message: string }[] | null>(null);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      api.getMe()
        .then(setUser)
        .catch(() => {
          api.setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setFieldErrors(null);
    try {
      const result = await api.login({ email, password });
      api.setToken(result.token);
      setUser(result.user);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; fieldErrors?: { field: string; message: string }[] };
      setError(apiErr.message || 'Login failed');
      setFieldErrors(apiErr.fieldErrors || null);
      throw err;
    }
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; ageRange?: string; goal?: string }) => {
    setError(null);
    setFieldErrors(null);
    try {
      const result = await api.register(data);
      api.setToken(result.token);
      setUser(result.user);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; fieldErrors?: { field: string; message: string }[] };
      setError(apiErr.message || 'Registration failed');
      setFieldErrors(apiErr.fieldErrors || null);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    api.setToken(null);
    setUser(null);
  }, []);

  const clearErrors = useCallback(() => {
    setError(null);
    setFieldErrors(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error, fieldErrors, clearErrors }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
