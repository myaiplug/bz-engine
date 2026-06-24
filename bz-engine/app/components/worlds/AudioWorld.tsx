'use client'
import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const STEM_COLORS = {
  vocals: '#e05080',
  drums: '#e06020',
  bass: '#6020c0',
  instruments: '#20a0c0',
  other: '#808090',
}

function WaveformStem({
  color,
  offset,
  label,
  soloed,
  onSolo,
}: {
  color: string
  offset: number
  label: string
  soloed: boolean
  onSolo: () => void
}) {
  const lineRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)

  const curve = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 80; i++) {
      const t = i / 80
      pts.push(
        new THREE.Vector3(
          Math.cos(t * Math.PI * 4 + offset) * (1 + t * 2),
          t * 8 - 2,
          Math.sin(t * Math.PI * 4 + offset) * (1 + t * 2)
        )
      )
    }
    return new THREE.CatmullRomCurve3(pts)
  }, [offset])

  useFrame(({ clock }) => {
    if (!lineRef.current) return
    const t = clock.getElapsedTime()
    lineRef.current.position.x += Math.sin(t * 0.5 + offset) * 0.002
    lineRef.current.material && ((lineRef.current.material as THREE.MeshStandardMaterial).opacity = soloed ? 1.0 : 0.35)
  })

  const tubeGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 80, 0.04, 8, false),
    [curve]
  )

  return (
    <mesh
      ref={lineRef}
      geometry={tubeGeo}
      onClick={onSolo}
      onPointerEnter={(e) => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerLeave={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={soloed ? 1.2 : 0.4}
        transparent
        opacity={soloed ? 1.0 : 0.35}
        roughness={0.1}
        metalness={0.6}
      />
    </mesh>
  )
}

function MainWaveform() {
  const ref = useRef<THREE.Mesh>(null)

  const curve = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 60; i++) {
      const t = i / 60
      pts.push(new THREE.Vector3(0, t * 8 - 6, 0))
    }
    return new THREE.CatmullRomCurve3(pts)
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    // Oscillate slightly
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1
  })

  const tubeGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 60, 0.08, 16, false),
    [curve]
  )

  return (
    <mesh ref={ref} geometry={tubeGeo}>
      <meshStandardMaterial
        color="#c0c8e0"
        emissive="#8090c0"
        emissiveIntensity={0.8}
        roughness={0.05}
        metalness={0.9}
      />
    </mesh>
  )
}

export function AudioWorld() {
  const [soloedStem, setSoloedStem] = useState<string | null>(null)

  const stems = [
    { key: 'vocals', color: STEM_COLORS.vocals, offset: 0 },
    { key: 'drums', color: STEM_COLORS.drums, offset: Math.PI * 0.4 },
    { key: 'bass', color: STEM_COLORS.bass, offset: Math.PI * 0.8 },
    { key: 'instruments', color: STEM_COLORS.instruments, offset: Math.PI * 1.2 },
    { key: 'other', color: STEM_COLORS.other, offset: Math.PI * 1.6 },
  ]

  return (
    <group>
      {/* Environment */}
      <ambientLight intensity={0.05} color="#100820" />
      <pointLight position={[0, 10, 0]} intensity={2} color="#c87020" />
      <pointLight position={[0, -8, 0]} intensity={0.5} color="#301020" />

      {/* Dark floor with reflection suggestion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#050508"
          roughness={0.02}
          metalness={0.98}
        />
      </mesh>

      {/* Main waveform trunk */}
      <MainWaveform />

      {/* Stem splits */}
      {stems.map((s) => (
        <WaveformStem
          key={s.key}
          color={s.color}
          offset={s.offset}
          label={s.key}
          soloed={soloedStem === s.key}
          onSolo={() =>
            setSoloedStem((prev) => (prev === s.key ? null : s.key))
          }
        />
      ))}

      {/* Speaker wall background geometry */}
      {Array.from({ length: 80 }).map((_, i) => {
        const row = Math.floor(i / 10)
        const col = i % 10
        return (
          <mesh
            key={i}
            position={[col * 3 - 13.5, row * 2.5 - 8, -18]}
          >
            <cylinderGeometry args={[0.8, 0.8, 0.3, 32]} />
            <meshStandardMaterial
              color="#0a0a0a"
              roughness={0.8}
              metalness={0.4}
            />
          </mesh>
        )
      })}
    </group>
  )
}
