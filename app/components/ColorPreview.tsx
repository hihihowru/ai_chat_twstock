'use client';

import { useState } from 'react';

// 按鈕主色選項
const colorOptions = [
  {
    name: '溫暖橘',
    primary: '#FFB86B',
    hover: '#FFA54F',
    description: '活力、友善的感覺'
  },
  {
    name: '珊瑚橘',
    primary: '#FF7F50',
    hover: '#FF6347',
    description: '現代、時尚的感覺'
  },
  {
    name: '淡金',
    primary: '#F6C177',
    hover: '#F4B860',
    description: '專業、穩重的感覺'
  },
  {
    name: '暖棕',
    primary: '#D4A574',
    hover: '#C19A6B',
    description: '自然、沉穩的感覺'
  },
  {
    name: '暖綠',
    primary: '#7FB069',
    hover: '#6B9A5A',
    description: '成長、投資的感覺'
  }
];

interface ColorPreviewProps {
  onColorSelect?: (color: typeof colorOptions[0]) => void;
}

export default function ColorPreview({ onColorSelect }: ColorPreviewProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorSelect = (color: typeof colorOptions[0]) => {
    setSelectedColor(color.primary);
    onColorSelect?.(color);
  };

  return (
    <div className="p-6 bg-[#F5F3EF]/80 backdrop-blur rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-[#232323]">選擇按鈕主色</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colorOptions.map((color) => (
          <div
            key={color.primary}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedColor === color.primary
                ? 'border-[#232323] shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleColorSelect(color)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color.primary }}
              />
              <div>
                <h4 className="font-medium text-[#232323]">{color.name}</h4>
                <p className="text-sm text-[#666666]">{color.description}</p>
              </div>
            </div>
            
            {/* 按鈕預覽 */}
            <div className="space-y-2">
              <button
                className="w-full py-2 px-4 rounded-lg text-white font-medium transition-colors"
                style={{ 
                  backgroundColor: color.primary,
                  ':hover': { backgroundColor: color.hover }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = color.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = color.primary;
                }}
              >
                主要按鈕
              </button>
              
              <button
                className="w-full py-2 px-4 rounded-lg border-2 font-medium transition-colors"
                style={{ 
                  borderColor: color.primary,
                  color: color.primary
                }}
              >
                次要按鈕
              </button>
            </div>
            
            {/* 顏色代碼 */}
            <div className="mt-3 text-xs text-[#666666]">
              <div>主色: {color.primary}</div>
              <div>Hover: {color.hover}</div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedColor && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            ✅ 已選擇: {colorOptions.find(c => c.primary === selectedColor)?.name}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            點擊下方按鈕套用到整個網站
          </p>
        </div>
      )}
    </div>
  );
} 