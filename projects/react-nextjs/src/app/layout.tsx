import './globals.css'
import type { Metadata } from 'next'

import Layout from '@/sections/common/Layout'

export const metadata: Metadata = {
  title: 'React + Next.js Template',
  description: 'React + Next.js Template',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/globe.svg?svg" type="image/svg" />
      </head>
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
