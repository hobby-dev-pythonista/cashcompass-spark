import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/apiTypes';
import { loginRequest, logoutRequest } from '../services/apiRequest';
import { LoginRequest } from '../types/apiTypes';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token on app start
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await loginRequest(credentials);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Welcome back!",
          description: `Logged in as ${userData.name}`,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};