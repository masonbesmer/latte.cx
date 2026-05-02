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
    cwd,
    mode,
    setInputBuffer,
    submit,
    handleKeyDown,
    handleTab,
  } = useTerminal();

  return (
    <div className="term-root">
      <svg
        aria-hidden
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
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
            cwd={cwd}
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
