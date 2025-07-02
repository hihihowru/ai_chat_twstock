"use client";
import React, { useState, useEffect } from "react";

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

const SelectedGroupDisplay: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<CustomGroup | null>(null);

  useEffect(() => {
    const savedGroup = localStorage.getItem('selected_custom_group');
    if (savedGroup) {
      try {
        setSelectedGroup(JSON.parse(savedGroup));
      } catch (error) {
        console.error('Error parsing saved group:', error);
      }
    }
  }, []);

  const handleClick = async () => {
    if (!selectedGroup) return;
    
    try {
      console.log('[SelectedGroupDisplay] 點擊自選股清單，準備跳轉到 MVP 頁面');
      console.log('[SelectedGroupDisplay] 清單名稱:', selectedGroup.DocName);
      console.log('[SelectedGroupDisplay] 股票代號:', selectedGroup.ItemList);
      console.log('[SelectedGroupDisplay] 股票數量:', selectedGroup.ItemList.length);
      
      // 讀取 stock_alias_dict.json
      const res = await fetch('/stock_alias_dict.json');
      const aliasMap = await res.json();
      
      // 將股票代號轉換為中文名稱
      const names = selectedGroup.ItemList.map(id => {
        const aliases = aliasMap[id];
        return aliases && aliases.length > 0 ? `${id} ${aliases[0]}` : id;
      });
      
      // 構建問題字串
      const question = `自選股摘要:[${names.join(', ')}]`;
      console.log('[SelectedGroupDisplay] 構建問題字串:', question);
      console.log('[SelectedGroupDisplay] 準備跳轉到:', `/mvp?question=${encodeURIComponent(question)}`);
      
      // 跳轉到 MVP 頁面並帶上問題參數
      window.location.href = `/mvp?question=${encodeURIComponent(question)}`;
      
    } catch (error) {
      console.error('[SelectedGroupDisplay] 跳轉失敗:', error);
      // 如果讀取別名字典失敗，使用原始股票代號
      const question = `自選股摘要:[${selectedGroup.ItemList.join(', ')}]`;
      console.log('[SelectedGroupDisplay] 使用原始股票代號構建問題:', question);
      window.location.href = `/mvp?question=${encodeURIComponent(question)}`;
    }
  };

  if (!selectedGroup) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div 
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-blue-800">
          當前自選股清單: {selectedGroup.DocName}
        </h3>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
            {selectedGroup.ItemList.length} 檔股票
          </span>
          <span className="text-blue-600 text-sm">點擊查看摘要 →</span>
        </div>
      </div>
      
      <div className="text-sm text-blue-600 mb-3">
        建立時間: {formatDate(selectedGroup.CreateTime)}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedGroup.ItemList.map((stockId, index) => (
          <span
            key={index}
            className="bg-white text-blue-700 text-sm px-3 py-1 rounded border border-blue-200"
          >
            {stockId}
          </span>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-blue-500 text-center">
        點擊此卡片開始自選股摘要分析
      </div>
    </div>
  );
};

export default SelectedGroupDisplay; 