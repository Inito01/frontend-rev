import type { AuthResponse, LoginData, RegisterData } from '@/types';
import api from './api';

export const register = async (userData: RegisterData) => {
  return api.post<AuthResponse>('/auth/register', userData);
};

export const login = async (credentials: LoginData) => {
  return api.post<AuthResponse>('/auth/login', credentials);
};

export const getProfile = async () => {
  return api.get<AuthResponse>('/auth/profile');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};
