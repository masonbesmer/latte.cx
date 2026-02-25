<script lang="ts">
  import { afterNavigate } from '$app/navigation';

  let lineEl: HTMLDivElement;
  let running = false;

  export function trigger() {
    if (running) return;
    running = true;

    // Reset to top instantly
    lineEl.style.transition = 'none';
    lineEl.style.top = '-2px';
    lineEl.style.opacity = '1';

    // Force reflow
    void lineEl.offsetHeight;

    // Sweep down
    lineEl.style.transition = 'top 600ms linear, opacity 100ms ease 500ms';
    lineEl.style.top = '100vh';
    lineEl.style.opacity = '0';

    setTimeout(() => {
      running = false;
      lineEl.style.top = '-2px';
      lineEl.style.opacity = '0';
    }, 700);
  }

  afterNavigate(() => {
    trigger();
  });
</script>

<div
  class="scanline-sweep"
  bind:this={lineEl}
  aria-hidden="true"
></div>

<style>
  .scanline-sweep {
    position: fixed;
    left: 0;
    right: 0;
    top: -2px;
    height: 2px;
    opacity: 0;
    pointer-events: none;
    z-index: 9999;
    background: #25E1ED;
    box-shadow:
      0 0  6px 1px #25E1ED,
      0 0 12px 3px rgba(37, 225, 237, 0.5),
      0 0 24px 6px rgba(37, 225, 237, 0.25);
  }
</style>
