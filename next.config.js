/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // 使用環境變數，預設為 localhost:8000
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    
    // 確保 API_BASE_URL 是有效的 URL
    if (!API_BASE_URL || !API_BASE_URL.startsWith('http')) {
      console.warn('Warning: API_BASE_URL is not set or invalid, using default localhost:8000');
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
      ];
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 