
import React, { createContext, useContext, useState, useEffect } from 'react';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://chatbot-npll.onrender.com';
const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

interface User {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, email?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  currentView: 'user' | 'admin';
  toggleView: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    // Check current user from backend
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      const response = await fetch(getApiUrl('/api/auth/current-user/'), {
        credentials: 'include' // Include cookies for session
      });
      
      console.log('🔍 Auth check response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Auth check response data:', data);
        
        if (data.authenticated) {
          setUser(data.user);
          // Set view based on user role
          const storedView = localStorage.getItem('chatbot_view');
          if (storedView && data.user.is_superuser) {
            setCurrentView(storedView as 'user' | 'admin');
          } else if (data.user.is_superuser) {
            setCurrentView('admin');
          } else {
            setCurrentView('user');
          }
          console.log('✅ User authenticated:', data.user.username);
        } else {
          console.log('❌ User not authenticated');
          setUser(null);
        }
      } else {
        console.log('❌ Auth check failed with status:', response.status);
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setUser(null);
    } finally {
      console.log('🔍 Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(getApiUrl('/api/auth/login/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          // Set initial view based on role
          const initialView = data.user.is_superuser ? 'admin' : 'user';
          setCurrentView(initialView);
          localStorage.setItem('chatbot_view', initialView);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (username: string, password: string, email?: string): Promise<boolean> => {
    try {
      const response = await fetch(getApiUrl('/api/auth/register/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setCurrentView('user');
          localStorage.setItem('chatbot_view', 'user');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(getApiUrl('/api/auth/logout/'), {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    setCurrentView('user');
    localStorage.removeItem('chatbot_view');
    // Redirect to home page
    window.location.href = '/';
  };

  const toggleView = () => {
    if (user?.is_superuser) {
      const newView = currentView === 'admin' ? 'user' : 'admin';
      setCurrentView(newView);
      localStorage.setItem('chatbot_view', newView);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, currentView, toggleView }}>
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
