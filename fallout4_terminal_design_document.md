# Fallout 4 Terminal — Design Recreation Document

## Overview

This document captures the authentic visual and UI design of the Fallout 4 in-game terminal interface, intended as a reference for accurate recreation. All details are sourced from the original Bethesda game assets, the official Fallout Wiki, and verified in-game observation. The terminal UI is built around a retro-futuristic "Atomic Age" aesthetic — specifically emulating 1950s–1970s green-phosphor CRT terminals as imagined through a Cold War science-fiction lens.

---

## Typography

### Primary Terminal Font

The terminal text in Fallout 4 uses **Sharetech Mono**[cite:2], a clean, modern monospaced sans-serif typeface. Key characteristics:

- Strictly fixed-width (every character occupies identical horizontal space)
- Geometric, open letterforms — less pixel-rough than older bitmap fonts
- More legible and refined than the Fixedsys font used in Fallout 3 and New Vegas[cite:2]
- No anti-aliasing — edges should appear crisp and hard
- All terminal UI text is rendered in this single typeface with no mixing

### General UI / HUD Font

The broader in-game HUD and menus use **Roboto** (condensed variant)[cite:2], though this is not required for a terminal-only recreation.

---

## Color

### Display Color

The terminal is **strictly monochromatic** — all rendered text, symbols, and UI elements share one single color against a pure black background[cite:15].

| Element | Value |
|---|---|
| Background | `#000000` (pure black) |
| Text / UI color | Green (phosphor), approximately `#00C800`–`#4AEF98` range |
| Cursor | Same green as text |
| Scanline overlay | Semi-transparent black bands |

> **Important:** The terminal color in-game is directly bound to the player's Pip-Boy color slider settings[cite:5]. The canonical default is green. Amber and white are player-selectable variants. A faithful default recreation should use mid-bright phosphor green.

### Color Behavior

- No color gradients — all elements are flat, single-color
- Text brightness can be slightly varied between headers (brighter) and body text (slightly dimmer) to suggest display intensity
- Blood/damage state: a dark red border box appears around the text area when the terminal has blood on it[cite:15]

---

## Screen Effects

These effects are critical to authenticity and should be layered as post-processing passes:

### Scanlines
Horizontal dark bands running across the full display at regular intervals, mimicking CRT electron gun raster scan. Should be subtle — not opaque. Roughly 1–2px dark bands every 3–4px of screen height.

### Phosphor Bloom / Glow
Text characters emit a soft glow halo in the same green color. Bright characters bleed faintly into surrounding dark areas. This simulates over-driven phosphor emission on a real CRT. Implement as a low-radius, low-intensity bloom filter centered on all lit pixels.

### Screen Flicker
A very slow, subtle, periodic brightness oscillation across the entire display. Simulates CRT refresh instability. Should be nearly imperceptible — a ~2–5% brightness variation at roughly 0.5–1 Hz.

### Vignetting
The corners and edges of the screen are darkened relative to the center. Replicates natural light falloff from a convex CRT tube face. A simple radial gradient overlay (black, low opacity, covering ~25% of screen from edges) achieves this.

### Barrel / CRT Curvature Distortion
The display surface should have a subtle convex bulge distortion (barrel distortion), simulating the physical curvature of a real CRT glass face. This is a UV-space warping effect, not a 2D overlay.

---

## UI Layout & Structure

The terminal interface is **entirely text-based** — no icons, no graphical elements, no images[cite:15].

### Boot Header

When a terminal activates, it displays a startup header:

```
ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL
ENTER PASSWORD NOW

> █
```

The MF Boot Agent v2.3.0 and RBIOS version strings appear during boot[cite:15]. These are displayed in the same monospaced font, left-aligned, with blank lines separating logical blocks.

### Standard Terminal Menu

After login, content is presented as a simple text menu:

```
ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL
[LOCATION / OWNER LABEL]

> [MENU ITEM 1]
> [MENU ITEM 2]
> [MENU ITEM 3]
```

- All menu items are preceded by `>`
- Headers use all-caps
- Body/content text uses mixed case
- No indentation beyond the `>` prompt character
- Blank lines separate logical sections

### Hacking Minigame Layout

The password-cracking interface splits the screen into two symmetrical columns:

- Left column: hex-address indices (e.g., `0xF7A0`) followed by a string of random punctuation and symbol characters (`!@#$%^&*./\`) interspersed with candidate words
- Right column: mirrors the same structure
- Below both columns: an attempt counter and a log of previous guesses with results (e.g., `ENTRY DENIED. LIKENESS=2/7`)
- The candidate password words are the same font and color as all surrounding garbage characters — no visual differentiation except by shape

### Cursor

- A solid **block cursor** (`█`), same color as all text
- Blinks at approximately **1 Hz** (0.5s on, 0.5s off)
- Positioned at the current input line, immediately after the `>` prompt

---

## Physical Hardware Reference (RIT-V300)

The canonical terminal model seen most frequently in Fallout 4 is the **RIT-V300**[cite:15]:

| Feature | Description |
|---|---|
| Form factor | Single all-in-one unit (display + compute + keyboard in one chassis) |
| Display | Large convex CRT, green phosphor |
| Enclosure material | Heavy-gauge metal, utilitarian finish |
| Color | Olive green / battleship gray |
| Keyboard | Integrated alphanumeric keyboard with chunky keycaps, four function keys |
| Bezel controls | Two physical rotary knobs on monitor bezel (display intensity) |
| Ventilation | Visible horizontal ventilation slots on enclosure body |
| Aesthetic | Cold War–era industrial; no decorative curves or consumer styling |

---

## Institute Terminal Variant

The Institute (synth-faction) uses a distinct terminal sub-variant with a noticeably different aesthetic[cite:15]:

- **Sleeker, more modern enclosure** — departs from the industrial RIT-V300 design
- **Higher apparent display resolution**
- **Optional drop-down magnification peripheral** attached to the monitor
- Available in both **desktop and wall-mounted** configurations
- Still monochromatic, but the overall visual impression is cleaner and more futuristic — consistent with the Institute's advanced technology

---

## Recreation Checklist

Use this checklist to verify a faithful recreation:

- [ ] Font is Sharetech Mono (monospaced, no anti-aliasing)
- [ ] Background is pure black (`#000000`)
- [ ] All text renders in a single phosphor green color
- [ ] Scanline overlay applied across full display
- [ ] Phosphor bloom/glow on all text pixels
- [ ] Subtle flicker effect on overall brightness
- [ ] Vignette darkening at screen edges
- [ ] Barrel distortion applied to display surface
- [ ] Block cursor (`█`) blinking at ~1 Hz
- [ ] UI is entirely text-based — no icons
- [ ] Boot header includes `ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL`
- [ ] Menu items preceded by `>` prompt
- [ ] Headers in ALL CAPS, body text in mixed case

