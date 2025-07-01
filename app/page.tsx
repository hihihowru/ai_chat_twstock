'use client'

import { useState, useEffect, useRef } from 'react'
import React from "react";
import { ReplyCardHorizontalGlass, ReplyCardVertical } from "./components/ReplyCard";
import FooterNav from "./components/FooterNav";
import { MediatekSnapshotCard } from "./components/StockSnapshotCard";
import SelectedGroupDisplay from "./components/SelectedGroupDisplay";

const marketIndices = [
  { name: 'NASDAQ', img: '/icons/nasdaq.png' }, 
  { name: 'S&P 500', img: '/icons/sp500.png' },
  { name: '日經225', img: '/icons/nikkei.png' },
  { name: '上證A股', img: '/icons/sse.png' },
];

const hotStocks = [
  { code: '2330', name: '台積電', change: '+3.2%', volume: '89,000', price: '850' },
  { code: '2303', name: '聯電', change: '+9.8%', volume: '120,000', price: '56.2' },
  { code: '2317', name: '鴻海', change: '+1.5%', volume: '65,000', price: '120.5' },
  { code: '2881', name: '富邦金', change: '-0.8%', volume: '32,000', price: '78.3' },
];

const hotQuestions = [
  { label: '聯電漲停板（橫式卡片）', value: '聯電漲停板', layout: 'horizontal' },
  { label: '台積電漲停板（直式卡片）', value: '台積電漲停板', layout: 'vertical' },
  { label: 'AI 概念股還能追嗎？（單卡片）', value: 'AI 概念股還能追嗎？', layout: 'single' },
  { label: '外資今天買超哪些股票？（純文字）', value: '外資今天買超哪些股票？', layout: 'text' },
  { label: '聯發科表現怎麼樣？(網頁版圖卡示範）', value: '聯發科表現怎麼樣？', layout: 'mediatek' },
];

const mockCardsHorizontal = [
  {
    type: "技術分析",
    image: "/icons/collection.png",
    summary: "短線均線多頭排列，成交量放大，技術面偏多。",
    footer: <span className="text-xs text-gray-500">資料來源：TradingView</span>,
  },
  {
    type: "新聞摘要",
    image: "/icons/collection.png",
    summary: "聯電今日漲停，法人看好先進製程，外資連續買超。",
    footer: <span className="text-xs text-gray-500">資料來源：經濟日報</span>,
  },
  {
    type: "籌碼分析",
    image: "/icons/collection.png",
    summary: "外資+12,000張，投信+2,000張，自營商-500張。",
    footer: <span className="text-xs text-gray-500">資料來源：CMoney</span>,
  },
  {
    type: "AI 總結",
    image: "/icons/collection.png",
    summary: "技術面與籌碼面皆多方，短線有望續強，建議留意法人動向。",
    footer: <span className="text-xs text-purple-700">追問</span>,
  },
];

const mockCardsVertical = [
  {
    type: "技術分析",
    image: "/icons/collection.png",
    summary: "台積電短線均線多頭排列，成交量放大，技術面偏多。",
    footer: <span className="text-xs text-gray-500">資料來源：TradingView</span>,
  },
  {
    type: "新聞摘要",
    image: "/icons/collection.png",
    summary: "台積電今日漲停板，市場熱議 AI 應用，外資大舉買進。",
    footer: <span className="text-xs text-gray-500">資料來源：工商時報</span>,
  },
  {
    type: "籌碼分析",
    image: "/icons/collection.png",
    summary: "外資+25,000張，投信+5,000張，自營商+1,000張。",
    footer: <span className="text-xs text-gray-500">資料來源：CMoney</span>,
  },
  {
    type: "AI 總結",
    image: "/icons/collection.png",
    summary: "台積電技術面與籌碼面皆強勢，AI 應用題材持續發酵。",
    footer: <span className="text-xs text-purple-700">追問</span>,
  },
];

const mockSingleCard = [
  {
    type: "AI 回答",
    image: "/icons/collection.png",
    summary: "AI 概念股短線漲多，建議留意基本面與籌碼變化，勿追高殺低。",
    footer: <span className="text-xs text-purple-700">追問</span>,
  },
];

const mockTeslaCards = [
  {
    type: '技術分析',
    image: '/mock/tesla_chart.png',
    summary: '股價近期震盪走高，均線多頭排列，技術面偏多。',
    footer: <span className="text-xs text-gray-500">資料來源：TradingView</span>,
  },
  {
    type: '新聞摘要',
    image: '/mock/tesla_news.png',
    summary: 'Tesla 最新財報優於預期，市場信心回溫。',
    footer: <span className="text-xs text-gray-500">資料來源：路透社</span>,
  },
  {
    type: '籌碼分析',
    image: '/mock/tesla_fund.png',
    summary: '外資持續加碼，法人看好未來成長。',
    footer: <span className="text-xs text-gray-500">資料來源：CMoney</span>,
  },
  {
    type: 'AI 總結',
    image: '/mock/ai_summary.png',
    summary: '技術面與基本面皆佳，短線有望續強。',
    footer: <span className="text-xs text-purple-700">追問</span>,
  },
];

export default function Page() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const handleSubmit = async (val?: string, layout?: string) => {
    const value = typeof val === 'string' ? val : input;
    if (!value.trim()) return
    setHistory((prev) => [...prev, { role: 'user', content: value }])
    setInput('')
    setTimeout(() => {
      if (layout === 'horizontal' || value.includes('聯電漲停板')) {
        setHistory((prev) => [
          ...prev,
          { role: 'ai', content: { type: 'cards', cards: mockCardsHorizontal, layout: 'horizontal' } },
        ])
      } else if (layout === 'vertical' || value.includes('台積電漲停板')) {
        setHistory((prev) => [
          ...prev,
          { role: 'ai', content: { type: 'cards', cards: mockCardsVertical, layout: 'vertical' } },
        ])
      } else if (layout === 'single') {
        setHistory((prev) => [
          ...prev,
          { role: 'ai', content: { type: 'cards', cards: mockSingleCard, layout: 'vertical' } },
        ])
      } else if (layout === 'mediatek' || value.includes('聯發科')) {
        setHistory((prev) => [
          ...prev,
          { role: 'ai', content: { type: 'mediatekCard' } },
        ])
      } else {
        setHistory((prev) => [
          ...prev,
          { role: 'ai', content: '這是 AI 的回覆：' + value },
        ])
      }
    }, 600)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      {/* 自選股清單顯示 */}
      <div className="p-6">
        <SelectedGroupDisplay />
      </div>
      
      {/* 資訊區（上方） */}
      <div className={`transition-all duration-500 ${history.length > 0 ? 'max-h-32 overflow-hidden opacity-60' : 'max-h-[600px] opacity-100'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">AI 投資摘要</h1>
          {/* Section 1: 市場動態 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-2">市場動態</h2>
            <div className="flex gap-4 overflow-x-auto">
              {marketIndices.map(idx => (
                <div key={idx.name} className="bg-white/60 backdrop-blur rounded-xl shadow p-4 min-w-[120px] flex flex-col items-center">
                  <img src={idx.img} alt={idx.name} className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium">{idx.name}</span>
                </div>
              ))}
            </div>
          </section>
          {/* Section 2: 熱門股排行 */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-2">熱門股排行</h2>
            <div className="bg-white/60 backdrop-blur rounded-xl shadow divide-y">
              {hotStocks.map(stock => (
                <button
                  key={stock.code}
                  className="flex w-full items-center px-4 py-2 hover:bg-blue-50 transition"
                  onClick={() => handleSubmit(`${stock.name}漲停板`, stock.name === '台積電' ? 'vertical' : 'horizontal')}
                >
                  <span className="w-14 font-mono text-blue-700">{stock.code}</span>
                  <span className="flex-1 text-left">{stock.name}</span>
                  <span className={`w-16 text-right ${stock.change.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>{stock.change}</span>
                  <span className="w-20 text-right text-gray-500">{stock.volume}</span>
                  <span className="w-16 text-right font-bold">{stock.price}</span>
                </button>
              ))}
            </div>
          </section>
          {/* Section 3: 熱門問題 */}
          <section>
            <h2 className="text-lg font-semibold mb-2">熱門問題</h2>
            <div className="flex flex-wrap gap-2">
              {hotQuestions.map(q => (
                <button
                  key={q.value}
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  onClick={() => handleSubmit(q.value, q.layout)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
      {/* 對話區（下方） */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[90%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
            >
              {msg.role === 'ai' && typeof msg.content === 'object' && msg.content.type === 'mediatekCard' ? (
                <MediatekSnapshotCard />
              ) : msg.role === 'ai' && typeof msg.content === 'object' && msg.content.type === 'cards' ? (
                msg.content.layout === 'vertical' ? (
                  msg.content.whiteTheme ? (
                    <div className="w-full max-w-xl mx-auto">
                      <div className="bg-white/70 backdrop-blur rounded-xl shadow-lg p-4 w-full">
                        <div className="flex items-center mb-2">
                          <img src="/mock/tesla_logo.png" alt="Tesla" className="w-8 h-8 rounded-full mr-2" />
                          <span className="font-bold text-gray-700">Tesla</span>
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">美股</span>
                        </div>
                        <div className="text-lg font-medium mb-1">Tesla 表現怎麼樣？</div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">TSLA</span>
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">電動車</span>
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">財報</span>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-gray-50 rounded p-2">
                            <div className="flex items-center mb-1">
                              <img src="/mock/tesla_chart.png" alt="技術分析" className="w-6 h-6 mr-2" />
                              <span className="font-semibold text-blue-700 text-xs">技術分析</span>
                            </div>
                            <div className="text-sm mb-1">股價近期震盪走高，均線多頭排列，技術面偏多。</div>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="flex items-center mb-1">
                              <img src="/mock/tesla_news.png" alt="新聞摘要" className="w-6 h-6 mr-2" />
                              <span className="font-semibold text-yellow-700 text-xs">新聞摘要</span>
                            </div>
                            <div className="text-sm mb-1">Tesla 最新財報優於預期，市場信心回溫。</div>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="flex items-center mb-1">
                              <img src="/mock/tesla_fund.png" alt="籌碼分析" className="w-6 h-6 mr-2" />
                              <span className="font-semibold text-green-700 text-xs">籌碼分析</span>
                            </div>
                            <div className="text-sm mb-1">外資持續加碼，法人看好未來成長。</div>
                          </div>
                          <div className="bg-blue-50 rounded p-2">
                            <div className="flex items-center mb-1">
                              <img src="/mock/ai_summary.png" alt="AI 總結" className="w-6 h-6 mr-2" />
                              <span className="font-semibold text-blue-700 text-xs">AI 總結</span>
                            </div>
                            <div className="text-sm mb-1">技術面與基本面皆佳，短線有望續強。</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ReplyCardVertical cards={msg.content.cards} />
                  )
                ) : (
                  <ReplyCardHorizontalGlass cards={msg.content.cards} />
                )
              ) : (
                <div
                  className={`text-sm p-3 rounded-lg whitespace-pre-line ${msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-white/80 text-gray-800'}`}
                >
                  {msg.content}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </main>
        <form
          className="flex gap-2 p-4 border-t bg-white/80 backdrop-blur"
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            className="flex-1 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="請輸入你的投資問題..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            送出
          </button>
        </form>
      </div>
      <FooterNav active="chat" />
    </div>
  )
}
