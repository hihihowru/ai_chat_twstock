// Google OAuth 配置
export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  scope: 'openid email profile',
};

// 檢查是否已登入
export const checkAuthStatus = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('cmoney_token');
  return !!token;
};

// 獲取用戶 token
export const getUserToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cmoney_token');
};

// 設置用戶 token
export const setUserToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cmoney_token', token);
};

// 清除用戶 token
export const clearUserToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cmoney_token');
  localStorage.removeItem('selected_custom_group');
  localStorage.removeItem('custom_stock_list');
};

// Google OAuth 登入 URL 生成
export const getGoogleAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    response_type: 'code',
    scope: GOOGLE_OAUTH_CONFIG.scope,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// 處理 Google OAuth 回調
export const handleGoogleCallback = async (code: string): Promise<any> => {
  try {
    const response = await fetch('/api/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Google OAuth callback failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    throw error;
  }
};

// 驗證 token 有效性
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}; 