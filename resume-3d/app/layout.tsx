import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const GA_ID = 'G-QZ595QWJL3'

export const metadata: Metadata = {
  title       : 'Manish Patel — UX Designer',
  description : 'Interactive 3D resume of Manish Patel, UX/UI Designer based in New Delhi.',
  metadataBase: new URL('https://manishresume.vercel.app'),
  openGraph: {
    title      : 'Manish Patel — UX Designer',
    description: 'Interactive 3D resume — click the paper to read it.',
    url        : 'https://manishresume.vercel.app',
    siteName   : 'Manish Patel',
    images: [
      {
        url   : '/preview.png',
        width : 1200,
        height: 630,
        alt   : 'Manish Patel 3D Resume Preview',
      },
    ],
    locale: 'en_US',
    type  : 'website',
  },
  twitter: {
    card       : 'summary_large_image',
    title      : 'Manish Patel — UX Designer',
    description: 'Interactive 3D resume — click the paper to read it.',
    images     : ['/preview.png'],
  },
  icons: {
    icon    : '/favicon.svg',
    shortcut: '/favicon.svg',
    apple   : '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
