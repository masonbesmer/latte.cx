# NEURAL//LINK — Agent Context

## Current Version: v0.4.0 — Three.js Background Scene (Threlte)

## Completed Steps

### v0.1.0 — Project Scaffolding & Design Foundation
- SvelteKit skeleton project scaffolded with TypeScript
- Tailwind CSS v4 installed and configured with @tailwindcss/vite plugin
- Custom design tokens defined in tailwind.config.ts and tokens.css
- Google Fonts (Rajdhani + Share Tech Mono) added to app.html
- Root layout created with CSS reset, dark background (#0A0A0F), cyan text (#02D7F2)
- Placeholder routes created: /, /projects/[slug], /contact
- globals.css: neon scrollbar, CRT vignette overlay, scan-line overlay
- tokens.css: CSS custom properties for all palette colors and spacing units

### v0.2.0 — Global UI Utilities & Glitch System
- Created src/lib/styles/glitch.css: .glitch utility class with keyframes (glitch-skew, glitch-clip-before/after, glitch-color-before/after) and trigger modes (.glitch--hover, .glitch--active, .glitch--always)
- Created src/lib/components/GlitchText.svelte: props text/tag/trigger, IntersectionObserver for scroll trigger via Svelte action
- Created src/lib/components/ScanlineTransition.svelte: full-viewport horizontal neon (#25E1ED) sweep overlay, expose trigger(), wired into +layout.svelte via afterNavigate
- Created src/lib/components/LoadingBar.svelte: animated percent fill with Unicode block chars (█/░), role=status aria-live=polite
- Created src/lib/components/NeonButton.svelte: border glow button, primary (yellow) and danger (red) variants with hover pulse animation
- Wired ScanlineTransition into +layout.svelte (fires on every navigation)

### v0.3.0 — Hero Section & Home Page
- Created src/lib/components/HeroSection.svelte: full-viewport hero with character-scramble title animation (each char randomizes through !@#$%^&*░▒▓ for ~1.5s, staggered 50ms per char), identity-line typewriter (// IDENTITY CONFIRMED: SONGBIRD with blinking cursor), CRT flicker keyframe (brightness/contrast 0.97–1.03 at random intervals), neon text-shadow on title (#02D7F2) and identity line (#F2E900)
- Created src/lib/components/CyclingSubtitle.svelte: cycles through three role strings (HOME AUTOMATION ENGINEER / SYSTEMS ARCHITECT / NETWORK OPERATOR) with per-char type (30ms) and erase (20ms) animation, 2s hold, blinking block cursor (█)
- Updated src/routes/+page.svelte: HeroSection takes full first viewport; #projects anchor below with placeholder // PROJECTS LOADING...
- Responsive title: clamp(3.75rem, 14vw, 9rem) — scales from text-6xl on mobile to text-9xl on desktop

### v0.4.0 — Three.js Background Scene (Threlte)
- Installed @threlte/core (v8.4.0), @threlte/extras (v9.8.1), three (v0.183.1), @types/three, postprocessing
- Created src/lib/stores/scene.ts: exports activeSection: Writable<string> initialized to 'hero'
- Created src/lib/components/three/BackgroundScene.svelte:
  - Fixed full-viewport wrapper (position: fixed; inset: 0; z-index: -1; pointer-events: none)
  - Canvas from @threlte/core as the WebGL surface
  - T.FogExp2 attached as scene fog (#0A0A0F, density 0.015) — buildings fade into darkness
  - Ambient light (cyan, intensity 0.3) + directional light (cyan, intensity 0.5) for depth
  - Grid from @threlte/extras: 120x120 units, cyan grid lines, 90-unit fade distance
  - 20 city buildings in 4 rows (z: -25, -38, -52, -65), BoxGeometry with emissive #F2E900 and #02D7F2 edges
  - 5 floating data shards: OctahedronGeometry, wireframe, colors (cyan/yellow/magenta), wrapped in Float for bobbing + rotation
- Created src/lib/components/three/SceneCore.svelte (inner Canvas child component):
  - Creates PerspectiveCamera imperatively (fov 60, position [0, 8, 18], lookAt [0, 2, -5])
  - Sets renderer clear color #0A0A0F for dark background
  - Stops Threlte's autoRenderTask, uses EffectComposer instead
  - EffectComposer: RenderPass -> UnrealBloomPass (strength 0.5, radius 0.3, threshold 0.3) -> OutputPass
  - Mouse parallax: window mousemove + deviceorientation, +/-0.5 X/+/-0.25 Y camera offset, lerp damping 0.05
  - Canvas size subscription for responsive camera aspect + composer resize
  - Full cleanup in onDestroy (event listeners, store unsub, scene.remove, composer.dispose)
- Updated src/routes/+layout.svelte: BackgroundScene integrated (persists across all routes), body background set to transparent so 3D canvas provides the dark background

## Tech Stack
- SvelteKit with TypeScript
- Tailwind CSS v4 (@tailwindcss/vite)
- Google Fonts: Rajdhani (headings), Share Tech Mono (body)
- Threlte (@threlte/core v8, @threlte/extras v9) for Three.js integration
- Three.js v0.183 for 3D rendering
- EffectComposer + UnrealBloomPass for bloom post-processing

## Design Tokens
- Iconic Yellow: #F2E900
- Cyan: #02D7F2
- Electric Blue: #007AFF
- Hot Red: #FF1111
- Deep Black: #0A0A0F
- Neon Cyan: #25E1ED
- Hot Magenta: #ED1E79

## Component Inventory
- src/lib/styles/glitch.css — glitch animation system
- src/lib/components/GlitchText.svelte — text with glitch effect (hover/scroll/always)
- src/lib/components/ScanlineTransition.svelte — full-viewport neon sweep on navigation
- src/lib/components/LoadingBar.svelte — animated ASCII-style loading bar
- src/lib/components/NeonButton.svelte — border glow button (primary/danger)
- src/lib/components/HeroSection.svelte — full-viewport hero (scramble title + identity typewriter + cycling subtitle + CRT flicker)
- src/lib/components/CyclingSubtitle.svelte — type/erase cycling role display with blinking cursor
- src/lib/components/three/BackgroundScene.svelte — fixed 3D background (grid + cityscape + data shards + bloom)
- src/lib/components/three/SceneCore.svelte — inner Threlte component: camera, bloom, parallax
- src/lib/stores/scene.ts — activeSection store for cross-component 3D state

## Architecture Notes
- Camera is created imperatively in SceneCore (not via T.PerspectiveCamera makeDefault) to avoid a Threlte v8 TypeScript issue where @types/three types isCamera as boolean instead of true literal
- body background-color is transparent; the WebGL canvas (renderer.setClearColor '#0A0A0F') provides the dark background
- EffectComposer render task runs in renderStage (after main stage object updates) for correct frame ordering
