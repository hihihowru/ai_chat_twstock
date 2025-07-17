'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  watchlist?: string[];
  createdAt: Date;
}

export function useUserSystem() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
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

  const login = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('cmoney_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
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

  return {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    addToWatchlist,
    removeFromWatchlist,
    isLoggedIn: !!user
  };
} 