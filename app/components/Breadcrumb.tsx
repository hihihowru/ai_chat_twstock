'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

// 頁面路徑映射
const pageTitles: Record<string, string> = {
  '/': '首頁',
  '/chat': 'AI 聊天',
  '/watchlist': '自選股',
};

// 動態路徑標題生成（未來會員系統用）
const getDynamicTitle = (pathname: string): string => {
  // 未來可以根據路徑參數生成動態標題
  // 例如：/chat/thread-123 → "對話 #123"
  if (pathname.startsWith('/chat/')) {
    return '對話歷史';
  }
  return '';
};

interface BreadcrumbProps {
  className?: string;
}

export default function Breadcrumb({ className = '' }: BreadcrumbProps) {
  const pathname = usePathname();
  
  // 生成 breadcrumb 項目
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { path: '/', title: '首頁', icon: <Home size={16} /> }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const title = pageTitles[currentPath] || getDynamicTitle(currentPath) || segment;
      breadcrumbs.push({
        path: currentPath,
        title,
        icon: null
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // 如果只有首頁，不顯示 breadcrumb
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}>
      {breadcrumbs.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index > 0 && (
            <ChevronRight size={14} className="mx-1 text-gray-400" />
          )}
          {index === breadcrumbs.length - 1 ? (
            // 最後一項不點擊
            <span className="flex items-center space-x-1 text-gray-900 font-medium">
              {item.icon}
              <span>{item.title}</span>
            </span>
          ) : (
            // 可點擊的導航
            <Link
              href={item.path}
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
} 