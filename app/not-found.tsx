import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F3] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">頁面未找到</h2>
          <p className="text-gray-600 mb-4">
            很抱歉，您要尋找的頁面不存在。
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-block bg-[#B97A57] hover:bg-[#B97A57]/90 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          回到首頁
        </Link>
      </div>
    </div>
  );
} 