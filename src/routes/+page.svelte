<script lang="ts">
  import HeroSection from '$lib/components/HeroSection.svelte';
</script>

<HeroSection />

<section id="projects" class="projects-placeholder">
  <p class="projects-label">// PROJECTS LOADING...</p>
</section>

<style>
  .projects-placeholder {
    min-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid rgba(2, 215, 242, 0.15);
  }

  .projects-label {
    font-family: 'Share Tech Mono', monospace;
    color: rgba(2, 215, 242, 0.4);
    font-size: 1rem;
    letter-spacing: 0.1em;
  }
</style>

