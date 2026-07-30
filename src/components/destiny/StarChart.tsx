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
