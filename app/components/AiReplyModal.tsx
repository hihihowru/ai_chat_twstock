import React, { useState } from 'react';
import ReplyTemplatePreview from './ReplyTemplatePreview';
import { ReplyCardData } from './ReplyCard';

interface AiReplyModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate?: (options: { selected: string[]; text: string }) => void;
  defaultSelected?: string[];
  defaultText?: string;
}

const options = ["技術分析", "新聞摘要", "籌碼分析", "AI 總結"];

const cardTemplates: Record<string, Omit<ReplyCardData, 'footer'>> = {
  "技術分析": {
    type: "技術分析",
    image: "/mock/tsmc_chart.png",
    summary: "短線均線多頭排列，成交量放大，技術面偏多。",
  },
  "新聞摘要": {
    type: "新聞摘要",
    image: "/mock/tsmc_news.png",
    summary: "台積電今日漲停，法人看好先進製程。",
  },
  "籌碼分析": {
    type: "籌碼分析",
    image: "/mock/chips.png",
    summary: "外資連續買超，投信同步加碼，籌碼面偏多。",
  },
  "AI 總結": {
    type: "AI 總結",
    image: "/mock/ai_summary.png",
    summary: "技術面與籌碼面皆多方，短線有望續強。",
  },
};

export default function AiReplyModal({ open, onClose, onGenerate, defaultSelected = [], defaultText = "" }: AiReplyModalProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [text, setText] = useState(defaultText);
  const [cards, setCards] = useState<ReplyCardData[] | null>(null);

  if (!open) return null;

  const handleGenerate = () => {
    // 根據勾選觀點產生卡片
    const generated = selected.map(opt => ({
      ...cardTemplates[opt],
      footer: <span className="text-xs text-gray-500">資料來源：AI 模型</span>,
    }));
    // 若有補充觀點，加入一張 AI 總結卡片
    if (text.trim()) {
      generated.push({
        ...cardTemplates["AI 總結"],
        summary: text,
        footer: <span className="text-xs text-purple-700">追問</span>,
      });
    }
    setCards(generated);
    onGenerate?.({ selected, text });
  };

  // 行動按鈕 callback
  const handleReply = () => {
    alert('已發佈為留言！');
    onClose();
  };
  const handleThread = () => {
    alert('已發佈為新 Threads！');
    onClose();
  };
  const handleSave = () => {
    alert('已儲存為模板！');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white/90 backdrop-blur rounded-xl p-6 w-80 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="font-bold mb-2">AI 生成摘要</h2>
        {!cards ? (
          <>
            <div className="mb-2">
              <div className="mb-1 text-xs">選擇要包含的觀點：</div>
              <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                  <button
                    key={opt}
                    className={`px-2 py-1 rounded text-xs border ${selected.includes(opt) ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-gray-100 border-gray-300'}`}
                    onClick={() => setSelected(sel => sel.includes(opt) ? sel.filter(o => o !== opt) : [...sel, opt])}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="w-full border rounded p-2 text-xs mb-2"
              rows={3}
              placeholder="補充你的觀點..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>取消</button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={handleGenerate}>生成回覆</button>
            </div>
          </>
        ) : (
          <ReplyTemplatePreview
            cards={cards}
            onReply={handleReply}
            onThread={handleThread}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
} 