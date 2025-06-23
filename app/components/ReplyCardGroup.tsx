import React, { useState } from "react";
import { ReplyCard, ReplyCardData } from "./ReplyCard";

interface ReplyCardGroupProps {
  stockName: string;
  stockId: string;
  tags: string[];
  cards: ReplyCardData[];
  onAddToWatch: () => void;
}

export const ReplyCardGroup: React.FC<ReplyCardGroupProps> = ({
  stockName,
  stockId,
  tags,
  cards,
  onAddToWatch,
}) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-b from-blue-100 to-purple-100 rounded-2xl p-4 shadow-lg relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="font-bold text-lg">{stockName} <span className="text-gray-500 text-base">{stockId}</span></div>
          <div className="flex gap-2 mt-1">
            {tags.map(tag => (
              <span key={tag} className="bg-white/60 backdrop-blur px-2 py-0.5 rounded text-xs text-blue-700">{tag}</span>
            ))}
          </div>
        </div>
        <button
          className="px-3 py-1 rounded bg-white/70 backdrop-blur text-blue-700 border border-blue-200 shadow"
          onClick={onAddToWatch}
        >
          ＋加入自選股
        </button>
      </div>
      {/* Cards */}
      <div className="flex flex-col gap-4 mt-2">
        {cards.map((card, idx) => (
          <ReplyCard
            key={card.type}
            {...card}
            expanded={expandedIdx === idx}
            onExpand={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          />
        ))}
      </div>
    </div>
  );
}; 