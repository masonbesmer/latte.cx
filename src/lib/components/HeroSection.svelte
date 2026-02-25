<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import CyclingSubtitle from './CyclingSubtitle.svelte';

  const TITLE = 'SONGBIRD';
  const IDENTITY_LINE = '// IDENTITY CONFIRMED: SONGBIRD';
  const SCRAMBLE_CHARS = '!@#$%^&*░▒▓';
  const SCRAMBLE_DURATION = 1500; // total scramble time per char before resolving
  const CHAR_STAGGER = 50; // ms offset per character

  // Character-scramble state: array of displayed characters
  let titleChars: string[] = TITLE.split('').map(() => SCRAMBLE_CHARS[0]);
  let titleResolved = false;

  // Identity line typewriter state
  let identityText = '';
  let identityCursorVisible = true;
  let identityDone = false;

  let scrambleIntervals: ReturnType<typeof setInterval>[] = [];
  let identityTimeout: ReturnType<typeof setTimeout> | null = null;
  let identityCursorInterval: ReturnType<typeof setInterval> | null = null;

  function scrambleTitle() {
    const chars = TITLE.split('');

    chars.forEach((targetChar, i) => {
      const startDelay = i * CHAR_STAGGER;
      const resolveAt = SCRAMBLE_DURATION + startDelay;
      let elapsed = 0;

      const interval = setInterval(() => {
        elapsed += 50;
        if (elapsed >= resolveAt) {
          titleChars[i] = targetChar;
          clearInterval(interval);
          // Check if all resolved
          if (titleChars.every((c, idx) => c === TITLE[idx])) {
            titleResolved = true;
            startIdentityLine();
          }
        } else {
          titleChars[i] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        titleChars = [...titleChars]; // trigger reactivity
      }, 50);

      scrambleIntervals.push(interval);
    });
  }

  function startIdentityLine() {
    let idx = 0;
    identityCursorInterval = setInterval(() => {
      identityCursorVisible = !identityCursorVisible;
    }, 500);

    function typeNext() {
      if (idx < IDENTITY_LINE.length) {
        identityText += IDENTITY_LINE[idx];
        idx++;
        identityTimeout = setTimeout(typeNext, 40);
      } else {
        identityDone = true;
        if (identityCursorInterval !== null) {
          clearInterval(identityCursorInterval);
          identityCursorInterval = null;
        }
      }
    }

    identityTimeout = setTimeout(typeNext, 200);
  }

  onMount(() => {
    scrambleTitle();
  });

  onDestroy(() => {
    scrambleIntervals.forEach(clearInterval);
    if (identityTimeout !== null) clearTimeout(identityTimeout);
    if (identityCursorInterval !== null) clearInterval(identityCursorInterval);
  });
</script>

<section class="hero">
  <div class="hero-inner">
    <!-- Scramble title -->
    <h1 class="hero-title" aria-label={TITLE}>
      {#each titleChars as char}
        <span class="title-char">{char}</span>
      {/each}
    </h1>

    <!-- Identity typewriter line -->
    <p class="identity-line" aria-label={IDENTITY_LINE} aria-live="off">
      {identityText}<span
        class="identity-cursor"
        class:visible={identityCursorVisible && !identityDone}
      >|</span>
    </p>

    <!-- Cycling subtitle -->
    <div class="subtitle-wrap">
      <CyclingSubtitle />
    </div>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    padding: 2rem 1rem;
    animation: crt-flicker 8s infinite;
  }

  @keyframes crt-flicker {
    0%   { filter: brightness(1) contrast(1); }
    2%   { filter: brightness(1.03) contrast(1.02); }
    4%   { filter: brightness(0.97) contrast(0.99); }
    6%   { filter: brightness(1.01) contrast(1.01); }
    8%   { filter: brightness(1) contrast(1); }
    50%  { filter: brightness(1) contrast(1); }
    51%  { filter: brightness(1.02) contrast(1.01); }
    53%  { filter: brightness(0.98) contrast(1); }
    55%  { filter: brightness(1) contrast(1); }
    100% { filter: brightness(1) contrast(1); }
  }

  .hero-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  .hero-title {
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #02D7F2;
    text-shadow:
      0 0 8px #02D7F2,
      0 0 20px rgba(2, 215, 242, 0.5),
      0 0 40px rgba(2, 215, 242, 0.2);
    margin: 0;
    line-height: 1;
    /* Mobile: clamp from 3.75rem (text-6xl) to 9rem (text-9xl) */
    font-size: clamp(3.75rem, 14vw, 9rem);
  }

  .title-char {
    display: inline-block;
  }

  .identity-line {
    font-family: 'Share Tech Mono', monospace;
    color: #F2E900;
    font-size: clamp(0.8rem, 2.5vw, 1.1rem);
    letter-spacing: 0.05em;
    margin: 0;
    min-height: 1.5em;
    text-shadow:
      0 0 6px rgba(242, 233, 0, 0.6);
  }

  .identity-cursor {
    opacity: 0;
    transition: opacity 0.05s;
    color: #F2E900;
  }

  .identity-cursor.visible {
    opacity: 1;
  }

  .subtitle-wrap {
    margin-top: 0.5rem;
  }

  /* clamp() handles full responsive range: 3.75rem (≈text-6xl) on small → 9rem (≈text-9xl) on large */
</style>
