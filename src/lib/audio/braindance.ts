/**
 * Braindance audio module — synthesizes all sounds via Web Audio API.
 * Falls back silently if AudioContext is unavailable (e.g. SSR).
 */

let ctx: AudioContext | null = null;
let staticSource: AudioBufferSourceNode | null = null;
let staticGain: GainNode | null = null;
let _muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  return ctx;
}

/** Resume context after a user gesture (required by browser autoplay policy). */
export async function resume(): Promise<void> {
  const c = getCtx();
  if (c && c.state === 'suspended') {
    try {
      await c.resume();
    } catch {
      // AudioContext resume blocked by browser autoplay policy — proceed without audio
    }
  }
}

export function setMuted(val: boolean): void {
  _muted = val;
  if (staticGain) {
    staticGain.gain.value = val ? 0 : 0.18;
  }
}

/** Phase 1: play looping white-noise static, fading in over `fadeDuration` seconds. */
export function playStaticFadeIn(fadeDuration: number = 2): void {
  const c = getCtx();
  if (!c) return;

  // Build a 2-second white-noise buffer
  const bufferSize = c.sampleRate * 2;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  // High-pass filter to keep it crunchy
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 0.5;

  staticSource = c.createBufferSource();
  staticSource.buffer = buffer;
  staticSource.loop = true;

  staticGain = c.createGain();
  staticGain.gain.setValueAtTime(0, c.currentTime);
  staticGain.gain.linearRampToValueAtTime(
    _muted ? 0 : 0.18,
    c.currentTime + fadeDuration
  );

  staticSource.connect(filter);
  filter.connect(staticGain);
  staticGain.connect(c.destination);
  staticSource.start();
}

/** Fade out and stop the looping static over `fadeDuration` seconds. */
export function fadeOutStatic(fadeDuration: number = 0.8): void {
  const c = getCtx();
  if (!c || !staticGain || !staticSource) return;
  staticGain.gain.setValueAtTime(staticGain.gain.value, c.currentTime);
  staticGain.gain.linearRampToValueAtTime(0, c.currentTime + fadeDuration);
  const src = staticSource;
  setTimeout(() => {
    try { src.stop(); } catch { /* already stopped */ }
  }, fadeDuration * 1000 + 50);
  staticSource = null;
}

/** Phase 2: short cyberpunk synth sting — rising frequency sweep with decay. */
export function playSynthSting(): void {
  const c = getCtx();
  if (!c || _muted) return;

  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.15);
  osc.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.4);

  const osc2 = c.createOscillator();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(110, c.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(220, c.currentTime + 0.3);

  const gain = c.createGain();
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.22, c.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(c.destination);

  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.55);
  osc2.start(c.currentTime);
  osc2.stop(c.currentTime + 0.55);
}

/** Phase 3: deep bass drop — pitch-falling sine with strong impact. */
export function playBassDrop(): void {
  const c = getCtx();
  if (!c || _muted) return;

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, c.currentTime + 0.5);

  const distortion = c.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = (Math.PI + 200) * x / (Math.PI + 200 * Math.abs(x));
  }
  distortion.curve = curve;

  const gain = c.createGain();
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.45, c.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8);

  osc.connect(distortion);
  distortion.connect(gain);
  gain.connect(c.destination);

  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.85);
}

/** Stop all audio immediately (used on skip). */
export function stopAll(fadeDuration: number = 0.2): void {
  fadeOutStatic(fadeDuration);
}
