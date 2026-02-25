<script>
  import '../lib/styles/tokens.css';
  import '../lib/styles/globals.css';
  import ScanlineTransition from '../lib/components/ScanlineTransition.svelte';
</script>

<svelte:head>
  <title>NEURAL//LINK</title>
</svelte:head>

<div class="page-container">
  <ScanlineTransition />
  <slot />
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #0A0A0F;
    color: #02D7F2;
    font-family: 'Share Tech Mono', monospace;
    min-height: 100vh;
  }

  :global(*, *::before, *::after) {
    box-sizing: inherit;
  }

  :global(h1, h2, h3, h4, h5, h6) {
    font-family: 'Rajdhani', sans-serif;
  }

  .page-container {
    min-height: 100vh;
    width: 100%;
  }
</style>
