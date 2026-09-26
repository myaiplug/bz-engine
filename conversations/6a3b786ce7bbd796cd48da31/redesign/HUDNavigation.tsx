'use client'
import { useEngineStore, WorldId } from '../../store/useEngineStore'
import { useIsMobile } from '../../hooks/useIsMobile'

const worldLabels: Record<WorldId, string> = {
  opening: '',
  hub: 'Engine Core',
  audio: 'Audio Systems',
  ai: 'AI Infrastructure',
  software: 'Software Products',
  screwai: 'ScrewAI',
  creative: 'Creative Technology',
  design: 'Design Systems',
  automation: 'Automation',
  about: 'About',
}

const NAV_ITEMS: { id: WorldId; index: string; label: string }[] = [
  { id: 'audio', index: '01', label: 'Audio' },
  { id: 'ai', index: '02', label: 'AI Systems' },
  { id: 'software', index: '03', label: 'Software' },
  { id: 'screwai', index: '04', label: 'ScrewAI' },
  { id: 'creative', index: '05', label: 'Creative Tech' },
  { id: 'automation', index: '06', label: 'Automation' },
]

export function HUDNavigation() {
  const currentWorld = useEngineStore((s) => s.currentWorld)
  const travelTo = useEngineStore((s) => s.travelTo)
  const hasEntered = useEngineStore((s) => s.hasEntered)
  const isMobile = useIsMobile()

  if (!hasEntered || currentWorld === 'opening') return null

  const pad = isMobile ? '14px 20px' : '26px 36px'

  return (
    <>
      {/* ---- Top bar ---- */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: pad,
          pointerEvents: 'none',
          paddingTop: isMobile ? 'max(14px, env(safe-area-inset-top))' : '26px',
        }}
      >
        {/* Left: wordmark + world */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              fontSize: isMobile ? '15px' : '17px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              color: '#f4f6fb',
            }}
          >
            BZ
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '8px',
                color: '#c9a96e',
                verticalAlign: 'super',
                marginLeft: '2px',
                letterSpacing: '0.1em',
              }}
            >
              ®
            </span>
          </span>
          <span
            style={{
              width: '1px',
              height: '12px',
              background: 'rgba(232,234,240,0.18)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: isMobile ? '8px' : '9px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(232,234,240,0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            {worldLabels[currentWorld]}
          </span>
        </div>

        {/* Right: studio label (desktop) / actions (mobile) */}
        {isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', pointerEvents: 'auto' }}>
            <button
              onClick={() => travelTo('about')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(232,234,240,0.5)',
              }}
            >
              About
            </button>
            {currentWorld !== 'hub' && (
              <button
                onClick={() => travelTo('hub')}
                style={{
                  background: 'none',
                  border: '1px solid rgba(232,234,240,0.16)',
                  color: 'rgba(232,234,240,0.75)',
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '8px',
                  fontWeight: 500,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  padding: '7px 12px',
                }}
              >
                ← Core
              </button>
            )}
          </div>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(232,234,240,0.35)',
            }}
          >
            NODAW LABS
          </span>
        )}
      </div>

      {/* ---- Bottom bar ---- */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: isMobile ? 'max(14px, env(safe-area-inset-bottom)) 20px' : '28px 36px',
          pointerEvents: 'none',
        }}
      >
        {isMobile ? (
          /* Mobile: horizontal scrollable nav across the bottom */
          <div
            className="nav-scroller"
            style={{ width: '100%', pointerEvents: 'auto' }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentWorld === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => travelTo(item.id)}
                  style={{
                    flex: '0 0 auto',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '8px',
                      letterSpacing: '0.2em',
                      color: isActive ? '#c9a96e' : 'rgba(232,234,240,0.4)',
                    }}
                  >
                    {item.index}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body), sans-serif',
                      fontSize: '9px',
                      fontWeight: 500,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      color: isActive ? '#f4f6fb' : 'rgba(232,234,240,0.75)',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          /* Desktop: index navigation */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '9px',
              pointerEvents: 'auto',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentWorld === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => travelTo(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.55,
                    transition: 'opacity 0.3s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = isActive ? '1' : '0.55'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '8px',
                      letterSpacing: '0.2em',
                      color: isActive ? '#c9a96e' : 'rgba(232,234,240,0.4)',
                      transition: 'color 0.3s ease',
                      width: '16px',
                    }}
                  >
                    {item.index}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body), sans-serif',
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: isActive ? '#f4f6fb' : 'rgba(232,234,240,0.75)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      width: isActive ? '26px' : '0px',
                      height: '1px',
                      background: '#c9a96e',
                      transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                      display: 'inline-block',
                    }}
                  />
                </button>
              )
            })}
          </div>
        )}

        {/* Desktop-only: right-side actions */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '22px',
              pointerEvents: 'auto',
            }}
          >
            <button
              onClick={() => travelTo('about')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(232,234,240,0.4)',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(232,234,240,0.9)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(232,234,240,0.4)'
              }}
            >
              About
            </button>

            {currentWorld !== 'hub' && (
              <button
                onClick={() => travelTo('hub')}
                style={{
                  background: 'none',
                  border: '1px solid rgba(232,234,240,0.14)',
                  color: 'rgba(232,234,240,0.6)',
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  textIndent: '0.3em',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(143,178,255,0.6)'
                  e.currentTarget.style.color = '#f4f6fb'
                  e.currentTarget.style.boxShadow =
                    '0 0 24px rgba(143,178,255,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(232,234,240,0.14)'
                  e.currentTarget.style.color = 'rgba(232,234,240,0.6)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                ← Engine Core
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
