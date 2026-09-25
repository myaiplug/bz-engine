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

const WORLDS: { id: WorldId; label: string; line: string }[] = [
  { id: 'audio', label: 'Audio', line: 'Stem waveforms. Click a strand to solo it.' },
  { id: 'ai', label: 'AI Systems', line: 'Models, agents, and the systems around them.' },
  { id: 'software', label: 'Software', line: 'NoDAW and the other products in the stack.' },
  { id: 'screwai', label: 'ScrewAI', line: 'Time-stretch chamber. Drag the slowdown.' },
  { id: 'creative', label: 'Creative', line: 'Installations and one-off machines.' },
  { id: 'automation', label: 'Automation', line: 'The pipes that keep the work moving.' },
  { id: 'about', label: 'About', line: 'Brian “BZ” Jutz. Creative technologist. Louisville.' },
]

export function HUDNavigation() {
  const currentWorld = useEngineStore((s) => s.currentWorld)
  const travelTo = useEngineStore((s) => s.travelTo)
  const hasEntered = useEngineStore((s) => s.hasEntered)

  if (!hasEntered || currentWorld === 'opening') return null

  const here = WORLDS.find((w) => w.id === currentWorld)

  return (
    <>
      {/* Top-left: current world label */}
      <div
        style={{
          position: 'fixed',
          top: '28px',
          left: '32px',
          zIndex: 100,
          color: '#f4f4f4',
          fontSize: '13px',
          letterSpacing: '0.22em',
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
            color: '#f4f4f4',
            fontSize: '12px',
            letterSpacing: '0.18em',
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
          color: '#f4f4f4',
          fontSize: '12px',
          letterSpacing: '0.18em',
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

      <nav
        style={{
          position: 'fixed',
          top: '72px',
          right: '28px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '280px',
        }}
      >
        {currentWorld !== 'hub' && here ? (
          <p
            style={{
              margin: '0 0 8px',
              color: '#f7f7f7',
              fontSize: '15px',
              lineHeight: 1.45,
              letterSpacing: '0.01em',
            }}
          >
            {here.line}
          </p>
        ) : null}
        {WORLDS.filter((w) => w.id !== 'about').map((world) => (
          <button
            key={world.id}
            type="button"
            onClick={() => travelTo(world.id)}
            style={{
              textAlign: 'left',
              background: currentWorld === world.id ? 'rgba(255,255,255,0.14)' : 'rgba(8,8,12,0.72)',
              border: '1px solid rgba(255,255,255,0.35)',
              color: '#f7f7f7',
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '10px 12px',
              cursor: 'pointer',
            }}
          >
            {world.label}
          </button>
        ))}
      </nav>
    </>
  )
}
