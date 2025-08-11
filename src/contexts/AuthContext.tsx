import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  login,
  register,
  getProfile,
  setAuthToken,
  initializeAuth,
  getAuthToken,
} from '../services/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuario si hay token
  useEffect(() => {
    const loadUser = async () => {
      if (initializeAuth()) {
        try {
          const response = await getProfile();
          setUser(response.data.data.user);
        } catch (error) {
          console.error('Error loading user profile:', error);
          setToken(null);
          setAuthToken(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login({ email, password });
      const { user, token } = response.data.data;

      setUser(user);
      setToken(token);
      setAuthToken(token);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await register({ name, email, password });
      const { user, token } = response.data.data;

      setUser(user);
      setToken(token);
      setAuthToken(token);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al registrarse');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error,
    login: loginUser,
    register: registerUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
