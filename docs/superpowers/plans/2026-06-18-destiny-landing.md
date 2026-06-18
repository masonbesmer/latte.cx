# Destiny Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen Destiny D1-themed "under construction" landing page at `/destiny` with a canvas-drawn star chart background.

**Architecture:** Three files — a canvas component that draws the star chart, a landing component that layers content over it, and a flat route file that wires it into TanStack Router. No layout route needed (no nav, no footer, no subroutes).

**Tech Stack:** React 18, TanStack Router (file-based), TypeScript, Canvas 2D API, inline styles (pattern used across this codebase)

## Global Constraints

- Inline styles only — no Tailwind classes, no CSS modules (matches codebase pattern)
- Fonts already loaded: `'Orbitron'` (bold headings) and `'Share Tech Mono'` (mono text) — do NOT add new font imports
- No external dependencies — Canvas 2D, React hooks only
- TypeScript strict — no `any`, no `@ts-ignore`
- Route file must be flat (`src/routes/destiny.tsx`) to produce `/destiny` without trailing slash — matches how `/fallout` is structured
- No tests directory exists for UI components in this project — verification is via `tsc --noEmit` + visual browser check

---

### Task 1: StarChart canvas component

**Files:**
- Create: `src/components/destiny/StarChart.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `export function StarChart(): JSX.Element` — `<canvas>` fixed-positioned, fills viewport, `aria-hidden="true"`

- [ ] **Step 1: Create the file with full implementation**

```tsx
import { useEffect, useRef } from "react";

function mulberry32(seed: number) {
  let s = seed;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function StarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      if (!canvas || !ctx) return;
      const w = (canvas.width = window.innerWidth);
      const h = (canvas.height = window.innerHeight);

      ctx.clearRect(0, 0, w, h);

      // Base background gradient
      const bg = ctx.createRadialGradient(
        w * 0.35, h * 0.5, 0,
        w * 0.5,  h * 0.5, w * 0.75,
      );
      bg.addColorStop(0, "#0d1525");
      bg.addColorStop(1, "#06090f");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Focal point — 35% from left, vertically centered
      const fx = w * 0.35;
      const fy = h * 0.5;

      // Central radial glow
      const glow = ctx.createRadialGradient(fx, fy, 0, fx, fy, w * 0.45);
      glow.addColorStop(0, "rgba(120,160,220,0.12)");
      glow.addColorStop(0.5, "rgba(80,120,180,0.05)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Radial grid lines from focal point
      ctx.strokeStyle = "rgba(180,210,255,0.07)";
      ctx.lineWidth = 0.5;
      const numLines = 28;
      const diagonal = Math.hypot(w, h);
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(
          fx + Math.cos(angle) * diagonal,
          fy + Math.sin(angle) * diagonal,
        );
        ctx.stroke();
      }

      // Concentric arcs
      ctx.strokeStyle = "rgba(180,210,255,0.06)";
      ctx.lineWidth = 0.5;
      const arcRadii = [
        w * 0.1,
        w * 0.2,
        w * 0.33,
        w * 0.48,
        w * 0.65,
      ];
      for (const r of arcRadii) {
        ctx.beginPath();
        ctx.arc(fx, fy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Stars — deterministic via mulberry32 so no flicker on resize
      const rng = mulberry32(42);
      for (let i = 0; i < 900; i++) {
        const x = rng() * w;
        const y = rng() * h;
        const dist = Math.hypot(x - fx, y - fy) / (w * 0.5);
        const baseOpacity = rng() * 0.8 + 0.1;
        const opacity = Math.min(baseOpacity * (dist < 0.4 ? 1.4 : 0.65), 0.9);
        const radius = Math.min(rng() * 1.5 + 0.3, 1.8);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(2)})`;
        ctx.fill();
      }
    }

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors for `src/components/destiny/StarChart.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/destiny/StarChart.tsx
git commit -m "feat: add Destiny star chart canvas component"
```

---

### Task 2: DestinyLanding content component

**Files:**
- Create: `src/components/destiny/DestinyLanding.tsx`

**Interfaces:**
- Consumes: `StarChart` from `./StarChart`
- Produces: `export function DestinyLanding(): JSX.Element` — full-screen layout with canvas bg + centered content block

- [ ] **Step 1: Create the file**

```tsx
import { StarChart } from "./StarChart";

export function DestinyLanding() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#06090f",
        overflow: "hidden",
      }}
    >
      <StarChart />

      {/* Content overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "relative",
            padding: "3rem 4rem",
            textAlign: "center",
            maxWidth: 560,
          }}
        >
          {/* Corner brackets */}
          {(
            [
              { top: 0, left: 0, borderTop: "1px solid rgba(255,255,255,0.35)", borderLeft: "1px solid rgba(255,255,255,0.35)" },
              { top: 0, right: 0, borderTop: "1px solid rgba(255,255,255,0.35)", borderRight: "1px solid rgba(255,255,255,0.35)" },
              { bottom: 0, left: 0, borderBottom: "1px solid rgba(255,255,255,0.35)", borderLeft: "1px solid rgba(255,255,255,0.35)" },
              { bottom: 0, right: 0, borderBottom: "1px solid rgba(255,255,255,0.35)", borderRight: "1px solid rgba(255,255,255,0.35)" },
            ] as React.CSSProperties[]
          ).map((style, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                ...style,
              }}
            />
          ))}

          {/* Ghost icon */}
          <svg
            aria-hidden="true"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: 32,
              height: 32,
              margin: "0 auto 1.5rem",
              display: "block",
              animation: "ghost-pulse 3s ease-in-out infinite",
            }}
          >
            <polygon
              points="16,2 28,10 28,22 16,30 4,22 4,10"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="1"
            />
            <polygon
              points="16,7 23,12 23,20 16,25 9,20 9,12"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.5"
            />
            <circle cx="16" cy="16" r="2.5" fill="rgba(120,180,255,0.9)" />
          </svg>

          {/* Site label */}
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 1rem",
              textTransform: "uppercase",
            }}
          >
            LATTE.CX
          </p>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 5vw, 4rem)",
              color: "#ffffff",
              margin: "0 0 1.5rem",
              letterSpacing: "0.06em",
              lineHeight: 1.2,
              textShadow:
                "0 0 20px rgba(120,180,255,0.6), 0 0 50px rgba(120,180,255,0.3)",
            }}
          >
            THIS SECTOR IS OFFLINE
          </h1>

          {/* Separator */}
          <div
            aria-hidden="true"
            style={{
              width: 120,
              height: 1,
              background: "rgba(255,255,255,0.2)",
              margin: "0 auto 1.5rem",
            }}
          />

          {/* Sub-text */}
          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            Guardian access restricted. Check back soon.
          </p>

          <style>{`
            @keyframes ghost-pulse {
              0%, 100% { opacity: 0.7; transform: translateY(0px); }
              50%       { opacity: 1;   transform: translateY(-4px); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add CSSProperties type import at top of file**

Add this as the first line:

```tsx
import type { CSSProperties } from "react";
import { StarChart } from "./StarChart";
```

Also update the array cast from `React.CSSProperties[]` to `CSSProperties[]`.

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/destiny/DestinyLanding.tsx
git commit -m "feat: add Destiny landing content component"
```

---

### Task 3: Route wiring

**Files:**
- Create: `src/routes/destiny.tsx`

**Interfaces:**
- Consumes: `DestinyLanding` from `../components/destiny/DestinyLanding`
- Produces: TanStack Router file route at `/destiny` — auto-registered by the router's file-based codegen

- [ ] **Step 1: Create route file**

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { DestinyLanding } from "../components/destiny/DestinyLanding";

export const Route = createFileRoute("/destiny")({
  component: DestinyLanding,
});
```

- [ ] **Step 2: Run the dev server so TanStack Router regenerates routeTree.gen.ts**

```bash
npm run dev
```

Expected: `src/routeTree.gen.ts` now includes `/destiny` in the route tree. Browser navigating to `http://localhost:5173/destiny` shows the page.

- [ ] **Step 3: Visual verification checklist**

- Deep navy background fills viewport with no white flash
- Radial grid lines fan out from a left-of-center focal point
- Stars visible at varying brightness, denser near center
- Central pale blue glow visible
- Ghost SVG icon gently floats up/down (3s loop)
- `LATTE.CX` label visible in mono font
- `THIS SECTOR IS OFFLINE` heading glows blue-white
- Thin separator line centered below heading
- Sub-text visible below separator
- Corner brackets visible at all 4 corners of content block
- Page is non-scrollable and fills exactly one viewport height
- Resize window — canvas redraws correctly, no distortion

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/routes/destiny.tsx src/routeTree.gen.ts
git commit -m "feat: add /destiny landing page route"
```
