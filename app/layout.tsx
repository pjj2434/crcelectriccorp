// app/layout.tsx (Server Component)
import type { Metadata } from 'next'

import "./globals.css";

export const metadata: Metadata = {
  title: 'CRC Electric | Expert Electrical Services in Long Island, NY',
  description: 'CRC Electric provides licensed electrical services including lighting, panel upgrades, wiring, and installations across Nassau & Suffolk County. Free estimates!',
  
  // Add favicon configuration
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
    shortcut: '/favicon.ico'
  },
  manifest: '/site.webmanifest',
  
  openGraph: {
    url: 'https://crcelectriccorp.vercel.app',
    type: 'website',
    title: 'CRC Electric | Expert Electrical Services in Long Island, NY',
    description: 'CRC Electric provides licensed electrical services including lighting, panel upgrades, wiring, and installations across Nassau & Suffolk County. Free estimates!',
    images: ['/logo.PNG'],
  },
  twitter: {
    card: 'summary_large_image',
    site: 'crcelectriccorp.com',
    title: 'CRC Electric | Expert Electrical Services in Long Island, NY',
    description: 'CRC Electric provides licensed electrical services including lighting, panel upgrades, wiring, and installations across Nassau & Suffolk County. Free estimates!',
    images: ['/logo.PNG'],
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
       {children}
      </body>
    </html>
  )
}
