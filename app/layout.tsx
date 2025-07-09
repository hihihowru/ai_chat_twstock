import '../styles/globals.css'
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
