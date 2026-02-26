<script lang="ts">
  import { onMount } from 'svelte';
  import GlitchText from '$lib/components/GlitchText.svelte';
  import ContactTerminal from '$lib/components/ContactTerminal.svelte';

  // Blinking uplink dot
  let dotVisible = true;
  let dotInterval: ReturnType<typeof setInterval>;

  onMount(() => {
    dotInterval = setInterval(() => {
      dotVisible = !dotVisible;
    }, 600);

    return () => clearInterval(dotInterval);
  });
</script>

<div class="contact-page">
  <div class="contact-inner">

    <!-- Header -->
    <header class="contact-header">
      <GlitchText tag="h1" text="// SEND TRANSMISSION" trigger="always" />
      <p class="uplink-status">
        UPLINK STATUS: <span class="uplink-ready">READY</span>
        <span class="uplink-dot" class:uplink-dot--on={dotVisible} aria-hidden="true">●</span>
      </p>
    </header>

    <!-- Separator -->
    <div class="ct-divider" aria-hidden="true">
      // ──────────────────────────────────────────────────────────────────────
    </div>

    <!-- Contact form -->
    <main class="contact-body">
      <ContactTerminal />
    </main>

    <!-- Footer hint -->
    <footer class="contact-footer">
      <a href="/#projects" class="back-link">← BACK TO NET</a>
    </footer>

  </div>
</div>

<style>
  .contact-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 1.5rem;
    font-family: 'Share Tech Mono', monospace;
  }

  .contact-inner {
    width: 100%;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* ── Header ────────────────────────────────────────────────────────────── */
  .contact-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Override GlitchText h1 size for this page */
  .contact-header :global(h1) {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 700;
    color: #02D7F2;
    text-shadow: 0 0 12px rgba(2, 215, 242, 0.5);
    margin: 0;
    letter-spacing: 0.05em;
  }

  .uplink-status {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    color: rgba(2, 215, 242, 0.55);
    letter-spacing: 0.08em;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .uplink-ready {
    color: #25E1ED;
    text-shadow: 0 0 8px rgba(37, 225, 237, 0.6);
  }

  .uplink-dot {
    font-size: 0.6rem;
    color: #25E1ED;
    text-shadow: 0 0 6px #25E1ED;
    transition: opacity 0.15s ease;
  }

  .uplink-dot--on {
    opacity: 1;
  }

  .uplink-dot:not(.uplink-dot--on) {
    opacity: 0;
  }

  /* ── Divider ───────────────────────────────────────────────────────────── */
  .ct-divider {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(2, 215, 242, 0.2);
    letter-spacing: 0;
    overflow: hidden;
    white-space: nowrap;
  }

  /* ── Body ──────────────────────────────────────────────────────────────── */
  .contact-body {
    padding: 0;
  }

  /* ── Footer ────────────────────────────────────────────────────────────── */
  .contact-footer {
    padding-top: 1rem;
    border-top: 1px solid rgba(2, 215, 242, 0.1);
  }

  .back-link {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    color: rgba(2, 215, 242, 0.5);
    text-decoration: none;
    letter-spacing: 0.06em;
    border: 1px solid rgba(2, 215, 242, 0.2);
    padding: 0.3rem 0.75rem;
    transition: color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    display: inline-block;
  }

  .back-link:hover {
    color: #02D7F2;
    border-color: rgba(2, 215, 242, 0.5);
    box-shadow: 0 0 8px rgba(2, 215, 242, 0.2);
  }
</style>
