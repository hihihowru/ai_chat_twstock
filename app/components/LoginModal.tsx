import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (token: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const body = new URLSearchParams({
        grant_type: 'password',
        login_method: 'email',
        client_id: 'cmchipkmobile',
        account,
        password
      });
      const res = await fetch('/api/proxy_login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('cmoney_token', data.access_token);
        onLogin(data.access_token);
        onClose();
      } else {
        setError(data.error_description || '登入失敗');
      }
    } catch (e) {
      setError('登入失敗，請檢查網路或帳密');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm mx-4">
        <h2 className="text-lg font-bold mb-4">會員登入</h2>
        <div className="space-y-4">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="帳號 (email)"
            value={account}
            onChange={e => setAccount(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="密碼"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '登入中...' : '登入'}
          </button>
          <button 
            className="w-full text-gray-500 hover:text-gray-700 py-2 transition-colors" 
            onClick={onClose}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 