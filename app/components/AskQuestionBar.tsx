import React, { useState } from 'react';

export default function AskQuestionBar({ onSubmit }: { onSubmit: (q: string) => void }) {
  const [value, setValue] = useState('');
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
      <div className="w-full max-w-md flex bg-white/60 backdrop-blur border border-gray-200 rounded-xl shadow-lg p-2 gap-2 pointer-events-auto">
        <input
          className="flex-1 bg-transparent outline-none px-3 text-gray-800 placeholder-gray-400 text-sm"
          type="text"
          placeholder="請輸入你的問題..."
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-1 rounded bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"
        >
          發問
        </button>
      </div>
    </form>
  );
} 