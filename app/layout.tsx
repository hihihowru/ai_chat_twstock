import '../styles/globals.css'
import HeaderWithLogin from './components/HeaderWithLogin';

export const metadata = {
  title: 'AI Chat',
  description: 'Smart Assistant'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <HeaderWithLogin />
        {children}
      </body>
    </html>
  )
}
