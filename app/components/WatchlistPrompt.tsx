import React from 'react';
import { BarChart3, User, Star } from 'lucide-react';

interface WatchlistPromptProps {
  isLoggedIn: boolean;
  hasWatchlist: boolean;
  onLoginClick?: () => void;
  onCreateWatchlistClick?: () => void;
}

const WatchlistPrompt: React.FC<WatchlistPromptProps> = ({
  isLoggedIn,
  hasWatchlist,
  onLoginClick,
  onCreateWatchlistClick,
}) => {
  return (
    <section className="w-full max-w-5xl mb-8">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          個人化投資組合
        </div>
        
        {!isLoggedIn ? (
          <div className="text-center py-8">
            <User size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2 text-gray-700">登入以查看您的投資組合</h3>
            <p className="text-gray-500 mb-4">登入後可以查看自選股健康度檢查和個人化分析</p>
            <button 
              onClick={onLoginClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              立即登入
            </button>
          </div>
        ) : !hasWatchlist ? (
          <div className="text-center py-8">
            <Star size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2 text-gray-700">建立您的自選股清單</h3>
            <p className="text-gray-500 mb-4">選擇您關注的股票，開始追蹤投資組合表現</p>
            <button 
              onClick={onCreateWatchlistClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              建立自選股
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default WatchlistPrompt; 