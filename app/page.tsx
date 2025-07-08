'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, TrendingUp, Users } from 'lucide-react'
import ColorPreview from './components/ColorPreview'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // 檢查是否在客戶端環境
  useEffect(() => {
    setIsClient(true)
    // 檢查登入狀態（簡單版本）
    const token = localStorage.getItem('cmoney_token')
    setIsLoggedIn(!!token)
  }, [])

  // 主要 CTA 按鈕
  const MainCTA = () => {
    // 在服務器端渲染時顯示登入按鈕
    if (!isClient) {
      return (
        <button 
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg"
        >
          <Users className="mr-2" size={20} />
          立即登入
        </button>
      )
    }
    
    if (isLoggedIn) {
      return (
        <Link 
          href="/chat"
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          <MessageCircle className="mr-2" size={20} />
          開始 AI 對話
        </Link>
      )
      } else {
      return (
        <button 
          onClick={() => alert('登入功能開發中...')}
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          <Users className="mr-2" size={20} />
          立即登入
        </button>
      )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F3]">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/標題 */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              AI 投資助手
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              智能分析股票，個人化投資建議，讓投資決策更簡單
            </p>
          </div>

          {/* 主要 CTA */}
          <div className="mb-12">
            <MainCTA />
      </div>
      
          {/* 功能特色 */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#F5F3EF]/80 backdrop-blur rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="text-blue-600" size={24} />
                </div>
              <h3 className="text-lg font-semibold mb-2">智能對話</h3>
              <p className="text-gray-600">
                自然語言提問，AI 即時分析股票技術面、籌碼面、基本面
              </p>
            </div>

            <div className="bg-[#F5F3EF]/80 backdrop-blur rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">自選股管理</h3>
              <p className="text-gray-600">
                建立個人投資組合，一鍵獲取多檔股票綜合分析
              </p>
            </div>

            <div className="bg-[#F5F3EF]/80 backdrop-blur rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">個人化體驗</h3>
              <p className="text-gray-600">
                根據投資偏好提供客製化建議，追蹤對話歷史
              </p>
            </div>
          </div>

          {/* 按鈕主色調選擇 */}
          <div className="mt-12">
            <ColorPreview />
          </div>

          {/* 快速開始提示 */}
          <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🚀 快速開始
            </h3>
            <p className="text-blue-700">
              登入後即可開始使用 AI 對話功能，或直接點擊上方按鈕體驗
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-gray-500">
        <p>© 2024 AI 投資助手. 投資有風險，請謹慎決策。</p>
      </div>
    </div>
  )
}
