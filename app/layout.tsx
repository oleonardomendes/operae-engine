import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Guiamos',
  description: 'Sua loja pronta. De uma conversa.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
