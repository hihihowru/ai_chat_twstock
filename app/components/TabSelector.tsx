'use client';

import React from 'react';

interface TabSelectorProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export default function TabSelector({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}: TabSelectorProps) {
  return (
    <div className={`flex gap-2 mb-4 overflow-x-auto ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
            activeTab === tab
              ? 'bg-[#B97A57]/80 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-[#B97A57]/10'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
} 