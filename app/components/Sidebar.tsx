import React from 'react';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';

export default function Sidebar({
  open,
  onClose,
  bookmarkedReplies,
  onSelect,
  onRemove
}: {
  open: boolean;
  onClose: () => void;
  bookmarkedReplies: { id: string; content: string }[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.aside
      initial={{ x: -320 }}
      animate={{ x: open ? 0 : -320 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-full w-72 bg-white/30 backdrop-blur-md shadow-md z-50 flex flex-col p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-lg">已收藏回覆</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/50 transition"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {bookmarkedReplies.length === 0 ? (
          <div className="text-gray-400 text-sm text-center mt-8">尚未收藏任何回覆</div>
        ) : (
          bookmarkedReplies.map(r => (
            <div key={r.id} className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2 shadow hover:bg-blue-50 cursor-pointer group">
              <Star className="text-yellow-400 fill-yellow-300" size={18} />
              <span className="flex-1 text-sm truncate" onClick={() => onSelect(r.id)}>{r.content}</span>
              <button onClick={() => onRemove(r.id)} className="opacity-0 group-hover:opacity-100 p-1 ml-1"><X size={16} /></button>
            </div>
          ))
        )}
      </div>
    </motion.aside>
  );
} 