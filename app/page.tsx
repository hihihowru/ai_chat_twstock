'use client'

import { useState, useRef, useEffect } from 'react'
import { resolveStockCode } from '../lib/alias'
import { fetchCmoneyNews } from '../lib/news'

export default function Home() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  

const handleSubmit = async () => {
  if (!input.trim()) return

  const userMsg = { role: 'user' as const, content: input }
  const stockId = resolveStockCode(input)

  let aiMsg = {
    role: 'ai' as const,
    content: '目前無法辨識這檔股票，請再提供一次股票名稱或代號。',
  }

  if (stockId) {
    const news = await fetchCmoneyNews(stockId)
    if (news.length > 0) {
      const summary = news
        .slice(0, 3)
        .map((n) => `📰 [${n.time}]\n${n.title}`)
        .join('\n\n')
      aiMsg = {
        role: 'ai' as const,
        content: `根據 CMoney 新聞，${stockId} 近期可能受到以下事件影響：\n\n${summary}`,
      }
    } else {
      aiMsg = {
        role: 'ai' as const,
        content: `找不到 ${stockId} 的即時新聞資料，請稍後再試。`,
      }
    }
  }

  setHistory((prev) => [...prev, userMsg, aiMsg])
  setInput('')
}


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm sticky top-0 z-10">
        {/* ☰ 漢堡 */}
        <button className="w-[36px] h-[36px] rounded-[8%] bg-gray-200 flex items-center justify-center text-lg">
          ☰
        </button>

        {/* 右側：收藏、分享、更多 */}
        <div className="flex items-center gap-2 ml-auto">
          {/* 收藏 */}
          <button className="w-[80px] h-[36px] rounded-[8%] bg-gray-100 flex items-center justify-center">
            <img src="/icons/collection.png" alt="收藏" className="w-[18px] h-[18px]" />
            收藏
          </button>
          {/* 分享 */}
          <button className="w-[80px] h-[36px] rounded-[8%] bg-gray-100 flex items-center justify-center">
            <img src="/icons/share.png" alt="分享" className="w-[18px] h-[18px]" />
            分享
          </button>
          {/* ⋯ 更多 */}
          <button className="w-[36px] h-[36px] rounded-[8%] bg-gray-200 flex items-center justify-center text-lg">
            ⋯
          </button>
        </div>
      </header>


      {/* Chat Content */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 space-y-4">
        {history.map((msg, i) => (
          <div
            key={i}
            className={`rounded-[8%] px-3 py-2 max-w-[80%] text-sm ${
              msg.role === 'user'
                ? 'bg-black text-white self-end ml-auto'
                : 'bg-white text-gray-800 self-start mr-auto border'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white px-4 py-2 flex items-center gap-2 border-t">
        {/* 輸入欄位 */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入問題..."
          className="flex-1 h-[36px] rounded-[8%] px-3 border border-gray-300 focus:outline-none"
        />
        {/* 送出按鈕 */}
        <button
          onClick={handleSubmit}
          className="w-[36px] h-[36px] rounded-[8%] bg-black text-white flex items-center justify-center text-lg"
        >
          ➤
        </button>
      </footer>

    </div>
  )
}
