'use client'
import dynamic from 'next/dynamic'
import { useMouseTracker } from './hooks/useMouseTracker'
import { CustomCursor } from './components/ui/CustomCursor'
import { HUDNavigation } from './components/ui/HUDNavigation'
import { OpeningSequence } from './components/engine/OpeningSequence'

// Dynamic import — no SSR for WebGL
const BZUniverse = dynamic(
  () =>
    import('./components/engine/BZUniverse').then((m) => ({ default: m.BZUniverse })),
  { ssr: false }
)

function MouseTracker() {
  useMouseTracker()
  return null
}

export default function Home() {
  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#06070b',
        cursor: 'none',
      }}
    >
      <MouseTracker />

      {/* Full-screen WebGL canvas */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <BZUniverse />
      </div>

      {/* 2D overlay: opening text + CTA */}
      <OpeningSequence />

      {/* HUD Navigation */}
      <HUDNavigation />

      {/* Atmosphere: grain + vignette */}
      <div className="grain-overlay" />
      <div className="vignette-overlay" />

      {/* Custom cursor */}
      <CustomCursor />
    </main>
  )
}
