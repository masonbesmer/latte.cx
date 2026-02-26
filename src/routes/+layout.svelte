<script lang="ts">
  import '../lib/styles/tokens.css';
  import '../lib/styles/globals.css';
  import { onMount } from 'svelte';
  import ScanlineTransition from '../lib/components/ScanlineTransition.svelte';
  import BackgroundScene from '../lib/components/three/BackgroundScene.svelte';
  import BraindanceIntro from '../lib/components/BraindanceIntro.svelte';
  import { muted } from '../lib/stores/audio';

  let showIntro = false;

  onMount(() => {
    const seen = sessionStorage.getItem('braindance-seen');
    if (!seen) {
      showIntro = true;
    }
  });

  function onIntroComplete() {
    showIntro = false;
  }

  function toggleMute() {
    muted.update((v) => !v);
  }
</script>

<svelte:head>
  <title>NEURAL//LINK</title>
</svelte:head>

<BackgroundScene />

{#if showIntro}
  <BraindanceIntro onComplete={onIntroComplete} />
{/if}

<div class="page-container">
  <ScanlineTransition />
  <slot />
</div>

<!-- Global audio mute toggle -->
<button
  class="audio-toggle"
  on:click={toggleMute}
  aria-label={$muted ? 'Unmute audio' : 'Mute audio'}
  title={$muted ? 'Unmute' : 'Mute'}
>
  {#if $muted}
    <span aria-hidden="true">🔇</span>
  {:else}
    <span aria-hidden="true">🔊</span>
  {/if}
</button>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: transparent;
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

  .audio-toggle {
    position: fixed;
    bottom: 1.25rem;
    right: 1.5rem;
    z-index: 100;
    background: rgba(10, 10, 15, 0.7);
    border: 1px solid rgba(2, 215, 242, 0.3);
    color: #02D7F2;
    font-size: 1rem;
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    border-radius: 2px;
  }

  .audio-toggle:hover {
    border-color: #02D7F2;
    box-shadow: 0 0 8px rgba(2, 215, 242, 0.4);
  }

  .audio-toggle:focus-visible {
    outline: 1px solid #02D7F2;
    outline-offset: 2px;
  }
</style>
