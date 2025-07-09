'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, Star, Mic, MessageCircle, BarChart3, TrendingUp, TrendingDown, Target, Globe, Newspaper, Rocket, User } from 'lucide-react';
import StockThumbnail from './components/StockThumbnail';
import IndexThumbnail from './components/IndexThumbnail';
import TabSelector from './components/TabSelector';
import WatchlistPrompt from './components/WatchlistPrompt';
import Sidebar from './components/Sidebar';
import AskQuestionBar from './components/AskQuestionBar';

import { mockWatchlistData, mockIndexData, mockHotStocksData } from './data/mockData';
import { useUserSystem } from './hooks/useUserSystem';

interface Message {
  role: 'user' | 'assistant' | 'system' | 'log';
  content: string;
  timestamp?: Date;
}

interface Conversation {
  id: string;
  question: string;
  response: any;
  timestamp: Date;
}

export default function HomePage() {
  const [activeWatchlistTab, setActiveWatchlistTab] = useState('自選股清單一');
  const [activeHotStocksTab, setActiveHotStocksTab] = useState('強勢股');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 使用自定義 Hook 管理用戶狀態
  const { user, isLoading, isLoggedIn, addToWatchlist, removeFromWatchlist } = useUserSystem();
  const hasWatchlist = user?.watchlist && user.watchlist.length > 0;
  const shouldShowWatchlistSection = isLoggedIn && hasWatchlist;

  // 對話相關狀態
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const watchlistTabs = Object.keys(mockWatchlistData);
  const hotStocksTabs = Object.keys(mockHotStocksData);

  // 處理登入點擊
  const handleLoginClick = () => {
    // TODO: 實現登入邏輯
    console.log('點擊登入按鈕');
  };

  // 處理建立自選股點擊
  const handleCreateWatchlistClick = () => {
    // TODO: 實現建立自選股邏輯
    console.log('點擊建立自選股按鈕');
  };

  // 處理問題提交
  const handleSubmit = async (e?: React.FormEvent, questionText?: string) => {
    console.log('handleSubmit 被調用', { e, questionText, input, isProcessing });
    e?.preventDefault();
    const text = questionText || input;
    console.log('處理的文字:', text);
    if (!text.trim() || isProcessing) {
      console.log('條件檢查失敗:', { textTrim: text.trim(), isProcessing });
      return;
    }

    // 跳轉到 chat 頁面並傳遞問題
    const chatUrl = `/chat?question=${encodeURIComponent(text)}&autoTrigger=true`;
    window.location.href = chatUrl;
  };

  // 處理語音輸入
  const handleMic = () => {
    alert('語音輸入功能開發中');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F3]">
      {/* Sidebar */}
              <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

      {/* 主要內容區域 */}
      <div className="flex flex-col">
        {/* 頁首 LOGO 與設定/收藏 */}
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-4 p-4">
          <div className="text-xl font-bold tracking-wide text-[#232323] flex items-center gap-2">
            <Search size={22} className="text-blue-700" />
            台股投資分析助理
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-[#F5F3EF] transition"><Settings size={20} /></button>
            <button className="p-2 rounded-full hover:bg-[#F5F3EF] transition"><Star size={20} /></button>
          </div>
        </header>

        {/* 今天想了解什麼？輸入區 */}
        <section className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-8">
          <div className="w-full text-lg font-semibold mb-3 flex items-center gap-2">
            <MessageCircle size={20} />
            今天想了解什麼？
          </div>
          <form 
            className="w-full flex items-center gap-2"
            onSubmit={(e) => {
              console.log('Form submitted!', e);
              handleSubmit(e);
            }}
          >
            <input
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-[#FAF7F3] text-base outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="輸入問題..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  console.log('Enter key pressed!');
                  handleSubmit(e);
                }
              }}
              disabled={isProcessing}
            />
            <button 
              type="button"
              className="p-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center"
              onClick={handleMic}
              disabled={isProcessing}
            >
              <Mic size={18} />
            </button>
            <button 
              type="submit"
              className="px-5 py-3 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
              disabled={isProcessing}
            >
              {isProcessing ? '處理中...' : '送出'}
            </button>
          </form>
        </section>



        {/* 自選股健康度檢查 - 條件顯示 */}
        {shouldShowWatchlistSection ? (
          <section className="w-full max-w-5xl mx-auto mb-8">
            <div className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              你的投資組合今天還好嗎？
            </div>
            
            {/* Tab 切換 */}
            <TabSelector
              tabs={watchlistTabs}
              activeTab={activeWatchlistTab}
              onTabChange={setActiveWatchlistTab}
            />

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockWatchlistData[activeWatchlistTab]?.map((stock, index) => (
                <StockThumbnail
                  key={`${stock.code}-${index}`}
                  name={stock.name}
                  code={stock.code}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changePercent}
                  industry={stock.industry}
                  chartData={stock.chartData}
                  onClick={() => handleSubmit(undefined, `${stock.name}今天表現如何？`)}
                  onChartClick={() => console.log(`點擊圖表: ${stock.name}`)}
                />
              ))}
            </div>
          </section>
        ) : (
          // 使用 WatchlistPrompt 組件
          <WatchlistPrompt
            isLoggedIn={isLoggedIn}
            hasWatchlist={hasWatchlist}
            onLoginClick={handleLoginClick}
            onCreateWatchlistClick={handleCreateWatchlistClick}
          />
        )}

        {/* 國際市場動態 */}
        <section className="w-full max-w-5xl mx-auto mb-8">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe size={20} />
            國際市場有什麼重要消息？
          </div>
          
          {/* 指數 Thumbnail Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockIndexData.map((index, indexKey) => (
              <IndexThumbnail
                key={`${index.code}-${indexKey}`}
                name={index.name}
                code={index.code}
                price={index.price}
                change={index.change}
                changePercent={index.changePercent}
                market={index.market}
                chartData={index.chartData}
                onClick={() => handleSubmit(undefined, `${index.name}今天表現如何？`)}
                onChartClick={() => console.log(`點擊圖表: ${index.name}`)}
              />
            ))}
          </div>
        </section>

        {/* 熱門股排行 */}
        <section className="w-full max-w-5xl mx-auto mb-8">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Rocket size={20} />
            今天大家都在關注哪些股票？
          </div>
          
          {/* Tab 切換 */}
          <TabSelector
            tabs={hotStocksTabs}
            activeTab={activeHotStocksTab}
            onTabChange={setActiveHotStocksTab}
          />

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockHotStocksData[activeHotStocksTab]?.map((stock, index) => (
              <StockThumbnail
                key={`${stock.code}-${index}`}
                name={stock.name}
                code={stock.code}
                price={stock.price}
                change={stock.change}
                changePercent={stock.changePercent}
                industry={stock.industry}
                chartData={stock.chartData}
                onClick={() => handleSubmit(undefined, `${stock.name}為什麼漲這麼多？`)}
                onChartClick={() => console.log(`點擊圖表: ${stock.name}`)}
              />
            ))}
          </div>
        </section>

        {/* 常見問題卡片 */}
        <section className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 mb-8">
          <div className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MessageCircle size={20} />
            常見問題快速解答
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <button 
              className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition"
              onClick={() => handleSubmit(undefined, '台積電今天為什麼漲？')}
            >
              台積電今天為什麼漲？
            </button>
            <button 
              className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition"
              onClick={() => handleSubmit(undefined, '大盤會繼續漲嗎？')}
            >
              大盤會繼續漲嗎？
            </button>
            <button 
              className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition"
              onClick={() => handleSubmit(undefined, '外資今天買賣超如何？')}
            >
              外資今天買賣超如何？
            </button>
            <button 
              className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition"
              onClick={() => handleSubmit(undefined, '有什麼股票可以關注？')}
            >
              有什麼股票可以關注？
            </button>
            <button 
              className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition"
              onClick={() => handleSubmit(undefined, '我的持股該賣嗎？')}
            >
              我的持股該賣嗎？
            </button>
          </div>
          <button className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
            更多問題...
          </button>
        </section>

        {/* 底部間距，為固定提問欄留空間 */}
        <div className="h-20"></div>
      </div>

      {/* 固定底部提問欄 */}
      <AskQuestionBar onSubmit={(question) => handleSubmit(undefined, question)} />


    </div>
  );
}
