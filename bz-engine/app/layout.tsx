import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BZ — Inside The Creative Engine',
  description:
    'Brian "BZ" Jutz — Creative Technologist. Audio Innovation. AI Systems. Digital Experiences.',
  openGraph: {
    title: 'BZ — Inside The Creative Engine',
    description: 'An interactive digital experience at the intersection of audio technology, AI systems, and creative innovation.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#020204', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
