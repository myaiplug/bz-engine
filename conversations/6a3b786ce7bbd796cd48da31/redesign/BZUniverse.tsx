'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useEngineStore } from '../../store/useEngineStore'
import { ParticleField } from './ParticleField'
import { MorphicCore } from './MorphicCore'
import { CinematicCamera } from './CinematicCamera'
import { PostProcessing } from './PostProcessing'
import { HubWorld } from '../worlds/HubWorld'
import { AudioWorld } from '../worlds/AudioWorld'
import { ScrewAIWorld } from '../worlds/ScrewAIWorld'

function SceneContent() {
  const currentWorld = useEngineStore((s) => s.currentWorld)
  const openingPhase = useEngineStore((s) => s.openingPhase)

  return (
    <>
      <CinematicCamera />

      {/* Opening sequence — particles + morphic core */}
      {(currentWorld === 'opening') && (
        <>
          <ParticleField imploding={openingPhase === 5} />
          <MorphicCore
            visible={openingPhase >= 2}
            scale={openingPhase === 5 ? 3.5 : 1}
          />
        </>
      )}

      {/* Hub world */}
      {currentWorld === 'hub' && <HubWorld />}

      {/* Audio world */}
      {currentWorld === 'audio' && <AudioWorld />}

      {/* ScrewAI world */}
      {currentWorld === 'screwai' && <ScrewAIWorld />}

      {/* Fallback — other worlds placeholder */}
      {(currentWorld === 'ai' ||
        currentWorld === 'software' ||
        currentWorld === 'creative' ||
        currentWorld === 'design' ||
        currentWorld === 'automation' ||
        currentWorld === 'about') && (
        <group>
          <ambientLight intensity={0.1} />
          <MorphicCore scale={0.6} />
          <ParticleField />
        </group>
      )}

      <PostProcessing />
    </>
  )
}

export function BZUniverse() {
  const isMobile = useIsMobile()
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 1000 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      style={{ background: '#020204' }}
      dpr={[1, isMobile ? 1.5 : 2]}
    >
      <color attach="background" args={['#020204']} />
      <fog attach="fog" args={['#020204', 20, 80]} />
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
