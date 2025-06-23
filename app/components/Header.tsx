import React from 'react';
import { Menu, Star, StarOff } from 'lucide-react';

export default function Header({
  onToggleSidebar,
  onBookmark,
  isBookmarked,
  title = '聊天中...'
}: {
  onToggleSidebar: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
  title?: string;
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-md shadow-md flex items-center justify-between px-4 h-14 text-gray-800">
      <button onClick={onToggleSidebar} className="p-2 rounded hover:bg-white/50 transition">
        <Menu size={24} />
      </button>
      <div className="font-bold text-base select-none">{title}</div>
      <button onClick={onBookmark} className="p-2 rounded hover:bg-white/50 transition">
        {isBookmarked ? <Star className="text-yellow-400 fill-yellow-300" size={24} /> : <StarOff size={24} />}
      </button>
    </header>
  );
} 