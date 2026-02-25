<script lang="ts">
  import GlitchText from '$lib/components/GlitchText.svelte';
  import LoadingBar from '$lib/components/LoadingBar.svelte';
  import NeonButton from '$lib/components/NeonButton.svelte';
</script>

<section class="home">
  <GlitchText text="// HOME: HERO + GALLERY" tag="h1" trigger="hover" />
  <p>Placeholder — Hero and project gallery will be here.</p>

  <div class="demo-row">
    <LoadingBar percent={72} label="LOADING SUBSYSTEM" duration={1500} />
  </div>

  <div class="demo-row">
    <NeonButton label="PRIMARY ACTION" variant="primary" />
    <NeonButton label="DANGER ACTION" variant="danger" />
  </div>
</section>

<style>
  .home {
    padding: var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .demo-row {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
    align-items: center;
  }
</style>

