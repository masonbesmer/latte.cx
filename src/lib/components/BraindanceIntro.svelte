<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { muted } from '$lib/stores/audio';
  import * as audio from '$lib/audio/braindance';

  export let onComplete: () => void = () => {};

  // ── State ──────────────────────────────────────────────────────────────────
  let phase: 1 | 2 | 3 = 1;
  let skipVisible = false;
  let done = false;

  // Phase 2 loading bar
  const READOUTS = [
    '// ESTABLISHING NEURAL HANDSHAKE...',
    '// DECRYPTING IDENTITY MATRIX...',
    '// LOADING SONGBIRD SUBSYSTEMS...',
    '// LINK ESTABLISHED'
  ];
  let barPercent = 0;
  let visibleReadouts: string[] = [];

  // Phase 3
  let flashWhite = false;

  // ── Canvas noise ───────────────────────────────────────────────────────────
  let canvas: HTMLCanvasElement;
  let noiseRaf = 0;

  function drawNoise(intensity: number) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
      noiseRaf = requestAnimationFrame(loop);
    }
    loop();
  }

  function stopNoiseLoop() {
    cancelAnimationFrame(noiseRaf);
  }

  // ── Phase timers ───────────────────────────────────────────────────────────
  let timers: ReturnType<typeof setTimeout>[] = [];

  function after(ms: number, fn: () => void) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  // ── Loading bar animation with glitch stutters ─────────────────────────────
  let barRaf = 0;
  let barStart = 0;
  const BAR_DURATION = 3000;
  // Stutter spec: at these fractions of duration, jump back 5-10%
  const STUTTERS = [0.35, 0.62, 0.78];
  let stutterApplied = [false, false, false];

  function startBarAnimation(onDone: () => void) {
    barStart = performance.now();
    stutterApplied = [false, false, false];

    function tick(now: number) {
      const elapsed = now - barStart;
      const t = Math.min(elapsed / BAR_DURATION, 1);

      let pct = Math.round(t * 100);

      // Apply glitch stutters
      for (let i = 0; i < STUTTERS.length; i++) {
        if (!stutterApplied[i] && t >= STUTTERS[i]) {
          stutterApplied[i] = true;
          pct = Math.max(0, pct - (5 + Math.floor(Math.random() * 6)));
        }
      }

      barPercent = pct;

      if (t < 1) {
        barRaf = requestAnimationFrame(tick);
      } else {
        barPercent = 100;
        onDone();
      }
    }

    barRaf = requestAnimationFrame(tick);
  }

  // ── Reveal readout lines ───────────────────────────────────────────────────
  function revealReadouts() {
    READOUTS.forEach((line, i) => {
      after(i * 650, () => {
        visibleReadouts = [...visibleReadouts, line];
      });
    });
  }

  // ── Full phase sequence ────────────────────────────────────────────────────
  let synthStingFired = false;

  function startSequence() {
    // Phase 1
    phase = 1;
    startNoiseLoop(1);
    audio.playStaticFadeIn(2);

    after(2000, () => {
      skipVisible = true;
    });

    after(2000, () => {
      // Phase 2
      phase = 2;
      stopNoiseLoop();
      audio.fadeOutStatic(0.8);
      revealReadouts();

      // Watch barPercent for synth sting
      const stingWatcher = setInterval(() => {
        if (!synthStingFired && barPercent >= 60) {
          synthStingFired = true;
          audio.playSynthSting();
          clearInterval(stingWatcher);
        }
      }, 50);
      timers.push(stingWatcher as unknown as ReturnType<typeof setTimeout>);

      startBarAnimation(() => {
        // Phase 3
        triggerResolve();
      });
    });
  }

  function triggerResolve() {
    phase = 3;
    flashWhite = true;
    audio.playBassDrop();

    after(100, () => {
      flashWhite = false;
    });

    after(700, () => {
      done = true;
      sessionStorage.setItem('braindance-seen', 'true');
      onComplete();
    });
  }

  // ── Skip ──────────────────────────────────────────────────────────────────
  function skip() {
    clearTimers();
    cancelAnimationFrame(barRaf);
    stopNoiseLoop();
    audio.stopAll(0.2);
    phase = 3;
    flashWhite = true;
    audio.playBassDrop();
    after(100, () => { flashWhite = false; });
    after(700, () => {
      done = true;
      sessionStorage.setItem('braindance-seen', 'true');
      onComplete();
    });
  }

  // ── Mount / Destroy ────────────────────────────────────────────────────────
  onMount(() => {
    // Respect prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      console.log('// BRAINDANCE BYPASSED — REDUCED MOTION DETECTED');
      sessionStorage.setItem('braindance-seen', 'true');
      done = true;
      onComplete();
      return;
    }

    audio.resume().then(() => {
      startSequence();
    });
  });

  onDestroy(() => {
    clearTimers();
    cancelAnimationFrame(barRaf);
    stopNoiseLoop();
  });

  // ── Muted store sync ───────────────────────────────────────────────────────
  $: audio.setMuted($muted);

  // ── Computed bar display ───────────────────────────────────────────────────
  const TOTAL_BLOCKS = 10;
  $: filled = Math.round((barPercent / 100) * TOTAL_BLOCKS);
  $: empty  = TOTAL_BLOCKS - filled;
  $: bar    = '█'.repeat(filled) + '░'.repeat(empty);
</script>

{#if !done}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    class="bd-overlay"
    class:bd-dissolve={phase === 3 && !flashWhite}
    class:bd-flash={flashWhite}
    role="dialog"
    aria-label="Braindance intro sequence"
    aria-modal="true"
  >
    <!-- Scanline overlay -->
    <div class="bd-scanlines" aria-hidden="true"></div>

    <!-- Phase 1: Noise canvas -->
    {#if phase === 1}
      <canvas bind:this={canvas} class="bd-canvas" aria-hidden="true"></canvas>
    {/if}

    <!-- Phase 2: Neural sync loading -->
    {#if phase === 2}
      <div class="bd-sync">
        <div class="bd-bar-label">SYNCING SONGBIRD//NET</div>
        <div class="bd-bar" role="status" aria-live="polite" aria-label="Neural sync: {barPercent}%">
          [{bar}] {barPercent}%
        </div>
        <div class="bd-readouts" aria-live="polite">
          {#each visibleReadouts as line}
            <div class="bd-readout-line">{line}</div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Skip button (visible after 2s) -->
    {#if skipVisible && phase !== 3}
      <button
        class="bd-skip"
        class:bd-skip-visible={skipVisible}
        on:click={skip}
        aria-label="Skip braindance intro"
      >
        [SKIP BRAINDANCE]
      </button>
    {/if}
  </div>
{/if}

<style>
  .bd-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.6s ease, clip-path 0.6s ease;
    overflow: hidden;
  }

  .bd-flash {
    background: #fff !important;
  }

  .bd-dissolve {
    animation: bd-tear-out 0.6s ease forwards;
  }

  @keyframes bd-tear-out {
    0%   { opacity: 1; clip-path: inset(0 0 0 0); }
    20%  { clip-path: inset(15% 0 20% 0); }
    40%  { clip-path: inset(35% 0 5% 0); }
    60%  { clip-path: inset(5% 0 60% 0); }
    80%  { clip-path: inset(70% 0 0% 0); opacity: 0.4; }
    100% { clip-path: inset(100% 0 0 0); opacity: 0; }
  }

  /* High-intensity scanlines for the intro */
  .bd-scanlines {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.25) 2px,
      rgba(0, 0, 0, 0.25) 4px
    );
    z-index: 1;
  }

  .bd-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  /* ── Phase 2 sync UI ─────────────────────────────────────────────────── */
  .bd-sync {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    z-index: 2;
    text-align: center;
    padding: 2rem;
  }

  .bd-bar-label {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(1.25rem, 4vw, 2rem);
    font-weight: 700;
    color: #25E1ED;
    letter-spacing: 0.15em;
    text-shadow: 0 0 12px #25E1ED;
  }

  .bd-bar {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(0.9rem, 2.5vw, 1.25rem);
    color: #02D7F2;
    letter-spacing: 0.05em;
    text-shadow: 0 0 8px #02D7F2;
  }

  .bd-readouts {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
    min-height: 7rem;
  }

  .bd-readout-line {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(0.7rem, 1.8vw, 0.9rem);
    color: rgba(2, 215, 242, 0.75);
    animation: bd-line-in 0.3s ease both;
  }

  @keyframes bd-line-in {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Skip button ─────────────────────────────────────────────────────── */
  .bd-skip {
    position: absolute;
    top: 1.25rem;
    right: 1.5rem;
    z-index: 10;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: rgba(2, 215, 242, 0.4);
    background: transparent;
    border: 1px solid rgba(2, 215, 242, 0.2);
    padding: 0.3rem 0.75rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.6s ease, color 0.2s, border-color 0.2s;
    letter-spacing: 0.08em;
  }

  .bd-skip-visible {
    opacity: 1;
  }

  .bd-skip:hover {
    color: #02D7F2;
    border-color: rgba(2, 215, 242, 0.6);
  }

  .bd-skip:focus-visible {
    outline: 1px solid #02D7F2;
    outline-offset: 2px;
  }
</style>
