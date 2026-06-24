'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useEngineStore } from '../../store/useEngineStore'

export function CinematicCamera() {
  const { camera } = useThree()
  const cameraTarget = useEngineStore((s) => s.cameraTarget)
  const cameraLookAt = useEngineStore((s) => s.cameraLookAt)
  const lookAtCurrent = useRef(new THREE.Vector3(0, 0, 0))
  const clock = useRef(0)

  useFrame(({ clock: c }) => {
    clock.current = c.getElapsedTime()

    // Smooth position follow
    camera.position.lerp(cameraTarget, 0.035)

    // Smooth look-at follow
    lookAtCurrent.current.lerp(cameraLookAt, 0.04)
    camera.lookAt(lookAtCurrent.current)

    // Subtle procedural drift — camera never perfectly still
    camera.position.x +=
      Math.sin(clock.current * 0.11) * 0.004
    camera.position.y +=
      Math.cos(clock.current * 0.09) * 0.003
    camera.position.z +=
      Math.sin(clock.current * 0.07) * 0.002
  })

  return null
}
