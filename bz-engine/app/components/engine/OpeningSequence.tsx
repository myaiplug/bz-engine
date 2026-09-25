'use client'
import { useEffect, useRef, useState } from 'react'
import { useEngineStore } from '../../store/useEngineStore'
import { gsap } from 'gsap'

export function OpeningSequence() {
  const openingPhase = useEngineStore((s) => s.openingPhase)
  const setOpeningPhase = useEngineStore((s) => s.setOpeningPhase)
  const setHasEntered = useEngineStore((s) => s.setHasEntered)
  const setCameraTarget = useEngineStore((s) => s.setCameraTarget)
  const travelTo = useEngineStore((s) => s.travelTo)
  const setAudioEnabled = useEngineStore((s) => s.setAudioEnabled)

  const containerRef = useRef<HTMLDivElement>(null)
  const bzRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const audioPromptRef = useRef<HTMLDivElement>(null)

  const [taglineIndex, setTaglineIndex] = useState(0)
  const taglines = ['Audio Innovation', 'AI Systems', 'Software Products', 'Digital Experiences']

  // Phase sequencer
  useEffect(() => {
    const tl = gsap.timeline()

    tl.call(() => setOpeningPhase(1), [], 0.3)
    tl.call(() => setOpeningPhase(2), [], 0.8)
    tl.call(() => setOpeningPhase(3), [], 1.1)

    // Animate BZ text in
    tl.fromTo(
      bzRef.current,
      { opacity: 0.2, scale: 0.96, filter: 'blur(6px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' },
      0.2
    )

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0.35, y: 8 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' },
      0.45
    )

    tl.fromTo(
      taglineRef.current,
      { opacity: 0.4, y: 6 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
      0.6
    )

    // Phase 3→4: CTA appears
    tl.call(() => setOpeningPhase(4), [], 1.2)

    tl.fromTo(
      ctaRef.current,
      { opacity: 0.45, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' },
      1.25
    )

    return () => { tl.kill() }
  }, [])

  // Tagline cycler
  useEffect(() => {
    if (openingPhase < 3) return
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % taglines.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [openingPhase])

  const handleAudioYes = () => {
    setAudioEnabled(true)
    if (audioPromptRef.current) {
      gsap.to(audioPromptRef.current, { opacity: 0, duration: 0.4, onComplete: () => {
        if (audioPromptRef.current) audioPromptRef.current.style.display = 'none'
      }})
    }
  }

  const handleAudioNo = () => {
    if (audioPromptRef.current) {
      gsap.to(audioPromptRef.current, { opacity: 0, duration: 0.4, onComplete: () => {
        if (audioPromptRef.current) audioPromptRef.current.style.display = 'none'
      }})
    }
  }

  const handleEnter = () => {
    setOpeningPhase(5)
    // Fade out all text
    gsap.to(containerRef.current, { opacity: 0, duration: 0.8, ease: 'expo.in' })
    import('three').then(({ Vector3 }) => {
      setCameraTarget(new Vector3(0, 0, -2))
    })
    // After flash — enter hub
    setTimeout(() => {
      setHasEntered(true)
      travelTo('hub')
    }, 1800)
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Audio permission prompt */}
      {openingPhase >= 2 && (
        <div
          ref={audioPromptRef}
          className="pointer-events-auto absolute top-8 flex gap-6 items-center"
          style={{
            pointerEvents: 'auto',
            color: '#f4f4f4',
            fontSize: '13px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          <span>Enable spatial audio?</span>
          <button
            onClick={handleAudioYes}
            className="px-4 py-1 border border-white/20 hover:border-white/60 transition-all"
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', letterSpacing: '0.15em' }}
          >
            YES
          </button>
          <button
            onClick={handleAudioNo}
            className="px-4 py-1 border border-white/10 hover:border-white/30 transition-all"
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '0.15em' }}
          >
            NO
          </button>
        </div>
      )}

      {/* BZ Monogram */}
      <div
        ref={bzRef}
        style={{
          opacity: 1,
          fontSize: 'clamp(72px, 14vw, 160px)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          color: '#ffffff',
          lineHeight: 1,
          mixBlendMode: 'normal',
          textShadow: '0 0 60px rgba(80,120,255,0.4)',
        }}
      >
        BZ
      </div>

      {/* Subtitle */}
      <div
        ref={subtitleRef}
        style={{
          opacity: 1,
          fontSize: 'clamp(14px, 1.6vw, 18px)',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#f7f7f7',
          marginTop: '16px',
        }}
      >
        Creative Technologist
      </div>

      {/* Cycling taglines */}
      <div
        ref={taglineRef}
        style={{
          opacity: 1,
          fontSize: 'clamp(13px, 1.4vw, 16px)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#c5d4ff',
          marginTop: '10px',
          height: '20px',
          transition: 'opacity 0.4s ease',
        }}
      >
        {taglines[taglineIndex]}
      </div>

      {/* CTA */}
      {(
        <button
          
          onClick={handleEnter}
          className="pointer-events-auto mt-16 group"
          style={{
            opacity: 1,
            pointerEvents: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            zIndex: 40,
          }}
        >
          <div
            style={{
              position: 'relative',
              fontSize: 'clamp(11px, 1.1vw, 13px)',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: '#ffffff',
              padding: '16px 32px',
            }}
          >
            {/* Corner brackets */}
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                borderTop: '1px solid rgba(255,255,255,0.4)',
                borderLeft: '1px solid rgba(255,255,255,0.4)',
                width: '14px',
                height: '14px',
                transition: 'all 0.3s ease',
              }}
              className="group-hover:w-[18px] group-hover:h-[18px] group-hover:border-white"
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                borderTop: '1px solid rgba(255,255,255,0.4)',
                borderRight: '1px solid rgba(255,255,255,0.4)',
                width: '14px',
                height: '14px',
                transition: 'all 0.3s ease',
              }}
              className="group-hover:w-[18px] group-hover:h-[18px] group-hover:border-white"
            />
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                borderBottom: '1px solid rgba(255,255,255,0.4)',
                borderLeft: '1px solid rgba(255,255,255,0.4)',
                width: '14px',
                height: '14px',
                transition: 'all 0.3s ease',
              }}
              className="group-hover:w-[18px] group-hover:h-[18px] group-hover:border-white"
            />
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                borderBottom: '1px solid rgba(255,255,255,0.4)',
                borderRight: '1px solid rgba(255,255,255,0.4)',
                width: '14px',
                height: '14px',
                transition: 'all 0.3s ease',
              }}
              className="group-hover:w-[18px] group-hover:h-[18px] group-hover:border-white"
            />
            ENTER THE ENGINE
          </div>
        </button>
      )}
    </div>
  )
}
