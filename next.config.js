/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // 使用環境變數，預設為 localhost:8000
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 