import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';

export default function AskQuestionBar({ onSubmit }: { onSubmit: (q: string) => void }) {
  const [value, setValue] = useState('');

  const handleMic = () => {
    alert('語音輸入功能開發中');
  };

  return (
    <form
      className="fixed left-0 right-0 bottom-16 z-40 flex justify-center pointer-events-none"
      onSubmit={e => {
        e.preventDefault();
        if (value.trim()) {
          onSubmit(value);
          setValue('');
        }
      }}
    >
      <div className="w-full max-w-md flex bg-white/80 backdrop-blur border border-gray-200/50 rounded-xl shadow-lg p-2 gap-2 pointer-events-auto">
        <input
          className="flex-1 bg-transparent outline-none px-3 text-gray-800 placeholder-gray-400 text-sm"
          type="text"
          placeholder="請輸入你的問題..."
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button
          type="button"
          onClick={handleMic}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-md hover:bg-[#B97A57]/10 transition-all"
        >
          <Mic size={22} className="text-[#B97A57]" />
        </button>
        <button
          type="submit"
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-md hover:bg-[#B97A57]/10 transition-all"
        >
          <Send size={22} className="text-[#B97A57]" />
        </button>
      </div>
    </form>
  );
} 