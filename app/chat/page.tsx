'use client';
import React, { useState } from 'react';
import StockSnapshotCard from '../components/StockSnapshotCard';
import AskQuestionBar from '../components/AskQuestionBar';

export default function ChatPage() {
  const [page, setPage] = useState<'main' | 'teslaCard'>('main');

  // 熱門話題 mock
  const hotTopics = [
    { label: 'tesla 表現如何（詳細版圖卡）', action: () => setPage('teslaCard') },
    { label: '台積電法說會重點', action: () => alert('台積電法說會重點') },
    { label: 'AI 概念股', action: () => alert('AI 概念股') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 pb-16">
      {page === 'main' && (
        <div className="max-w-md mx-auto pt-4 space-y-6">
          <h2 className="font-bold text-lg mb-2">熱門話題</h2>
          <div className="space-y-2">
            {hotTopics.map((topic, idx) => (
              <button
                key={topic.label}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/80 shadow hover:bg-blue-50 transition font-medium text-gray-800"
                onClick={topic.action}
              >
                {topic.label}
              </button>
            ))}
          </div>
          {/* 這裡可以放聊天訊息或其他內容 */}
        </div>
      )}
      {page === 'teslaCard' && (
        <div className="max-w-xl mx-auto pt-8">
          <StockSnapshotCard />
        </div>
      )}
      <AskQuestionBar onSubmit={q => alert('你問了: ' + q)} />
      {/* FooterNav or chat footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-gray-200 py-3 flex justify-center z-10">
        <button
          className="px-6 py-2 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
          onClick={() => setPage('main')}
        >
          回到主頁
        </button>
      </div>
    </div>
  );
} 