'use client'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useIsMobile } from '../../hooks/useIsMobile'

export function PostProcessing() {
  const isMobile = useIsMobile()

  const bloom = (
    <Bloom
      intensity={0.85}
      luminanceThreshold={0.32}
      luminanceSmoothing={0.2}
      mipmapBlur
      radius={0.75}
    />
  )
  const vignette = (
    <Vignette
      eskil={false}
      offset={0.18}
      darkness={0.72}
      blendFunction={BlendFunction.NORMAL}
    />
  )

  if (isMobile) {
    // Lean stack: bloom + vignette only
    return <EffectComposer>{bloom}{vignette}</EffectComposer>
  }

  return (
    <EffectComposer>
      {bloom}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0004, 0.0004)}
        radialModulation={true}
        modulationOffset={0.6}
      />
      <Noise
        opacity={0.035}
        blendFunction={BlendFunction.OVERLAY}
      />
      {vignette}
    </EffectComposer>
  )
}
