"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { InvestmentReportCard, InvestmentSection } from '../components/InvestmentReportCard';

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

export default function MVPChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'system' | 'log'; content: string; report?: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

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

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setLoading(true);

    // 關閉舊的 SSE 連線
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // 串接 SSE API
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const url = `${apiBaseUrl}/api/ask-sse?question=${encodeURIComponent(input)}`;
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
    };
    es.addEventListener('end', () => {
      es.close();
      setLoading(false);
    });
    setInput('');
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
                  onBookmark={() => alert('收藏功能開發中')}
                />
              </div>
            ) : msg.role === 'system' ? (
              <div key={idx} className="flex w-full">
                <div className="bg-white text-gray-900 rounded-2xl px-4 py-2 max-w-[85vw] sm:max-w-[70%] text-sm break-words shadow ml-0 mr-auto text-left">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div key={idx} className="flex w-full">
                <div className="text-xs text-gray-400 px-4 py-1 ml-0 mr-auto">{msg.content}</div>
              </div>
            )
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
    </div>
  );
} 