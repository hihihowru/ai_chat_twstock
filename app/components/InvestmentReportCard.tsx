import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, StarOff, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// 支援新的後端資料結構
export interface InvestmentSection {
  section: string;           // 大標題
  cards?: Array<{            // 小卡片陣列
    title: string;
    content?: string;
    suggestion?: string;
    bullets?: string[];
  }>;
  tabs?: Array<{             // Tab 陣列
    tab: string;
    content: string;
    table?: any[];
  }>;
  bullets?: string[];        // 條列式內容
  sources?: Array<string | {title: string, link: string}>;  // 資料來源 - 支援字串或物件格式
  disclaimer?: string;       // 免責聲明
  summary_table?: Array<{    // 總結表格
    period: string;
    suggestion: string;
    confidence: string;
    reason: string;
  }>;
  financial_scores?: {       // 財務分數
    eps_score: number;
    revenue_score: number;
    margin_score: number;
    overall_score: number;
  };
  // 向後相容
  title?: string;
  content?: string;
  icon?: string;
  table?: any[];
}

export interface InvestmentReportData {
  stockName: string;
  stockId: string;
  sections: InvestmentSection[];
  summary?: string;
  paraphrased_prompt?: string;
}

interface InvestmentReportCardProps extends InvestmentReportData {
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

// Section 圖示對應
const sectionIcons: { [key: string]: string } = {
  "股價異動總結": "📈",
  "財務狀況分析": "💰",
  "投資策略建議": "🎯",
  "操作注意事項": "⚠️",
  "資料來源": "📚",
  "免責聲明": "📋"
};

// Section 顏色對應 - 使用專業的淺米色系
const sectionColors: { [key: string]: string } = {
  "股價異動總結": "from-blue-50 to-indigo-50",
  "財務狀況分析": "from-emerald-50 to-teal-50", 
  "投資策略建議": "from-amber-50 to-orange-50",
  "操作注意事項": "from-red-50 to-pink-50",
  "資料來源": "from-slate-50 to-gray-50",
  "免責聲明": "from-yellow-50 to-amber-50",
  // 圖示對應
  "📈": "from-blue-50 to-indigo-50",
  "💰": "from-emerald-50 to-teal-50",
  "🎯": "from-amber-50 to-orange-50", 
  "⚠️": "from-red-50 to-pink-50",
  "📚": "from-slate-50 to-gray-50",
  "📋": "from-yellow-50 to-amber-50"
};

// 修改 renderContent 來源標記處理，使用 SourceButtonWithPopup
const renderContent = (content: any, sources?: Array<{title: string, link: string} | string>) => {
  if (typeof content !== 'string') {
    return <span>內容格式錯誤</span>;
  }
  // 將多個 [來源X] 連續出現的 pattern 換成一個 icon
  const multiSourcePattern = /(\[來源\d+\])+$/;
  const match = content.match(multiSourcePattern);
  let mainText = content;
  let showSources = false;
  if (match && sources && sources.length > 0) {
    mainText = content.replace(multiSourcePattern, '');
    showSources = true;
  }
  // 其餘內容用 markdown 處理
  return (
    <span className="whitespace-pre-line">
      <ReactMarkdown>{mainText}</ReactMarkdown>
      {showSources && <SourceIconWithPopup sources={sources} />}
    </span>
  );
};

// 表格渲染元件
function FinancialTable({ table, highlightKey = 'highlight' }: { table: any[], highlightKey?: string }) {
  if (!Array.isArray(table) || table.length === 0) return <div className="text-gray-400 text-sm">無資料</div>;
  if (typeof table[0] !== 'object') return <div className="text-red-500 text-sm">資料格式錯誤</div>;
  const keys = Object.keys(table[0]).filter(k => k !== highlightKey);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-gray-50">
            {keys.map(k => (
              <th key={k} className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={i} className={`${row[highlightKey] ? "bg-amber-50" : "bg-white"} hover:bg-gray-50 transition-colors`}>
              {keys.map(k => (
                <td key={k} className="px-4 py-3 border-b border-gray-100">
                  {/* 成長率欄位用 button 樣式，紅色=好，綠色=跌 */}
                  {k.match(/成長率/) && typeof row[k] === 'object' && row[k] !== null ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      row[k].color === 'red' ? 'bg-red-100 text-red-700' :
                      row[k].color === 'green' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {row[k].value}
                    </span>
                  ) : (
                    <span className="text-gray-700">{row[k]}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 新增：將財報原始表格轉換為年度/季度格式的 table
function buildQuarterTable(rawTable, valueKey) {
  if (!Array.isArray(rawTable)) return { years: [], table: [] };
  const years = Array.from(new Set(rawTable.map(row => row.季度.slice(0, 4)))).sort();
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const table = quarters.map(q => {
    const row = { quarter: q };
    years.forEach(year => {
      const quarterKey = `${year}${q}`;
      const found = rawTable.find(r => r.季度 === quarterKey);
      row[year] = found ? found[valueKey] : 'N/A';
    });
    return row;
  });
  return { years, table };
}

// 修改 TabsComponent 讓 EPS/營收/營業利益 tab 用財報原始表格渲染
function TabsComponent({ tabs }: { tabs: Array<{ tab: string; content: string; table?: any[] }> }) {
  const [activeTab, setActiveTab] = useState(0);
  // 找到財報原始表格
  const rawTableTab = tabs.find(tab => tab.tab.includes('財報原始表格'));
  const rawTable = rawTableTab?.table || [];
  // tab 對應的 key
  const tabValueKeyMap = {
    'EPS': '每股盈餘',
    '營收': '營收',
    '營業利益': '營業利益',
  };
  // 判斷是否要用原始表格渲染
  const currentTab = tabs[activeTab];
  let customTable = null;
  if (rawTable.length > 0 && tabValueKeyMap[currentTab.tab]) {
    const { years, table } = buildQuarterTable(rawTable, tabValueKeyMap[currentTab.tab]);
    customTable = (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">季度</th>
              {years.map(y => (
                <th key={y} className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">{y}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => (
              <tr key={i} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 border-b border-gray-100 font-semibold">{row.quarter}</td>
                {years.map(y => (
                  <td key={y} className="px-4 py-3 border-b border-gray-100">{row[y]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="mt-4">
      {/* Tab 標籤 */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === index
                ? 'border-amber-500 text-amber-600 bg-amber-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.tab}
          </button>
        ))}
      </div>
      {/* Tab 內容 */}
      <div className="tab-content">
        <div className="mb-6 text-gray-700 leading-relaxed">{renderContent(currentTab.content)}</div>
        {/* EPS/營收/營業利益 tab 用原始表格渲染，其他 tab 用原本的 table */}
        {customTable || (currentTab.table && <FinancialTable table={currentTab.table!} />)}
      </div>
    </div>
  );
}

// 財務分數元件
function FinancialScoresComponent({ scores }: { scores: { eps_score: number; revenue_score: number; margin_score: number; overall_score: number } }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '優秀';
    if (score >= 60) return '良好';
    return '需改善';
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h4 className="text-lg font-semibold mb-4 text-gray-800">📊 財務狀況評分</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold ${getScoreColor(scores.eps_score)}`}>
            {scores.eps_score}
          </div>
          <div className="text-sm font-medium text-gray-700 mt-2">EPS 評分</div>
          <div className="text-xs text-gray-500">{getScoreLabel(scores.eps_score)}</div>
        </div>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold ${getScoreColor(scores.revenue_score)}`}>
            {scores.revenue_score}
          </div>
          <div className="text-sm font-medium text-gray-700 mt-2">營收評分</div>
          <div className="text-xs text-gray-500">{getScoreLabel(scores.revenue_score)}</div>
        </div>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold ${getScoreColor(scores.margin_score)}`}>
            {scores.margin_score}
          </div>
          <div className="text-sm font-medium text-gray-700 mt-2">毛利率評分</div>
          <div className="text-xs text-gray-500">{getScoreLabel(scores.margin_score)}</div>
        </div>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold ${getScoreColor(scores.overall_score)}`}>
            {scores.overall_score}
          </div>
          <div className="text-sm font-medium text-gray-700 mt-2">綜合評分</div>
          <div className="text-xs text-gray-500">{getScoreLabel(scores.overall_score)}</div>
        </div>
      </div>
    </div>
  );
}

// 總結表格元件
function SummaryTableComponent({ data, sources }: { data: Array<{ period: string; suggestion: string; confidence: string; reason: string }>, sources?: Array<{title: string, link: string} | string> }) {
  if (!data || data.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h4 className="text-xl font-semibold mb-4 text-gray-800">投資建議總結</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-800">{item.period}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                item.suggestion === '買進' ? 'bg-green-100 text-green-700' :
                item.suggestion === '賣出' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {item.suggestion}
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-2">信心度: {item.confidence}</div>
            <div className="text-sm text-gray-700 leading-relaxed">{renderContent(item.reason, sources)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 來源計數器元件
function SourcesCounter({ sources, onToggle }: { sources: Array<string | {title: string, link: string}>, onToggle: () => void }) {
  const validSources = sources.filter(source => {
    if (typeof source === 'string') return source;
    return source.link && source.link !== '無連結';
  });

  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
    >
      <span className="w-4 h-4 bg-gray-300 rounded flex items-center justify-center text-xs font-bold">
        {validSources.length}
      </span>
      <span>資料來源</span>
    </button>
  );
}

// 修改 SourcesCounter 來源 popup UX
function SourceButtonWithPopup({ sourceIndex, title, link }: { sourceIndex: number, title: string, link?: string }) {
  const [show, setShow] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <span className="relative inline-block align-middle">
      <button
        ref={btnRef}
        className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 rounded-md text-xs font-bold mx-1 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setTimeout(() => setShow(false), 100)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        tabIndex={0}
        aria-label={`資料來源 ${sourceIndex}`}
      >
        {sourceIndex}
      </button>
      {show && (
        <div
          className="absolute z-10 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-auto"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <div className="text-sm font-medium text-gray-800 mb-1">{title}</div>
          {link && (
            <div className="text-xs text-blue-600 break-all">
              <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
            </div>
          )}
        </div>
      )}
    </span>
  );
}

// 修改 renderContent：遇到多個 [來源X] 連續出現時，改為只顯示一個 icon
function SourceIconWithPopup({ sources }: { sources: Array<{title: string, link: string} | string> }) {
  const [show, setShow] = useState(false);
  let hoverAreaRef = useRef<HTMLSpanElement>(null);
  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (hoverAreaRef.current && hoverAreaRef.current.contains(e.relatedTarget as Node)) return;
    setShow(false);
  };
  return (
    <span className="relative inline-block align-middle ml-1" ref={hoverAreaRef}>
      <button
        className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 rounded-md text-xs font-bold hover:bg-gray-300 focus:bg-gray-300 focus:outline-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={() => setShow(false)}
        tabIndex={0}
        aria-label={`資料來源${sources.length}`}
        style={{ verticalAlign: 'super', marginLeft: 2 }}
      >
        <sup>{sources.length}</sup>
      </button>
      {show && (
        <div
          className="absolute z-10 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="text-sm font-medium text-gray-800 mb-2">資料來源</div>
          <ul className="text-xs text-gray-700">
            {sources.map((source, idx) => {
              let title = "";
              let link = "";
              if (typeof source === 'string') {
                title = source;
              } else if (source && typeof source === 'object' && 'title' in source) {
                title = source.title;
                link = source.link || "";
              } else {
                title = String(source);
              }
              return (
                <li key={idx} className="mb-1">
                  {title}
                  {link && (
                    <span className="ml-1 text-blue-600 break-all">
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </span>
  );
}

export const InvestmentReportCard: React.FC<InvestmentReportCardProps> = ({
  stockName,
  stockId,
  sections,
  summary,
  onBookmark,
  isBookmarked,
  paraphrased_prompt
}) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [showSources, setShowSources] = useState<{[key: string]: boolean}>({});

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const toggleSources = (sectionTitle: string) => {
    setShowSources(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-amber-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 relative">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {stockName} <span className="text-gray-500 text-2xl">({stockId})</span>
          </h2>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl text-gray-600 font-medium">投資分析報告</h3>
            {paraphrased_prompt && (
              <span className="text-sm text-gray-500 italic ml-2">—— {paraphrased_prompt}</span>
            )}
          </div>
          {summary && (
            <p className="text-sm text-gray-500 italic">{summary}</p>
          )}
        </div>
        
        {/* 收藏按鈕 */}
        {onBookmark && (
          <button
            className="p-3 rounded-full bg-white/80 hover:bg-amber-100 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={onBookmark}
          >
            {isBookmarked ? (
              <Star className="text-amber-500 fill-amber-400" size={28} />
            ) : (
              <StarOff size={28} className="text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => {
          const sectionTitle = section.section || section.title || "未命名區塊";
          const icon = section.icon || sectionIcons[sectionTitle] || "📋";
          const colorClass = sectionColors[sectionTitle] || sectionColors[icon] || "from-gray-50 to-gray-100";
          const isExpanded = expandedSections[sectionTitle] !== false; // 預設展開
          const isSourcesExpanded = showSources[sectionTitle] || false;
          
          return (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 shadow-lg border border-white/60 backdrop-blur-sm`}
              layout
            >
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{icon}</span>
                  <h3 className="text-xl font-bold flex items-center gap-3 text-gray-800">
                    <span>{sectionTitle}</span>
                  </h3>
                </div>
              </div>

              {/* Section Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-gray-700 leading-relaxed"
                  >
                    {/* 財務分數顯示 - 只在財務狀況分析區塊顯示 */}
                    {section.financial_scores && sectionTitle === "財務狀況分析" && (
                      <FinancialScoresComponent scores={section.financial_scores} />
                    )}

                    {/* Cards 型 section */}
                    {section.cards && section.cards.length > 0 && (
                      <div className="space-y-5">
                        {section.cards.map((card, cardIndex) => (
                          <div key={cardIndex} className="bg-white/70 rounded-xl p-5 shadow-md border border-white/50">
                            <div className="flex items-center mb-2">
                              <span className="font-semibold text-lg">{card.title}</span>
                            </div>
                            {card.content && <div className="mb-3 text-gray-700">{renderContent(card.content, section.sources)}</div>}
                            {card.suggestion && <div className="mb-3 text-blue-700 font-medium">{card.suggestion}</div>}
                            {card.bullets && card.bullets.length > 0 && (
                              <ul className="list-disc list-inside space-y-2">
                                {card.bullets.map((bullet, bulletIndex) => (
                                  <li key={bulletIndex} className="text-sm text-gray-600">{renderContent(bullet, section.sources)}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tabs 型 section */}
                    {section.tabs && section.tabs.length > 0 && (
                      <TabsComponent key={`tabs-${index}`} tabs={section.tabs} />
                    )}

                    {/* Bullets 型 section */}
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="list-disc list-inside space-y-3">
                        {section.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="text-gray-700">{bullet}</li>
                        ))}
                      </ul>
                    )}

                    {/* Sources 型 section - 可切換顯示 */}
                    {section.sources && section.sources.length > 0 && (
                      <AnimatePresence>
                        {isSourcesExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4"
                          >
                            <h4 className="font-semibold mb-3 text-gray-800">資料來源：</h4>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                              {section.sources.map((source, sourceIndex) => {
                                // 處理不同的來源格式
                                let displayText = "";
                                let link = "";
                                
                                if (typeof source === 'string') {
                                  displayText = source;
                                } else if (source && typeof source === 'object' && 'title' in source) {
                                  displayText = source.title;
                                  link = source.link || "";
                                } else {
                                  displayText = String(source);
                                }
                                
                                return (
                                  <li key={sourceIndex} className="text-gray-600">
                                    {link ? (
                                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                        {displayText}
                                      </a>
                                    ) : (
                                      displayText
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}

                    {/* Disclaimer 型 section */}
                    {section.disclaimer && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-800">{section.disclaimer}</p>
                      </div>
                    )}

                    {/* Summary Table */}
                    {section.summary_table && section.summary_table.length > 0 && (
                      <SummaryTableComponent data={section.summary_table} sources={section.sources} />
                    )}

                    {/* 向後相容：舊格式 */}
                    {section.content && typeof section.content === 'string' && !section.cards && !section.tabs && !section.bullets && !section.sources && !section.disclaimer && (
                      <div className="mb-4">{renderContent(section.content, section.sources)}</div>
                    )}

                    {/* 向後相容：舊表格格式 */}
                    {section.table && section.table.length > 0 && !section.tabs && (
                      <FinancialTable table={section.table} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-amber-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>📌 本報告為 AI 模型根據公開資料與新聞彙整生成，並非任何投資建議</span>
          <span>投資必有風險，請審慎評估並自行承擔操作結果</span>
        </div>
      </div>
    </div>
  );
};

// 簡化版本 - 用於列表顯示
export const InvestmentReportCardCompact: React.FC<InvestmentReportData> = ({
  stockName,
  stockId,
  sections
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="font-bold text-lg text-gray-800">
          {stockName} <span className="text-gray-500">({stockId})</span>
        </h3>
        <span className="text-sm text-gray-500">投資分析報告</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {sections.slice(0, 4).map((section, index) => {
          const sectionTitle = section.section || section.title || "未命名區塊";
          const icon = section.icon || sectionIcons[sectionTitle] || "📋";
          return (
            <div key={index} className="bg-white/60 rounded-lg p-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-xs font-medium text-gray-700">{sectionTitle}</div>
            </div>
          );
        })}
      </div>
      
      {sections.length > 4 && (
        <div className="text-center mt-2 text-xs text-gray-500">
          還有 {sections.length - 4} 個分析面向
        </div>
      )}
    </div>
  );
}; 