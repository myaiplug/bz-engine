'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { morphicCoreVertexShader, morphicCoreFragmentShader } from '../../shaders/morphicCore.glsl'
import { useEngineStore } from '../../store/useEngineStore'

export function MorphicCore({
  scale = 1,
  visible = true,
}: {
  scale?: number
  visible?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseNormX = useEngineStore((s) => s.mouseNormX)
  const mouseNormY = useEngineStore((s) => s.mouseNormY)
  const audioFreq = useEngineStore((s) => s.audioFreq)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorphA: { value: 0 },
      uMorphB: { value: 0 },
      uMorphC: { value: 0 },
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
      uAudioFreq: { value: 0 },
      uColorA: { value: new THREE.Color('#0a0a14') },
      uColorB: { value: new THREE.Color('#1a2040') },
      uColorC: { value: new THREE.Color('#4466ff') },
    }),
    []
  )

  // Lerp target for mouse
  const mouseTarget = useRef({ x: 0, y: 0 })

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const mat = meshRef.current.material as THREE.ShaderMaterial

    mat.uniforms.uTime.value = t

    // Cycle morph targets smoothly — sine waves offset by thirds
    mat.uniforms.uMorphA.value = Math.max(0, Math.sin(t * 0.28) * 0.7 + 0.3)
    mat.uniforms.uMorphB.value = Math.max(
      0,
      Math.sin(t * 0.28 + Math.PI * 0.66) * 0.7 + 0.3
    )
    mat.uniforms.uMorphC.value = Math.max(
      0,
      Math.sin(t * 0.28 + Math.PI * 1.33) * 0.7 + 0.3
    )

    // Mouse lerp — inertia
    mouseTarget.current.x += (mouseNormX - mouseTarget.current.x) * 0.05
    mouseTarget.current.y += (mouseNormY - mouseTarget.current.y) * 0.05
    mat.uniforms.uMouseX.value = mouseTarget.current.x
    mat.uniforms.uMouseY.value = mouseTarget.current.y

    // Audio
    mat.uniforms.uAudioFreq.value = audioFreq

    // Slow base rotation
    meshRef.current.rotation.y += 0.0015
    meshRef.current.rotation.x += 0.0005
  })

  return (
    <mesh ref={meshRef} visible={visible} scale={scale}>
      <icosahedronGeometry args={[1.8, 64]} />
      <shaderMaterial
        vertexShader={morphicCoreVertexShader}
        fragmentShader={morphicCoreFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.FrontSide}
      />
    </mesh>
  )
}
