'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, Star, Mic, Send, MessageCircle, BarChart3, TrendingUp, TrendingDown, Target, Globe, Newspaper, Rocket, User } from 'lucide-react';
import StockThumbnail from './components/StockThumbnail';
import IndexThumbnail from './components/IndexThumbnail';
import TabSelector from './components/TabSelector';
import WatchlistPrompt from './components/WatchlistPrompt';
import Sidebar from './components/Sidebar';
import AskQuestionBar from './components/AskQuestionBar';
import LoginModal from './components/LoginModal';

import { mockWatchlistData, mockIndexData, mockHotStocksData } from './data/mockData';
import { useUser } from './hooks/UserContext';
import stockAlias from '../data/stock_alias_dict.json';

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // 使用自定義 Hook 管理用戶狀態
  const { user, isLoading, isLoggedIn, watchlist } = useUser();

  // 對話相關狀態
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customGroup, setCustomGroup] = useState<any>(null);
  const [customGroups, setCustomGroups] = useState<any>([]);
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupError, setGroupError] = useState<string | null>(null);
  const token = (typeof window !== 'undefined') ? localStorage.getItem('cmoney_token') : null;

  // 修正 hasWatchlist 判斷邏輯
  const hasWatchlist = customGroup && customGroup.ItemList && customGroup.ItemList.length > 0;
  const shouldShowWatchlistSection = isLoggedIn && hasWatchlist;

  useEffect(() => {
    if (!isLoggedIn) return;
    const token = (typeof window !== 'undefined') ? localStorage.getItem('cmoney_token') : null;
    const fetchCustomGroup = async () => {
      if (!token) {
        setGroupError('尚未取得 token');
        return;
      }
      setGroupLoading(true);
      setGroupError(null);
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
          setCustomGroups(data.Group);
          setCustomGroup(data.Group[0]);
      } else {
          setCustomGroups([]);
          setCustomGroup(null);
          setGroupError('API 無自選股資料');
        }
      } catch (e) {
        setCustomGroups([]);
        setCustomGroup(null);
        setGroupError('API 請求失敗: ' + String(e));
      } finally {
        setGroupLoading(false);
      }
    };
    fetchCustomGroup();
  }, [isLoggedIn]);

  // 處理自選股 tab 切換
  const handleWatchlistTabChange = (tabName: string) => {
    const selectedGroup = customGroups.find(group => group.DocName === tabName);
    if (selectedGroup) {
      setCustomGroup(selectedGroup);
    }
  };

  // 處理一鍵生成自選股分析報告
  const handleGenerateReport = () => {
    if (!customGroup || !customGroup.ItemList) return;
    const stockNames = customGroup.ItemList.map((stockId: string) => {
      return stockAlias[stockId]?.[1] || stockId;
    }).join(', ');
    const question = `自選股分析報告: ${customGroup.DocName} [${stockNames}]`;
    const chatUrl = `/chat?question=${encodeURIComponent(question)}&autoTrigger=true`;
    window.location.href = chatUrl;
  };

  const watchlistTabs = Object.keys(mockWatchlistData);
  const hotStocksTabs = Object.keys(mockHotStocksData);

  // 處理登入點擊
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  // 處理登入成功
  const handleLoginSuccess = (token: string) => {
    setShowLoginModal(false);
    // 重新載入頁面以更新登入狀態
    window.location.reload();
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
        onLoginClick={handleLoginClick}
      />

      {/* 主要內容區域 */}
      <div className="flex flex-col">
        {/* 頁首 LOGO 與設定/收藏 */}
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-4 p-4">
          <div className="text-xl font-bold tracking-wide text-[#232323] flex items-center gap-2">
            <Search size={22} className="text-[#B97A57]" />
            台股投資分析助理
          </div>
          {/* 會員登入按鈕已移除，統一從 sidebar 進行登入 */}
        </header>

        {/* 今天想了解什麼？輸入區 */}
        <section className="w-full max-w-2xl mx-auto flex flex-col items-center mb-8">
          <div className="w-full text-lg font-semibold mb-3 flex items-center gap-2">
            <MessageCircle size={20} />
            今天想了解什麼？
          </div>
          <form 
            className="w-full flex items-center gap-2"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <input
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-base outline-none focus:ring-2 focus:ring-[#B97A57]"
              placeholder="輸入問題..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isProcessing}
            />
            <button 
              type="button"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-md hover:bg-[#B97A57]/10 transition-all"
              onClick={handleMic}
              disabled={isProcessing}
            >
              <Mic size={22} className="text-[#B97A57]" />
            </button>
            <button 
              type="submit"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-md hover:bg-[#B97A57]/10 transition-all"
              disabled={isProcessing}
            >
              <Send size={22} className="text-[#B97A57]" />
            </button>
          </form>
        </section>

        {/* 自選股健康度檢查 - 條件顯示 */}
        {shouldShowWatchlistSection ? (
          <section className="w-full max-w-5xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <div className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 size={20} />
                  你的投資組合今天還好嗎？
                </div>
                <button
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-[#B97A57] hover:bg-[#B97A57]/90 text-white rounded-lg font-medium shadow-md transition-all text-sm sm:text-base"
                >
                  一鍵生成分析報告
                </button>
              </div>
              
              {/* 自選股清單切換 Tabs */}
              {customGroups.length > 1 && (
                <div className="mb-4">
                  <TabSelector
                    tabs={customGroups.map(group => group.DocName)}
                    activeTab={customGroup?.DocName || ''}
                    onTabChange={handleWatchlistTabChange}
                  />
                </div>
              )}
              
              {groupError && (
                <div className="text-red-500 text-sm mb-2">{groupError}</div>
              )}
              {groupLoading ? (
                <div className="text-center text-gray-400 py-8">自選股載入中...</div>
              ) : customGroup && customGroup.ItemList && customGroup.ItemList.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {customGroup.ItemList.map((stockId: string, index: number) => {
                    // 取得股票簡稱：找到第一個不是股票代號的元素
                    const aliases = stockAlias[stockId] || [];
                    const stockName = aliases.find(alias => alias !== stockId) || stockId;
                    
                    return (
                      <StockThumbnail
                        key={stockId}
                        name={stockName}
                        code={stockId}
                        price={0}
                        change={0}
                        changePercent={0}
                        industry={''}
                        chartData={[]}
                        onClick={() => handleSubmit(undefined, `${stockName}今天表現如何？`)}
                        onChartClick={() => {}}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">尚無自選股</div>
              )}
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

        {/* 強勢股（熱門股排行） */}
        <section className="w-full max-w-5xl mx-auto mb-8">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            強勢股
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
                onClick={() => {
                  const chatUrl = `/chat?question=${encodeURIComponent(`${stock.name}今天表現如何？`)}&autoTrigger=true`;
                  window.location.href = chatUrl;
                }}
                onChartClick={() => console.log(`點擊圖表: ${stock.name}`)}
              />
            ))}
          </div>
        </section>

        {/* 國際股市（合併國際市場有什麼重要消息+主要指數） */}
        <section className="w-full max-w-5xl mx-auto mb-8">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe size={20} />
            國際股市
          </div>
          {/* 主要指數 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {mockIndexData.map((index, indexKey) => (
              <IndexThumbnail
                key={indexKey}
                name={index.name}
                code={index.code}
                price={index.price}
                change={index.change}
                changePercent={index.changePercent}
                market={index.market}
                chartData={index.chartData}
                onClick={() => {
                  const chatUrl = `/chat?question=${encodeURIComponent(`${index.name}今天表現如何？`)}&autoTrigger=true`;
                  window.location.href = chatUrl;
                }}
              />
              ))}
            </div>
          </section>

        {/* 熱門話題 */}
        <section className="w-full max-w-5xl mx-auto mb-8">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Newspaper size={20} />
            熱門話題
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
              const chatUrl = `/chat?question=${encodeURIComponent('AI 概念股今天表現如何？')}&autoTrigger=true`;
              window.location.href = chatUrl;
            }}>
              <div className="flex items-center gap-2 mb-2">
                <Rocket size={16} className="text-[#B97A57]" />
                <span className="text-sm font-medium text-gray-600">AI 概念股</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI 概念股集體上漲</h3>
              <p className="text-sm text-gray-600">受惠於 AI 技術發展，相關概念股表現亮眼</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
              const chatUrl = `/chat?question=${encodeURIComponent('半導體產業今天表現如何？')}&autoTrigger=true`;
              window.location.href = chatUrl;
            }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-[#B97A57]" />
                <span className="text-sm font-medium text-gray-600">半導體</span>
        </div>
              <h3 className="font-semibold text-gray-900 mb-1">半導體產業復甦</h3>
              <p className="text-sm text-gray-600">庫存調整結束，需求回溫帶動股價上漲</p>
      </div>
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
              const chatUrl = `/chat?question=${encodeURIComponent('金融股今天表現如何？')}&autoTrigger=true`;
              window.location.href = chatUrl;
            }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={16} className="text-red-500" />
                <span className="text-sm font-medium text-gray-600">金融股</span>
                </div>
              <h3 className="font-semibold text-gray-900 mb-1">金融股小幅回調</h3>
              <p className="text-sm text-gray-600">市場觀望氣氛濃厚，金融股表現相對保守</p>
            </div>
          </div>
        </section>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLoginSuccess} 
      />
    </div>
  );
}
