<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import HeroSection from '$lib/components/HeroSection.svelte';
  import GlitchText from '$lib/components/GlitchText.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { activeSection } from '$lib/stores/scene';
  import { projects } from '$lib/data/projects';

  let heroEl: HTMLElement;
  let projectsEl: HTMLElement;
  let glitchFlash = false;
  let pendingNav = '';

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

  function handleCardClick(slug: string) {
    pendingNav = `/projects/${slug}`;
    glitchFlash = true;
    setTimeout(() => {
      glitchFlash = false;
      goto(pendingNav);
    }, 220);
  }
</script>

{#if glitchFlash}
  <div class="glitch-flash" aria-hidden="true"></div>
{/if}

<section bind:this={heroEl} id="hero">
  <HeroSection />
</section>

<section bind:this={projectsEl} id="projects" class="projects-section">
  <div class="projects-inner">
    <div class="section-heading">
      <GlitchText tag="h2" text="// ACTIVE PROJECTS" trigger="scroll" />
    </div>
    <div class="projects-grid">
      {#each projects as project (project.slug)}
        <ProjectCard
          {project}
          onCardClick={() => handleCardClick(project.slug)}
        />
      {/each}
    </div>
  </div>
</section>

<style>
  #hero {
    display: contents;
  }

  /* Glitch flash overlay */
  .glitch-flash {
    position: fixed;
    inset: 0;
    z-index: 9998;
    pointer-events: none;
    animation: glitch-flash-anim 220ms steps(1) forwards;
  }

  @keyframes glitch-flash-anim {
    0%   { background: rgba(255,255,255,0.08); }
    20%  { background: rgba(2,215,242,0.12); }
    40%  { background: rgba(255,255,255,0.06); }
    60%  { background: rgba(237,30,121,0.08); }
    80%  { background: rgba(255,255,255,0.04); }
    100% { background: transparent; }
  }

  /* Projects section */
  .projects-section {
    border-top: 1px solid rgba(2, 215, 242, 0.15);
    padding: 4rem 0 6rem;
  }

  .projects-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .section-heading {
    margin-bottom: 2.5rem;
  }

  /* Responsive grid */
  .projects-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .projects-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .projects-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>

