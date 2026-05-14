import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/services/auth';
import { getUser, removeToken } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  isAdmin: boolean;
  isBarber: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("@SeuCorte:user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem("@SeuCorte:user");
    window.location.href = '/login';
  };

  const isAdmin = user?.role === 'OWNER';
  const isBarber = user?.role === 'BARBER';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isBarber }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
