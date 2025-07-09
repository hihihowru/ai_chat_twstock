import React from 'react';
import { MoreHorizontal } from 'lucide-react';

// 股票資訊卡元件
export default function StockSnapshotCard({
  name = 'Tesla, Inc.',
  symbol = 'NASDAQ: TSLA',
  price = 322.16,
  change = 0.11,
  changePercent = 0.03,
  afterHours = 0.55,
  afterHoursPercent = 0.17,
  prevClose = 322.05,
  dayRange = '317.78 - 332.36',
  peRatio = 183.1,
  volume = '34.688B',
  eps = 1.76,
  marketCap = '1.04T',
  open = 327.81,
  range52w = '182.00 - 488.54',
  dividend = '0.00%',
  chartData = [], // 未來可串接圖表資料
}: {
  name?: string;
  symbol?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  afterHours?: number;
  afterHoursPercent?: number;
  prevClose?: number;
  dayRange?: string;
  peRatio?: number;
  volume?: string;
  eps?: number;
  marketCap?: string;
  open?: number;
  range52w?: string;
  dividend?: string;
  chartData?: any[];
}) {
  const isUp = change > 0;
  const isAfterUp = afterHours > 0;
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-white/40 text-gray-900 p-6 flex flex-col gap-4">
      {/* 股票基本資訊區 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-lg">{name}</div>
          <div className="text-xs text-gray-500">{symbol}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-200 transition">+ 追蹤</button>
          <button className="p-1 rounded hover:bg-gray-200"><MoreHorizontal size={20} /></button>
        </div>
      </div>
      {/* 股價區 */}
      <div className="flex items-end gap-4">
        <div>
          <div className="text-3xl font-bold">${price.toFixed(2)}</div>
          <div className={`text-sm font-bold ${isUp ? 'text-red-600' : 'text-green-500'}`}>{isUp ? '+' : ''}{change.toFixed(2)} ({isUp ? '+' : ''}{(changePercent * 100).toFixed(2)}%)</div>
          <div className={`text-xs ${isAfterUp ? 'text-red-500' : 'text-green-400'}`}>盤後 {isAfterUp ? '+' : ''}{afterHours.toFixed(2)} ({isAfterUp ? '+' : ''}{(afterHoursPercent * 100).toFixed(2)}%)</div>
        </div>
        {/* 圖表區 Placeholder */}
        <div className="flex-1 flex flex-col items-end">
          {/* 時間區段選擇 */}
          <div className="flex gap-2 mb-1">
            {['1D','5D','1M','6M','YTD','1Y','5Y','MAX'].map(t => (
              <button key={t} className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-600 hover:bg-blue-100 transition">{t}</button>
            ))}
          </div>
          {/* 簡易折線圖 Placeholder */}
          <div className="w-64 h-20 bg-white/60 rounded relative flex items-end shadow-inner">
            {/* dotted line for Prev Close */}
            <div className="absolute left-0 right-0 top-1/2 border-t border-dotted border-blue-200" style={{zIndex:1}} />
            {/* 假資料線條 */}
            <svg width="100%" height="100%" viewBox="0 0 256 64" className="absolute left-0 top-0">
              <polyline points="0,40 32,20 64,50 96,30 128,40 160,20 192,50 224,30 256,40" fill="none" stroke="#60a5fa" strokeWidth="2" />
            </svg>
            {/* 時間軸 */}
            <div className="absolute left-2 bottom-1 text-xs text-gray-400">9AM</div>
            <div className="absolute right-2 bottom-1 text-xs text-gray-400">3PM</div>
          </div>
        </div>
      </div>
      {/* 資訊區塊 */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        {/* 左側 */}
        <div className="space-y-1 text-sm">
          <div>前收盤價：<span className="font-mono">${prevClose}</span></div>
          <div>日區間：<span className="font-mono">{dayRange}</span></div>
          <div>本益比：<span className="font-mono">{peRatio}</span></div>
          <div>24H 成交量：<span className="font-mono">{volume}</span></div>
          <div>每股盈餘 EPS：<span className="font-mono">{eps}</span></div>
        </div>
        {/* 右側 */}
        <div className="space-y-1 text-sm">
          <div>市值：<span className="font-mono">{marketCap}</span></div>
          <div>開盤價：<span className="font-mono">${open}</span></div>
          <div>52週區間：<span className="font-mono">{range52w}</span></div>
          <div>殖利率：<span className="font-mono">{dividend}</span></div>
        </div>
      </div>
      {/* 其他擴充欄位可加在這裡 */}
    </div>
  );
}

// 新增：聯發科（MediaTek）白色主題卡片範例
export function MediatekSnapshotCard() {
  // 假資料
  const isUp = true;
  const isAfterUp = false;
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-white/40 text-gray-900 p-6 flex flex-col gap-4">
      {/* 股票基本資訊區 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/mock/mediatek_logo.png" alt="聯發科" className="w-8 h-8 rounded" />
          <div>
            <div className="font-bold text-lg">聯發科</div>
            <div className="text-xs text-gray-500">TPE: 2454</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-200 transition">+ 追蹤</button>
          <button className="p-1 rounded hover:bg-gray-200"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg></button>
        </div>
      </div>
      {/* 股價區 */}
      <div className="flex items-end gap-4">
        <div>
          <div className="text-3xl font-bold">$1,200.50</div>
          <div className="text-sm font-bold text-red-600">+15.00 (+1.27%)</div>
          <div className="text-xs text-green-400">盤後 -2.00 (-0.17%)</div>
        </div>
        {/* 圖表區 Placeholder */}
        <div className="flex-1 flex flex-col items-end">
          {/* 時間區段選擇 */}
          <div className="flex gap-2 mb-1">
            {['1D','5D','1M','6M','YTD','1Y','5Y','MAX'].map(t => (
              <button key={t} className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-600 hover:bg-blue-100 transition">{t}</button>
            ))}
          </div>
          {/* 簡易折線圖 Placeholder */}
          <div className="w-64 h-20 bg-white/60 rounded relative flex items-end shadow-inner">
            {/* dotted line for Prev Close */}
            <div className="absolute left-0 right-0 top-1/2 border-t border-dotted border-blue-200" style={{zIndex:1}} />
            {/* 假資料線條 */}
            <svg width="100%" height="100%" viewBox="0 0 256 64" className="absolute left-0 top-0">
              <polyline points="0,40 32,20 64,50 96,30 128,40 160,20 192,50 224,30 256,40" fill="none" stroke="#60a5fa" strokeWidth="2" />
            </svg>
            {/* 時間軸 */}
            <div className="absolute left-2 bottom-1 text-xs text-gray-400">9AM</div>
            <div className="absolute right-2 bottom-1 text-xs text-gray-400">3PM</div>
          </div>
        </div>
      </div>
      {/* 資訊區塊 */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        {/* 左側 */}
        <div className="space-y-1 text-sm">
          <div>前收盤價：<span className="font-mono">$1,185.50</span></div>
          <div>日區間：<span className="font-mono">$1,180.00 - $1,210.00</span></div>
          <div>本益比：<span className="font-mono">18.5</span></div>
          <div>24H 成交量：<span className="font-mono">2.31M</span></div>
          <div>每股盈餘 EPS：<span className="font-mono">65.2</span></div>
        </div>
        {/* 右側 */}
        <div className="space-y-1 text-sm">
          <div>市值：<span className="font-mono">$190.2B</span></div>
          <div>開盤價：<span className="font-mono">$1,190.00</span></div>
          <div>52週區間：<span className="font-mono">$900.00 - $1,350.00</span></div>
          <div>殖利率：<span className="font-mono">3.20%</span></div>
        </div>
      </div>
      {/* 其他擴充欄位可加在這裡 */}
    </div>
  );
} 