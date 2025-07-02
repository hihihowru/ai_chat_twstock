// 測試後端連接的腳本
const testBackendConnection = async (backendUrl) => {
  console.log(`🔍 測試後端連接: ${backendUrl}`);
  
  try {
    // 測試健康檢查
    const healthResponse = await fetch(`${backendUrl}/docs`);
    console.log(`📊 健康檢查: ${healthResponse.status}`);
    
    // 測試登入 API
    const loginResponse = await fetch(`${backendUrl}/api/proxy_login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=password&login_method=account&client_id=test&account=test&password=test'
    });
    
    console.log(`🔐 登入 API: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('✅ 後端連接正常');
      return true;
    } else {
      console.log('❌ 後端 API 錯誤');
      return false;
    }
    
  } catch (error) {
    console.log(`❌ 連接失敗: ${error.message}`);
    return false;
  }
};

// 測試多個可能的後端 URL
const testUrls = [
  'https://your-backend-domain.com',
  'https://ai-chatbot-proxy.herokuapp.com',
  'https://ai-chatbot-proxy.railway.app',
  'https://ai-chatbot-proxy.onrender.com',
  'https://ai-chatbot-proxy.fly.dev'
];

console.log('🚀 開始測試後端連接...');

testUrls.forEach(url => {
  testBackendConnection(url);
}); 