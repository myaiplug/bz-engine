'use client'
import { useRef, useEffect } from 'react'
import { useEngineStore } from '../../store/useEngineStore'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const smoothPos = useRef({ x: 0, y: 0 })
  const cursorVariant = useEngineStore((s) => s.cursorVariant)
  const activePortal = useEngineStore((s) => s.activePortal)

  const portalColors: Record<string, string> = {
    audio: '#8fb2ff',
    ai: '#7fe0d4',
    software: '#c9c2b4',
    screwai: '#b39dff',
    creative: '#8fd4ff',
    automation: '#7fc4a0',
    design: '#f4f6fb',
  }

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useEffect(() => {
    let raf: number
    const animate = () => {
      smoothPos.current.x += (pos.current.x - smoothPos.current.x) * 0.12
      smoothPos.current.y += (pos.current.y - smoothPos.current.y) * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${smoothPos.current.x - 16}px, ${smoothPos.current.y - 16}px)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 2}px, ${pos.current.y - 2}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  const color = activePortal
    ? portalColors[activePortal] || '#ffffff'
    : cursorVariant === 'hover'
    ? '#8fb2ff'
    : 'rgba(232,234,240,0.55)'

  const size = cursorVariant === 'portal' ? 40 : cursorVariant === 'hover' ? 28 : 32

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${size}px`,
          height: `${size}px`,
          border: `1px solid ${color}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease',
          mixBlendMode: 'difference',
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '4px',
          height: '4px',
          background: color,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'background 0.3s ease',
        }}
      />
    </>
  )
}
