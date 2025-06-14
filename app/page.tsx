'use client'
import { useState, useRef, useEffect } from 'react'

const replies = [
  "電動車（EV）相關股票：隨著全球電動車市場的快速增長，台灣許多相關企業受惠於這個趨勢，包括電池製造商、電動車零組件供應商與充電設施建設公司。"
]

export default function Home() {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState<{ role: 'user' | 'gpt', content: string }[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  const ask = async () => {
    if (!question.trim()) return
    setHistory(prev => [
      ...prev,
      { role: 'user', content: question },
      { role: 'gpt', content: replies[0] }
    ])
    setQuestion('')
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm sticky top-0 z-10">
        <button className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">☰</button>
        <div className="flex gap-2 overflow-x-auto px-2">
          <button className="text-sm py-1 px-3 rounded-full bg-black text-white whitespace-nowrap">專業語氣</button>
          <button className="text-sm py-1 px-3 rounded-full bg-gray-100 text-gray-700 whitespace-nowrap">收藏</button>
        </div>
        <button className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">⋯</button>
      </header>

      {/* Main 內容區 */}
      <main className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.map((msg, i) =>
            msg.role === 'user' ? (
              <div key={i} className="text-white bg-gray-800 p-3 rounded-xl self-end max-w-[75%] ml-auto">
                {msg.content}
              </div>
            ) : (
              <div key={i} className="bg-white p-4 rounded-xl shadow border text-sm text-gray-800 space-y-2">
                <p>{msg.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-2 text-gray-400">
                    <button>👍</button>
                    <button>👎</button>
                  </div>
                  <span className="text-xs text-gray-400">我們已經收到反饋！</span>
                </div>
              </div>
            )
          )}
          <div ref={bottomRef} />
        </div>

        {/* Footer 輸入欄 */}
        <div className="sticky bottom-0 w-full bg-white p-3 border-t flex items-center gap-2">
          <input
            className="flex-1 border px-4 py-2 rounded-full text-sm"
            placeholder="輸入問題"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={ask} className="text-white bg-black p-2 rounded-full">
            ➤
          </button>
        </div>
      </main>
    </>
  )
}
