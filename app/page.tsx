'use client'

import { useState, useRef, useEffect } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleSubmit = () => {
    if (!input.trim()) return
    const userMsg = { role: 'user' as const, content: input }
    const aiMsg = {
      role: 'ai' as const,
      content: `這是 AI 回覆：「${input}」`,
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

        {/* 中間選單 */}
        <div className="flex gap-2">
          <button className="w-[80px] h-[36px] rounded-[8%] bg-gray-100 text-gray-700 text-sm flex items-center justify-center gap-1">
            ⭐ 收藏
          </button>
          <button className="w-[80px] h-[36px] rounded-[8%] bg-gray-100 text-gray-700 text-sm flex items-center justify-center gap-1">
            📤 分享
          </button>
        </div>

        {/* ⋯ 更多 */}
        <button className="w-[36px] h-[36px] rounded-[8%] bg-gray-200 flex items-center justify-center text-lg">
          ⋯
        </button>
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
      <footer className="sticky bottom-0 bg-white px-4 py-2 flex items-end gap-2 border-t">
        {/* Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入問題..."
          className="w-[299px] h-[36px] rounded-[8%] px-3 border border-gray-300 focus:outline-none"
        />
        {/* Submit */}
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
