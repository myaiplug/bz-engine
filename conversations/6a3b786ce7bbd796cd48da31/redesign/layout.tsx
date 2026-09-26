import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BZ — Creative Engine | Brian Jutz',
  description:
    'Brian "BZ" Jutz — Creative Technologist. Audio systems, AI infrastructure, and software products, engineered as one machine.',
  openGraph: {
    title: 'BZ — Creative Engine',
    description:
      'An interactive engine at the intersection of audio technology, AI systems, and creative software.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#06070b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
