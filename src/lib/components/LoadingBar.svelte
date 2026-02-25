<script lang="ts">
  import { onMount } from 'svelte';

  export let percent: number = 100;
  export let label: string = 'LOADING SUBSYSTEM';
  export let duration: number = 1200; // ms

  const TOTAL_BLOCKS = 10;

  let displayed = 0;

  onMount(() => {
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      displayed = Math.round(progress * percent);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        displayed = percent;
      }
    }

    requestAnimationFrame(tick);
  });

  $: filled = Math.round((displayed / 100) * TOTAL_BLOCKS);
  $: empty  = TOTAL_BLOCKS - filled;
  $: bar    = '█'.repeat(filled) + '░'.repeat(empty);
</script>

<div class="loading-bar" role="status" aria-live="polite" aria-label="{label}: {displayed}%">
  <span class="bar-track">[{bar}]</span>
  <span class="bar-percent"> {displayed}%</span>
  <span class="bar-label"> — {label}</span>
</div>

<style>
  .loading-bar {
    font-family: 'Share Tech Mono', monospace;
    color: #02D7F2;
    font-size: 1rem;
    white-space: nowrap;
  }

  .bar-percent {
    color: #F2E900;
  }

  .bar-label {
    color: #25E1ED;
  }
</style>
