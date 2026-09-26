'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useEngineStore } from '../../store/useEngineStore'

export function CinematicCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const cameraTarget = useEngineStore((s) => s.cameraTarget)
  const cameraLookAt = useEngineStore((s) => s.cameraLookAt)
  const lookAtCurrent = useRef(new THREE.Vector3(0, 0, 0))
  const clock = useRef(0)
  const effectiveTarget = useRef(new THREE.Vector3())

  useFrame(({ clock: c }) => {
    clock.current = c.getElapsedTime()

    // Portrait / narrow screens: pull the camera back proportionally
    // so the scene composition still fits the frame.
    const aspect = size.width / Math.max(size.height, 1)
    const pullback = aspect >= 1 ? 1 : 1 + (1 / aspect - 1) * 0.42

    effectiveTarget.current.copy(cameraTarget)
    effectiveTarget.current.z *= pullback

    // Smooth position follow
    camera.position.lerp(effectiveTarget.current, 0.035)

    // Smooth look-at follow
    lookAtCurrent.current.lerp(cameraLookAt, 0.04)
    camera.lookAt(lookAtCurrent.current)

    // Subtle procedural drift — camera never perfectly still.
    // Scaled down on narrow screens to avoid edge artifacts.
    const driftScale = aspect >= 1 ? 1 : 0.6
    camera.position.x +=
      Math.sin(clock.current * 0.11) * 0.004 * driftScale
    camera.position.y +=
      Math.cos(clock.current * 0.09) * 0.003 * driftScale
    camera.position.z +=
      Math.sin(clock.current * 0.07) * 0.002
  })

  return null
}
