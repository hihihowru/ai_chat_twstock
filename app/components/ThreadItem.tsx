import React, { useState } from 'react';

interface User {
  avatar: string;
  name: string;
}

interface AiReplyCard {
  type: string;
  image: string;
  summary: string;
  footer?: React.ReactNode;
}

interface Stats {
  like: number;
  comment: number;
  favorite: number;
  share: number;
}

interface QuoteThread {
  question: string;
}

interface ThreadItemProps {
  id: string;
  user: User;
  question: string;
  tags: string[];
  aiReplyCards: AiReplyCard[];
  aiReplyCollapsed: boolean;
  stats: Stats;
  quoteThread: QuoteThread | null;
  onExpandAiReply?: () => void;
  onAiReply?: () => void;
}

const ThreadItem: React.FC<ThreadItemProps> = ({
  user,
  question,
  tags,
  aiReplyCards,
  aiReplyCollapsed,
  stats,
  quoteThread,
  onExpandAiReply,
  onAiReply,
}) => {
  const [like, setLike] = useState(stats.like);
  const [favorite, setFavorite] = useState(stats.favorite);

  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl p-4 mb-6 transition hover:shadow-2xl">
      <div className="flex items-center mb-2">
        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
        <span className="font-bold text-gray-800">{user.name}</span>
        <button
          className="ml-auto px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 transition"
          onClick={onAiReply}
        >
          AI 回答
        </button>
      </div>
      {quoteThread && (
        <div className="text-xs text-gray-500 mb-1 pl-2 border-l-2 border-gray-200">{quoteThread.question}</div>
      )}
      <div className="text-lg font-medium mb-1 text-gray-900">{question}</div>
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{tag}</span>
        ))}
      </div>
      <div className="flex gap-2 text-xs text-gray-600 mb-2">
        <button onClick={() => setLike(like + 1)} className="flex items-center gap-1 hover:text-blue-600 transition"><span>👍</span> {like}</button>
        <button onClick={() => alert('留言功能開發中')} className="flex items-center gap-1 hover:text-blue-600 transition"><span>💬</span> {stats.comment}</button>
        <button onClick={() => setFavorite(favorite + 1)} className="flex items-center gap-1 hover:text-yellow-500 transition"><span>⭐</span> {favorite}</button>
        <button onClick={() => alert('分享功能開發中')} className="flex items-center gap-1 hover:text-blue-600 transition"><span>🔗</span> {stats.share}</button>
      </div>
      <div>
        {aiReplyCollapsed ? (
          <button
            className="text-blue-600 text-xs underline"
            onClick={onExpandAiReply}
          >
            展開 AI 回覆
          </button>
        ) : (
          <div className="space-y-2">
            {aiReplyCards.map((card, idx) => (
              <div key={idx} className="bg-white/40 rounded p-2 shadow-sm">
                <div className="flex items-center mb-1">
                  {card.image && <img src={card.image} alt={card.type} className="w-6 h-6 mr-2" />}
                  <span className="font-semibold text-gray-700 text-xs">{card.type}</span>
                </div>
                <div className="text-sm mb-1 whitespace-pre-line text-gray-800">{card.summary}</div>
                {card.footer && <div>{card.footer}</div>}
              </div>
            ))}
            <button
              className="mt-2 text-blue-700 text-xs underline"
              onClick={onAiReply}
            >
              追問 AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadItem; 