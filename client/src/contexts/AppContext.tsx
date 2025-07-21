import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, EmergencyNotification } from '@shared/schema';

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  currentPage: string;
  emergencyNotifications: EmergencyNotification[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCurrentPage: (page: string) => void;
  addEmergencyNotification: (notification: EmergencyNotification) => void;
  removeEmergencyNotification: (id: number) => void;
  isPageBlinking: boolean;
  setIsPageBlinking: (blinking: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [emergencyNotifications, setEmergencyNotifications] = useState<EmergencyNotification[]>([]);
  const [isPageBlinking, setIsPageBlinking] = useState(false);

  const isAdmin = user?.isAdmin || false;

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  }, []);

  const addEmergencyNotification = useCallback((notification: EmergencyNotification) => {
    setEmergencyNotifications(prev => [...prev, notification]);
  }, []);

  const removeEmergencyNotification = useCallback((id: number) => {
    setEmergencyNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Page blinking effect for emergency notifications
  useEffect(() => {
    if (isPageBlinking) {
      const originalTitle = document.title;
      let isBlinking = false;
      
      const interval = setInterval(() => {
        isBlinking = !isBlinking;
        document.title = isBlinking ? '🚨 EMERGÊNCIA - Portal Interno' : originalTitle;
      }, 500);

      return () => {
        clearInterval(interval);
        document.title = originalTitle;
      };
    }
  }, [isPageBlinking]);

  // Check for active emergency notifications on login
  useEffect(() => {
    if (isLoggedIn) {
      const checkEmergencyNotifications = async () => {
        try {
          const response = await fetch('/api/emergency-notifications');
          if (response.ok) {
            const notifications = await response.json();
            setEmergencyNotifications(notifications);
          }
        } catch (error) {
          console.error('Error fetching emergency notifications:', error);
        }
      };
      
      checkEmergencyNotifications();
    }
  }, [isLoggedIn]);

  const value = {
    user,
    isLoggedIn,
    isAdmin,
    currentPage,
    emergencyNotifications,
    login,
    logout,
    setCurrentPage,
    addEmergencyNotification,
    removeEmergencyNotification,
    isPageBlinking,
    setIsPageBlinking,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
