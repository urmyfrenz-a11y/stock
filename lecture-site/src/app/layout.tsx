import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '전문 강사 | LTE/5G, IoT, AI, 네트워크 전문 교육',
  description: '25년 이상의 현장 경험을 바탕으로 정부기관, 통신사, 대기업에서 신뢰받는 IT 전문 강사. LTE/5G, IoT, TCP/IP, 생성형 AI, 데이터 사이언스 교육.',
  keywords: 'LTE 5G 교육, IoT 강의, TCP/IP 네트워크, 생성형 AI, 데이터 사이언스, 기업교육, 통신 전문강사',
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
