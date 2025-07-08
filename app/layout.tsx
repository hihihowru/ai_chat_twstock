import '../styles/globals.css'
import Breadcrumb from './components/Breadcrumb';
import { SidebarProvider } from './components/SidebarProvider';

export const metadata = {
  title: 'AI Chat',
  description: 'Smart Assistant'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <SidebarProvider>
          <div className="min-h-screen bg-[#FAF7F3]">
            {/* 主要內容區域 */}
            <div className="pl-0 transition-all duration-300">
              {/* Breadcrumb 區域 */}
              <div className="px-6 py-3 bg-[#F5F3EF]/60 backdrop-blur border-b border-gray-200">
                <Breadcrumb />
              </div>
              <main>
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
