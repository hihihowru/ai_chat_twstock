'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  watchlist?: string[];
  createdAt: Date;
}

interface StockItem {
  code: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
  industry?: string;
  chartData?: any[];
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (userData: Omit<User, 'id' | 'createdAt'>, token: string) => Promise<User>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addToWatchlist: (stockId: string) => void;
  removeFromWatchlist: (stockId: string) => void;
  watchlist: StockItem[];
  setWatchlist: (list: StockItem[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<StockItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('cmoney_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('cmoney_user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  // fetch CMoney 自選股清單
  const fetchWatchlist = async (token: string) => {
    try {
      const res = await fetch('/api/proxy_custom_group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        },
        body: new URLSearchParams({
          Action: 'getcustomgroupwithorderandlist',
          docType: 'stock'
        })
      });
      const data = await res.json();
      if (data.Group && Array.isArray(data.Group) && data.Group.length > 0) {
        // 只取第一個自選股群組的 ItemList
        const items = data.Group[0].ItemList || [];
        // 這裡假設 ItemList 是股票代碼陣列，實際可根據 API 回傳調整
        setWatchlist(items.map((code: string) => ({ code, name: code })));
      } else {
        setWatchlist([]);
      }
    } catch (e) {
      setWatchlist([]);
    }
  };

  const login = async (userData: Omit<User, 'id' | 'createdAt'>, token: string) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setUser(newUser);
    localStorage.setItem('cmoney_user', JSON.stringify(newUser));
    // 登入後自動 fetch watchlist
    await fetchWatchlist(token);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setWatchlist([]);
    localStorage.removeItem('cmoney_user');
    localStorage.removeItem('cmoney_token');
    localStorage.removeItem('selected_custom_group');
    localStorage.removeItem('custom_stock_list');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('cmoney_user', JSON.stringify(updatedUser));
  };

  const addToWatchlist = (stockId: string) => {
    if (!user) return;
    const updatedWatchlist = [...(user.watchlist || []), stockId];
    updateUser({ watchlist: updatedWatchlist });
  };

  const removeFromWatchlist = (stockId: string) => {
    if (!user) return;
    const updatedWatchlist = (user.watchlist || []).filter(id => id !== stockId);
    updateUser({ watchlist: updatedWatchlist });
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoading,
      isLoggedIn: !!user,
      login,
      logout,
      updateUser,
      addToWatchlist,
      removeFromWatchlist,
      watchlist,
      setWatchlist
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 