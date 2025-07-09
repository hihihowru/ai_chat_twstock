# 自選股 Section 兩層確認機制

## 概述

首頁的第一個 section（自選股健康度檢查）採用兩層確認機制，確保只有滿足條件的用戶才能看到個人化的投資組合資訊。

## 兩層確認條件

### 第一層：用戶登入狀態檢查
- **檢查項目**：`localStorage.getItem('cmoney_token')`
- **邏輯**：檢查用戶是否已成功登入並獲得 token
- **結果**：`isLoggedIn` 狀態

### 第二層：自選股清單檢查
- **檢查項目**：
  - `localStorage.getItem('custom_stock_list')` - 自定義股票清單
  - `localStorage.getItem('selected_custom_group')` - 已選擇的自選股群組
- **邏輯**：檢查用戶是否有自選股清單或已選擇自選股群組
- **結果**：`hasWatchlist` 狀態

## 顯示邏輯

```typescript
const shouldShowWatchlistSection = isLoggedIn && hasWatchlist;
```

### 顯示條件
- ✅ **顯示自選股 section**：`isLoggedIn = true` AND `hasWatchlist = true`
- ❌ **顯示提示區塊**：其他情況

## 組件架構

### 1. useUserStatus Hook
**位置**：`app/hooks/useUserStatus.ts`

**功能**：
- 管理用戶登入狀態
- 檢查自選股清單
- 提供統一的狀態管理

**返回值**：
```typescript
interface UserStatus {
  isLoggedIn: boolean;
  hasWatchlist: boolean;
  isLoading: boolean;
  shouldShowWatchlistSection: boolean;
}
```

### 2. WatchlistPrompt 組件
**位置**：`app/components/WatchlistPrompt.tsx`

**功能**：
- 顯示未登入用戶的登入提示
- 顯示已登入但無自選股用戶的建立提示
- 提供相應的操作按鈕

### 3. 首頁組件
**位置**：`app/page.tsx`

**邏輯**：
```typescript
{shouldShowWatchlistSection ? (
  // 顯示自選股健康度檢查 section
  <WatchlistSection />
) : (
  // 顯示提示區塊
  <WatchlistPrompt 
    isLoggedIn={isLoggedIn}
    hasWatchlist={hasWatchlist}
    onLoginClick={handleLoginClick}
    onCreateWatchlistClick={handleCreateWatchlistClick}
  />
)}
```

## 用戶體驗流程

### 場景 1：未登入用戶
1. 用戶訪問首頁
2. 系統檢查 `cmoney_token` → 不存在
3. 顯示登入提示區塊
4. 用戶點擊「立即登入」按鈕
5. 跳轉到登入頁面

### 場景 2：已登入但無自選股
1. 用戶已登入（有 `cmoney_token`）
2. 系統檢查自選股清單 → 不存在
3. 顯示建立自選股提示區塊
4. 用戶點擊「建立自選股」按鈕
5. 跳轉到自選股選擇頁面

### 場景 3：已登入且有自選股
1. 用戶已登入（有 `cmoney_token`）
2. 系統檢查自選股清單 → 存在
3. 顯示自選股健康度檢查 section
4. 用戶可以看到個人化的投資組合資訊

## 技術實現細節

### 狀態檢查時機
- 組件掛載時（`useEffect`）
- 每次頁面重新載入時

### 本地存儲項目
```typescript
// 登入狀態
localStorage.getItem('cmoney_token')

// 自選股相關
localStorage.getItem('custom_stock_list')
localStorage.getItem('selected_custom_group')
```

### 錯誤處理
- 如果檢查過程中發生錯誤，預設為未登入狀態
- 提供適當的錯誤日誌記錄

## 未來擴展

### 可能的改進
1. **實時狀態更新**：監聽 localStorage 變化，實時更新狀態
2. **服務器端驗證**：結合服務器端 API 驗證用戶狀態
3. **緩存機制**：緩存用戶狀態，減少重複檢查
4. **離線支持**：支持離線狀態下的基本功能

### 新增功能
1. **多自選股群組**：支持多個自選股群組的切換
2. **自選股同步**：與服務器端自選股數據同步
3. **個性化設置**：根據用戶偏好調整顯示內容

## 測試案例

### 測試場景
1. **未登入狀態**：清除所有 localStorage，確認顯示登入提示
2. **已登入無自選股**：只設置 token，確認顯示建立自選股提示
3. **完整狀態**：設置 token 和自選股，確認顯示自選股 section
4. **錯誤處理**：模擬檢查失敗，確認預設行為

### 測試方法
```javascript
// 測試未登入狀態
localStorage.clear();

// 測試已登入無自選股
localStorage.setItem('cmoney_token', 'test-token');

// 測試完整狀態
localStorage.setItem('cmoney_token', 'test-token');
localStorage.setItem('custom_stock_list', JSON.stringify(['2330', '2317']));
``` 