import React from 'react';
import { ReplyCardData, ReplyCardVertical } from './ReplyCard';
import { MessageCircle, Send, Save } from 'lucide-react';

interface ReplyTemplatePreviewProps {
  cards: ReplyCardData[];
  onReply: () => void;
  onThread: () => void;
  onSave: () => void;
}

export default function ReplyTemplatePreview({ cards, onReply, onThread, onSave }: ReplyTemplatePreviewProps) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow-lg max-w-md mx-auto mt-4">
      <ReplyCardVertical cards={cards} />
      <div className="flex justify-between mt-4 gap-3">
        <IconActionButton icon={<MessageCircle size={22} />} label="發佈留言" onClick={onReply} />
        <IconActionButton icon={<Send size={22} />} label="發佈至 Threads" onClick={onThread} />
        <IconActionButton icon={<Save size={22} />} label="儲存模板" onClick={onSave} />
      </div>
    </div>
  );
}

function IconActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      className="group flex-1 flex flex-col items-center justify-center py-2 rounded-lg bg-white/60 hover:bg-blue-100 transition border border-blue-100 shadow relative"
      onClick={onClick}
      type="button"
    >
      {icon}
      <span className="text-xs mt-1 text-blue-700 font-medium opacity-80 group-hover:opacity-100 transition-all">{label}</span>
      <span className="absolute bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
        {label}
      </span>
    </button>
  );
} 