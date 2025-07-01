"use client";
import React, { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import CustomGroupSelector from "../components/CustomGroupSelector";

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

const HeaderWithLogin: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomGroupSelector, setShowCustomGroupSelector] = useState(false);
  const [customGroups, setCustomGroups] = useState<CustomGroup[]>([]);
  const [userToken, setUserToken] = useState<string>("");

  useEffect(() => {
    // 每次 refresh 自動清除 token 與自選股
    localStorage.removeItem('cmoney_token');
    localStorage.removeItem('selected_custom_group');
    localStorage.removeItem('custom_stock_list');
    setIsLoggedIn(false);
    setUserToken('');
    setIsLoading(false);
  }, []);

  const handleLogin = async (token: string) => {
    setIsLoggedIn(true);
    setUserToken(token);
    
    try {
      let res = await fetch('/api/proxy_custom_group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        },
        body: new URLSearchParams({
          Action: 'getcustomgroupwithorderandlist',
          docType: 'stock'
        })
      });
      
      if (res.ok) {
        let data = await res.json();
        if (data.Group && Array.isArray(data.Group)) {
          setCustomGroups(data.Group);
          setShowCustomGroupSelector(true);
        } else {
          console.log("No custom groups found or invalid response");
        }
      } else {
        console.error("Failed to fetch custom groups");
      }
    } catch (error) {
      console.error("Error fetching custom groups:", error);
    }
  };

  const handleGroupSelect = (selectedGroup: CustomGroup) => {
    localStorage.setItem('selected_custom_group', JSON.stringify(selectedGroup));
    localStorage.setItem('custom_stock_list', JSON.stringify(selectedGroup.ItemList));
    setShowCustomGroupSelector(false);
    
    window.location.reload();
  };

  if (isLoading) {
    return (
      <header className="w-full flex justify-end p-4 bg-white/80 backdrop-blur border-b">
        <div className="px-4 py-2 text-gray-500">載入中...</div>
      </header>
    );
  }

  return (
    <>
      <header className="w-full flex justify-end p-4 bg-white/80 backdrop-blur border-b">
        {!isLoggedIn ? (
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setShowLogin(true)}>
            會員登入
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-blue-600 font-bold">已登入</span>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowCustomGroupSelector(true)}
            >
              選擇自選股清單
            </button>
          </div>
        )}
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      </header>
      
      {showCustomGroupSelector && (
        <CustomGroupSelector 
          groups={customGroups}
          isOpen={showCustomGroupSelector}
          onClose={() => setShowCustomGroupSelector(false)}
          onSelect={handleGroupSelect}
        />
      )}
    </>
  );
};

export default HeaderWithLogin; 