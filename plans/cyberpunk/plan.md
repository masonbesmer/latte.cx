# NEURAL//LINK — Versioned Build Plan

**Target:** 10 versions, `v0.1.0` → `v1.0.0`, each scoped to ~1 hour of agent work.

---

## v0.1.0 — Project Scaffolding & Design Foundation

**Goal:** Bootable SvelteKit project with Tailwind, design tokens, fonts, and base layout shell.

### Steps

1. Scaffold a new SvelteKit project with TypeScript (`create-svelte`), selecting the skeleton template
2. Install and configure Tailwind CSS v4 with PostCSS
3. Define custom design tokens in `tailwind.config.ts`:
   - Colors: Iconic Yellow `#F2E900`, Cyan `#02D7F2`, Electric Blue `#007AFF`, Hot Red `#FF1111`, Deep Black `#0A0A0F`, Neon Cyan `#25E1ED`, Hot Magenta `#ED1E79`
   - Font families: `rajdhani` (headings/UI), `share-tech-mono` (body/readouts)
4. Add Google Fonts imports for `Rajdhani` and `Share Tech Mono` in `app.html`
5. Create the root layout `+layout.svelte` with:
   - Global CSS reset and base `background: #0A0A0F`, `color: #02D7F2`
   - Font assignments for headings and body
   - A `<slot />` wrapper with a page-level container
6. Create placeholder route files:
   - `src/routes/+page.svelte` (Home / Hero + Gallery)
   - `src/routes/projects/[slug]/+page.svelte` (Writeup)
   - `src/routes/contact/+page.svelte` (Terminal)
7. Create `src/lib/styles/globals.css` with:
   - Custom neon scrollbar styles using `#02D7F2`
   - CRT vignette overlay as a `::after` pseudo-element on the body
   - Horizontal scan-line CSS overlay (`repeating-linear-gradient` at 2px intervals, low opacity)
8. Create `src/lib/styles/tokens.css` exporting CSS custom properties for all palette colors and spacing units
9. Verify the dev server boots cleanly with `npm run dev`, all three routes render placeholder text, fonts load, scrollbar is styled

### Verification

- `npm run dev` succeeds with no errors
- Visiting `/`, `/projects/test`, and `/contact` renders styled placeholder pages
- Scrollbar, vignette, and scan-line overlays are visible
- Fonts render correctly (Rajdhani for headings, Share Tech Mono for body)

---

## v0.2.0 — Global UI Utilities & Glitch System

**Goal:** Reusable CSS glitch effect, page-transition scanline, loading state component, and shared UI primitives.

### Steps

1. Create `src/lib/styles/glitch.css` containing the `.glitch` utility class:
   - Uses `::before` and `::after` pseudo-elements with `clip-path` animation
   - Pseudo-elements inherit text content via `attr(data-text)` or duplicated content
   - Keyframes: `glitch-skew` (random `skew()` transforms), `glitch-clip` (animated `clip-path: inset()` slicing), `glitch-color` (shifted `color` between `#FF1111` and `#02D7F2`)
   - Trigger modes: `.glitch--hover` (plays on `:hover`), `.glitch--scroll` (plays via an `IntersectionObserver`-toggled class `.glitch--active`)
2. Create a Svelte component `src/lib/components/GlitchText.svelte`:
   - Props: `text: string`, `tag: 'h1' | 'h2' | 'h3' | 'p'` (default `'h1'`), `trigger: 'hover' | 'scroll' | 'always'`
   - Wraps the text in the appropriate HTML element with `.glitch` class and `data-text` attribute
   - If `trigger === 'scroll'`, uses `svelte:action` with an `IntersectionObserver` to add `.glitch--active`
3. Create `src/lib/components/ScanlineTransition.svelte`:
   - A full-viewport fixed overlay (`pointer-events: none`) — a horizontal neon line (`#25E1ED`, 2px tall, box-shadow glow) that sweeps top-to-bottom over ~600ms
   - Exposes a `trigger()` function via `bind:this` or a Svelte store
   - Integrate into `+layout.svelte` — fires on every `$page.url` change using `afterNavigate`
4. Create `src/lib/components/LoadingBar.svelte`:
   - Props: `percent: number`, `label: string` (default `'LOADING SUBSYSTEM'`)
   - Renders: `[████░░░░] 47% — LOADING SUBSYSTEM` using Unicode block characters
   - Animated: percent ticks up from 0 to target value over a configurable duration
5. Create `src/lib/components/NeonButton.svelte`:
   - Props: `label: string`, `variant: 'primary' | 'danger'`, `disabled: boolean`
   - Styled as a border-only button with glow box-shadow, hover pulse animation
   - Colors derive from design tokens (`primary` = Yellow, `danger` = Hot Red)
6. Wire the `ScanlineTransition` into the root layout so it fires on every navigation

### Verification

- `<GlitchText>` renders with visible glitch animation on hover
- Navigating between `/`, `/projects/test`, and `/contact` triggers the scanline sweep
- `<LoadingBar>` animates from 0% to a given value with correct visual output
- `<NeonButton>` renders with glow, responds to hover

---

## v0.3.0 — Hero Section & Home Page

**Goal:** Complete hero/home section with glitch title, cycling subtitle, and CRT aesthetic.

### Steps

1. Build `src/lib/components/HeroSection.svelte`:
   - Large centered layout, full viewport height (`min-h-screen`), flex column centered
   - Title: `SONGBIRD` rendered via `<GlitchText tag="h1" trigger="always">` with character-scramble animation:
     - On mount, each character randomizes through symbols (`!@#$%^&*░▒▓`) for ~1.5s before resolving to the correct letter, staggered per character (50ms offset each)
     - Implement as a Svelte reactive block using `setInterval` per character index
   - Subheading identity line: `// IDENTITY CONFIRMED: SONGBIRD` — typed out character-by-character with a blinking cursor (`|` toggling every 500ms via CSS animation)
2. Create `src/lib/components/CyclingSubtitle.svelte`:
   - Cycles through an array of role strings:
     - `// HOME AUTOMATION ENGINEER`
     - `// SYSTEMS ARCHITECT`
     - `// NETWORK OPERATOR`
   - Each role types in character-by-character (30ms per char), holds for 2s, then erases (20ms per char), then next
   - Blinking block cursor at the end of the current text
3. Integrate hero into `src/routes/+page.svelte`:
   - `<HeroSection />` takes full first viewport
   - Below the hero, add an anchor point `#projects` for the gallery (placeholder for now — text: `// PROJECTS LOADING...`)
4. Add CRT overlay enhancements specific to the hero:
   - Slight `brightness` and `contrast` CSS filter flicker using a keyframe that varies brightness between 0.97–1.03 at random intervals
   - Subtle `text-shadow` on all hero text in `#02D7F2` for neon glow effect
5. Ensure the hero section is fully responsive:
   - Title scales: `text-6xl` on mobile → `text-9xl` on desktop
   - Subtitle and identity line scale proportionally
   - Adequate padding and spacing on all breakpoints

### Verification

- Page loads with character-scramble animation resolving to `SONGBIRD`
- Identity line types in after title resolves
- Subtitle cycles through all three roles with type/erase animation
- CRT flicker and neon glow visible
- Responsive at 375px, 768px, and 1440px widths

---

## v0.4.0 — Three.js Background Scene (Threlte)

**Goal:** Persistent 3D background layer with grid-plane cityscape, parallax camera, fog, and bloom.

### Steps

1. Install Threlte packages: `@threlte/core`, `@threlte/extras`, `three`, and `@types/three`
2. Install post-processing: `@threlte/extras` (includes `EffectComposer` integration) or `postprocessing` package
3. Create `src/lib/components/three/BackgroundScene.svelte`:
   - Uses `<Canvas>` from `@threlte/core` as a fixed, full-viewport background layer (`position: fixed; inset: 0; z-index: -1; pointer-events: none`)
   - Scene contents:
     - **Grid plane:** A large flat grid (`GridHelper` or custom shader plane) in `#02D7F2` with subtle opacity, extending to the horizon — gives that Tron/cyberpunk floor effect
     - **City skyline silhouettes:** Simple `BoxGeometry` towers of varying height (20–40 units) arranged in rows at the far edge of the grid, using `MeshStandardMaterial` with emissive edges in `#F2E900` and `#02D7F2`
     - **Fog:** `THREE.FogExp2` in `#0A0A0F` with density `0.015` — buildings fade into darkness at distance
   - **Camera:** `PerspectiveCamera` at a slight downward angle, positioned above the grid
4. Implement mouse-reactive parallax:
   - Track `mousemove` on `window` (normalized -1 to 1)
   - Apply subtle camera position offset (±0.5 units X/Y) via `lerp` with damping factor 0.05 for smooth drift
   - On mobile/touch: use `deviceorientation` as fallback, or gentle auto-drift
5. Add bloom post-processing:
   - Use `EffectComposer` with `UnrealBloomPass` (strength: 0.8, radius: 0.4, threshold: 0.2)
   - This gives the neon edges and emissive materials a hazy glow
6. Create 3–5 floating "data shard" meshes:
   - `OctahedronGeometry` or `IcosahedronGeometry` with wireframe + emissive material
   - Color-coded: cyan, yellow, magenta (one for each project category)
   - Slowly rotating (`0.005 rad/frame`) and bobbing (sine wave on Y axis)
   - Positioned in mid-air above the cityscape
7. Integrate `<BackgroundScene />` into `+layout.svelte` so it persists across all routes
8. Add a Svelte store `src/lib/stores/scene.ts` exporting `activeSection: Writable<string>` to allow future color-shifting of data shards based on active page section

### Verification

- 3D scene renders behind all page content on every route
- Grid plane, city silhouettes, and floating data shards are visible
- Mouse movement causes subtle parallax camera drift
- Bloom glow is visible on neon-colored edges
- Fog fades distant geometry into black
- Scene does not capture pointer events (page content remains interactive)
- No console errors or WebGL context loss

---

## v0.5.0 — Particle System

**Goal:** Ambient particle field integrated into the Three.js scene with mouse reactivity and color-shifting.

### Steps

1. Create `src/lib/components/three/ParticleField.svelte` (child of `BackgroundScene`):
   - Uses a `Points` geometry with `BufferGeometry` containing 800–1200 particles
   - Initial positions: randomly distributed in a box volume (X: -30 to 30, Y: -5 to 20, Z: -30 to 10)
   - Each particle has attributes: `position`, `velocity` (upward drift: Y += 0.005–0.02 per frame), `baseColor`, `size`
   - Particle material: `PointsMaterial` with `sizeAttenuation: true`, `transparent: true`, `blending: AdditiveBlending`, small circle texture (or custom shader for soft dots)
2. Implement upward drift behavior:
   - Particles drift upward at varying speeds, simulating embers / data streams
   - When a particle exceeds Y > 25, reset its Y to -5 and randomize X/Z — creates an infinite upward flow
3. Implement mouse-reactive burst:
   - On `mousemove`, raycast from camera through mouse position into the scene using `THREE.Raycaster`
   - Particles within a radius of 3 units from the ray intersection point receive a velocity impulse (radial push outward, magnitude 0.3)
   - After impulse, particles `lerp` back toward their original drift velocity over ~2 seconds (damping factor)
4. Implement color-shifting:
   - Subscribe to the `activeSection` store from `src/lib/stores/scene.ts`
   - Particle base color transitions between `#02D7F2` (cyan) and `#F2E900` (yellow) using `THREE.Color.lerp` over 1 second when `activeSection` changes
   - Apply per-particle color variation: ±10% hue jitter for organic feel
5. Write a custom vertex shader (optional, performance optimization):
   - If `PointsMaterial` performance is acceptable, keep it simple
   - Otherwise, create a `ShaderMaterial` with custom vertex/fragment shaders that handle size attenuation, color, and alpha falloff per particle
6. Ensure particles respect the scene's fog — distant particles fade out naturally
7. Wire up `activeSection` store updates from `+page.svelte` using an `IntersectionObserver` on the hero and projects sections to toggle between `'hero'` (cyan) and `'projects'` (yellow)

### Verification

- Particles drift upward continuously across the viewport
- Moving the mouse causes nearby particles to scatter and reconvene
- Scrolling from hero to projects section shifts particle color from cyan to yellow
- Particles fade with fog at distance
- No framerate drops below 50fps on mid-range hardware (test in Chrome DevTools Performance tab)

---

## v0.6.0 — Projects Gallery

**Goal:** Holographic data-pad project cards with glass-morphism, neon borders, hover effects, and 3D tilt.

### Steps

1. Define the project data model in `src/lib/data/projects.ts`:
   - Type: `{ slug: string, title: string, tags: string[], thumbnail: string, summary: string, category: 'home-assistant' | 'proxmox' | 'networking' | 'automotive' | 'hardware' | 'linux' }`
   - Populate with 4–6 placeholder projects using the tag reference from the spec (`[HOME ASSISTANT]`, `[PROXMOX]`, `[NETWORKING]`, `[AUTOMOTIVE]`, `[HARDWARE]`, `[LINUX]`)
   - Thumbnails: placeholder gradient images or SVG patterns for now
2. Create `src/lib/components/ProjectCard.svelte`:
   - **Glass-morphism base:** `backdrop-filter: blur(12px)`, `background: rgba(10, 10, 15, 0.6)`, `border: 1px solid rgba(2, 215, 242, 0.3)`, `border-radius: 4px`
   - **Layout:** Thumbnail at top (16:9 aspect ratio), title in `Rajdhani`, tags as inline badges (monospace, border-only, small), one-liner summary
   - **Neon border:** Animated `border-color` glow using `box-shadow: 0 0 8px #02D7F2, inset 0 0 8px rgba(2,215,242,0.1)`
   - **Tag badges:** Styled with category-specific accent colors (e.g., `[HOME ASSISTANT]` in cyan, `[AUTOMOTIVE]` in yellow, `[HARDWARE]` in magenta)
3. Implement hover state:
   - **Glow pulse:** `box-shadow` intensity increases on hover via CSS transition (0.3s ease)
   - **3D tilt:** Track mouse position within the card, apply `transform: perspective(800px) rotateY(Xdeg) rotateX(Ydeg)` where angles map from mouse offset (max ±8°)
   - Implement tilt in a Svelte action `src/lib/actions/tilt.ts` that attaches `mousemove`/`mouseleave` listeners
   - **Orbiting particle dots:** On hover, 3–5 tiny dots (CSS `::after` pseudo elements or absolutely-positioned divs) orbit the card border using a CSS `@keyframes` path animation along the card perimeter
4. Create the gallery section in `src/routes/+page.svelte` below the hero:
   - Section title: `<GlitchText tag="h2" trigger="scroll">` reading `// ACTIVE PROJECTS`
   - Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, gap `1.5rem`
   - Each card is an `<a>` linking to `/projects/{slug}`
5. Add click transition:
   - On card click, trigger the `ScanlineTransition` before navigation
   - Add a brief (200ms) glitch overlay flash (white noise static) using a CSS animation on a full-screen overlay div, then navigate
6. Set `activeSection` store to `'projects'` when the gallery scrolls into view (wired via `IntersectionObserver` on the section element)

### Verification

- Gallery renders 4–6 cards in a responsive grid
- Cards display glass-morphism styling with neon borders
- Hovering a card triggers glow intensification, 3D tilt, and orbiting dots
- Clicking a card triggers scanline + glitch transition, navigates to `/projects/{slug}`
- Tag badges are color-coded per category
- `activeSection` updates to `'projects'` on scroll — particles shift to yellow

---

## v0.7.0 — Writeups Page & Markdown Rendering

**Goal:** Project writeup route with markdown rendering, terminal-readout styling, and breadcrumb navigation.

### Steps

1. Install markdown processing: `mdsvex` (Svelte markdown preprocessor) or `unified` + `remark` + `rehype` stack
   - Preferred: use `mdsvex` for native Svelte markdown support with syntax highlighting
   - Configure in `svelte.config.js`: add `mdsvex` preprocessor with `Share Tech Mono` code blocks and cyberpunk-themed syntax highlighting (custom Prism/Shiki theme with cyan/yellow/magenta tokens on `#0A0A0F` background)
2. Create the content directory structure:
   - `src/content/` folder containing sample `.md` writeup files (2–3 examples)
   - Each file has frontmatter: `title`, `slug`, `tags`, `date`, `summary`
3. Create a content loader in `src/lib/data/content.ts`:
   - Uses Vite's `import.meta.glob` to load all `.md` files from `src/content/`
   - Exports an async function `getProject(slug: string)` that returns the parsed markdown component and frontmatter metadata
   - Exports `getAllProjects()` for the gallery listing (replaces placeholder data from v0.6.0)
4. Build the writeup page `src/routes/projects/[slug]/+page.svelte`:
   - Load function in `+page.ts`: calls `getProject(params.slug)`, returns 404 if not found
   - **Breadcrumb:** `NIGHT CITY NET > SONGBIRD > PROJECTS > [PROJECT NAME]` — each segment is a link styled in `Share Tech Mono`, separated by `>`, with the current segment in `#F2E900`
   - **Terminal readout styling:**
     - Content wrapper has a subtle dark border (`#02D7F2` at 20% opacity), padding, and a `font-family: 'Share Tech Mono'` base
     - Headings get the `.glitch` class on scroll entry
     - Code blocks styled as inline terminal windows with a top bar reading `// OUTPUT` and neon border
   - **Text load-in animation:** On mount, content is revealed line-by-line with a 15ms stagger per line using GSAP `staggerFrom` or a Svelte `each` block with delayed `in:fly` transitions — simulates terminal text streaming
   - **Blinking cursor:** A `|` cursor element at the end of the last visible line during the load-in animation, removed once complete
5. Add a `[← BACK TO NET]` navigation link at the top that returns to `/#projects` with the scanline transition
6. Style all standard markdown elements (`h1`–`h4`, `p`, `ul`, `ol`, `blockquote`, `table`, `hr`, `img`) in the terminal aesthetic — ensure images have neon border treatment and `max-width: 100%`

### Verification

- Navigating to `/projects/sample-slug` renders the markdown content with terminal styling
- Breadcrumb displays correctly with working links
- Text streams in with the load-in animation and blinking cursor
- Code blocks render with syntax highlighting in cyberpunk colors
- Back link navigates to home with transition
- 404 page shows for invalid slugs
- Content loaded from `.md` files with correct frontmatter parsing

---

## v0.8.0 — Contact Terminal

**Goal:** Immersive CLI-styled contact form with transmission animations and validation.

### Steps

1. Create `src/routes/contact/+page.svelte`:
   - Full viewport terminal interface, centered content, `Share Tech Mono` font throughout
   - Header: `<GlitchText tag="h1" trigger="always">` reading `// SEND TRANSMISSION`
   - Subtitle: `UPLINK STATUS: READY` in `#25E1ED` with a blinking dot indicator
2. Build the form as `src/lib/components/ContactTerminal.svelte`:
   - **Form fields rendered as CLI prompts:**
     - `> IDENTIFY:` — text input for name (required, min 2 chars)
     - `> FREQ:` — text input for email (required, email validation)
     - `> SUBJECT:` — text input for subject (required, min 3 chars)
     - `> MESSAGE:` — textarea for message body (required, min 10 chars)
   - Each field has: monospace styling, no visible border except a bottom `1px solid #02D7F2`, transparent background, cyan text, blinking cursor animation on focus
   - Validation errors display inline as `// ERR: INVALID FREQUENCY FORMAT` in `#FF1111`
   - Fields appear sequentially — each field slides in after the previous is interacted with (optional: can show all at once with sequential entrance animation)
3. **Submit button:** `[BROADCAST]` styled as `<NeonButton label="BROADCAST" variant="primary" />`
4. **Submission states** (all visual — no real backend yet):
   - **Loading:** Button text changes to `// UPLINK CONNECTING...`, dots animate (`...` cycles), form fields become readonly, a `<LoadingBar>` appears with label `TRANSMITTING PAYLOAD`
   - **Success:** Full screen glitch flash (200ms static overlay), then screen clears to:
     - `// TRANSMISSION RECEIVED`
     - `// NEURAL ACK CONFIRMED`
     - `// SONGBIRD WILL RESPOND VIA ENCRYPTED CHANNEL`
     - A `[NEW TRANSMISSION]` button to reset the form
   - **Error:** `// UPLINK FAILED — RETRY?` in `#FF1111` with a retry button
5. Implement form state management using Svelte stores or component state:
   - `formState: 'idle' | 'submitting' | 'success' | 'error'`
   - Simulated submission: `setTimeout` of 2–3s to mimic network delay (real backend integration deferred)
6. Add the scanline overlay that sweeps on initial page load
7. Optional: Also wire `/contact` as an anchor section (`#contact`) on the home page — add a `[SEND TRANSMISSION]` button in the home page footer that scrolls or navigates to it

### Verification

- Form renders with CLI prompt styling on `/contact`
- All fields validate with inline error messages
- Submit triggers loading state with animated dots and loading bar
- Success state shows glitch flash → confirmation message
- `[NEW TRANSMISSION]` resets the form to idle
- Fully responsive and keyboard-accessible (tab order, enter to submit)

---

## v0.9.0 — Braindance Intro Sequence & Audio

**Goal:** Cinematic full-screen loader with glitch/static effects, spatialized audio, skip functionality, and neural sync progress bar.

### Steps

1. Install `howler` (`howler.js`) and `@types/howler` for audio
2. Prepare audio assets in `static/audio/`:
   - `neural-static.mp3` — ~3s of fuzzy white noise / digital static
   - `synth-sting.mp3` — short cyberpunk synth hit
   - `bass-drop.mp3` — deep bass impact for scene resolve
   - (Source: royalty-free cyberpunk SFX packs, or generate programmatically with Web Audio API as fallback)
   - Create a `src/lib/audio/braindance.ts` module that initializes Howler instances for each sound with volume levels and spatial settings
3. Create `src/lib/components/BraindanceIntro.svelte`:
   - **Full-screen overlay** (`position: fixed; inset: 0; z-index: 9999; background: #000`)
   - **Phase 1 (0–2s): Static burst**
     - Canvas element rendering random noise pixels (or a CSS `background-image` with rapidly cycling random gradients)
     - Scan-line overlay at high intensity
     - Audio: `neural-static.mp3` fades in
     - After 2s, the `[SKIP BRAINDANCE]` button fades in at top-right corner — small, low opacity (`0.4`), styled as a UI chip with border
   - **Phase 2 (2–5s): Neural sync**
     - Static clears partially, replaced by the `<LoadingBar>` centered on screen
     - Label: `SYNCING SONGBIRD//NET`
     - Bar animates from 0% → 100% over 3s with occasional glitch stutters (bar jumps back 5–10% randomly 2–3 times)
     - Text readouts appear below the bar sequentially:
       - `// ESTABLISHING NEURAL HANDSHAKE...`
       - `// DECRYPTING IDENTITY MATRIX...`
       - `// LOADING SONGBIRD SUBSYSTEMS...`
       - `// LINK ESTABLISHED`
     - Audio: static fades, `synth-sting.mp3` plays at bar ~60%
   - **Phase 3 (5–6s): Resolve**
     - Bar hits 100%, screen flashes white for 100ms
     - `bass-drop.mp3` plays
     - Overlay dissolves: `opacity` transition 0→1 on the main content beneath, overlay fades out with a glitch/tear effect (CSS `clip-path` animation splitting the overlay into fragments that scatter)
     - Overlay element removed from DOM after animation completes
4. **Skip functionality:**
   - `[SKIP BRAINDANCE]` button click immediately triggers Phase 3 resolve (fast-forward)
   - All audio fades out quickly (200ms)
   - Store a flag in `sessionStorage` so the intro only plays once per session
5. **Session check:** In `+layout.svelte`, conditionally render `<BraindanceIntro />` only if `sessionStorage.getItem('braindance-seen')` is falsy. Set it to `'true'` on completion/skip.
6. Add a `prefers-reduced-motion` media query check — if enabled, skip the intro entirely and log to console: `// BRAINDANCE BYPASSED — REDUCED MOTION DETECTED`
7. Create an audio settings store `src/lib/stores/audio.ts` with a `muted: Writable<boolean>` — the intro respects this, and add a small speaker icon toggle in the layout footer for global mute

### Verification

- First visit shows the full braindance sequence with all three phases
- Audio plays in sync with visual phases (static → sting → bass drop)
- `[SKIP BRAINDANCE]` appears at 2s and fast-forwards when clicked
- Refreshing the page within the same session skips the intro
- Opening a new session replays the intro
- `prefers-reduced-motion` skips the intro entirely
- Mute toggle works and persists via the audio store
- No audio autoplay issues (handle browser autoplay policy with a user gesture fallback)

---

## v1.0.0 — Docker, Polish, Performance & Final Integration

**Goal:** Production-ready build with Docker/Nginx containerization, performance optimization, cross-browser polish, and full integration testing.

### Steps

1. **SvelteKit build configuration:**
   - Configure `@sveltejs/adapter-static` (or `adapter-node` if SSR desired) in `svelte.config.js`
   - Set `prerender` options for all static routes; set `[slug]` routes to prerender from the content directory entries
   - Verify `npm run build` completes without errors
2. **Create `Dockerfile`:**
   - Multi-stage build: Stage 1 (`node:20-alpine`) runs `npm ci && npm run build`
   - Stage 2 (`nginx:alpine`) copies built output to `/usr/share/nginx/html`
   - Add custom `nginx.conf` with: gzip compression, SPA fallback (`try_files $uri $uri/ /index.html`), cache headers for static assets (1 year for hashed files, no-cache for `index.html`), security headers (`X-Frame-Options`, `X-Content-Type-Options`, `CSP`)
3. **Create `docker-compose.yml`:**
   - Service `songbird-portfolio` with build context, container name, `restart: unless-stopped`
   - Traefik labels as specified in the spec (host rule, websecure entrypoint, Let's Encrypt cert resolver)
   - Volume mount: `./content:/app/content` for live markdown file additions (if using SSR adapter; for static, document rebuild requirement)
4. **Create `.dockerignore`:** Exclude `node_modules`, `.svelte-kit`, `.git`, `*.md` (except content dir)
5. **Performance optimization pass:**
   - Audit Three.js scene: ensure `dispose()` is called on geometries/materials/textures in Svelte `onDestroy`
   - Add `requestAnimationFrame` throttling: skip frames if tab is hidden (`document.hidden`)
   - Lazy-load the Three.js background scene — defer `<BackgroundScene />` render until after the braindance intro completes (avoid GPU contention during intro)
   - Add `loading="lazy"` to all project thumbnail images
   - Audit bundle size with `npx vite-bundle-visualizer` — ensure Three.js is code-split from the main bundle
   - Target: Lighthouse performance score ≥80 on mobile
6. **Cross-browser polish:**
   - Test and fix `backdrop-filter` fallback for Firefox (add solid semi-transparent background)
   - Ensure WebGL context loss recovery (listen for `webglcontextlost`/`webglcontextrestored` events on the canvas)
   - Test Safari: fix any `-webkit-` prefix issues for scrollbar styling and `clip-path` animations
   - Verify mobile touch interactions: card tilt disabled on touch (no hover), particles respond to touch position
7. **Accessibility pass:**
   - Add `aria-label` to the braindance skip button
   - Ensure all interactive elements are keyboard-focusable with visible focus rings (styled as neon outlines)
   - Add `role="status"` and `aria-live="polite"` to the loading bar component
   - Contact form has proper `<label>` elements (visually hidden if needed) associated with inputs
   - Ensure color contrast meets WCAG AA for body text (`#02D7F2` on `#0A0A0F` = 8.5:1 — passes)
8. **Final integration verification:**
   - Full user journey test: braindance → hero → scroll to projects → click project → read writeup → back → navigate to contact → submit form
   - Verify all transitions fire correctly between routes
   - Verify particle color-shifting on section scroll
   - Verify 3D scene persists and performs across all routes
   - Test Docker build: `docker compose up --build` — verify site loads at `localhost`

### Verification

- `docker compose up --build` succeeds, site accessible at configured port
- Lighthouse audit: Performance ≥80, Accessibility ≥90, Best Practices ≥90
- Full user journey completes without errors on Chrome, Firefox, Safari, and mobile Chrome
- Bundle size for initial load < 300KB gzipped (excluding Three.js lazy chunk)
- No console errors or warnings in production build
- WebGL context recovery works if GPU resources are constrained
- All accessibility checks pass

---

## Decisions

- **Threlte over raw Three.js:** Svelte-native bindings reduce boilerplate, align with SvelteKit ecosystem
- **mdsvex over remark/rehype:** Simpler integration, supports Svelte components inside markdown
- **Static adapter as default:** Simpler deployment, better caching; SSR adapter noted as alternative if dynamic content mounting is needed
- **Session-based intro gating:** `sessionStorage` over `localStorage` so returning visitors within a session skip it, but new sessions replay the experience
- **Simulated form submission:** Real backend deferred beyond v1.0.0 — keeps scope contained to frontend
