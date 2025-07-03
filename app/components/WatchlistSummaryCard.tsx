'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Source {
  name: string;
  url: string;
  description: string;
}

interface Card {
  title: string;
  content: string;
  type: string;
  sources?: Source[];
  data?: any;
  insights?: { title: string; content: string; why_important: string }[];
}

interface Section {
  title: string;
  content: string;
  cards: Card[];
  sources: Source[];
  data?: any;
}

interface WatchlistSummaryCardProps {
  sections: Section[];
  isLoading?: boolean;
}

const WatchlistSummaryCard: React.FC<WatchlistSummaryCardProps> = ({ 
  sections, 
  isLoading = false 
}) => {
  // 預設展開所有 section
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map(section => section.title))
  );

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const formatReturnRate = (rate: number | null | undefined): string => {
    if (rate === null || rate === undefined) return 'N/A';
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  const getReturnRateColor = (rate: number | null | undefined): string => {
    if (rate === null || rate === undefined) return 'bg-gray-100 text-gray-600';
    // 動態深淺，最大深度設在 20% 以上
    const abs = Math.abs(rate);
    if (rate > 0) {
      if (abs > 20) return 'bg-red-500 text-white';
      if (abs > 10) return 'bg-red-400 text-white';
      if (abs > 5) return 'bg-red-300 text-white';
      return 'bg-red-100 text-red-700';
    }
    if (rate < 0) {
      if (abs > 20) return 'bg-green-600 text-white';
      if (abs > 10) return 'bg-green-500 text-white';
      if (abs > 5) return 'bg-green-300 text-white';
      return 'bg-green-100 text-green-700';
    }
    return 'bg-gray-100 text-gray-600';
  };

  const renderCardContent = (card: Card) => {
    // 調試：檢查 card 結構
    console.log('[WatchlistSummaryCard] renderCardContent:', {
      title: card.title,
      type: card.type,
      hasData: !!card.data,
      dataLength: card.data ? card.data.length : 'N/A',
      dataSample: card.data ? card.data[0] : 'N/A'
    });
    
    if (card.type === 'table' && card.data) {
      // 檢查 data 是否為陣列（股票資料）或物件（統計資料）
      if (Array.isArray(card.data)) {
        // 股票資料表格
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">股票代號</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">公司名稱</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">今日 ({card.data[0]?.close_date}) 收盤價</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">5日報酬</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">20日報酬</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">60日報酬</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">240日報酬</th>
                </tr>
              </thead>
              <tbody>
                {card.data.map((stock: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{stock.stock_id}</td>
                    <td className="px-4 py-3">{stock.company_name}</td>
                    <td className="px-4 py-3 text-center">
                      {stock.close}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getReturnRateColor(stock['1日報酬'])}`}>
                        {formatReturnRate(stock['1日報酬'])}
                      </span>
                    </td>
                    {['5日報酬','20日報酬','60日報酬','240日報酬'].map(period => (
                      <td key={period} className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReturnRateColor(stock[period])}`}>
                          {formatReturnRate(stock[period])}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        // 統計資料表格（字典格式）
        // 期間補齊 1日、5日、20日、60日、240日
        const periods = ['1日報酬', '5日報酬', '20日報酬', '60日報酬', '240日報酬'];
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">期間</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">上漲檔數</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">下跌檔數</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">平均報酬</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">最大漲幅</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b border-gray-200">最大跌幅</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((period, index) => {
                  const data = card.data[period];
                  if (!data) return null;
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{period.replace('日報酬', '日')}</td>
                      <td className="px-4 py-3 text-center">{data.up_count}</td>
                      <td className="px-4 py-3 text-center">{data.down_count}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReturnRateColor(data.avg_return)}`}>
                          {formatReturnRate(data.avg_return)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReturnRateColor(data.max_return)}`}>
                          {formatReturnRate(data.max_return)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReturnRateColor(data.min_return)}`}>
                          {formatReturnRate(data.min_return)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }

    if (card.type === 'discussion_stats' && card.data) {
      const { discussion_count, comment_count, emotions, market_label } = card.data;
      return (
        <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex flex-row items-center justify-between mb-4 gap-4">
            <div className="flex flex-col items-center flex-1">
              <span className="text-gray-500 text-sm">討論數</span>
              <span className="text-4xl font-extrabold text-blue-600">{discussion_count}</span>
              <span className="text-xs text-gray-400">篇</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-gray-500 text-sm">留言數</span>
              <span className="text-4xl font-extrabold text-green-600">{comment_count}</span>
              <span className="text-xs text-gray-400">則</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-gray-500 text-sm">市場標籤</span>
              <span className="text-lg font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">{market_label}</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between mt-2 gap-4">
            {emotions && Array.isArray(emotions) && emotions.map((emo, idx) => (
              <div key={emo.type} className="flex flex-col items-center flex-1">
                <span className="text-gray-500 text-xs">{emo.type}</span>
                <span className={`text-2xl font-bold ${emo.type === '正面' ? 'text-green-500' : emo.type === '負面' ? 'text-red-500' : 'text-gray-500'}`}>{emo.post}</span>
                <span className="text-xs text-gray-400">貼文</span>
                <span className="text-xs text-gray-400">{emo.comment} 留言</span>
              </div>
            ))}
          </div>
          {/* 補充觀察與解讀 */}
          {card.insights && Array.isArray(card.insights) && card.insights.length > 0 && (
            <div className="mt-6 space-y-6 border-t pt-4">
              {card.insights.map((insight, idx) => (
                <div key={idx} className="">
                  <div className="font-bold text-base text-gray-800 mb-1">{insight.title}</div>
                  <div className="text-gray-700 text-sm mb-1 whitespace-pre-line">{insight.content}</div>
                  <div className="text-xs text-gray-500 italic">👉 {insight.why_important}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // 新增：若 card.content 為 HTML 字串，使用 dangerouslySetInnerHTML
    if (card.content && typeof card.content === 'string' && /<[^>]+>/.test(card.content)) {
      return <div className="whitespace-pre-line text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: card.content }} />;
    }

    // 渲染一般文字內容
    return (
      <div className="whitespace-pre-line text-sm text-gray-700">
        {card.content}
      </div>
    );
  };

  // 新增：自選股 vs 同產業指數表現 section 表格渲染
  function renderIndustryComparisonSection(section: any) {
    const periods = [
      { key: '1日報酬', label: '1日' },
      { key: '5日報酬', label: '5日' },
      { key: '20日報酬', label: '20日' },
      { key: '60日報酬', label: '60日' },
      { key: '240日報酬', label: '240日' },
    ];
    function getColor(val: number | null) {
      if (val === null || val === undefined) return 'text-gray-400';
      if (val > 0) return 'text-red-600';
      if (val < 0) return 'text-green-600';
      return 'text-gray-700';
    }
    function getStatusColor(status: string) {
      if (status === '領先') return 'text-blue-600 font-bold';
      if (status === '落後') return 'text-gray-500';
      if (status === '持平') return 'text-black';
      return 'text-gray-400';
    }
    return (
      <div className="my-8">
        <h3 className="text-lg font-bold mb-2">{section.title}</h3>
        <div className="text-sm text-gray-600 mb-4">{section.content}</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 border-b">股票代號</th>
                <th className="px-3 py-2 border-b">公司名稱</th>
                <th className="px-3 py-2 border-b">產業</th>
                <th className="px-3 py-2 border-b">產業指數</th>
                {periods.map((p) => (
                  <React.Fragment key={p.key}>
                    <th className="px-3 py-2 border-b text-center">{p.label}個股</th>
                    <th className="px-3 py-2 border-b text-center">{p.label}產業</th>
                    <th className="px-3 py-2 border-b text-center">{p.label}狀態</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.data && Array.isArray(section.data) && section.data.map((row: any, idx: number) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{row['股票代號']}</td>
                  <td className="px-3 py-2">{row['公司名稱']}</td>
                  <td className="px-3 py-2">{row['產業類別']}</td>
                  <td className="px-3 py-2">{row['產業指數']}</td>
                  {periods.map((p) => (
                    <React.Fragment key={p.key}>
                      <td className={`px-3 py-2 ${getColor(row[p.key])}`}>{formatReturnRate(row[p.key])}</td>
                      <td className={`px-3 py-2 ${getColor(row[`${p.key}產業`])}`}>{formatReturnRate(row[`${p.key}產業`])}</td>
                      <td className={`px-3 py-2 ${getStatusColor(row[`${p.key}狀態`])}`}>{row[`${p.key}狀態`]}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections && Array.isArray(sections) && sections.map((section, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">{section.title}</h2>
            <button onClick={() => toggleSection(section.title)}>
              {expandedSections.has(section.title) ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
          {expandedSections.has(section.title) && (
            <div>
              <div className="text-sm text-gray-700 mb-4">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
              {Array.isArray(section.cards) && section.cards.map((card, cardIndex) => (
                <div key={cardIndex} className="mb-4">
                  <h3 className="text-md font-bold mb-2">{card.title}</h3>
                  {renderCardContent(card)}
                  {card.sources && Array.isArray(card.sources) && card.sources.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2">
                      資料來源：
                      {card.sources.map((source, sourceIndex) => (
                        <span key={sourceIndex}>
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">
                            {source.name}
                          </a>
                          {sourceIndex < card.sources.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WatchlistSummaryCard;
