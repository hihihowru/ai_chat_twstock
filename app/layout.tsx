
import '../styles/globals.css'

export const metadata = {
  title: 'AI Chat',
  description: 'Smart Assistant'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  )
}
