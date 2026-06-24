'use client'
import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const temporalVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSlowFactor;
  uniform float uFieldRadius;

  attribute float aProgress;
  attribute float aRandom;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float speed = 1.0 - uSlowFactor * 0.85;
    float t = mod(aProgress + uTime * speed * 0.3 + aRandom * 0.5, 1.0);
    float yPos = mix(8.0, -8.0, t);
    
    vec3 pos = vec3(
      sin(aRandom * 6.28 + uTime * 0.1) * 0.8,
      yPos,
      cos(aRandom * 6.28 + uTime * 0.08) * 0.8
    );
    
    float dist = length(pos);
    float influence = smoothstep(uFieldRadius, 0.0, dist);
    
    vColor = mix(
      vec3(0.7, 0.8, 1.0),
      vec3(1.0, 0.6, 0.2),
      influence * uSlowFactor
    );
    
    vAlpha = 0.6 - influence * 0.2;
    
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (2.0 + influence * uSlowFactor * 4.0) * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`

const temporalFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if(dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`

function TemporalParticleStream({ slowFactor }: { slowFactor: number }) {
  const ref = useRef<THREE.Points>(null)
  const COUNT = 3000

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const positions = new Float32Array(COUNT * 3)
    const progresses = new Float32Array(COUNT)
    const randoms = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      progresses[i] = Math.random()
      randoms[i] = Math.random()
    }

    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aProgress', new THREE.BufferAttribute(progresses, 1))
    g.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
    return g
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSlowFactor: { value: 0.5 },
      uFieldRadius: { value: 2.5 },
    }),
    []
  )

  useFrame(({ clock }) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.ShaderMaterial
    mat.uniforms.uTime.value = clock.getElapsedTime()
    mat.uniforms.uSlowFactor.value = slowFactor
  })

  return (
    <points ref={ref} geometry={geo}>
      <shaderMaterial
        vertexShader={temporalVertexShader}
        fragmentShader={temporalFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function ScrewAIWorld() {
  const [slowFactor, setSlowFactor] = useState(0.5)
  const dialRef = useRef<THREE.Mesh>(null)
  const isDragging = useRef(false)
  const dragStart = useRef(0)

  useFrame(() => {
    if (!dialRef.current) return
    dialRef.current.rotation.z = -slowFactor * Math.PI * 1.5
  })

  return (
    <group>
      <ambientLight intensity={0.04} color="#200810" />
      <pointLight position={[0, 6, 0]} intensity={1.5} color="#c05010" distance={20} />
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#e08030" distance={8} />

      {/* Cylindrical chamber walls */}
      <mesh scale={[-1, 1, 1]}>
        <cylinderGeometry args={[14, 14, 24, 64, 1, true]} />
        <meshStandardMaterial color="#0a0505" roughness={0.7} metalness={0.3} side={THREE.BackSide} />
      </mesh>

      {/* Temporal particle stream */}
      <TemporalParticleStream slowFactor={slowFactor} />

      {/* Temporal field wireframe sphere */}
      <mesh scale={[2.3 + slowFactor * 0.8, 2.3 + slowFactor * 0.8, 2.3 + slowFactor * 0.8]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#402010"
          emissive="#c06020"
          emissiveIntensity={0.1 + slowFactor * 0.4}
          transparent
          opacity={0.06}
          wireframe
        />
      </mesh>

      {/* TEMPO DIAL */}
      <group position={[-4, -1, 2]}>
        <mesh
          ref={dialRef}
          onPointerDown={(e) => {
            isDragging.current = true
            dragStart.current = e.clientY ?? 0
            e.stopPropagation()
          }}
          onPointerUp={() => { isDragging.current = false }}
          onPointerMove={(e) => {
            if (!isDragging.current) return
            const delta = (dragStart.current - (e.clientY ?? 0)) * 0.003
            setSlowFactor((prev) => Math.max(0, Math.min(1, prev + delta)))
            dragStart.current = e.clientY ?? 0
          }}
        >
          <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
          <meshStandardMaterial color="#1a1008" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.06, 0.02, 0.5]} />
          <meshStandardMaterial color="#ff8030" emissive="#ff8030" emissiveIntensity={2} />
        </mesh>
        <pointLight position={[0, 0.5, 0]} intensity={0.4} color="#ff8030" distance={2} />
      </group>

      {/* Reverb Crystal Ball */}
      <group position={[4, -1, 2]}>
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color="#102030"
            roughness={0.0}
            metalness={0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={0.3 + slowFactor * 0.8} color="#40a0ff" distance={3} />
      </group>

      {/* Slow factor indicator bar */}
      <group position={[0, -4, 0]}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[i * 0.4 - 1.8, 0, 0]}>
            <boxGeometry args={[0.3, 0.06, 0.06]} />
            <meshStandardMaterial
              color={i / 10 < slowFactor ? '#ff8030' : '#303030'}
              emissive={i / 10 < slowFactor ? '#ff8030' : '#000000'}
              emissiveIntensity={i / 10 < slowFactor ? 1.5 : 0}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
