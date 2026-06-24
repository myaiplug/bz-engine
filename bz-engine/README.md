# BZ — Inside The Creative Engine

An interactive 3D portfolio experience built with Next.js, React Three Fiber, and custom GLSL shaders.

## Stack

- Next.js 15 (App Router)
- React Three Fiber + Three.js
- GSAP animations
- Custom GLSL vertex/fragment shaders
- Zustand state management
- @react-three/postprocessing (Bloom, Chromatic Aberration, Vignette)

## Worlds

- Opening Sequence — Morphic Core + 50k particle field
- Engine Core Hub — 6 navigable portals
- Audio World — Liminal Stem Split waveform visualization
- ScrewAI World — Temporal distortion chamber with interactive controls
- AI, Software, Creative, Design, Automation — (expanding)

## Dev

```bash
npm install
npm run dev
```

## Deploy

Push to GitHub, connect to Vercel. Set framework to Next.js. No env vars needed.

## Notes

- Desktop-first (mobile responsive planned)
- Audio is optional — site works fully without it
- 60 FPS target with postprocessing on high-end GPUs
