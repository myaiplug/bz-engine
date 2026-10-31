'use client'
import { useEngineStore, WorldId } from '../../store/useEngineStore'
import { getSystemsByWorld, System } from '../../data/systems'
import { useIsMobile } from '../../hooks/useIsMobile'

function StatusBadge({ status }: { status: System['status'] }) {
  const colors: Record<System['status'], string> = {
    live: '#7fe0d4',
    experiment: '#c9a96e',
    transfer: '#b39dff',
    attention: '#e05080',
  }
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '7px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: colors[status],
        border: `1px solid ${colors[status]}40`,
        padding: '2px 6px',
        borderRadius: '2px',
      }}
    >
      {status}
    </span>
  )
}

function SystemCard({ system }: { system: System }) {
  return (
    <div
      style={{
        padding: '14px 0',
        borderBottom: '1px solid rgba(232,234,240,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              color: '#f4f6fb',
            }}
          >
            {system.name}
          </span>
          {system.grokAssisted && (
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '7px',
                letterSpacing: '0.15em',
                color: '#8fb2ff',
                opacity: 0.7,
              }}
            >
              GROK
            </span>
          )}
        </div>
        <StatusBadge status={system.status} />
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: '11px',
          color: 'rgba(232,234,240,0.6)',
          lineHeight: 1.4,
        }}
      >
        {system.short}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: '10px',
          color: 'rgba(232,234,240,0.4)',
          lineHeight: 1.45,
        }}
      >
        {system.description}
      </div>
      {system.liveUrl && (
        <a
          href={system.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            textDecoration: 'none',
            marginTop: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          Open Live →
        </a>
      )}
    </div>
  )
}

export function SystemPanel() {
  const currentWorld = useEngineStore((s) => s.currentWorld)
  const hasEntered = useEngineStore((s) => s.hasEntered)
  const isMobile = useIsMobile()

  if (!hasEntered || currentWorld === 'opening' || currentWorld === 'hub') return null

  const systems = getSystemsByWorld(currentWorld)
  if (systems.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: isMobile ? 'auto' : '80px',
        bottom: isMobile ? '80px' : 'auto',
        right: isMobile ? '16px' : '36px',
        left: isMobile ? '16px' : 'auto',
        width: isMobile ? 'auto' : '320px',
        maxHeight: isMobile ? '40vh' : '70vh',
        overflowY: 'auto',
        zIndex: 90,
        background: 'rgba(6,7,11,0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(232,234,240,0.12)',
        borderRadius: '4px',
        padding: '20px 18px',
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '8px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(232,234,240,0.4)',
          marginBottom: '12px',
        }}
      >
        Systems in this world
      </div>
      {systems.map((s) => (
        <SystemCard key={s.id} system={s} />
      ))}
    </div>
  )
}
