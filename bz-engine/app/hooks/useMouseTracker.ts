'use client'
import { useEffect } from 'react'
import { useEngineStore } from '../store/useEngineStore'

export function useMouseTracker() {
  const setMouse = useEngineStore((s) => s.setMouse)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      setMouse(e.clientX, e.clientY, nx, ny)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [setMouse])
}
