'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { morphicCoreVertexShader, morphicCoreFragmentShader } from '../../shaders/morphicCore.glsl'
import { useEngineStore } from '../../store/useEngineStore'

/**
 * The Engine Core — a sculpted obsidian form with an ice-cobalt rim,
 * an orbital ring, and a faint engineered lattice shell.
 */
export function MorphicCore({
  scale = 1,
  visible = true,
  withOrbit = true,
}: {
  scale?: number
  visible?: boolean
  withOrbit?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Mesh>(null)
  const latticeRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const mouseNormX = useEngineStore((s) => s.mouseNormX)
  const mouseNormY = useEngineStore((s) => s.mouseNormY)
  const audioFreq = useEngineStore((s) => s.audioFreq)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudioFreq: { value: 0 },
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
      uBase: { value: new THREE.Color('#1a2030') },
      uDeep: { value: new THREE.Color('#070a12') },
      uRim: { value: new THREE.Color('#8fb2ff') },
      uGold: { value: new THREE.Color('#c9a96e') },
    }),
    []
  )

  const mouseTarget = useRef({ x: 0, y: 0 })

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = t

      // audio breathe
      mat.uniforms.uAudioFreq.value = audioFreq

      // mouse — slow, weighted inertia
      mouseTarget.current.x += (mouseNormX - mouseTarget.current.x) * 0.03
      mouseTarget.current.y += (mouseNormY - mouseTarget.current.y) * 0.03
      mat.uniforms.uMouseX.value = mouseTarget.current.x
      mat.uniforms.uMouseY.value = mouseTarget.current.y

      // slow confident rotation
      meshRef.current.rotation.y = t * 0.06
      meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.08
    }

    if (orbitRef.current) {
      orbitRef.current.rotation.z = t * 0.045
    }

    if (latticeRef.current) {
      // counter-rotation for engineered feel
      latticeRef.current.rotation.y = -t * 0.03
      latticeRef.current.rotation.z = t * 0.017
    }

    // whole-form mouse parallax tilt
    groupRef.current.rotation.y += (mouseTarget.current.x * 0.22 - groupRef.current.rotation.y) * 0.02
    groupRef.current.rotation.x += (-mouseTarget.current.y * 0.14 - groupRef.current.rotation.x) * 0.02
  })

  return (
    <group ref={groupRef} visible={visible} scale={scale}>
      {/* Sculpted core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.55, 96]} />
        <shaderMaterial
          vertexShader={morphicCoreVertexShader}
          fragmentShader={morphicCoreFragmentShader}
          uniforms={uniforms}
          transparent
        />
      </mesh>

      {/* Orbital ring — a polished instrument band */}
      {withOrbit && (
        <mesh ref={orbitRef} rotation={[Math.PI / 2.35, 0.2, 0]}>
          <torusGeometry args={[2.6, 0.012, 8, 220]} />
          <meshBasicMaterial color="#8fb2ff" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Faint engineered lattice shell */}
      {withOrbit && (
        <mesh ref={latticeRef}>
          <icosahedronGeometry args={[2.05, 1]} />
          <meshBasicMaterial
            color="#8fb2ff"
            wireframe
            transparent
            opacity={0.05}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Under-light for the ring */}
      <pointLight position={[0, -3.5, 1.5]} intensity={2.2} color="#4a6fd4" distance={9} />
    </group>
  )
}
