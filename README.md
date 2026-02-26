# latte.cx

A cyberpunk-themed personal portfolio built with SvelteKit. Features a full 3D background scene (Three.js / Threlte), a cinematic intro sequence, particle effects, markdown-powered project write-ups, and a CLI-styled contact form.

Live at **[latte.cx](https://latte.cx)**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [SvelteKit](https://kit.svelte.dev/) + TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| 3D / WebGL | [Three.js](https://threejs.org/) via [Threlte](https://threlte.xyz/) (`@threlte/core`, `@threlte/extras`) |
| Post-processing | `three/examples` EffectComposer + UnrealBloomPass |
| Markdown | [mdsvex](https://mdsvex.pngwn.io/) |
| Fonts | Google Fonts — Rajdhani (headings), Share Tech Mono (body) |
| Audio | Web Audio API (synthesized, no external files) |
| Deployment | Docker (nginx:alpine) + Traefik reverse proxy |

---

## Local Development

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Setup

```sh
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

```sh
npm run build       # production build → ./build
npm run preview     # serve the production build locally
npm run check       # svelte-check TypeScript + type-check
npm run check:watch # watch mode type-checking
```

---

## Production Build

```sh
npm run build
```

The output is a static site in `./build`, served by nginx via `index.html` SPA fallback.

---

## Docker Deployment

The project ships with a multi-stage `Dockerfile` (Node 20 build → nginx:alpine serve) and a `docker-compose.yml` pre-configured for [Traefik](https://traefik.io/) with automatic TLS via Let's Encrypt.

```sh
# Build and start
docker compose up -d --build
```

Traefik must have a `traefik-public` external network and a `letsencrypt` cert resolver configured.

---

## Project Structure

```
src/
├── content/          # Markdown write-ups (mdsvex frontmatter)
├── lib/
│   ├── actions/      # Svelte actions (e.g. 3D card tilt)
│   ├── audio/        # Web Audio API synthesis module
│   ├── components/   # Svelte components
│   │   └── three/    # Threlte / Three.js scene components
│   ├── data/         # Project & content data models
│   ├── stores/       # Svelte stores (activeSection, muted)
│   └── styles/       # Global CSS, glitch animations, design tokens
└── routes/           # SvelteKit file-based routes
    ├── +layout.svelte
    ├── +page.svelte
    ├── contact/
    └── projects/[slug]/
```

---

## Design Tokens

| Name | Hex |
|---|---|
| Iconic Yellow | `#F2E900` |
| Cyan | `#02D7F2` |
| Neon Cyan | `#25E1ED` |
| Hot Magenta | `#ED1E79` |
| Electric Blue | `#007AFF` |
| Hot Red | `#FF1111` |
| Deep Black | `#0A0A0F` |
