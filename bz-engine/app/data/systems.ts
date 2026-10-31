import { WorldId } from '../store/useEngineStore'

export type SystemStatus = 'live' | 'experiment' | 'transfer' | 'attention'

export interface System {
  id: string
  world: WorldId
  name: string
  short: string
  description: string
  status: SystemStatus
  liveUrl?: string
  action: 'open' | 'demo' | 'commission'
  tags: string[]
  grokAssisted?: boolean
}

export const SYSTEMS: System[] = [
  // Audio Systems
  {
    id: 'liminal',
    world: 'audio',
    name: 'Liminal StemSplit',
    short: 'Local 6-stem isolation',
    description: '100% local AI stem separation. Vocals, drums, bass, other. One-time. No upload. Built with agent-assisted workflows.',
    status: 'live',
    liveUrl: 'https://liminal-stemsplit.onrender.com',
    action: 'demo',
    tags: ['stem', 'local', 'one-time'],
    grokAssisted: true,
  },
  {
    id: 'coproducer',
    world: 'audio',
    name: 'CoProducer',
    short: 'Level + mix analysis',
    description: 'Same-night mix rescue and analysis. Local pass.',
    status: 'live',
    liveUrl: 'https://myaiplug.github.io/coproducer-web',
    action: 'open',
    tags: ['analysis', 'qc'],
  },
  {
    id: 'screwai',
    world: 'screwai',
    name: 'ScrewAI',
    short: 'Chop and screw processor',
    description: 'Temporal slowdown and flavor packs. Web pass + local library.',
    status: 'live',
    action: 'demo',
    tags: ['screw', 'tempo'],
    grokAssisted: true,
  },
  {
    id: 'retune',
    world: 'audio',
    name: 'reTUNE[432]',
    short: '440 to 432 Hz engine',
    description: 'Precision retuning system.',
    status: 'live',
    liveUrl: 'https://retune-432.vercel.app',
    action: 'open',
    tags: ['tuning'],
  },
  {
    id: 'fantune',
    world: 'audio',
    name: 'FanTune',
    short: 'Spectral fan modulator',
    description: 'Box-fan vocal chop as VST3/AU/CLAP. Free browser demo.',
    status: 'live',
    action: 'demo',
    tags: ['vst', 'spectral'],
  },
  {
    id: 'wavetrim',
    world: 'audio',
    name: 'WaveTrim',
    short: 'Waveform trimmer',
    description: 'Click-drag selection, producer tags, bulk unlock.',
    status: 'transfer',
    action: 'commission',
    tags: ['editor'],
  },

  // Software / Creator Tools
  {
    id: 'suite',
    world: 'software',
    name: 'NoDAW Suite',
    short: 'ConvertIT · TrimIT · FxIT · TestIT',
    description: 'Browser-native free tools. Local processing. Multiple tools iterated with AI agents.',
    status: 'live',
    liveUrl: 'https://myaiplug.github.io/nodaw',
    action: 'open',
    tags: ['free', 'tools'],
    grokAssisted: true,
  },
  {
    id: 'cyberforge',
    world: 'design',
    name: 'CyberForge',
    short: 'Newton Field audio UI',
    description: 'High-end audio UI design system. Awwwards-level motion and HUD language.',
    status: 'live',
    liveUrl: 'https://cyberforge-five-psi.vercel.app',
    action: 'open',
    tags: ['ui', 'design'],
    grokAssisted: true,
  },
  {
    id: 'beatmob',
    world: 'creative',
    name: 'Beat Mob Store',
    short: 'Leases and catalog',
    description: 'October storefront. Beat leases from the collective.',
    status: 'live',
    liveUrl: 'https://beat-mob-store-ruby.vercel.app',
    action: 'open',
    tags: ['music', 'catalog'],
  },

  // AI / Automation / Grok-assisted
  {
    id: 'lyrics',
    world: 'ai',
    name: 'Lyrics from Vocal Stem',
    short: 'Browser Whisper',
    description: 'Free local lyric transcription with timestamps. Nothing uploaded.',
    status: 'live',
    action: 'demo',
    tags: ['whisper', 'local'],
  },
  {
    id: 'blackbox',
    world: 'automation',
    name: 'Black Box',
    short: 'Credit + MLC check',
    description: 'Pulls public writer/performer/producer credits, checks The MLC.',
    status: 'live',
    liveUrl: 'https://blackbox-sigma-eight.vercel.app',
    action: 'open',
    tags: ['credits'],
  },
  {
    id: 'fanout',
    world: 'automation',
    name: 'FANOUT',
    short: 'Cross-lister',
    description: 'One catalog, every marketplace. Bulk listings and upload queue.',
    status: 'live',
    liveUrl: 'https://cross-lister.vercel.app',
    action: 'open',
    tags: ['listings'],
  },
  {
    id: 'agent-crews',
    world: 'ai',
    name: 'Agent Crews',
    short: 'OpenCode + Grok workflows',
    description: 'Specialized agent teams for frontend, design systems, market analysis, and product iteration. Multiple tools and pages built end-to-end with Grok and OpenCode.',
    status: 'live',
    action: 'commission',
    tags: ['agents', 'grok', 'automation'],
    grokAssisted: true,
  },

  // Operator / About
  {
    id: 'operator',
    world: 'about',
    name: 'Brian Jutz / bZ',
    short: 'Creative Technologist',
    description: 'NODAW LABS. Local-first audio systems, AI infrastructure, and software products engineered as one machine. Louisville. High volume of work iterated with Grok and local agent crews.',
    status: 'live',
    action: 'commission',
    tags: ['operator'],
    grokAssisted: true,
  },
]

export function getSystemsByWorld(world: WorldId): System[] {
  return SYSTEMS.filter((s) => s.world === world)
}

export function getGrokAssistedSystems(): System[] {
  return SYSTEMS.filter((s) => s.grokAssisted)
}
