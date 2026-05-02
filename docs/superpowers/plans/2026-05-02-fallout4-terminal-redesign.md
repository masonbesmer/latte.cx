# Fallout 4 Terminal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the main landing page terminal to faithfully match the Fallout 4 in-game terminal aesthetic per the design spec.

**Architecture:** CSS-only redesign with one inline SVG barrel distortion filter. No new JS libraries. The SVG displacement map is generated once via Canvas API in a `useMemo` hook and passed to an `<feImage>` element. All other effects (scanlines, vignette, glow, flicker) are pure CSS.

**Tech Stack:** React, CSS custom properties, SVG filter primitives (feDisplacementMap), Canvas API (one-time map generation), Google Fonts CDN (Share Tech Mono)

---

## File Map

| File | Change |
|---|---|
| `src/styles/terminal.css` | Font, color tokens, scanlines, glow, flicker, vignette, cursor timing |
| `src/components/terminal/TerminalPage.tsx` | Add `useMemo` barrel map + inline SVG filter |
| `src/components/terminal/TerminalInput.tsx` | Change `C:\>` prompt to `>` |
| `src/lib/terminal/useTerminal.ts` | Change `C:\>` in echoed prompt lines to `>` |

---

## Task 1: Typography and Color Tokens

**Files:**
- Modify: `src/styles/terminal.css`

- [ ] **Step 1: Replace the @font-face block and :root tokens**

Replace the top of `src/styles/terminal.css` (lines 1–17) with:

```css
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

/* ── Tokens ──────────────────────────────────────────────────────── */
:root {
  --term-fg: #3EEF82;
  --term-glow: #3EEF82;
  --term-bg: #000000;
  --term-font: 'Share Tech Mono', monospace;
  --term-size: 16px;
  --term-lh: 1.5;
}
```

- [ ] **Step 2: Add anti-aliasing suppression to `.term-root`**

After `.term-root {` open brace, add these two properties (inside the existing rule):

```css
  text-rendering: optimizeSpeed;
  -webkit-font-smoothing: none;
```

Final `.term-root` should look like:

```css
.term-root {
  width: 100vw;
  height: 100vh;
  background: var(--term-bg);
  display: flex;
  overflow: hidden;
  font-family: var(--term-font);
  font-size: var(--term-size);
  color: var(--term-fg);
  text-rendering: optimizeSpeed;
  -webkit-font-smoothing: none;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/terminal.css
git commit -m "style(terminal): switch to Share Tech Mono, pure black bg, phosphor green"
```

---

## Task 2: Scanlines and Vignette

**Files:**
- Modify: `src/styles/terminal.css`

- [ ] **Step 1: Update scanlines to 1px band every 4px**

Replace the `.term-scanlines` background gradient:

```css
/* Scanlines overlay */
.term-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.20) 3px,
    rgba(0, 0, 0, 0.20) 4px
  );
}
```

- [ ] **Step 2: Update vignette to cover ~25% from edges**

Replace the `.term-vignette` background gradient:

```css
/* Vignette overlay */
.term-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 11;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(0, 0, 0, 0.70) 100%
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/terminal.css
git commit -m "style(terminal): tighten scanlines and deepen vignette per spec"
```

---

## Task 3: Phosphor Glow, Flicker, and Cursor

**Files:**
- Modify: `src/styles/terminal.css`

- [ ] **Step 1: Update the flicker animation to ~0.5 Hz with 2–5% variation**

Replace `@keyframes flicker` and the `animation` property on `.term-screen-wrap`:

```css
/* ── Animations ──────────────────────────────────────────────────── */
@keyframes flicker {
  0%,
  18%,
  22%,
  57%,
  62%,
  100% {
    opacity: 1;
  }
  20% {
    opacity: 0.97;
  }
  60% {
    opacity: 0.98;
  }
}
```

And on `.term-screen-wrap`, change `animation: flicker 5s ease-in-out infinite;` to:

```css
  animation: flicker 2s linear infinite;
```

- [ ] **Step 2: Update the cursor blink to exactly 1 Hz (0.5s on / 0.5s off)**

The `@keyframes blink` body stays the same. Only change the `animation` duration on `.term-cursor` from `0.75s` to `1s`:

```css
.term-cursor {
  font-family: var(--term-font);
  font-size: var(--term-size);
  color: var(--term-fg);
  text-shadow:
    0 0 4px var(--term-glow),
    0 0 10px var(--term-glow),
    0 0 20px var(--term-glow);
  animation: blink 1s step-end infinite;
  flex-shrink: 0;
  line-height: var(--term-lh);
  user-select: none;
}
```

- [ ] **Step 3: Update phosphor glow to 3-layer text-shadow on all text elements**

Replace every `text-shadow` rule that currently has 2 layers (`0 0 6px` + `0 0 14px`) with the 3-layer spec version. There are four places:

**.term-glow:**
```css
.term-glow {
  text-shadow:
    0 0 4px var(--term-glow),
    0 0 10px var(--term-glow),
    0 0 20px var(--term-glow);
}
```

**.term-line:**
```css
.term-line {
  font-family: var(--term-font);
  font-size: var(--term-size);
  line-height: var(--term-lh);
  color: var(--term-fg);
  text-shadow:
    0 0 4px var(--term-glow),
    0 0 10px var(--term-glow),
    0 0 20px var(--term-glow);
  white-space: pre-wrap;
  word-break: break-all;
  min-height: calc(var(--term-size) * var(--term-lh));
}
```

**.term-prompt-label:**
```css
.term-prompt-label {
  font-family: var(--term-font);
  font-size: var(--term-size);
  line-height: var(--term-lh);
  color: var(--term-fg);
  text-shadow:
    0 0 4px var(--term-glow),
    0 0 10px var(--term-glow),
    0 0 20px var(--term-glow);
  white-space: pre;
  user-select: none;
  flex-shrink: 0;
}
```

**.term-input-mirror:**
```css
.term-input-mirror {
  font-family: var(--term-font);
  font-size: var(--term-size);
  line-height: var(--term-lh);
  color: var(--term-fg);
  text-shadow:
    0 0 4px var(--term-glow),
    0 0 10px var(--term-glow),
    0 0 20px var(--term-glow);
  white-space: pre;
  pointer-events: none;
  display: flex;
  align-items: center;
}
```

- [ ] **Step 4: Update line opacity values**

Replace the `.term-line--*` opacity rules:

```css
.term-line--system {
  opacity: 1;
}
.term-line--output {
  opacity: 0.88;
}
.term-line--prompt {
  opacity: 0.8;
}
.term-line--error {
  opacity: 0.6;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/styles/terminal.css
git commit -m "style(terminal): 3-layer phosphor glow, 1Hz cursor, tightened flicker"
```

---

## Task 4: Barrel Distortion (SVG + Canvas)

**Files:**
- Modify: `src/components/terminal/TerminalPage.tsx`
- Modify: `src/styles/terminal.css`

- [ ] **Step 1: Add `useMemo` barrel displacement map + SVG filter to TerminalPage.tsx**

Replace the entire `TerminalPage.tsx` with:

```tsx
import { useCallback, useMemo, useState } from "react";
import { BootSequence } from "./BootSequence";
import { TerminalScreen } from "./TerminalScreen";
import { useTerminal } from "../../lib/terminal/useTerminal";
import "../../styles/terminal.css";

function buildBarrelMapUrl(): string {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / (size - 1)) * 2 - 1;
      const ny = (y / (size - 1)) * 2 - 1;
      const dist = Math.sqrt(nx * nx + ny * ny);
      const r = Math.round(128 + nx * dist * 60);
      const g = Math.round(128 + ny * dist * 60);
      const idx = (y * size + x) * 4;
      img.data[idx] = Math.max(0, Math.min(255, r));
      img.data[idx + 1] = Math.max(0, Math.min(255, g));
      img.data[idx + 2] = 128;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

export function TerminalPage() {
  const [booted, setBooted] = useState(false);
  const handleBootComplete = useCallback(() => setBooted(true), []);
  const barrelMapUrl = useMemo(() => buildBarrelMapUrl(), []);
  const {
    outputLines,
    inputBuffer,
    mode,
    setInputBuffer,
    submit,
    handleKeyDown,
    handleTab,
  } = useTerminal();

  return (
    <div className="term-root">
      <svg aria-hidden style={{ display: "none" }}>
        <defs>
          <filter
            id="crt-barrel"
            x="-3%"
            y="-3%"
            width="106%"
            height="106%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={barrelMapUrl}
              result="displace-map"
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="displace-map"
              scale={18}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="term-screen-wrap">
        <div className="term-scanlines" aria-hidden="true" />
        <div className="term-vignette" aria-hidden="true" />
        {booted ? (
          <TerminalScreen
            outputLines={outputLines}
            inputBuffer={inputBuffer}
            mode={mode}
            onInputChange={setInputBuffer}
            onSubmit={submit}
            onKeyDown={handleKeyDown}
            onTab={handleTab}
          />
        ) : (
          <BootSequence onComplete={handleBootComplete} />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add `filter: url(#crt-barrel)` to `.term-screen-wrap` in CSS**

Add `filter: url(#crt-barrel);` to the existing `.term-screen-wrap` rule (the `animation` value was already updated to `2s linear` in Task 3):

```css
.term-screen-wrap {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: flicker 2s linear infinite;
  will-change: opacity;
  filter: url(#crt-barrel);
}
```

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: no errors, no warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/terminal/TerminalPage.tsx src/styles/terminal.css
git commit -m "feat(terminal): add SVG barrel/CRT distortion via feDisplacementMap"
```

---

## Task 5: Fix Prompt Format

**Files:**
- Modify: `src/components/terminal/TerminalInput.tsx`
- Modify: `src/lib/terminal/useTerminal.ts`

- [ ] **Step 1: Update the visible prompt label in TerminalInput.tsx**

Replace line 36 in `src/components/terminal/TerminalInput.tsx`:

```typescript
// Before:
const promptLabel = mode === "editing" ? "> " : "C:\\> ";

// After:
const promptLabel = "> ";
```

The `mode` parameter is no longer used in this expression, but keep it in the interface/signature — it is still used for the `useEffect` focus call on line 25.

- [ ] **Step 2: Update echoed prompt in submit handler in useTerminal.ts**

Replace line 54–56 in `src/lib/terminal/useTerminal.ts`:

```typescript
// Before:
const promptLine = mkLine(
  prev.mode === "editing" ? `> ${input}` : `C:\\> ${input}`,
  "prompt",
);

// After:
const promptLine = mkLine(`> ${input}`, "prompt");
```

- [ ] **Step 3: Update echoed prompt in tab-completion handler in useTerminal.ts**

Replace line 254 in `src/lib/terminal/useTerminal.ts`:

```typescript
// Before:
const promptLine = mkLine(`C:\\> ${prev.inputBuffer}`, "prompt");

// After:
const promptLine = mkLine(`> ${prev.inputBuffer}`, "prompt");
```

- [ ] **Step 4: Lint**

```bash
npm run lint
```

Expected: no errors, no warnings.

- [ ] **Step 5: Commit**

```bash
git add src/components/terminal/TerminalInput.tsx src/lib/terminal/useTerminal.ts
git commit -m "style(terminal): unify prompt prefix to > per Fallout 4 spec"
```

---

## Task 6: Final Verification

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: exit 0, zero warnings.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: successful build with no type errors.

- [ ] **Step 3: Visual verification checklist**

Start dev server: `npm run dev`

Open the app and verify each item from the spec recreation checklist:

- [ ] Font is Share Tech Mono (visible in browser dev tools → Computed → font-family)
- [ ] Background is pure black `#000000`
- [ ] All text is single phosphor green `#3EEF82`
- [ ] Horizontal scanline bands visible across full display
- [ ] Text has a visible soft green glow halo
- [ ] Very subtle brightness pulse/flicker on the screen
- [ ] Screen corners/edges noticeably darker than center (vignette)
- [ ] Screen edges appear slightly curved/distorted (barrel effect)
- [ ] Block cursor `█` blinks at ~1 second interval
- [ ] Boot sequence shows `ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL`
- [ ] Input prompt shows `> ` (not `C:\>`)
- [ ] Typed commands echo back as `> <command>` in output history
- [ ] Tab completion echo also shows `> <input>` prefix
