'use client'
import { useEngineStore, WorldId } from '../../store/useEngineStore'

const worldLabels: Record<WorldId, string> = {
  opening: '',
  hub: 'Engine Core',
  audio: 'Audio Innovation',
  ai: 'AI Systems',
  software: 'Software Products',
  screwai: 'ScrewAI',
  creative: 'Creative Technology',
  design: 'Design Systems',
  automation: 'Automation',
  about: 'About',
}

export function HUDNavigation() {
  const currentWorld = useEngineStore((s) => s.currentWorld)
  const travelTo = useEngineStore((s) => s.travelTo)
  const hasEntered = useEngineStore((s) => s.hasEntered)

  if (!hasEntered || currentWorld === 'opening') return null

  return (
    <>
      {/* Top-left: current world label */}
      <div
        style={{
          position: 'fixed',
          top: '28px',
          left: '32px',
          zIndex: 100,
          color: 'rgba(255,255,255,0.35)',
          fontSize: '10px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          fontFamily: 'system-ui, sans-serif',
          pointerEvents: 'none',
        }}
      >
        BZ / {worldLabels[currentWorld]}
      </div>

      {/* Bottom-right: hub return */}
      {currentWorld !== 'hub' && (
        <button
          onClick={() => travelTo('hub')}
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '32px',
            zIndex: 100,
            background: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '9px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            padding: '8px 16px',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
          }}
        >
          ← Engine Core
        </button>
      )}

      {/* Bottom-left: about */}
      <button
        onClick={() => travelTo('about')}
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '32px',
          zIndex: 100,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontFamily: 'system-ui, sans-serif',
          padding: 0,
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.25)'
        }}
      >
        About
      </button>
    </>
  )
}
