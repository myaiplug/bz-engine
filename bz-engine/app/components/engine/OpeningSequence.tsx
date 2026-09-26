'use client'
import { useEffect, useRef, useState } from 'react'
import { useEngineStore } from '../../store/useEngineStore'
import { gsap } from 'gsap'

const TAGLINES = [
  'Audio Systems',
  'AI Infrastructure',
  'Software Products',
  'Immersive Experiences',
]

export function OpeningSequence() {
  const openingPhase = useEngineStore((s) => s.openingPhase)
  const setOpeningPhase = useEngineStore((s) => s.setOpeningPhase)
  const setHasEntered = useEngineStore((s) => s.setHasEntered)
  const travelTo = useEngineStore((s) => s.travelTo)

  const containerRef = useRef<HTMLDivElement>(null)
  const overlineRef = useRef<HTMLDivElement>(null)
  const bzRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)

  const [taglineIndex, setTaglineIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const tl = gsap.timeline()

    tl.call(() => setOpeningPhase(1), [], 0.25)
    tl.call(() => setOpeningPhase(2), [], 0.6)

    tl.fromTo(
      overlineRef.current,
      { opacity: 0, y: 14, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out' },
      0.7
    )

    tl.fromTo(
      ruleRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.0, ease: 'power3.inOut' },
      0.9
    )

    tl.fromTo(
      bzRef.current,
      { opacity: 0, scale: 0.92, filter: 'blur(24px)', letterSpacing: '0.2em' },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        letterSpacing: '-0.03em',
        duration: 1.4,
        ease: 'expo.out',
      },
      1.0
    )

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 18, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'expo.out' },
      1.9
    )

    tl.fromTo(
      taglineRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' },
      2.4
    )

    tl.call(() => setOpeningPhase(3), [], 2.0)
    tl.call(() => setOpeningPhase(4), [], 2.6)

    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 14, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out' },
      2.7
    )

    return () => {
      tl.kill()
    }
  }, [setOpeningPhase])

  const handleEnter = () => {
    if (leaving) return
    setLeaving(true)

    const tl = gsap.timeline({
      onComplete: () => {
        setHasEntered(true)
        travelTo('hub')
      },
    })

    tl.to([overlineRef.current, ruleRef.current, subtitleRef.current, taglineRef.current], {
      opacity: 0,
      y: -16,
      duration: 0.7,
      ease: 'power2.in',
      stagger: 0.05,
    })
    tl.to(
      bzRef.current,
      {
        opacity: 0,
        scale: 1.15,
        filter: 'blur(30px)',
        duration: 1.0,
        ease: 'power2.inOut',
      },
      0.15
    )
    tl.to(
      ctaRef.current,
      { opacity: 0, y: 24, duration: 0.6, ease: 'power2.in' },
      0.1
    )
    tl.call(() => setOpeningPhase(5), [], 0.55)
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: leaving ? undefined : 1,
      }}
    >
      {/* Overline */}
      <div
        ref={overlineRef}
        style={{
          opacity: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '28px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'rgba(232,234,240,0.4)',
          }}
        >
          NODAW LABS
        </span>
        <span
          style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: '#c9a96e',
            display: 'inline-block',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'rgba(232,234,240,0.4)',
          }}
        >
          CREATIVE TECHNOLOGY
        </span>
      </div>

      {/* Wordmark */}
      <div
        ref={bzRef}
        style={{
          opacity: 0,
          fontFamily: 'var(--font-display), sans-serif',
          fontSize: 'clamp(96px, 18vw, 220px)',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          lineHeight: 0.95,
          color: '#f4f6fb',
          textShadow:
            '0 0 80px rgba(143,178,255,0.35), 0 0 160px rgba(143,178,255,0.12)',
          willChange: 'filter, transform, opacity',
        }}
      >
        BZ
      </div>

      {/* Hairline rule */}
      <div
        ref={ruleRef}
        style={{
          width: 'min(380px, 60vw)',
          height: '1px',
          marginTop: '34px',
          marginBottom: '30px',
          background:
            'linear-gradient(90deg, transparent, rgba(143,178,255,0.5), transparent)',
          transformOrigin: 'center',
          willChange: 'transform',
        }}
      />

      {/* Subtitle */}
      <div
        ref={subtitleRef}
        style={{
          opacity: 0,
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: 'clamp(12px, 1.4vw, 15px)',
          fontWeight: 400,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: 'rgba(232,234,240,0.72)',
        }}
      >
        Brian Jutz — Creative Technologist
      </div>

      {/* Cycling taglines */}
      <div
        ref={taglineRef}
        style={{
          opacity: 0,
          marginTop: '16px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '9px',
            color: 'rgba(201,169,110,0.8)',
          }}
        >
          ▚
        </span>
        <span
          key={taglineIndex}
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '10px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(143,178,255,0.9)',
            animation: 'pulse-fade 2.4s ease-in-out',
          }}
        >
          {TAGLINES[taglineIndex]}
        </span>
      </div>

      {/* CTA */}
      <div
        ref={ctaRef}
        style={{
          opacity: 0,
          marginTop: 'clamp(40px, 7vh, 80px)',
          pointerEvents: 'auto',
        }}
      >
        <button onClick={handleEnter} className="cta-btn" style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          position: 'relative',
        }}>
          <div
            className="cta-label"
            style={{
              position: 'relative',
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              textIndent: '0.5em',
              color: 'rgba(232,234,240,0.9)',
              padding: '18px 44px',
            }}
          >
            <span className="cta-corner" style={{ top: 0, left: 0, borderWidth: '1px 0 0 1px' }} />
            <span className="cta-corner" style={{ top: 0, right: 0, borderWidth: '1px 1px 0 0' }} />
            <span className="cta-corner" style={{ bottom: 0, left: 0, borderWidth: '0 0 1px 1px' }} />
            <span className="cta-corner" style={{ bottom: 0, right: 0, borderWidth: '0 1px 1px 0' }} />
            Enter the Engine
          </div>
        </button>
      </div>
    </div>
  )
}
