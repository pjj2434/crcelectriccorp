// app/layout.tsx (Server Component)
import type { Metadata } from 'next'

import "./globals.css";

export const metadata: Metadata = {
  title: 'CRC Electric | Expert Electrical Services in Long Island, NY',
  description: 'CRC Electric provides licensed electrical services including lighting, panel upgrades, wiring, and installations across Nassau & Suffolk County. Free estimates!',
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
