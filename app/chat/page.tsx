"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Mic, Send, Menu, X, MessageCircle, TrendingUp, Settings, User, LogOut } from 'lucide-react';
import { InvestmentReportCard, InvestmentSection } from '../components/InvestmentReportCard';
import WatchlistSummaryCard from '../components/WatchlistSummaryCard';
import AskQuestionBar from '../components/AskQuestionBar';
import LoginModal from '../components/LoginModal';

const sectionColors: Record<string, string> = {
  '📌 問題簡述與事件背景': 'bg-gray-100',
  '📉 股價異動說明': 'bg-yellow-50',
  '📊 財務狀況分析': 'bg-blue-50',
  '🌐 產業與市場環境分析': 'bg-green-50',
  '💡 投資策略建議': 'bg-indigo-50',
  '⚠️ 投資風險提醒': 'bg-red-50',
};

const buttonColor = (text: string) => {
  if (text.includes('短期')) return 'bg-red-500';
  if (text.includes('中期')) return 'bg-yellow-500';
  if (text.includes('長期')) return 'bg-blue-500';
  return 'bg-gray-400';
};

interface ReportData {
  stockName: string;
  stockId: string;
  sections: InvestmentSection[];
}

function isWatchlistSummaryQuestion(q: string) {
  return q.startsWith('自選股摘要:');
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'system' | 'log'; content: string; report?: any; sections?: any[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [displayPrompt, setDisplayPrompt] = useState<string | null>(null);
  const [displayStockList, setDisplayStockList] = useState<string[]>([]);
  const [customGroups, setCustomGroups] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    console.log('[Chat][DEBUG] useEffect 啟動');
    // 防止 React Strict Mode 重複執行
    if (hasInitialized.current) {
      console.log('[Chat][DEBUG] useEffect 已經執行過，跳過重複執行');
      return;
    }
    hasInitialized.current = true;
    
    // 判斷登入狀態（以 localStorage token 為例）
    const token = localStorage.getItem('cmoney_token');
    setIsLoggedIn(!!token);
    if (token) {
      setUserId('user'); // 這裡根據實際登入邏輯設置 userId
    }
    const url = new URL(window.location.href);
    const question = url.searchParams.get('question');
    const autoTrigger = url.searchParams.get('autoTrigger');
    console.log('[Chat][DEBUG] 取得 question:', question, 'autoTrigger:', autoTrigger);
    if (question) {
      setInput(question);
      if (isWatchlistSummaryQuestion(question)) {
        const match = question.match(/\[(.*)\]/);
        if (match) {
          const stockList = match[1].split(',').map(s => s.trim());
          fetch('/stock_alias_dict.json')
            .then(res => res.json())
            .then(aliasMap => {
              const names = stockList.map(id => {
                const aliases = aliasMap[id];
                return aliases && aliases.length > 0 ? `${id} ${aliases[0]}` : id;
              });
              setDisplayPrompt(`自選股摘要`);
              setDisplayStockList(names);
            });
        }
      } else {
        setDisplayPrompt(question);
        setDisplayStockList([]);
      }
      // 只在 autoTrigger=true 時觸發分析
      if (autoTrigger === 'true') {
        console.log('[Chat][DEBUG] autoTrigger=true，準備觸發 handleSend');
        setHasTriggered(true);
        setIsProcessing(true);
        setTimeout(() => {
          handleSend(undefined, question);
          // 移除 autoTrigger 參數避免 refresh 重複觸發
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('autoTrigger');
          window.history.replaceState({}, '', newUrl.toString());
        }, 100);
      }
    }
  }, []); // 只在組件掛載時執行一次

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    // 離開頁面時關閉 SSE
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // 取得自選股清單
  useEffect(() => {
    // 這裡參考 CustomGroupSelector 的 API 呼叫
    const fetchGroups = async () => {
      const res = await fetch('/api/proxy_custom_group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId || 'default' })
      });
      const data = await res.json();
      setCustomGroups(data.groups || []);
    };
    if (userId) fetchGroups();
  }, [userId]);

  const handleSend = async (e?: React.FormEvent, questionText?: string) => {
    e?.preventDefault();
    const text = questionText || input;
    console.log('[Chat][DEBUG] handleSend 啟動, text:', text, 'isProcessing:', isProcessing);
    if (!text.trim()) return;
    
    // 防止重複請求
    if (isProcessing) {
      console.log('[Chat][DEBUG] 正在處理中，跳過重複請求');
      return;
    }
    
    setIsProcessing(true);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    // 關閉舊的 SSE 連線
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    if (isWatchlistSummaryQuestion(text)) {
      console.log('[Chat][DEBUG] 判斷為自選股摘要問題，呼叫 handleWatchlistSummary');
      await handleWatchlistSummary(text);
    } else {
      console.log('[Chat][DEBUG] 處理一般問題，呼叫 handleGeneralQuestion');
      // 處理一般問題
      await handleGeneralQuestion(text);
    }
    
    if (!questionText) {
      setInput('');
    }
  };

  const handleWatchlistSummary = async (question: string) => {
    console.log('[Chat][DEBUG] handleWatchlistSummary 啟動, 問題:', question);
    try {
      // 解析股票清單
      const match = question.match(/\[(.*)\]/);
      if (!match) {
        setMessages((prev) => [...prev, { role: 'system', content: '無法解析股票清單' }]);
        setLoading(false);
        return;
      }

      const stockList = match[1].split(',').map(s => {
        const stockMatch = s.trim().match(/^(\d+)/);
        return stockMatch ? parseInt(stockMatch[1]) : null;
      }).filter(id => id !== null);

      if (stockList.length === 0) {
        setMessages((prev) => [...prev, { role: 'system', content: '沒有有效的股票代號' }]);
        setLoading(false);
        return;
      }

      // 用 EventSource 監聽 SSE log
      const es = new EventSource('/api/watchlist-summary-sse?stock_list=' + encodeURIComponent(JSON.stringify(stockList)));
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.log) {
            console.log('SSE:', data.log);
            setMessages((prev) => [...prev, { role: 'log', content: data.log }]);
          }
          if (data.sections) {
            setMessages((prev) => [...prev, { role: 'system', content: 'watchlist_summary', sections: data.sections }]);
            setLoading(false);
            setIsProcessing(false);
            es.close();
          }
        } catch (e) {}
      };
      es.onerror = () => {
        setLoading(false);
        setIsProcessing(false);
        setMessages((prev) => [...prev, { role: 'system', content: '取得回覆時發生錯誤' }]);
        es.close();
      };
    } catch (error) {
      console.error('Watchlist summary error:', error);
      setMessages((prev) => [...prev, { role: 'system', content: `處理自選股摘要時發生錯誤: ${error}` }]);
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const handleGeneralQuestion = async (question: string) => {
    console.log('[Chat][DEBUG] handleGeneralQuestion 啟動, 問題:', question);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${apiBaseUrl}/api/ask-sse?question=${encodeURIComponent(question)}`;
    console.log('[Chat][DEBUG] SSE 連線 URL:', url);
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      console.log('[Chat][DEBUG] SSE onmessage:', event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.log) {
          setMessages((prev) => [...prev, { role: 'log', content: data.log }]);
        }
        if (data.report) {
          setMessages((prev) => [...prev, { role: 'system', content: 'report', report: data.report }]);
          setLoading(false);
        }
      } catch (err) {
        // 忽略解析錯誤
      }
    };
    es.onerror = (err) => {
      console.log('[Chat][DEBUG] SSE onerror:', err);
      es.close();
      setLoading(false);
      setIsProcessing(false);
    };
    es.addEventListener('end', () => {
      console.log('[Chat][DEBUG] SSE end event');
      es.close();
      setLoading(false);
      setIsProcessing(false);
    });
  };

  const handleLogin = async (token: string) => {
    setIsLoggedIn(true);
    setUserId('user');
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('cmoney_token');
    localStorage.removeItem('selected_custom_group');
    localStorage.removeItem('custom_stock_list');
    setIsLoggedIn(false);
    setUserId('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] flex">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#F0EDE8]/80 backdrop-blur rounded-lg shadow-lg hover:bg-[#E8E5E0]/80 transition-all"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[#F0EDE8]/90 backdrop-blur-md border-r border-gray-200/50 z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-200/50">
          <h1 className="text-xl font-bold text-[#232323]">AI 投資助手</h1>
          <div className="mt-2 p-3 bg-[#E8E5E0]/50 rounded-lg">
            <p className="text-sm font-medium text-[#232323]">New Space</p>
            <p className="text-xs text-gray-600 mt-1">AI 投資分析對話空間</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <a 
              href="/" 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#E8E5E0]/50 transition-colors text-[#232323]"
            >
              <MessageCircle size={20} />
              <span>首頁</span>
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
              className="w-full flex items-center justify-center space-x-2 p-3 bg-[#B97A57]/80 hover:bg-[#B97A57] text-white rounded-xl shadow-md transition-all font-semibold"
            >
              <User size={20} />
              <span>會員登入</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-16">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {/* 顯示 prompt 與股票清單 */}
            
            {/* Messages */}
            {messages.map((msg, idx) =>
              msg.role === 'user' ? (
                <div key={idx} className="flex w-full mb-4">
                  <div className="bg-blue-500 text-white rounded-2xl px-4 py-3 max-w-[85%] text-sm break-words shadow-sm ml-auto">
                    {msg.content}
                  </div>
                </div>
              ) : msg.role === 'system' && msg.content === 'report' ? (
                <div key={idx} className="mb-6">
                  <InvestmentReportCard
                    stockName={msg.report.stockName}
                    stockId={msg.report.stockId}
                    sections={msg.report.sections}
                    paraphrased_prompt={msg.report.paraphrased_prompt}
                    logs={msg.report.logs}
                    onBookmark={() => alert('收藏功能開發中')}
                  />
                </div>
              ) : msg.role === 'system' && msg.content === 'watchlist_summary' ? (
                <div key={idx} className="mb-6">
                  <WatchlistSummaryCard sections={msg.sections || []} />
                  {(!msg.sections || msg.sections.length === 0) && (
                    <div className="text-center text-gray-400 py-8">暫無內容</div>
                  )}
                </div>
              ) : msg.role === 'system' ? (
                <div key={idx} className="flex w-full mb-4">
                  <div className="bg-white/70 backdrop-blur text-gray-900 rounded-2xl px-4 py-3 max-w-[85%] text-sm break-words shadow-sm">
                    {msg.content}
                  </div>
                </div>
              ) : null
            )}
            
            {/* Log Container */}
            <div className="w-full flex justify-center mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium shadow-sm transition-colors"
                onClick={() => setShowLogs(v => !v)}
                type="button"
              >
                {showLogs ? '隱藏分析進度' : '查看分析進度'}
              </button>
            </div>
            
            {showLogs && (
              <div className="w-full max-w-2xl mx-auto mt-4 max-h-60 overflow-y-auto text-xs text-gray-600 bg-white/50 rounded-lg p-4">
                {messages.filter(msg => msg.role === 'log').length === 0 ? (
                  <div className="text-gray-400">目前沒有分析進度</div>
                ) : (
                  messages.filter(msg => msg.role === 'log').map((msg, idx) => (
                    <div key={idx} className="mb-1">{msg.content}</div>
                  ))
                )}
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-6 border-t border-gray-200/50">
          <AskQuestionBar onSubmit={(question) => handleSend(undefined, question)} />
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={handleLogin} 
      />
    </div>
  );
} 