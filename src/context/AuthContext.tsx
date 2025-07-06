import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Admin } from '../types';
import { adminAuthService } from '../services/adminAuthService';

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuth = async () => {
    try {
      const adminData = await adminAuthService.getCurrentAdmin();
      if (adminData) {
        setAdmin(adminData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAdmin(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await adminAuthService.login(email, password);
      
      const adminData: Admin = {
        id: response.adminId,
        adminId: response.adminId,
        name: response.name,
        email: response.email,
      };
      
      setAdmin(adminData);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setIsLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adminAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
