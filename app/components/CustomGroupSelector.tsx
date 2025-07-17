"use client";
import React from "react";

interface CustomGroup {
  Order: number;
  DocType: number;
  DocNo: number;
  MemberId: number;
  DocName: string;
  Flag: number;
  DocRight: string;
  SP_CMID: string;
  CreateTime: string;
  ItemList: string[];
}

interface CustomGroupSelectorProps {
  groups: CustomGroup[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (group: CustomGroup) => void;
}

const CustomGroupSelector: React.FC<CustomGroupSelectorProps> = ({
  groups,
  isOpen,
  onClose,
  onSelect
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">選擇自選股清單</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">目前沒有自選股清單</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group, index) => (
              <div
                key={group.DocNo}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#B97A57] hover:shadow-md transition-all cursor-pointer"
                onClick={async () => {
                  console.log('[CustomGroupSelector] 點擊自選股清單');
                  console.log('[CustomGroupSelector] 清單名稱:', group.DocName);
                  console.log('[CustomGroupSelector] 股票代號:', group.ItemList);
                  console.log('[CustomGroupSelector] 股票數量:', group.ItemList.length);
                  
                  onSelect(group);
                  const question = `自選股摘要:[${group.ItemList.join(',')}]`;
                  console.log('[CustomGroupSelector] 構建問題字串:', question);
                  console.log('[CustomGroupSelector] 準備跳轉到:', `/mvp?question=${encodeURIComponent(question)}&autoTrigger=true`);
                  window.location.href = `/mvp?question=${encodeURIComponent(question)}&autoTrigger=true`;
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {group.DocName}
                  </h3>
                  <span className="bg-[#B97A57]/20 text-[#B97A57] text-xs font-medium px-2 py-1 rounded">
                    {group.ItemList.length} 檔股票
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  建立時間: {formatDate(group.CreateTime)}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {group.ItemList.slice(0, 10).map((stockId, stockIndex) => (
                    <span
                      key={stockIndex}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {stockId}
                    </span>
                  ))}
                  {group.ItemList.length > 10 && (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                      +{group.ItemList.length - 10} 檔
                    </span>
                  )}
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  點擊選擇此清單進行分析
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#B97A57]/80 hover:bg-[#B97A57] text-white rounded-xl shadow-md transition-all font-semibold"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomGroupSelector; 