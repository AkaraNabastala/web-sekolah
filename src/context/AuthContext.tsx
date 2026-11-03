import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { schoolApi } from '../services/api';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateAdminUser: (user: AdminUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('caruy_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('caruy_admin_token') || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const user = await schoolApi.getMe();
          setAdmin(user);
          localStorage.setItem('caruy_admin_user', JSON.stringify(user));
        } catch (err) {
          console.warn('[Auth] Token invalid or expired');
          logout();
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const res = await schoolApi.login({ username, password });
      if (res.success && res.token) {
        setToken(res.token);
        setAdmin(res.user);
        localStorage.setItem('caruy_admin_token', res.token);
        localStorage.setItem('caruy_admin_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: res.message || 'Login gagal.' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal masuk. Periksa kembali username dan password.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('caruy_admin_token');
    localStorage.removeItem('caruy_admin_user');
  };

  const updateAdminUser = (user: AdminUser) => {
    setAdmin(user);
    localStorage.setItem('caruy_admin_user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        isLoading,
        login,
        logout,
        updateAdminUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
