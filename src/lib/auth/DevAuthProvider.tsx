import React, { createContext, useContext, useState } from 'react';
import { AccountInfo } from '@azure/msal-browser';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUser: AccountInfo = {
  homeAccountId: 'dev-account',
  localAccountId: 'dev-local',
  environment: 'development',
  tenantId: 'dev-tenant',
  username: 'dev@example.com',
  name: 'Development User',
};

export const DevAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AccountInfo | null>(null);

  const login = async () => {
    setIsAuthenticated(true);
    setUser(mockUser);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const getToken = async () => {
    return 'dev-token';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a DevAuthProvider');
  }
  return context;
};