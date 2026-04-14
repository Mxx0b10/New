import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Manish Patel — UX Designer',
  description: 'Interactive 3D resume of Manish Patel, UX/UI Designer based in New Delhi.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
