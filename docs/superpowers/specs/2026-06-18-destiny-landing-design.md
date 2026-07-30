# Destiny Landing Page — Design Spec

**Date:** 2026-06-18  
**Route:** `/destiny`  
**Type:** Under-construction landing page

## Summary

Single full-screen page with a Destiny D1 aesthetic. No scroll, no sections — just a centered content block over a canvas-drawn star chart background.

## Files

| File | Purpose |
|------|---------|
| `src/routes/destiny/index.tsx` | TanStack route, renders `<DestinyLanding />` |
| `src/components/destiny/DestinyLanding.tsx` | Full-screen layout + content overlay |
| `src/components/destiny/StarChart.tsx` | Canvas component — draws grid + stars |

## Background (StarChart canvas)

- Deep navy base: `#06090f` → `#0d1525` via radial gradient
- Focal point: ~35% from left, 50% from top (off-center, like the source image)
- ~28 radial grid lines fanning from focal point
- 5 concentric arc segments (partial, like a star chart graticule)
- 800+ stars: radius 0.3–1.8px, opacity 0.1–0.9, random scatter with higher density near center
- Central radial glow: `createRadialGradient`, pale blue-white `rgba(120,160,220,0.12)` → transparent
- Canvas fills viewport, resizes on window resize

## Content Overlay

Centered absolutely over canvas. Elements top-to-bottom:

1. **Ghost icon** — simple geometric SVG (diamond/faceted shape), white, ~32px, subtle pulse animation
2. **Label** — `LATTE.CX` — 0.7rem monospace, letter-spacing 0.2em, `rgba(255,255,255,0.5)`
3. **Heading** — `THIS SECTOR IS OFFLINE` — Orbitron bold, `clamp(1.8rem, 5vw, 4rem)`, white, text-shadow glow `rgba(120,180,255,0.6)`
4. **Separator** — thin horizontal rule, 120px wide, `rgba(255,255,255,0.2)`
5. **Sub-text** — `Guardian access restricted. Check back soon.` — 0.85rem, `rgba(255,255,255,0.45)`, letter-spacing 0.05em
6. **Corner brackets** — absolute-positioned CSS borders at all 4 corners of a ~400px wide content frame

## Typography

- Heading: `'Orbitron'` (already used in tron/cyberpunk themes — already loaded)
- Label/sub-text: `'Share Tech Mono'` (already loaded)

## Colors

| Token | Value |
|-------|-------|
| Background dark | `#06090f` |
| Background mid | `#0d1525` |
| Grid lines | `rgba(180,210,255,0.07)` |
| Stars | `rgba(255,255,255, 0.1–0.9)` |
| Glow | `rgba(120,180,255,0.6)` |
| Corner brackets | `rgba(255,255,255,0.35)` |
| Text primary | `#ffffff` |
| Text secondary | `rgba(255,255,255,0.45)` |

## No Route Layout Needed

No `route.tsx` — single index route is sufficient. No nav, no footer.
