// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/authService';

type AuthContextType = {
  user: { id: string; name: string; email: string } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(u => {
        setUser(u);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const u = await loginUser(email, password);
    setUser({ id: u.id, name: u.name, email: u.email });
  };

  const register = async (name: string, email: string, password: string) => {
    const u = await registerUser(name, email, password);
    setUser({ id: u.id, name: u.name, email: u.email });
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};