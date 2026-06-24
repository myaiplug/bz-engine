'use client'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useEngineStore, WorldId } from '../../store/useEngineStore'
import * as THREE from 'three'

const PORTAL_DATA: {
  id: WorldId
  label: string
  angle: number
  color: string
  accentColor: string
  description: string
}[] = [
  {
    id: 'audio',
    label: 'Audio Innovation',
    angle: 0,
    color: '#c87020',
    accentColor: '#ffaa40',
    description: 'The Frequency Cathedral',
  },
  {
    id: 'ai',
    label: 'AI Systems',
    angle: Math.PI / 3,
    color: '#1060c8',
    accentColor: '#40aaff',
    description: 'The Neural Infrastructure',
  },
  {
    id: 'software',
    label: 'Software Products',
    angle: (Math.PI * 2) / 3,
    color: '#505060',
    accentColor: '#c0c0d0',
    description: 'The NODAW Ecosystem',
  },
  {
    id: 'screwai',
    label: 'ScrewAI',
    angle: Math.PI,
    color: '#a040a0',
    accentColor: '#e060e0',
    description: 'The Temporal Chamber',
  },
  {
    id: 'creative',
    label: 'Creative Technology',
    angle: (Math.PI * 4) / 3,
    color: '#208060',
    accentColor: '#40e0a0',
    description: 'The Discovery Lab',
  },
  {
    id: 'automation',
    label: 'Automation',
    angle: (Math.PI * 5) / 3,
    color: '#206030',
    accentColor: '#40c060',
    description: 'The Infrastructure',
  },
]

function Portal({
  data,
  radius,
}: {
  data: (typeof PORTAL_DATA)[0]
  radius: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const travelTo = useEngineStore((s) => s.travelTo)
  const setActivePortal = useEngineStore((s) => s.setActivePortal)
  const setCursorVariant = useEngineStore((s) => s.setCursorVariant)

  const x = Math.cos(data.angle) * radius
  const z = Math.sin(data.angle) * radius

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    ringRef.current.rotation.z = clock.getElapsedTime() * 0.3
    ringRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
  })

  return (
    <group position={[x, 0, z]} rotation={[0, -data.angle + Math.PI / 2, 0]}>
      {/* Portal frame ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.04, 8, 64]} />
        <meshStandardMaterial
          color={data.accentColor}
          emissive={data.accentColor}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Portal inner surface */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => {
          setActivePortal(data.id)
          setCursorVariant('portal')
        }}
        onPointerLeave={() => {
          setActivePortal(null)
          setCursorVariant('default')
        }}
        onClick={() => travelTo(data.id)}
      >
        <circleGeometry args={[1.1, 64]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.7}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Glow light */}
      <pointLight
        color={data.accentColor}
        intensity={1.5}
        distance={4}
        position={[0, 0, 0.5]}
      />
    </group>
  )
}

function HubChamber() {
  // The inner sphere environment
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[20, 64, 64]} />
      <meshStandardMaterial
        color="#050508"
        roughness={0.9}
        metalness={0.3}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

function CentralEngine() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.12
    groupRef.current.rotation.x = clock.getElapsedTime() * 0.07
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color="#101020"
          wireframe
          emissive="#3050c0"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#0a0a18"
          wireframe
          emissive="#204080"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  )
}

export function HubWorld() {
  const PORTAL_RADIUS = 6

  return (
    <group>
      <HubChamber />
      <CentralEngine />

      {/* Ambient + directional lighting */}
      <ambientLight intensity={0.1} color="#0a0a20" />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#204080" />

      {PORTAL_DATA.map((p) => (
        <Portal key={p.id} data={p} radius={PORTAL_RADIUS} />
      ))}
    </group>
  )
}
