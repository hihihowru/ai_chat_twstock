import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';

interface UnifiedInputBarProps {
  onSubmit: (question: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showMic?: boolean;
  onMicClick?: () => void;
}

export default function UnifiedInputBar({
  onSubmit,
  placeholder = "請輸入你的問題...",
  disabled = false,
  className = "",
  showMic = true,
  onMicClick
}: UnifiedInputBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value);
      setValue('');
    }
  };

  const handleMicClick = () => {
    if (onMicClick) {
      onMicClick();
    } else {
      alert('語音輸入功能開發中');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-md p-3">
        <input
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm font-medium"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        {showMic && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={disabled}
            className="flex items-center justify-center bg-[#B97A57]/60 hover:bg-[#B97A57]/80 text-white rounded-full shadow-md w-10 h-10 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic size={18} />
          </button>
        )}
        
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex items-center justify-center bg-[#B97A57]/80 hover:bg-[#B97A57] text-white font-semibold rounded-xl shadow-md px-4 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
} 