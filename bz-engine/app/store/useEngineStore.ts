import { create } from 'zustand'
import * as THREE from 'three'

export type WorldId =
  | 'opening'
  | 'hub'
  | 'audio'
  | 'ai'
  | 'software'
  | 'screwai'
  | 'creative'
  | 'design'
  | 'automation'
  | 'about'

interface EngineState {
  // World navigation
  currentWorld: WorldId
  previousWorld: WorldId | null
  isTransitioning: boolean
  transitionProgress: number

  // Opening sequence
  openingPhase: 0 | 1 | 2 | 3 | 4 | 5
  hasEntered: boolean

  // Camera
  cameraTarget: THREE.Vector3
  cameraLookAt: THREE.Vector3

  // Audio
  audioEnabled: boolean
  audioReady: boolean
  globalVolume: number

  // Mouse
  mouseX: number
  mouseY: number
  mouseNormX: number
  mouseNormY: number

  // Audio frequency data
  audioFreq: number
  audioBass: number
  audioMid: number
  audioHigh: number

  // UI
  showUI: boolean
  cursorVariant: 'default' | 'hover' | 'portal' | 'hidden'
  activePortal: WorldId | null

  // Actions
  travelTo: (world: WorldId) => void
  setOpeningPhase: (phase: 0 | 1 | 2 | 3 | 4 | 5) => void
  setHasEntered: (val: boolean) => void
  setCameraTarget: (pos: THREE.Vector3, lookAt?: THREE.Vector3) => void
  setAudioEnabled: (val: boolean) => void
  setAudioReady: (val: boolean) => void
  setMouse: (x: number, y: number, nx: number, ny: number) => void
  setAudioData: (freq: number, bass: number, mid: number, high: number) => void
  setCursorVariant: (v: 'default' | 'hover' | 'portal' | 'hidden') => void
  setActivePortal: (w: WorldId | null) => void
  setTransitionProgress: (p: number) => void
}

export const useEngineStore = create<EngineState>((set) => ({
  currentWorld: 'opening',
  previousWorld: null,
  isTransitioning: false,
  transitionProgress: 0,

  openingPhase: 0,
  hasEntered: false,

  cameraTarget: new THREE.Vector3(0, 0, 6),
  cameraLookAt: new THREE.Vector3(0, 0, 0),

  audioEnabled: false,
  audioReady: false,
  globalVolume: 0.6,

  mouseX: 0,
  mouseY: 0,
  mouseNormX: 0,
  mouseNormY: 0,

  audioFreq: 0,
  audioBass: 0,
  audioMid: 0,
  audioHigh: 0,

  showUI: true,
  cursorVariant: 'default',
  activePortal: null,

  travelTo: (world) =>
    set((state) => ({
      previousWorld: state.currentWorld,
      currentWorld: world,
      isTransitioning: true,
      transitionProgress: 0,
    })),

  setOpeningPhase: (phase) => set({ openingPhase: phase }),
  setHasEntered: (val) => set({ hasEntered: val }),
  setCameraTarget: (pos, lookAt) =>
    set({
      cameraTarget: pos,
      cameraLookAt: lookAt ?? new THREE.Vector3(0, 0, 0),
    }),
  setAudioEnabled: (val) => set({ audioEnabled: val }),
  setAudioReady: (val) => set({ audioReady: val }),
  setMouse: (x, y, nx, ny) =>
    set({ mouseX: x, mouseY: y, mouseNormX: nx, mouseNormY: ny }),
  setAudioData: (freq, bass, mid, high) =>
    set({ audioFreq: freq, audioBass: bass, audioMid: mid, audioHigh: high }),
  setCursorVariant: (v) => set({ cursorVariant: v }),
  setActivePortal: (w) => set({ activePortal: w }),
  setTransitionProgress: (p) =>
    set({ transitionProgress: p, isTransitioning: p < 1 }),
}))
