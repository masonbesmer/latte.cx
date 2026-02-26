# NEURAL//LINK — Agent Context

## Current Version: v0.9.0 — Braindance Intro Sequence & Audio

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

### v0.5.0 — Particle System
- Created src/lib/components/three/ParticleField.svelte (child of BackgroundScene Canvas):
  - 1000 particles using THREE.Points + THREE.BufferGeometry with position and color attributes
  - PointsMaterial: size 0.15, sizeAttenuation, transparent, opacity 0.75, AdditiveBlending, vertexColors, depthWrite:false, fog:true (respects scene FogExp2)
  - Per-particle state: driftY (0.005–0.02/frame upward speed), impX/impY/impZ (impulse), jitter (0.9–1.1 color factor)
  - Upward drift loop: Y += driftY each frame; when Y > 25, particle resets to Y=-5 with new random X/Z
  - Mouse burst: mousemove event → Raycaster → intersect horizontal plane at Y=5; particles within 3 units receive radial impulse magnitude 0.3; impulse dampens at 0.95/frame (~2s decay); pre-allocated THREE.Vector2 to avoid heap alloc on mousemove
  - Color-shifting: subscribes to activeSection store; on change, saves startColor=currentColor.clone() and sets targetColor (cyan for 'hero', yellow for 'projects'); lerpColors over ~60 frames (1s); ±10% per-particle hue jitter from pre-computed jitter[] array
  - Full cleanup in onDestroy (removeEventListener, unsubSection, scene.remove, geometry.dispose, material.dispose)
- Updated BackgroundScene.svelte: added <ParticleField /> as last child of Canvas
- Updated src/routes/+page.svelte: added IntersectionObserver (threshold: 0.3) on #hero wrapper and #projects section; sets activeSection to 'hero' or 'projects' on intersection

### v0.7.0 — Writeups Page & Markdown Rendering
- Installed mdsvex (v0.12.6) as devDependency for SvelteKit-native markdown processing
- Configured svelte.config.js: extensions ['.svelte', '.md'], mdsvex preprocessor with .md extension and highlight aliases (sh→bash, ts→typescript, js→javascript)
- Created src/content/ directory with 3 sample writeup .md files:
  - neural-home-hub.md — Home Assistant platform write-up (frontmatter: title/slug/tags/category/date/summary)
  - proxmox-hypervisor-cluster.md — Proxmox HA cluster write-up
  - darknet-infrastructure.md — Zero-trust network write-up
- Created src/lib/data/content.ts:
  - ContentFrontmatter / ContentModule interfaces
  - import.meta.glob loads all /src/content/*.md files
  - getProject(slug): returns { component, meta } or null (404)
  - getAllProjects(): returns all frontmatter sorted by date descending
- Created src/routes/projects/[slug]/+page.ts: PageLoad calls getProject(params.slug), throws error(404) if not found with message "// PROJECT NOT FOUND: SLUG"
- Built src/routes/projects/[slug]/+page.svelte:
  - Breadcrumb: "NIGHT CITY NET > SONGBIRD > PROJECTS > [PROJECT NAME]" — Share Tech Mono, links in cyan, current segment in #F2E900
  - GlitchText h1 with trigger="always" for the project title
  - Project meta row: date in dim cyan, tag badges in border-only monospace style
  - Project summary in border-left styled paragraph
  - Terminal wrapper: neon border (rgba 20% opacity), top bar reading "// OUTPUT" with decorative dots
  - Line-by-line load-in animation: requestAnimationFrame → forEach child with 80+i*15ms setTimeout, opacity 0→1 + translateY 8→0 CSS transition
  - Blinking | cursor (.stream-cursor, blink-cursor @keyframes) shown during animation, cursorDone=true after last line + 1s delay
  - Empty content edge case: cursorDone set immediately when no children
  - ← BACK TO NET buttons (top + bottom): monospace border button, goto('/#projects')
  - All markdown elements styled in terminal aesthetic:
    - h1: Rajdhani, #F2E900, yellow text-shadow glow
    - h2: Rajdhani, #25E1ED, neon-cyan text-shadow, border-bottom
    - h3: Rajdhani, #02D7F2
    - h4: Share Tech Mono, uppercase, dim cyan
    - p: rgba cyan 85% opacity
    - a: #25E1ED, border-bottom, hover → #F2E900
    - ul/ol: dim list markers
    - blockquote: yellow left border, yellow-tinted background
    - hr: dim cyan 1px border-top
    - table: yellow th, cyan td, row hover subtle highlight
    - img: neon border + box-shadow glow, max-width 100%
    - pre: dark bg, neon border, ::before pseudo "// OUTPUT" top bar
    - code: #F2E900 inline, yellow-tinted bg
    - pre code: #25E1ED, no bg (overrides inline)
    - Prism token classes: keyword=magenta, string=yellow, number=neon-cyan, function=cyan, comment=dim

## Tech Stack
- SvelteKit with TypeScript
- Tailwind CSS v4 (@tailwindcss/vite)
- Google Fonts: Rajdhani (headings), Share Tech Mono (body)
- Threlte (@threlte/core v8, @threlte/extras v9) for Three.js integration
- Three.js v0.183 for 3D rendering
- EffectComposer + UnrealBloomPass for bloom post-processing
- mdsvex v0.12.6 for markdown preprocessing
- Audio synthesis via Web Audio API (no external audio files or libraries required)

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
- src/lib/components/ProjectCard.svelte — holographic data-pad card (glass-morphism, neon border, 3D tilt, orbiting dots, tag badges)
- src/lib/components/three/BackgroundScene.svelte — fixed 3D background (grid + cityscape + data shards + bloom + particles)
- src/lib/components/three/SceneCore.svelte — inner Threlte component: camera, bloom, parallax
- src/lib/components/three/ParticleField.svelte — ambient particle system: upward drift, mouse burst, color-shift
- src/lib/stores/scene.ts — activeSection store for cross-component 3D state
- src/lib/data/projects.ts — project data model + 6 placeholder projects with categories/tags
- src/lib/data/content.ts — markdown content loader: getProject(slug) + getAllProjects() via import.meta.glob
- src/lib/actions/tilt.ts — Svelte action for 3D card tilt (mousemove/mouseleave, touch-disabled)
- src/content/*.md — markdown writeup files with frontmatter (title/slug/tags/category/date/summary)
- src/lib/components/ContactTerminal.svelte — CLI-styled contact form: sequential fields, validation, loading/success/error states
- src/lib/components/BraindanceIntro.svelte — full-screen 3-phase intro sequence: static noise canvas (phase 1), neural sync loading bar with glitch stutters + text readouts (phase 2), white flash + tear-out dissolve (phase 3)
- src/lib/audio/braindance.ts — Web Audio API synthesis: white-noise static (fade in/out), synth sting (sawtooth+square, frequency sweep), bass drop (sine + waveshaper distortion)
- src/lib/stores/audio.ts — muted: Writable<boolean> for global audio toggle

## Architecture Notes
- Camera is created imperatively in SceneCore (not via T.PerspectiveCamera makeDefault) to avoid a Threlte v8 TypeScript issue where @types/three types isCamera as boolean instead of true literal
- body background-color is transparent; the WebGL canvas (renderer.setClearColor '#0A0A0F') provides the dark background
- EffectComposer render task runs in renderStage (after main stage object updates) for correct frame ordering
- ParticleField useTask runs in default stage (before renderStage) so particle positions are updated before bloom compositing
- activeSection store connects +page.svelte IntersectionObserver → ParticleField color lerp and ProjectCard section highlight
- ProjectCard tilt action is disabled on touch devices (hover: none media query check)
- Card click triggers a 220ms glitch-flash CSS animation overlay before goto() navigation (scanline fires again via afterNavigate in layout)
- BraindanceIntro is conditionally rendered in +layout.svelte only when sessionStorage('braindance-seen') is not set; sets flag on completion/skip
- prefers-reduced-motion check in BraindanceIntro bypasses intro entirely and logs to console
- Audio uses Web Audio API synthesis (no external files); AudioContext.resume() called on mount to satisfy browser autoplay policy; all audio gracefully skipped if muted store is true or AudioContext unavailable


### v0.6.0 — Projects Gallery
- Created src/lib/data/projects.ts: Project type (slug/title/tags/thumbnail/summary/category), CATEGORY_LABELS map, CATEGORY_COLORS map (home-assistant=cyan, proxmox=yellow, networking=neon-cyan, automotive=yellow, hardware=magenta, linux=cyan), 6 placeholder projects (Neural Home Hub, Proxmox Hypervisor Cluster, Darknet Infrastructure, Vehicle CAN Bus Logger, Custom PCB Sensor Array, Linux Kernel Hardening)
- Created src/lib/actions/tilt.ts: Svelte action attaching mousemove/mouseleave; computes rotX/rotY from mouse offset relative to card center (max ±8°); perspective(800px) transform; disabled on touch devices via matchMedia('(hover: none)')
- Created src/lib/components/ProjectCard.svelte:
  - Glass-morphism: backdrop-filter blur(12px), background rgba(10,10,15,0.6), border rgba(2,215,242,0.3) → rgba(2,215,242,0.7) on hover
  - Neon border glow: box-shadow 0 0 8px → 0 0 20px + 0 0 40px on hover (CSS transition 0.3s)
  - Thumbnail: 16:9 aspect-ratio div with gradient using category accent color (color-mix)
  - Card body: Rajdhani title with cyan text-shadow, Share Tech Mono summary, category-colored tag badges
  - 3D tilt: use:tilt={maxAngle: 8} action applied to card <a> element
  - Orbiting dots: 3 absolutely-positioned spans (cyan/yellow/magenta) animated via orbit-path @keyframes, shown only on hover ({#if hovered})
  - onCardClick prop: preventDefault on <a> click, calls callback to trigger glitch-flash then navigate
- Updated src/routes/+page.svelte:
  - Replaced placeholder #projects section with full gallery layout
  - GlitchText h2 trigger="scroll" for "// ACTIVE PROJECTS" section title
  - Responsive grid: 1 col mobile → 2 col md → 3 col lg, gap 1.5rem, max-width 1200px centered
  - glitch-flash overlay: fixed full-viewport div with 220ms step-animation (white/cyan/magenta noise pulses) shown on card click, then goto() navigates
  - IntersectionObserver still wired for hero/projects sections → activeSection store
  - Added `// ESTABLISH UPLINK` footer CTA section with `[SEND TRANSMISSION]` link to /contact

### v0.8.0 — Contact Terminal
- Created src/lib/components/ContactTerminal.svelte:
  - formState: 'idle' | 'submitting' | 'success' | 'error' with Svelte reactive state
  - CLI prompt fields: `> IDENTIFY:` (name, min 2 chars), `> FREQ:` (email, regex validation), `> SUBJECT:` (min 3 chars), `> MESSAGE:` (textarea, min 10 chars)
  - Sequential field reveal: each field slides in (ct-slide-in @keyframes) after Enter/blur on previous field; auto-focuses next field
  - Inline validation errors displayed as `// ERR: ...` in #FF1111 with red input border on submit
  - Loading state: `// UPLINK CONNECTING...` animated dots (toggle every 400ms) + LoadingBar (label "TRANSMITTING PAYLOAD", 2.5s)
  - Success state: glitch-flash overlay (220ms) → `// TRANSMISSION RECEIVED / // NEURAL ACK CONFIRMED / // SONGBIRD WILL RESPOND VIA ENCRYPTED CHANNEL` with slide-in animation, `[NEW TRANSMISSION]` reset button
  - Error state: `// UPLINK FAILED — SIGNAL LOST` in red with RETRY button
  - Simulated submission: 2.6s setTimeout (real backend deferred)
  - Full cleanup: clearInterval on dots/loading in resetForm()
- Updated src/routes/contact/+page.svelte:
  - Full viewport centered layout (min-h-screen, max-width 680px)
  - GlitchText h1 trigger="always" reading "// SEND TRANSMISSION"
  - UPLINK STATUS: READY with blinking dot indicator (600ms interval)
  - ct-divider separator line in dim cyan
  - ContactTerminal component in main
  - ← BACK TO NET footer link to /#projects

### v0.9.0 — Braindance Intro Sequence & Audio
- Installed howler (v2.2.4) as specified by plan.md step 1; subsequently removed (unused — all audio synthesized via Web Audio API programmatic fallback)
- Created src/lib/audio/braindance.ts:
  - All sounds synthesized via Web Audio API — no external audio files required
  - playStaticFadeIn(): looping white-noise buffer → bandpass filter (2kHz) → gain fade-in over 2s; stored as staticSource/staticGain for external control
  - fadeOutStatic(): linear gain ramp to 0 over fadeDuration, stops source
  - playSynthSting(): sawtooth+square oscillators with frequency sweep (220→880→440Hz) and exponential gain envelope
  - playBassDrop(): sine oscillator with pitch drop (80→30Hz), WaveShaperNode distortion, sharp attack + decay envelope
  - stopAll(): delegates to fadeOutStatic
  - setMuted(val): updates _muted flag and live staticGain value
  - resume(): async, wraps AudioContext.resume() in try/catch to handle autoplay policy gracefully
  - All functions guard against null ctx (SSR / no audio support)
- Created src/lib/stores/audio.ts: muted: Writable<boolean> — persists mute state across components
- Created src/lib/components/BraindanceIntro.svelte:
  - Full-screen fixed overlay (z-index: 9999, background: #000), aria role=dialog
  - Phase 1 (0–2s): <canvas> renders random noise pixels via ImageData in requestAnimationFrame loop; playStaticFadeIn plays
  - Skip button: fades in at 2s (opacity: 0 → 1 via CSS transition), positioned top-right
  - Phase 2 (2–5s): canvas hidden, bd-sync block shown; custom loading bar animates 0→100% over 3s via requestAnimationFrame; STUTTERS=[0.35, 0.62, 0.78] array causes 3 backwards jumps of 5–10%; synth sting fires via setInterval watcher when barPercent ≥ 60; 4 readout lines appear sequentially via staggered setTimeout (650ms apart)
  - Phase 3 (5–6s): white flash (100ms), bass drop, bd-tear-out @keyframes dissolve (clip-path splits into fragments), done=true after 700ms → onComplete() called
  - Skip: clearTimers + cancelAnimationFrame + stopNoiseLoop + audio.stopAll, then triggers phase 3 directly
  - prefers-reduced-motion check in onMount: bypasses intro entirely, sets sessionStorage flag, logs `// BRAINDANCE BYPASSED — REDUCED MOTION DETECTED`
  - $: audio.setMuted($muted) reactive statement keeps audio module in sync with store
  - onDestroy: clearTimers + cancelAnimationFrame barRaf + stopNoiseLoop for full cleanup
- Updated src/routes/+layout.svelte:
  - Imports BraindanceIntro and muted store
  - onMount reads sessionStorage('braindance-seen'); if absent, sets showIntro=true
  - {#if showIntro} renders <BraindanceIntro onComplete={onIntroComplete} />
  - onIntroComplete sets showIntro=false (unmounts component)
  - Audio mute toggle button: fixed bottom-right (z-index: 100), 🔊/🔇 icon, aria-label updates on state, neon border style consistent with design system
