import React from 'react';
import { User } from 'lucide-react';

export default function WatchlistPrompt({ isLoggedIn, hasWatchlist, onLoginClick, onCreateWatchlistClick }: {
  isLoggedIn: boolean;
  hasWatchlist: boolean;
  onLoginClick: () => void;
  onCreateWatchlistClick: () => void;
}) {
  return (
    <section className="w-full flex justify-center mb-8">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
        <User size={40} className="text-gray-400 mb-4" />
        <div className="text-lg font-semibold mb-2">登入以查看您的投資組合</div>
        <div className="text-gray-500 text-sm mb-4 text-center">
          登入後可以查看自選股健康度檢查和個人化分析
        </div>
        <button
          onClick={onLoginClick}
          className="px-6 py-3 bg-[#B97A57]/80 hover:bg-[#B97A57] text-white rounded-xl font-semibold shadow-md transition-all"
        >
          立即登入
        </button>
      </div>
    </section>
  );
} 