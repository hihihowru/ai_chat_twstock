"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { InvestmentReportCard, InvestmentSection } from '../components/InvestmentReportCard';
import WatchlistSummaryCard from '../components/WatchlistSummaryCard';

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

export default function MVPChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'system' | 'log'; content: string; report?: any; sections?: any[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [displayPrompt, setDisplayPrompt] = useState<string | null>(null);
  const [displayStockList, setDisplayStockList] = useState<string[]>([]);
  const [customGroups, setCustomGroups] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 防止 React Strict Mode 重複執行
    if (hasInitialized.current) {
      console.log('[MVP] useEffect 已經執行過，跳過重複執行');
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
    console.log('[MVP] useEffect 啟動, 取得 question:', question, 'autoTrigger:', autoTrigger);
    if (question) {
      setInput(question);
      if (isWatchlistSummaryQuestion(question)) {
        const match = question.match(/\[(.*)\]/);
        if (match) {
          const stockList = match[1].split(',').map(s => s.trim());
          fetch('/data/stock_alias_dict.json')
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
    console.log('[MVP] handleSend 啟動, text:', text);
    if (!text.trim()) return;
    
    // 防止重複請求
    if (isProcessing) {
      console.log('[MVP] 正在處理中，跳過重複請求');
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
      console.log('[MVP] 判斷為自選股摘要問題，呼叫 handleWatchlistSummary');
      await handleWatchlistSummary(text);
    } else {
      // 處理一般問題
      await handleGeneralQuestion(text);
    }
    
    if (!questionText) {
      setInput('');
    }
  };

  const handleWatchlistSummary = async (question: string) => {
    console.log('[MVP] handleWatchlistSummary 啟動, 問題:', question);
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
    // 串接 SSE API
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const url = `${apiBaseUrl}/api/ask-sse?question=${encodeURIComponent(question)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
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
    es.onerror = () => {
      es.close();
      setLoading(false);
      setIsProcessing(false);
    };
    es.addEventListener('end', () => {
      es.close();
      setLoading(false);
      setIsProcessing(false);
    });
  };

  const handleMic = () => {
    alert('錄音功能開發中');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Breadcrumb */}
      <div className="px-4 pt-4 pb-2 text-xs text-gray-400 font-medium">/mvp</div>
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-2 pb-32 sm:px-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-3 pt-2">
          {/* 新增：顯示 prompt 與股票清單 */}
          {displayPrompt && (
            <div className="mb-2 text-blue-700 text-sm font-mono bg-blue-50 rounded px-3 py-2 w-fit max-w-full break-words shadow">
              {displayPrompt}：[{displayStockList.join(', ')}]
            </div>
          )}
          {messages.map((msg, idx) =>
            msg.role === 'user' ? (
              <div key={idx} className="flex w-full">
                <div className="bg-blue-500 text-white rounded-2xl px-4 py-2 max-w-[85vw] sm:max-w-[70%] text-sm break-words shadow ml-auto mr-0 text-right">
                  {msg.content}
                </div>
              </div>
            ) : msg.role === 'system' && msg.content === 'report' ? (
              <div key={idx} className="mt-6">
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
              <div key={idx} className="mt-6">
                <WatchlistSummaryCard sections={msg.sections || []} />
                {(!msg.sections || msg.sections.length === 0) && (
                  <div className="text-center text-gray-400 py-8">暫無內容</div>
                )}
              </div>
            ) : msg.role === 'system' ? (
              <div key={idx} className="flex w-full">
                <div className="bg-white/70 backdrop-blur text-gray-900 rounded-2xl px-4 py-2 max-w-[85vw] sm:max-w-[70%] text-sm break-words shadow ml-0 mr-auto text-left">
                  {msg.content}
                </div>
              </div>
            ) : null
          )}
          {/* Log Container - 集中顯示所有 log 訊息 */}
          <div className="w-full flex justify-center mt-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs font-medium shadow"
              onClick={() => setShowLogs(v => !v)}
              type="button"
            >
              {showLogs ? '隱藏分析進度' : '查看分析進度'}
            </button>
          </div>
          {showLogs && (
            <div className="w-full max-w-2xl mx-auto mt-2 max-h-60 overflow-y-auto text-xs text-gray-600">
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
      {/* Input bar */}
      <form
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-t border-gray-200 flex items-center px-2 py-2 sm:justify-center"
        onSubmit={handleSend}
      >
        <div className="w-full max-w-md flex gap-2 items-center">
          <input
            className="flex-1 bg-white/70 rounded-xl px-4 py-2 text-sm outline-none border border-gray-200 focus:border-blue-400 transition"
            type="text"
            placeholder="輸入提問、股票名稱或代號..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition"
            onClick={handleMic}
            tabIndex={-1}
            aria-label="錄音"
          >
            <Mic size={20} />
          </button>
          <button
            type="submit"
            className="p-2 rounded-xl bg-blue-600 text-white font-bold text-sm shadow hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
            aria-label="送出"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
      {/* 右上角顯示登入後的按鈕 */}
      <div className="absolute top-4 right-4 z-50">
        {isLoggedIn && (
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-bold">已登入</span>
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium shadow"
              onClick={() => window.location.href = '/watchlist'}
              type="button"
            >
              選擇自選股清單
            </button>
          </div>
        )}
      </div>
      {/* 中間置中顯示『目前沒有分析進度』 */}
      {messages.length === 0 && !loading && (
        <div className="w-full flex justify-center items-center h-64">
          <div className="text-gray-400 text-lg">目前沒有分析進度</div>
        </div>
      )}
    </div>
  );
} 