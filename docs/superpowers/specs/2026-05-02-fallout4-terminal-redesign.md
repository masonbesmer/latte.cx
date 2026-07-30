# Fallout 4 Terminal Redesign — Design Spec

**Date:** 2026-05-02  
**Reference:** `fallout4_terminal_design_document.md`

---

## Problem Statement

The main landing page terminal at `latte.cx` currently uses `FixedsysExcelsior` font, neon `#39ff14` green, and `#0a0a0a` background. It lacks barrel/CRT distortion, uses imprecise phosphor green, and has minor deviations from the Fallout 4 terminal spec (cursor blink speed, scanline density, prompt format). This spec covers all changes required to bring the terminal into full alignment with the Fallout 4 design reference document.

---

## Approach

CSS-only with one inline SVG filter — no additional JavaScript libraries or rendering layers. All screen effects remain pure CSS/SVG overlays on top of the existing React component tree.

---

## Typography

- **Font:** `Sharetech Mono` loaded via Google Fonts CDN (`@import`)
- Replaces `FixedsysExcelsior` entirely in all terminal CSS
- `text-rendering: optimizeSpeed` to suppress anti-aliasing; crisp hard edges
- All terminal text uses this single typeface — no mixing

---

## Color

| Token | Old Value | New Value | Notes |
|---|---|---|---|
| `--term-bg` | `#0a0a0a` | `#000000` | Pure black per spec |
| `--term-fg` | `#39ff14` | `#3EEF82` | Mid-bright phosphor green |
| `--term-glow` | `#39ff14` | `#3EEF82` | Matches fg |

- All elements remain monochromatic — single color against black
- System/header lines: full `opacity: 1`, stronger glow (brighter = higher display intensity)
- Body/output lines: `opacity: 0.88`, softer glow

---

## Screen Effects

### Scanlines
- `repeating-linear-gradient`: 1px dark band (`rgba(0,0,0,0.20)`) every 4px
- Full-display overlay, `z-index: 10`, `pointer-events: none`

### Phosphor Bloom / Glow
Three-layer `text-shadow` on all text elements:
1. Tight core: `0 0 4px var(--term-glow)` — simulates phosphor dot hotspot
2. Mid spread: `0 0 10px var(--term-glow)` — bloom halo
3. Faint outer: `0 0 20px var(--term-glow)` — phosphor over-drive bleed

### Flicker
`@keyframes flicker` on `.term-screen-wrap` — ~2–5% brightness oscillation at 0.5–1 Hz. Keyframes target 98–100% opacity at ~2s intervals. Nearly imperceptible.

### Vignette
`radial-gradient` overlay from transparent center to `rgba(0,0,0,0.70)` at edges, covering ~25% of screen from each edge. `z-index: 11`, `pointer-events: none`.

### Barrel / CRT Curvature Distortion
Inline `<svg aria-hidden style="display:none">` placed inside `.term-screen-wrap` in `TerminalPage.tsx`. Defines filter `#crt-barrel` using:
- A `<radialGradient id="barrel-grad">` + `<rect fill="url(#barrel-grad)">` rendered inside the filter as the displacement source via `feImage`
- `<feDisplacementMap>` with `scale="18"` (subtle), `xChannelSelector="R"`, `yChannelSelector="G"`
- All primitives defined within the same `<defs>` block — no external file references

Applied to `.term-screen-wrap` via `filter: url(#crt-barrel)`. Produces convex outward bulge at edges, imperceptible at center.

### Cursor
`@keyframes blink` — `0%–49%: visibility: visible`, `50%–100%: visibility: hidden`, `animation-duration: 1s` (exactly 1 Hz, 0.5s on / 0.5s off per spec).

---

## UI Structure

No React component tree changes except:

1. **`TerminalPage.tsx`** — add inline SVG `<defs>` block with `#crt-barrel` filter inside `.term-screen-wrap`
2. **`TerminalInput.tsx`** — change `C:\> ` prompt (command mode) to `> ` to match Fallout 4 `>` prefix convention
3. **`terminal.css`** — all CSS/token changes above

Boot sequence content unchanged — already faithful (`ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL`, `>` prefixes, ALL CAPS headers).

---

## Files Changed

| File | Change |
|---|---|
| `src/styles/terminal.css` | Font, color tokens, scanlines, glow, flicker, vignette, cursor timing |
| `src/components/terminal/TerminalPage.tsx` | Add inline SVG barrel distortion filter |
| `src/components/terminal/TerminalInput.tsx` | Fix `C:\>` → `>` prompt in command mode |

---

## Recreation Checklist Coverage

- [x] Font is Sharetech Mono (monospaced, no anti-aliasing)
- [x] Background is pure black (`#000000`)
- [x] All text renders in a single phosphor green color
- [x] Scanline overlay applied across full display
- [x] Phosphor bloom/glow on all text pixels
- [x] Subtle flicker effect on overall brightness
- [x] Vignette darkening at screen edges
- [x] Barrel distortion applied to display surface (SVG feDisplacementMap)
- [x] Block cursor (`█`) blinking at ~1 Hz
- [x] UI is entirely text-based — no icons
- [x] Boot header includes `ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL`
- [x] Menu items preceded by `>` prompt
- [x] Headers in ALL CAPS, body text in mixed case
