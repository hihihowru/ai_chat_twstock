'use client';

import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, TrendingUp, Settings, User, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState<string>("");

  useEffect(() => {
    // 檢查登入狀態
    const token = localStorage.getItem('cmoney_token');
    if (token) {
      setIsLoggedIn(true);
      setUserToken(token);
    }
  }, []);

  const handleLogin = async (token: string) => {
    setIsLoggedIn(true);
    setUserToken(token);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('cmoney_token');
    localStorage.removeItem('selected_custom_group');
    localStorage.removeItem('custom_stock_list');
    setIsLoggedIn(false);
    setUserToken('');
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-[#F0EDE8]/80 backdrop-blur rounded-lg shadow-lg hover:bg-[#E8E5E0]/80 transition-all"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[#F0EDE8]/90 backdrop-blur-md border-r border-gray-200/50 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-200/50">
          <h1 className="text-xl font-bold text-[#232323]">AI 投資助手</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <a 
              href="/chat" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#E8E5E0]/50 transition-colors text-[#232323]"
            >
              <MessageCircle size={20} />
              <span>AI 聊天</span>
            </a>
            
            <a 
              href="/watchlist" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#E8E5E0]/50 transition-colors text-[#232323]"
            >
              <TrendingUp size={20} />
              <span>自選股</span>
            </a>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200/50">
          {/* Dark/Light Mode Toggle (未來功能) */}
          <div className="mb-4">
            <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg hover:bg-[#E8E5E0]/50 transition-colors text-[#232323]">
              <span>🌙</span>
              <span>深色模式</span>
            </button>
          </div>

          {/* User Section */}
          {isLoggedIn ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#E8E5E0]/30">
                <User size={20} />
                <span className="text-[#232323] font-medium">已登入</span>
              </div>
              
              <button 
                onClick={() => {/* 未來設定頁面 */}}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#E8E5E0]/50 transition-colors text-[#232323]"
              >
                <Settings size={20} />
                <span>設定</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#E8E5E0]/50 transition-colors text-[#232323]"
              >
                <LogOut size={20} />
                <span>登出</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-[#FFB86B] text-white rounded-lg hover:bg-[#FFA54F] transition-colors font-medium"
            >
              <User size={20} />
              <span>會員登入</span>
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={handleLogin} 
      />
    </>
  );
} 