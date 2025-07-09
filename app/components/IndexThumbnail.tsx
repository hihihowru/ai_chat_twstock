'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData } from 'lightweight-charts';
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
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const isUp = change >= 0;
  const changeColor = isUp ? 'text-green-600' : 'text-red-600';

  useEffect(() => {
    if (chartContainerRef.current && chartData.length > 0) {
      // 創建圖表
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: '#f9fafb' },
          textColor: '#6b7280',
        },
        grid: {
          vertLines: { color: '#e5e7eb' },
          horzLines: { color: '#e5e7eb' },
        },
        crosshair: {
          mode: 0,
        },
        rightPriceScale: {
          borderColor: '#e5e7eb',
          visible: false,
        },
        timeScale: {
          borderColor: '#e5e7eb',
          visible: false,
        },
        handleScroll: false,
        handleScale: false,
      });

      // 創建線圖系列（指數通常用線圖）
      const lineSeries = chart.addLineSeries({
        color: isUp ? '#10b981' : '#ef4444',
        lineWidth: 2,
      });

      // 轉換數據格式
      const formattedData: LineData[] = chartData.map(item => ({
        time: item.timestamp,
        value: item.close,
      }));

      lineSeries.setData(formattedData);

      // 儲存引用
      chartRef.current = chart;
      seriesRef.current = lineSeries;

      // 清理函數
      return () => {
        chart.remove();
      };
    }
  }, [chartData, isUp]);

  // 處理視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

      {/* Chart Area */}
      <div 
        ref={chartContainerRef}
        className="bg-gray-50 rounded border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
        style={{ height: '60px' }}
        onClick={(e) => {
          e.stopPropagation();
          onChartClick?.();
        }}
      />
    </div>
  );
} 