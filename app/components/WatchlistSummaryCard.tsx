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
}

interface Section {
  title: string;
  content: string;
  cards: Card[];
  sources: Source[];
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
              {section.data.map((row: any, idx: number) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{row['股票代號']}</td>
                  <td className="px-3 py-2">{row['公司名稱']}</td>
                  <td className="px-3 py-2">{row['產業類別']}</td>
                  <td className="px-3 py-2">{row['產業指數']}</td>
                  {periods.map((p) => (
                    <React.Fragment key={p.key}>
                      <td className={`px-3 py-2 text-center ${getColor(row[`個股${p.key}`])}`}>
                        {row[`個股${p.key}`] === null ? '無對應' : `${row[`個股${p.key}`]}%`}
                      </td>
                      <td className={`px-3 py-2 text-center ${getColor(row[`產業${p.key}`])}`}>
                        {row[`產業${p.key}`] === null ? '無對應' : `${row[`產業${p.key}`]}%`}
                      </td>
                      <td className={`px-3 py-2 text-center ${getStatusColor(row[`領先狀態${p.key}`])}`}>
                        {row[`領先狀態${p.key}`]}
                      </td>
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

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <div className="animate-pulse bg-gray-200 h-6 w-48 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 調試：檢查 sections 資料
  console.log('[WatchlistSummaryCard] sections:', sections);
  
  return (
    <div className="space-y-6">
      {sections.map((section: any, idx: number) => {
        // 新增：渲染 industry_comparison section
        if (section.type === 'industry_comparison') {
          return <div key={idx}>{renderIndustryComparisonSection(section)}</div>;
        }
        return (
          <div key={idx} className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              <button
                onClick={() => toggleSection(section.title)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {expandedSections.has(section.title) ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
            
            {expandedSections.has(section.title) && (
              <div className="space-y-4">
                {/* 只渲染 cards，不重複渲染 section.content */}
                {section.cards && section.cards.length > 0 ? (
                  section.cards.map((card, cardIndex) => {
                    // 移除報酬率統計分析的說明文字卡片（type === 'text'）
                    if (section.title === '報酬率統計分析' && card.type === 'text') {
                      return null;
                    }
                    return (
                      <div key={cardIndex} className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-900 mb-2">{card.title}</h4>
                        {renderCardContent(card)}
                        {/* 資料來源 */}
                        {card.sources && card.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <h5 className="text-xs font-medium text-gray-500 mb-2">資料來源：</h5>
                            <div className="flex flex-wrap gap-2">
                              {card.sources.map((source, sourceIndex) => (
                                <a
                                  key={sourceIndex}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  {source.name}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  // 若無 cards，渲染 markdown 格式內容
                  section.content && (
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  )
                )}
                {/* Section 資料來源 */}
                {section.sources && section.sources.length > 0 && (
                  <div className="pt-4 border-t">
                    <h5 className="text-xs font-medium text-gray-500 mb-2">資料來源：</h5>
                    <div className="flex flex-wrap gap-2">
                      {section.sources.map((source, sourceIndex) => (
                        <a
                          key={sourceIndex}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          {source.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WatchlistSummaryCard; 