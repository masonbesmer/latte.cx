import { useRef, useEffect } from "react";
import type { NetworkSample } from "../../lib/synthwave-data";

interface NetworkGraphProps {
  samples: NetworkSample[];
}

export function NetworkGraph({ samples }: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || samples.length < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Hi-DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const PAD = 4;

    ctx.clearRect(0, 0, W, H);

    const maxVal = Math.max(
      ...samples.map((s) => Math.max(s.upload, s.download)),
      1,
    );

    function drawLine(data: number[], color: string, glow: string) {
      if (!ctx) return;
      ctx.save();
      ctx.shadowColor = glow;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
        const y = H - PAD - (v / maxVal) * (H - PAD * 2);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Fill gradient under line
      ctx.shadowBlur = 0;
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, color + "33");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.lineTo(W - PAD, H - PAD);
      ctx.lineTo(PAD, H - PAD);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Grid lines
    ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = PAD + (i / 4) * (H - PAD * 2);
      ctx.beginPath();
      ctx.moveTo(PAD, y);
      ctx.lineTo(W - PAD, y);
      ctx.stroke();
    }

    drawLine(
      samples.map((s) => s.download),
      "#00F0FF",
      "#00F0FF",
    );
    drawLine(
      samples.map((s) => s.upload),
      "#FF1493",
      "#FF1493",
    );

    // Latest values
    const last = samples[samples.length - 1];
    ctx.font = '10px "VT323", monospace';
    ctx.fillStyle = "#00F0FF";
    ctx.textAlign = "right";
    ctx.fillText(`↓ ${last.download.toFixed(0)} Mbps`, W - PAD, 14);
    ctx.fillStyle = "#FF1493";
    ctx.fillText(`↑ ${last.upload.toFixed(0)} Mbps`, W - PAD, 26);
  }, [samples]);

  return (
    <div className="sw-panel">
      <div className="sw-panel-header">
        <span className="sw-panel-title">NETWORK THROUGHPUT</span>
        <span className="sw-panel-title" style={{ color: "#00F0FF" }}>
          WAN
        </span>
      </div>
      <div className="sw-netgraph-inner">
        <canvas
          ref={canvasRef}
          className="sw-netgraph-canvas"
          style={{ height: 90 }}
          aria-label="Network throughput graph"
        />
        <div className="sw-netgraph-legend">
          <span className="sw-netgraph-legend-item">
            <span
              className="sw-netgraph-legend-line"
              style={{ background: "#00F0FF", boxShadow: "0 0 4px #00F0FF" }}
            />
            <span
              style={{
                color: "#00F0FF",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
              }}
            >
              DOWNLOAD
            </span>
          </span>
          <span className="sw-netgraph-legend-item">
            <span
              className="sw-netgraph-legend-line"
              style={{ background: "#FF1493", boxShadow: "0 0 4px #FF1493" }}
            />
            <span
              style={{
                color: "#FF1493",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
              }}
            >
              UPLOAD
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
