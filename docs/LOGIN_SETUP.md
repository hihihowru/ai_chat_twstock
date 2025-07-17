# 登入功能設置指南

## 概述

本專案已整合了完整的登入系統，包括：
- 電子郵件/密碼登入（使用 CMoney API）
- Google OAuth 登入（開發中）
- 登入狀態管理
- 用戶介面整合

## 功能特點

### 1. 登入狀態檢測
- 自動檢測用戶是否已登入
- 未登入用戶會看到登入按鈕
- 已登入用戶會看到個人化內容

### 2. 登入方式
- **電子郵件登入**：使用 CMoney 帳戶
- **Google 登入**：使用 Google 帳戶（開發中）

### 3. 用戶介面
- 主頁面右上角登入按鈕
- Sidebar 中的登入/登出功能
- 美觀的登入彈窗
- 響應式設計

## 設置步驟

### 1. 環境變數設置

複製 `env.local.example` 到 `.env.local` 並填入相應的值：

```bash
cp env.local.example .env.local
```

### 2. Google OAuth 設置（可選）

如果要啟用 Google 登入：

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用 Google+ API
4. 創建 OAuth 2.0 憑證
5. 設置授權的重定向 URI：`http://localhost:3000/auth/callback`
6. 將 Client ID 和 Client Secret 填入 `.env.local`

### 3. CMoney API 設置

確保 CMoney API 配置正確：

```env
CMONEY_API_BASE_URL=https://api.cmoney.com.tw
CMONEY_CLIENT_ID=cmchipkmobile
```

## 使用方式

### 開發者

1. **啟動開發伺服器**：
   ```bash
   npm run dev
   ```

2. **測試登入功能**：
   - 點擊右上角「會員登入」按鈕
   - 選擇登入方式（電子郵件或 Google）
   - 完成登入流程

### 用戶

1. **未登入狀態**：
   - 看到登入按鈕
   - 無法查看個人化內容
   - 無法使用自選股功能

2. **已登入狀態**：
   - 看到個人化投資組合
   - 可以使用自選股功能
   - 可以查看個人化分析

## 檔案結構

```
app/
├── components/
│   ├── LoginModal.tsx          # 登入彈窗組件
│   ├── HeaderWithLogin.tsx     # 帶登入功能的頁首
│   └── Sidebar.tsx             # 側邊欄（包含登入狀態）
├── hooks/
│   └── useUserSystem.ts        # 用戶狀態管理 Hook
├── lib/
│   └── auth.ts                 # 認證工具函數
└── page.tsx                    # 主頁面（整合登入功能）
```

## API 端點

### 現有端點
- `/api/proxy_login` - CMoney 登入 API
- `/api/proxy_custom_group` - 自選股群組 API

### 計劃中的端點
- `/api/auth/google/callback` - Google OAuth 回調
- `/api/auth/validate` - Token 驗證

## 安全性考量

1. **Token 存儲**：使用 localStorage 存儲用戶 token
2. **Token 驗證**：定期驗證 token 有效性
3. **登出清理**：登出時清除所有相關資料
4. **HTTPS**：生產環境必須使用 HTTPS

## 故障排除

### 常見問題

1. **登入失敗**：
   - 檢查 CMoney API 配置
   - 確認網路連接
   - 檢查瀏覽器控制台錯誤

2. **Google 登入無法使用**：
   - 確認 Google OAuth 配置
   - 檢查重定向 URI 設置
   - 確認 Client ID 正確

3. **登入狀態不正確**：
   - 清除瀏覽器快取
   - 檢查 localStorage 中的 token
   - 重新登入

## 未來改進

1. **社交登入**：加入 Facebook、Apple 等登入方式
2. **雙因素認證**：增加安全性
3. **記住登入狀態**：延長登入有效期
4. **用戶資料管理**：個人資料編輯功能
5. **登入歷史**：查看登入記錄

## 技術細節

### 狀態管理
- 使用 React Hooks 管理用戶狀態
- localStorage 持久化存儲
- 自動狀態同步

### UI/UX
- 響應式設計
- 載入狀態指示
- 錯誤處理和提示
- 無障礙設計

### 安全性
- Token 驗證
- 安全的 API 調用
- 用戶資料保護 