'use client'

import { useState, useEffect, useRef } from 'react'
import { resolveStockId } from '@/lib/resolveStockId'

type ChatMessage = { role: 'user' | 'ai'; content: string }

export default function Page() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<ChatMessage[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const handleSubmit = async () => {
    if (!input.trim()) return

    const userMsg: ChatMessage = { role: 'user', content: input }
    const aiThinking: ChatMessage = { role: 'ai', content: '查詢中，請稍候...' }
    setHistory((prev) => [...prev, userMsg, aiThinking])
    setInput('')

    const stockId = resolveStockId(input)
    if (!stockId) {
      updateLastAIMessage('❗ 無法辨識輸入中的股票代號或名稱，請確認輸入。')
      return
    }

    try {
      const res = await fetch('/api/ask-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, stockId, keyword: input }),
      })
      const data = await res.json()
      if (!data.answer) throw new Error('No answer')
      updateLastAIMessage(data.answer)
    } catch (err) {
      console.error('[Client] fetch error:', err)
      updateLastAIMessage('🚨 查詢過程發生錯誤，請稍後再試。')
    }
  }

  const updateLastAIMessage = (content: string) => {
    setHistory((prev) => {
      const updated = [...prev]
      updated[updated.length - 1] = { role: 'ai', content }
      return updated
    })
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* ✅ Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm sticky top-0 z-10">
        <button className="w-[36px] h-[36px] rounded-[8%] bg-gray-200 flex items-center justify-center text-lg">
          ☰
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <button className="w-[36px] h-[36px] rounded-[8%] bg-gray-100 flex items-center px-2 gap-1 text-sm text-black">
            <img src="/icons/collection.png" className="w-[16px] h-[16px]" />
          </button>
          <button className="w-[36px] h-[36px] rounded-[8%] bg-gray-100 flex items-center px-2 gap-1 text-sm text-black">
            <img src="/icons/share.png" className="w-[16px] h-[16px]" />
          </button>
          <button className="w-[36px] h-[36px] rounded-[8%] bg-gray-200 flex items-center justify-center text-lg">
            ⋯
          </button>
        </div>
      </header>

      {/* ✅ Chat History */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((msg, i) => (
          <div
            key={i}
            className={`text-sm p-3 rounded-lg max-w-[90%] whitespace-pre-line ${
              msg.role === 'user' ? 'bg-blue-100 self-end ml-auto' : 'bg-white self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* ✅ Input */}
      <footer className="sticky bottom-0 bg-white px-4 py-2 flex items-center gap-2 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入提問、股票名稱或代號，幫你做即時新聞事件彙整..."
          className="flex-1 h-[36px] rounded-[8%] px-3 border border-gray-300 focus:outline-none"
        />
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
