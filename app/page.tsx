import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F3] flex flex-col items-center pt-8 pb-24 px-2 md:px-0">
      {/* 頁首 LOGO 與設定/收藏 */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-4">
        <div className="text-xl font-bold tracking-wide text-[#232323]">🔍 台股投資分析助理</div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-[#F5F3EF] transition"><span role="img" aria-label="settings">⚙️</span></button>
          <button className="p-2 rounded-full hover:bg-[#F5F3EF] transition"><span role="img" aria-label="star">⭐</span></button>
        </div>
      </header>

      {/* 今天想了解什麼？輸入區 */}
      <section className="w-full max-w-2xl bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-8">
        <div className="w-full text-lg font-semibold mb-3 flex items-center gap-2">💬 今天想了解什麼？</div>
        <div className="w-full flex items-center gap-2">
          <input
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-[#FAF7F3] text-base outline-none focus:ring-2 focus:ring-primary"
            placeholder="輸入問題..."
          />
          <button className="p-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition flex items-center"><span role="img" aria-label="mic">🎤</span></button>
          <button className="px-5 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition">發送</button>
        </div>
      </section>

      {/* 自選股健康度卡片 */}
      <section className="w-full max-w-3xl bg-white rounded-2xl shadow p-6 mb-8">
        <div className="text-lg font-semibold mb-3 flex items-center gap-2">🤔 你的投資組合今天還好嗎？</div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-2 font-medium">📊 自選股健康度評分</div>
            <div className="mb-2 text-2xl font-bold text-[#DAA574]">⭐⭐⭐⭐⭐ (4.2/5.0)</div>
            <div className="mb-2 font-medium">📈 今日表現 <span className="text-green-600 font-bold">+2.3%</span> <span className="text-gray-500 text-sm">(優於大盤 +1.1%)</span></div>
            <div className="mb-2 font-medium">🎯 焦點個股</div>
            <ul className="mb-2 text-sm text-gray-700">
              <li>• 台積電 (2330) <span className="text-green-600 font-bold">+3.2%</span> 📈</li>
              <li>• 聯發科 (2454) <span className="text-red-500 font-bold">-1.1%</span> 📉</li>
              <li>• 長榮 (2603) <span className="text-green-600 font-bold">+0.8%</span> 📈</li>
            </ul>
            <div className="flex gap-2 mt-2">
              <button className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition">🔍 查看完整分析</button>
              <button className="px-4 py-2 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition">📊 更新自選股</button>
            </div>
          </div>
        </div>
      </section>

      {/* 國際市場動態卡片 */}
      <section className="w-full max-w-3xl bg-white rounded-2xl shadow p-6 mb-8">
        <div className="text-lg font-semibold mb-3 flex items-center gap-2">🌍 國際市場有什麼重要消息？</div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-2 font-medium">📰 重要新聞</div>
            <ul className="mb-2 text-sm text-gray-700">
              <li>• Fed 官員釋放鴿派訊號，美股大漲</li>
              <li>• 中國 Q3 GDP 成長 4.9%，優於預期</li>
              <li>• 日圓貶值至 150，亞股普遍上漲</li>
            </ul>
            <div className="mb-2 font-medium">📊 主要指數</div>
            <ul className="mb-2 text-sm text-gray-700">
              <li>🇺🇸 道瓊 +1.2% | 🇯🇵 日經 +0.8%</li>
              <li>🇨🇳 上證 +0.5% | 🇹🇼 台指 +1.1%</li>
            </ul>
            <div className="flex gap-2 mt-2">
              <button className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition">📰 更多國際新聞</button>
              <button className="px-4 py-2 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition">📈 影響分析</button>
            </div>
          </div>
        </div>
      </section>

      {/* 熱門股排行卡片 */}
      <section className="w-full max-w-3xl bg-white rounded-2xl shadow p-6 mb-8">
        <div className="text-lg font-semibold mb-3 flex items-center gap-2">🔥 今天大家都在關注哪些股票？</div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-2 font-medium">📈 漲幅排行</div>
            <ol className="mb-2 text-sm text-green-700 list-decimal list-inside">
              <li>智原 (3035) +9.8% 🚀</li>
              <li>世芯-KY (3661) +7.2% 📈</li>
              <li>創意 (3443) +6.5% 📈</li>
              <li>聯詠 (3034) +5.8% 📈</li>
              <li>瑞昱 (2379) +4.9% 📈</li>
            </ol>
            <div className="mb-2 font-medium">📉 跌幅排行</div>
            <ol className="mb-2 text-sm text-red-600 list-decimal list-inside">
              <li>大立光 (3008) -3.2% 📉</li>
              <li>玉晶光 (3406) -2.8% 📉</li>
              <li>可成 (2474) -2.1% 📉</li>
            </ol>
            <div className="flex gap-2 mt-2">
              <button className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition">📊 完整排行</button>
              <button className="px-4 py-2 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition">🔍 個股分析</button>
            </div>
          </div>
        </div>
      </section>

      {/* 常見問題卡片 */}
      <section className="w-full max-w-3xl bg-white rounded-2xl shadow p-6 mb-8">
        <div className="text-lg font-semibold mb-3 flex items-center gap-2">💭 常見問題快速解答</div>
        <div className="flex flex-wrap gap-2 mb-2">
          <button className="px-4 py-2 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition">台積電今天為什麼漲？</button>
          <button className="px-4 py-2 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition">大盤會繼續漲嗎？</button>
          <button className="px-4 py-2 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition">外資今天買賣超如何？</button>
          <button className="px-4 py-2 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition">有什麼股票可以關注？</button>
          <button className="px-4 py-2 rounded-xl border border-primary text-primary font-bold hover:bg-primary/10 transition">我的持股該賣嗎？</button>
        </div>
        <button className="mt-2 px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition">更多問題...</button>
      </section>

      {/* 底部導航 */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow z-30">
        <div className="max-w-3xl mx-auto flex justify-between items-center px-6 py-2">
          <div className="flex gap-6 text-2xl">
            <button className="text-primary"><span role="img" aria-label="home">🏠</span></button>
            <button><span role="img" aria-label="chat">💬</span></button>
            <button><span role="img" aria-label="chart">📊</span></button>
            <button><span role="img" aria-label="star">⭐</span></button>
            <button><span role="img" aria-label="user">👤</span></button>
          </div>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>首頁</span>
            <span>聊天</span>
            <span>分析</span>
            <span>收藏</span>
            <span>我的</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
