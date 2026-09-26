'use client'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useEngineStore, WorldId } from '../../store/useEngineStore'
import {
  portalDiscVertexShader,
  portalDiscFragmentShader,
} from '../../shaders/portalDisc.glsl'
import { MorphicCore } from '../engine/MorphicCore'
import { useIsMobile } from '../../hooks/useIsMobile'
import * as THREE from 'three'

const PORTAL_DATA: {
  id: WorldId
  index: string
  label: string
  angle: number
  color: string
  description: string
}[] = [
  {
    id: 'audio',
    index: '01',
    label: 'Audio Systems',
    angle: 0,
    color: '#8fb2ff',
    description: 'DSP engineering · spatial audio · the Frequency Cathedral',
  },
  {
    id: 'ai',
    index: '02',
    label: 'AI Infrastructure',
    angle: Math.PI / 3,
    color: '#7fe0d4',
    description: 'Model systems · neural pipelines · inference architecture',
  },
  {
    id: 'software',
    index: '03',
    label: 'Software Products',
    angle: (Math.PI * 2) / 3,
    color: '#c9c2b4',
    description: 'The NODAW ecosystem · products built end to end',
  },
  {
    id: 'screwai',
    index: '04',
    label: 'ScrewAI',
    angle: Math.PI,
    color: '#b39dff',
    description: 'Temporal machine intelligence · the Temporal Chamber',
  },
  {
    id: 'creative',
    index: '05',
    label: 'Creative Technology',
    angle: (Math.PI * 4) / 3,
    color: '#8fd4ff',
    description: 'Installations · real-time graphics · the Discovery Lab',
  },
  {
    id: 'automation',
    index: '06',
    label: 'Automation',
    angle: (Math.PI * 5) / 3,
    color: '#7fc4a0',
    description: 'Systems that run themselves · the Infrastructure',
  },
]

const tmpScale = new THREE.Vector3()

function Portal({
  data,
  radius,
}: {
  data: (typeof PORTAL_DATA)[0]
  radius: number
}) {
  const ringRef = useRef<THREE.Mesh>(null)
  const discRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const travelTo = useEngineStore((s) => s.travelTo)
  const activePortal = useEngineStore((s) => s.activePortal)
  const setActivePortal = useEngineStore((s) => s.setActivePortal)
  const setCursorVariant = useEngineStore((s) => s.setCursorVariant)
  const { camera } = useThree()

  // Orbital band: ring tilted 55° around X — portals orbit the core
  // like a gallery of satellites. Nothing blocks the camera axis.
  const TILT = 0.96 // rad ≈ 55°
  const x = Math.cos(data.angle) * radius
  const y = Math.sin(data.angle) * radius * Math.cos(TILT)
  const z = Math.sin(data.angle) * radius * Math.sin(TILT)
  const isActive = activePortal === data.id

  const discUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(data.color) },
      uActive: { value: 0 },
    }),
    [data.color]
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.1
    }
    if (discRef.current) {
      const mat = discRef.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = t
      mat.uniforms.uActive.value +=
        ((isActive ? 1 : 0) - mat.uniforms.uActive.value) * 0.08
    }
    if (groupRef.current) {
      // billboarding: portals always face the camera
      groupRef.current.lookAt(camera.position)
      // hover scale (hoisted vector — no per-frame allocation)
      const target = isActive ? 1.08 : 1
      tmpScale.set(target, target, target)
      groupRef.current.scale.lerp(tmpScale, 0.12)
    }
  })

  return (
    <group position={[x, y, z]}>
      <group ref={groupRef}>
        {/* Ring — thin polished metal, double band */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.18, 0.014, 8, 128]} />
          <meshStandardMaterial
            color="#dfe6f4"
            emissive={data.color}
            emissiveIntensity={0.25}
            roughness={0.25}
            metalness={0.95}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[1.3, 0.006, 6, 128]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.35} />
        </mesh>

        {/* Inner energy disc */}
        <mesh
          ref={discRef}
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
          <circleGeometry args={[1.12, 96]} />
          <shaderMaterial
            vertexShader={portalDiscVertexShader}
            fragmentShader={portalDiscFragmentShader}
            uniforms={discUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Soft light */}
        <pointLight
          color={data.color}
          intensity={isActive ? 3.2 : 1.2}
          distance={6}
        />
      </group>

      {/* Typographic label */}
      <Html
        position={[0, -1.75, 0]}
        center
        zIndexRange={[40, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div className={`portal-label${isActive ? ' is-active' : ''}`}>
          <div className="pl-index">{data.index}</div>
          <div className="pl-name">{data.label}</div>
          <div className="pl-desc">{data.description}</div>
        </div>
      </Html>
    </group>
  )
}

/** Environment dome with a vertical gradient + horizon glow */
function EnvironmentDome() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[26, 48, 48]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          varying vec3 vPos;
          void main() {
            float h = normalize(vPos).y;
            // deep base, slightly lifted floor, faint zenith
            vec3 bottom = vec3(0.016, 0.019, 0.030);
            vec3 top    = vec3(0.010, 0.012, 0.022);
            vec3 col = mix(bottom, top, smoothstep(-0.4, 1.0, h));
            // horizon glow — a whisper of cobalt at eye level
            float horizon = exp(-abs(h) * 5.5) * 0.5;
            col += vec3(0.10, 0.15, 0.32) * horizon * (0.7 + 0.3 * sin(uTime * 0.23));
            // subtle grain bands
            col += 0.004 * sin(vPos.y * 40.0 + uTime);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

/** Fine dust motes — depth and scale */
function DustField() {
  const ref = useRef<THREE.Points>(null)
  const isMobile = useIsMobile()

  const geo = useMemo(() => {
    const N = isMobile ? 700 : 1400
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const i3 = i * 3
      const r = 6 + Math.random() * 16
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = (Math.random() - 0.5) * 14
      pos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [isMobile])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.008
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.02}
        color="#8fb2ff"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export function HubWorld() {
  const isMobile = useIsMobile()
  const PORTAL_RADIUS = isMobile ? 5.8 : 5.2

  return (
    <group>
      <EnvironmentDome />
      <DustField />

      {/* The centerpiece — the Engine Core itself */}
      <MorphicCore withOrbit />

      {/* Lighting — low, controlled, premium */}
      <ambientLight intensity={0.12} color="#9db4e8" />
      <pointLight position={[0, 7, 3]} intensity={1.4} color="#8fb2ff" distance={30} />

      {PORTAL_DATA.map((p) => (
        <Portal key={p.id} data={p} radius={PORTAL_RADIUS} />
      ))}
    </group>
  )
}
