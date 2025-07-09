'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface IndexThumbnailProps {
  name: string;
  code: string;
  price: number;
  change: number;
  changePercent: number;
  market: string;
  chartData: OHLCVData[];
  onClick?: () => void;
  onChartClick?: () => void;
}

export default function IndexThumbnail({
  name,
  code,
  price,
  change,
  changePercent,
  market,
  chartData,
  onClick,
  onChartClick
}: IndexThumbnailProps) {
  const isUp = change >= 0;
  const changeColor = isUp ? 'text-red-600' : 'text-green-600';

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
      onClick={onClick}
    >
      {/* Header: 指數名稱和代碼 */}
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-sm text-gray-900">{name}</div>
        <div className="font-medium text-xs text-gray-500">{code}</div>
      </div>

      {/* Info: 點數、漲跌幅和市場 */}
      <div className="flex justify-between items-end mb-3">
        <div className="flex items-center gap-1">
          <span className="font-bold text-base text-gray-900">
            {price.toLocaleString()}
          </span>
          <span className={`font-medium text-sm ${changeColor}`}>
            ({isUp ? '+' : ''}{changePercent.toFixed(1)}%)
          </span>
          {isUp ? (
            <TrendingUp size={12} className={changeColor} />
          ) : (
            <TrendingDown size={12} className={changeColor} />
          )}
        </div>
        <div className="text-xs text-gray-500 font-normal">{market}</div>
      </div>

      {/* Chart Area - 暫時顯示為簡單的背景 */}
      <div 
        className="bg-gray-50 rounded border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center"
        style={{ height: '60px' }}
        onClick={(e) => {
          e.stopPropagation();
          onChartClick?.();
        }}
      >
        <span className="text-xs text-gray-500">圖表載入中...</span>
      </div>
    </div>
  );
} 