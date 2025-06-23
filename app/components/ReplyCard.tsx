import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, StarOff } from 'lucide-react';

export interface ReplyCardData {
  type: string;
  image: string | React.ReactNode;
  summary: string;
  footer: React.ReactNode;
}

interface ReplyCardProps extends ReplyCardData {
  expanded: boolean;
  onExpand: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({
  type,
  image,
  summary,
  footer,
  expanded,
  onExpand,
  onBookmark,
  isBookmarked
}) => (
  <motion.div
    className="bg-white/60 backdrop-blur rounded-xl shadow-md border border-transparent hover:border-blue-400 transition-all cursor-pointer overflow-hidden relative"
    onClick={onExpand}
    layout
    initial={false}
    animate={{ boxShadow: expanded ? "0 4px 32px rgba(80,80,200,0.12)" : "0 2px 8px rgba(0,0,0,0.06)" }}
    style={{ maxHeight: expanded ? 400 : 220 }}
  >
    {/* 收藏 icon */}
    {onBookmark && (
      <button
        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/70 hover:bg-blue-100 transition"
        onClick={e => { e.stopPropagation(); onBookmark(); }}
      >
        {isBookmarked ? <Star className="text-yellow-400 fill-yellow-300" size={20} /> : <StarOff size={20} />}
      </button>
    )}
    <div className="p-4 flex flex-col gap-2">
      <div className="font-bold text-base mb-1">{type}</div>
      <div className="w-full h-28 flex items-center justify-center mb-2">
        {typeof image === "string" ? (
          <img src={image} alt={type} className="h-full object-contain rounded" />
        ) : image}
      </div>
      <div className="text-sm text-gray-800 line-clamp-3">{summary}</div>
    </div>
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white/80 backdrop-blur px-4 py-2 border-t flex gap-2 items-center"
        >
          {footer}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// 多卡片橫向 scroll
export const ReplyCardHorizontalGlass = ({ cards }: { cards?: ReplyCardData[] }) => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  if (!cards || !Array.isArray(cards)) return null;
  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 flex flex-col gap-4 shadow-lg">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {cards.map((card, idx) => (
          <motion.div
            key={card.type}
            className={`min-w-[260px] bg-white/60 backdrop-blur rounded-xl shadow-md p-4 cursor-pointer border transition-all ${
              activeIdx === idx
                ? "border-blue-500 scale-105"
                : "border-transparent hover:scale-102"
            }`}
            onClick={() => setActiveIdx(idx)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <div className="font-bold text-lg mb-2">{card.type}</div>
            <div className="w-full h-28 flex items-center justify-center mb-2">
              {typeof card.image === "string" ? (
                <img src={card.image} alt={card.type} className="h-full object-contain rounded" />
              ) : card.image}
            </div>
            <div className="text-sm text-gray-800 line-clamp-3 mb-2">{card.summary}</div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full bg-white/80 backdrop-blur rounded-lg shadow p-3 flex items-center justify-between"
        >
          {cards[activeIdx].footer}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// 多卡片直向 scroll
export const ReplyCardVertical = ({ cards }: { cards?: ReplyCardData[] }) => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  if (!cards || !Array.isArray(cards)) return null;
  // 預設顯示 1.5 個卡片
  const showCards = expanded ? cards : cards.slice(0, 2);
  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-b from-blue-100 to-purple-100 rounded-2xl p-4 flex flex-col gap-4 shadow-lg">
      <div className="flex flex-col gap-4 relative" style={{ maxHeight: expanded ? 'none' : '340px', overflow: expanded ? 'visible' : 'hidden' }}>
        {showCards.map((card, idx) => (
          <motion.div
            key={card.type}
            className={`bg-white/60 backdrop-blur rounded-xl shadow-md p-4 border transition-all flex flex-col gap-2 ${activeIdx === idx ? "border-blue-500" : "border-transparent"}`}
            onClick={() => setActiveIdx(idx)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
            style={{ minHeight: 180, maxHeight: 220, marginBottom: idx === 0 && !expanded ? '-60px' : '0' }}
          >
            <div className="font-bold text-lg mb-2">{card.type}</div>
            <div className="w-full h-28 flex items-center justify-center mb-2">
              {typeof card.image === "string" ? (
                <img src={card.image} alt={card.type} className="h-full object-contain rounded" />
              ) : card.image}
            </div>
            <div className="text-sm text-gray-800 line-clamp-3 mb-2">{card.summary}</div>
            <AnimatePresence mode="wait">
              {activeIdx === idx && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full bg-white/80 backdrop-blur rounded-lg shadow p-3 flex items-center justify-between mt-2"
                >
                  {card.footer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      {!expanded && cards.length > 2 && (
        <button
          className="w-full mt-2 text-blue-600 text-xs font-bold bg-white/70 backdrop-blur rounded-lg py-2 shadow border border-blue-100 hover:bg-blue-50 transition"
          onClick={() => setExpanded(true)}
        >
          繼續閱讀更多 AI 回覆
        </button>
      )}
    </div>
  );
};

export const ReplyCardFooter = ({
  source,
  onReadMore,
  onAskMore,
}: {
  source?: string;
  onReadMore?: () => void;
  onAskMore?: () => void;
}) => (
  <>
    {source && <span className="text-xs text-gray-500">資料來源：{source}</span>}
    {onReadMore && (
      <button className="ml-auto px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs" onClick={onReadMore}>
        延伸閱讀
      </button>
    )}
    {onAskMore && (
      <button className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs" onClick={onAskMore}>
        追問
      </button>
    )}
  </>
); 