import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '아이디어 보관함',
  description: '쌓아온 아이디어들의 기록',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
