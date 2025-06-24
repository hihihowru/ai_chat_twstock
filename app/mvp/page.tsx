"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';

const SYSTEM_LOGS = [
  '🔍 擷取新聞資料中…',
  '📈 分析技術線圖中…',
  '🧠 總結觀點中…',
];

export default function MVPChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'system' | 'log'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { role: 'user', content: value }]);
    setInput('');
    setLoading(true);
    // 隨機選一個 log
    const log = SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
    setMessages((prev) => [...prev, { role: 'log', content: log }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.slice(0, -1), // 移除 log
        { role: 'system', content: '這是系統的回覆：' + value },
      ]);
      setLoading(false);
    }, 1000);
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
        <div className="max-w-md mx-auto flex flex-col gap-3 pt-2">
          {messages.map((msg, idx) =>
            msg.role === 'user' ? (
              <div key={idx} className="flex w-full">
                <div className="bg-blue-500 text-white rounded-2xl px-4 py-2 max-w-[85vw] sm:max-w-[70%] text-sm break-words shadow ml-auto mr-0 text-right">
                  {msg.content}
                </div>
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