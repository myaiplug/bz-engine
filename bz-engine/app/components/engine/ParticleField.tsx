'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { particleVertexShader, particleFragmentShader } from '../../shaders/particles.glsl'
import { useEngineStore } from '../../store/useEngineStore'

const PARTICLE_COUNT = 50000

export function ParticleField({ imploding = false }: { imploding?: boolean }) {
  const meshRef = useRef<THREE.Points>(null)
  const mouseNormX = useEngineStore((s) => s.mouseNormX)
  const mouseNormY = useEngineStore((s) => s.mouseNormY)

  const { positions, randoms, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const randoms = new Float32Array(PARTICLE_COUNT)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const r = Math.cbrt(Math.random()) * 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = r * Math.cos(phi)

      randoms[i] = Math.random()

      velocities[i3] = (Math.random() - 0.5) * 0.002
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001
    }

    return { positions, randoms, velocities }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
      uProgress: { value: 0 },
    }),
    []
  )

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
    g.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3))
    return g
  }, [positions, randoms, velocities])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.ShaderMaterial
    mat.uniforms.uTime.value = clock.getElapsedTime()
    mat.uniforms.uMouseX.value = mouseNormX
    mat.uniforms.uMouseY.value = mouseNormY

    if (imploding) {
      mat.uniforms.uProgress.value = Math.min(
        mat.uniforms.uProgress.value + 0.018,
        1.0
      )
    }
  })

  return (
    <points ref={meshRef} geometry={geo}>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
