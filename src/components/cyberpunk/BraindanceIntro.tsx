import { useState, useEffect, useRef, useCallback } from "react";
import * as audio from "../../lib/audio/braindance";

interface BraindanceIntroProps {
  onComplete: () => void;
  muted: boolean;
}

const READOUTS = [
  "// ESTABLISHING NEURAL HANDSHAKE...",
  "// DECRYPTING IDENTITY MATRIX...",
  "// LOADING SONGBIRD SUBSYSTEMS...",
  "// LINK ESTABLISHED",
];
const BAR_DURATION = 3000;
const STUTTERS = [0.35, 0.62, 0.78];
const TOTAL_BLOCKS = 10;

export function BraindanceIntro({ onComplete, muted }: BraindanceIntroProps) {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [skipVisible, setSkipVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [barPercent, setBarPercent] = useState(0);
  const [visibleReadouts, setVisibleReadouts] = useState<string[]>([]);
  const [flashWhite, setFlashWhite] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRafRef = useRef(0);
  const timersRef = useRef<
    (ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>)[]
  >([]);
  const barRafRef = useRef(0);
  const synthStingFiredRef = useRef(false);
  const barPercentRef = useRef(0);

  function after(ms: number, fn: () => void) {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }

  function clearTimers() {
    timersRef.current.forEach((id) => {
      clearTimeout(id as ReturnType<typeof setTimeout>);
      clearInterval(id as ReturnType<typeof setInterval>);
    });
    timersRef.current = [];
  }

  function drawNoise(intensity: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const img = ctx.createImageData(canvas.width, canvas.height);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255 * intensity;
      data[i] = v;
      data[i + 1] = v * 0.9;
      data[i + 2] = v * 1.1;
      data[i + 3] = 220;
    }
    ctx.putImageData(img, 0, 0);
  }

  function startNoiseLoop(intensity: number) {
    function loop() {
      drawNoise(intensity);
      noiseRafRef.current = requestAnimationFrame(loop);
    }
    loop();
  }

  function stopNoiseLoop() {
    cancelAnimationFrame(noiseRafRef.current);
  }

  function startBarAnimation(onDone: () => void) {
    const barStart = performance.now();
    const stutterApplied = [false, false, false];

    function tick(now: number) {
      const elapsed = now - barStart;
      const t = Math.min(elapsed / BAR_DURATION, 1);
      let pct = Math.round(t * 100);
      for (let i = 0; i < STUTTERS.length; i++) {
        if (!stutterApplied[i] && t >= STUTTERS[i]) {
          stutterApplied[i] = true;
          pct = Math.max(0, pct - (5 + Math.floor(Math.random() * 6)));
        }
      }
      barPercentRef.current = pct;
      setBarPercent(pct);
      if (t < 1) {
        barRafRef.current = requestAnimationFrame(tick);
      } else {
        setBarPercent(100);
        barPercentRef.current = 100;
        onDone();
      }
    }
    barRafRef.current = requestAnimationFrame(tick);
  }

  function triggerResolve() {
    setPhase(3);
    setFlashWhite(true);
    audio.playBassDrop();
    after(100, () => setFlashWhite(false));
    after(700, () => {
      setDone(true);
      sessionStorage.setItem("braindance-seen", "true");
      onComplete();
    });
  }

  function startSequence() {
    setPhase(1);
    startNoiseLoop(1);
    audio.playStaticFadeIn(2);
    after(2000, () => setSkipVisible(true));
    after(2000, () => {
      setPhase(2);
      stopNoiseLoop();
      audio.fadeOutStatic(0.8);
      READOUTS.forEach((line, i) => {
        after(i * 650, () => setVisibleReadouts((prev) => [...prev, line]));
      });
      const stingWatcher = setInterval(() => {
        if (!synthStingFiredRef.current && barPercentRef.current >= 60) {
          synthStingFiredRef.current = true;
          audio.playSynthSting();
          clearInterval(stingWatcher);
        }
      }, 50);
      timersRef.current.push(stingWatcher);
      startBarAnimation(() => triggerResolve());
    });
  }

  function skip() {
    clearTimers();
    cancelAnimationFrame(barRafRef.current);
    stopNoiseLoop();
    audio.stopAll(0.2);
    setPhase(3);
    setFlashWhite(true);
    audio.playBassDrop();
    after(100, () => setFlashWhite(false));
    after(700, () => {
      setDone(true);
      sessionStorage.setItem("braindance-seen", "true");
      onComplete();
    });
  }

  const handleStart = useCallback(() => {
    setStarted(true);
    audio
      .resume()
      .then(() => startSequence())
      .catch(() => startSequence());
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      sessionStorage.setItem("braindance-seen", "true");
      setDone(true);
      onComplete();
      return;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (
        !done &&
        !started &&
        !["Tab", "Escape", "Shift", "Control", "Alt", "Meta"].includes(e.key)
      ) {
        handleStart();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimers();
      cancelAnimationFrame(barRafRef.current);
      stopNoiseLoop();
    };
  }, [done, started, handleStart]);

  useEffect(() => {
    audio.setMuted(muted);
  }, [muted]);

  if (done) return null;

  const filled = Math.round((barPercent / 100) * TOTAL_BLOCKS);
  const empty = TOTAL_BLOCKS - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <div
      className={`bd-overlay${phase === 3 && !flashWhite ? " bd-dissolve" : ""}${flashWhite ? " bd-flash" : ""}`}
      role="dialog"
      aria-label="Braindance intro sequence"
      aria-modal="true"
    >
      <div className="bd-scanlines" aria-hidden="true" />

      {!started ? (
        <button
          className="bd-enter"
          onClick={handleStart}
          aria-label="Begin braindance intro"
        >
          <span className="bd-enter-text" aria-hidden="true">
            // CLICK TO INITIALIZE BRAINDANCE
          </span>
          <span className="bd-enter-sub" aria-hidden="true">
            PRESS ANY KEY OR CLICK TO CONTINUE
          </span>
        </button>
      ) : (
        <>
          {phase === 1 && (
            <canvas ref={canvasRef} className="bd-canvas" aria-hidden="true" />
          )}
          {phase === 2 && (
            <div className="bd-sync">
              <div className="bd-bar-label">SYNCING SONGBIRD//NET</div>
              <div
                className="bd-bar"
                role="status"
                aria-live="polite"
                aria-label={`Neural sync: ${barPercent}%`}
              >
                [{bar}] {barPercent}%
              </div>
              <div className="bd-readouts" aria-live="polite">
                {visibleReadouts.map((line, i) => (
                  <div key={i} className="bd-readout-line">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
          {skipVisible && phase !== 3 && (
            <button
              className="bd-skip bd-skip-visible"
              onClick={skip}
              aria-label="Skip braindance intro"
            >
              [SKIP BRAINDANCE]
            </button>
          )}
        </>
      )}

      <style>{`
        .bd-overlay { position: fixed; inset: 0; z-index: 9999; background: #000; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .bd-flash { background: #fff !important; }
        .bd-dissolve { animation: bd-tear-out 0.6s ease forwards; }
        @keyframes bd-tear-out { 0% { opacity: 1; clip-path: inset(0 0 0 0); } 20% { clip-path: inset(15% 0 20% 0); } 40% { clip-path: inset(35% 0 5% 0); } 60% { clip-path: inset(5% 0 60% 0); } 80% { clip-path: inset(70% 0 0% 0); opacity: 0.4; } 100% { clip-path: inset(100% 0 0 0); opacity: 0; } }
        .bd-scanlines { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px); z-index: 1; }
        .bd-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .bd-sync { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; z-index: 2; text-align: center; padding: 2rem; }
        .bd-bar-label { font-family: 'Rajdhani', sans-serif; font-size: clamp(1.25rem, 4vw, 2rem); font-weight: 700; color: #25E1ED; letter-spacing: 0.15em; text-shadow: 0 0 12px #25E1ED; }
        .bd-bar { font-family: 'Share Tech Mono', monospace; font-size: clamp(0.9rem, 2.5vw, 1.25rem); color: #02D7F2; letter-spacing: 0.05em; text-shadow: 0 0 8px #02D7F2; }
        .bd-readouts { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem; min-height: 7rem; }
        .bd-readout-line { font-family: 'Share Tech Mono', monospace; font-size: clamp(0.7rem, 1.8vw, 0.9rem); color: rgba(2,215,242,0.75); animation: bd-line-in 0.3s ease both; }
        @keyframes bd-line-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .bd-skip { position: absolute; top: 1.25rem; right: 1.5rem; z-index: 10; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(2,215,242,0.4); background: transparent; border: 1px solid rgba(2,215,242,0.2); padding: 0.3rem 0.75rem; cursor: pointer; opacity: 0; transition: opacity 0.6s ease, color 0.2s, border-color 0.2s; letter-spacing: 0.08em; }
        .bd-skip-visible { opacity: 1; }
        .bd-skip:hover { color: #02D7F2; border-color: rgba(2,215,242,0.6); }
        .bd-enter { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; z-index: 2; background: transparent; border: 1px solid rgba(2,215,242,0.35); padding: 2rem 3rem; cursor: pointer; animation: bd-enter-pulse 2s ease-in-out infinite; color: inherit; }
        .bd-enter:hover, .bd-enter:focus-visible { border-color: #02D7F2; box-shadow: 0 0 16px rgba(2,215,242,0.3); outline: none; }
        .bd-enter-text { font-family: 'Rajdhani', sans-serif; font-size: clamp(1.1rem, 3.5vw, 1.75rem); font-weight: 700; color: #25E1ED; letter-spacing: 0.15em; text-shadow: 0 0 12px #25E1ED; }
        .bd-enter-sub { font-family: 'Share Tech Mono', monospace; font-size: clamp(0.65rem, 1.6vw, 0.8rem); color: rgba(2,215,242,0.55); letter-spacing: 0.1em; }
        @keyframes bd-enter-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}
