import { useState, useEffect } from 'react';

interface UserStatus {
  isLoggedIn: boolean;
  hasWatchlist: boolean;
  isLoading: boolean;
  shouldShowWatchlistSection: boolean;
}

export const useUserStatus = (): UserStatus => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasWatchlist, setHasWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // 1. 檢查登入狀態
        const token = localStorage.getItem('cmoney_token');
        const isUserLoggedIn = !!token;
        setIsLoggedIn(isUserLoggedIn);

        // 2. 如果已登入，檢查是否有自選股清單
        if (isUserLoggedIn) {
          // 檢查本地存儲的自選股清單
          const customStockList = localStorage.getItem('custom_stock_list');
          const selectedCustomGroup = localStorage.getItem('selected_custom_group');
          
          // 如果有自選股清單或已選擇自選股群組，則認為有自選股
          const hasUserWatchlist = !!(customStockList || selectedCustomGroup);
          setHasWatchlist(hasUserWatchlist);
        } else {
          setHasWatchlist(false);
        }
      } catch (error) {
        console.error('檢查用戶狀態時發生錯誤:', error);
        setIsLoggedIn(false);
        setHasWatchlist(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  // 計算是否應該顯示自選股section
  const shouldShowWatchlistSection = isLoggedIn && hasWatchlist;

  return {
    isLoggedIn,
    hasWatchlist,
    isLoading,
    shouldShowWatchlistSection,
  };
}; 