<script lang="ts">
  import { onMount } from 'svelte';
  import HeroSection from '$lib/components/HeroSection.svelte';
  import { activeSection } from '$lib/stores/scene';

  let heroEl: HTMLElement;
  let projectsEl: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target === heroEl) {
            activeSection.set('hero');
          } else if (entry.target === projectsEl) {
            activeSection.set('projects');
          }
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(heroEl);
    observer.observe(projectsEl);

    return () => observer.disconnect();
  });
</script>

<section bind:this={heroEl} id="hero">
  <HeroSection />
</section>

<section bind:this={projectsEl} id="projects" class="projects-placeholder">
  <p class="projects-label">// PROJECTS LOADING...</p>
</section>

<style>
  #hero {
    display: contents;
  }

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

