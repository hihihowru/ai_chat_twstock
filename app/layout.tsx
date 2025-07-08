import '../styles/globals.css'
import HeaderWithLogin from './components/HeaderWithLogin';
import Breadcrumb from './components/Breadcrumb';

export const metadata = {
  title: 'AI Chat',
  description: 'Smart Assistant'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <HeaderWithLogin />
        <div className="min-h-screen bg-[#FAF7F3]">
          {/* Breadcrumb 區域 */}
          <div className="px-6 py-3 bg-[#F5F3EF]/60 backdrop-blur border-b border-gray-200">
            <Breadcrumb />
          </div>
          {/* 主要內容區域 */}
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
