<script lang="ts">
  import { goto } from '$app/navigation';
  import { tilt } from '$lib/actions/tilt';
  import { CATEGORY_LABELS, CATEGORY_COLORS } from '$lib/data/projects';
  import type { Project } from '$lib/data/projects';

  export let project: Project;
  export let onCardClick: (() => void) | undefined = undefined;

  let hovered = false;

  function handleClick() {
    if (onCardClick) {
      onCardClick();
    } else {
      goto(`/projects/${project.slug}`);
    }
  }
</script>

<a
  href="/projects/{project.slug}"
  class="project-card"
  class:hovered
  use:tilt={{ maxAngle: 8 }}
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  on:click|preventDefault={handleClick}
  aria-label="View project: {project.title}"
>
  <!-- Orbiting dots (visible on hover) -->
  {#if hovered}
    <span class="orbit orbit-1" aria-hidden="true"></span>
    <span class="orbit orbit-2" aria-hidden="true"></span>
    <span class="orbit orbit-3" aria-hidden="true"></span>
  {/if}

  <!-- Thumbnail -->
  <div class="thumbnail">
    <div class="thumbnail-bg" style="--accent: {CATEGORY_COLORS[project.category]}"></div>
    <span class="thumbnail-label">{project.title}</span>
  </div>

  <!-- Content -->
  <div class="card-body">
    <h3 class="card-title">{project.title}</h3>
    <p class="card-summary">{project.summary}</p>
    <div class="tags">
      {#each project.tags as tag}
        <span class="tag" style="--tag-color: {CATEGORY_COLORS[tag]}">
          [{CATEGORY_LABELS[tag]}]
        </span>
      {/each}
    </div>
  </div>
</a>

<style>
  .project-card {
    position: relative;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: #02d7f2;
    background: rgba(10, 10, 15, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(2, 215, 242, 0.3);
    border-radius: 4px;
    overflow: hidden;
    box-shadow:
      0 0 8px rgba(2, 215, 242, 0.15),
      inset 0 0 8px rgba(2, 215, 242, 0.05);
    transition:
      box-shadow 0.3s ease,
      border-color 0.3s ease,
      transform 0.15s ease;
    will-change: transform;
  }

  /* Firefox fallback: backdrop-filter not supported — use more opaque background */
  @supports not (backdrop-filter: blur(12px)) {
    .project-card {
      background: rgba(10, 10, 15, 0.92);
    }
  }

  .project-card.hovered {
    border-color: rgba(2, 215, 242, 0.7);
    box-shadow:
      0 0 20px rgba(2, 215, 242, 0.4),
      0 0 40px rgba(2, 215, 242, 0.15),
      inset 0 0 12px rgba(2, 215, 242, 0.1);
  }

  .project-card:focus-visible {
    outline: 1px solid #02D7F2;
    outline-offset: 3px;
  }

  /* Thumbnail */
  .thumbnail {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumbnail-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(10, 10, 15, 0.9) 0%,
      color-mix(in srgb, var(--accent) 15%, #0a0a0f) 100%
    );
  }

  .thumbnail-label {
    position: relative;
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: rgba(2, 215, 242, 0.3);
    text-transform: uppercase;
  }

  /* Card body */
  .card-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .card-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #02d7f2;
    margin: 0;
    text-shadow: 0 0 8px rgba(2, 215, 242, 0.5);
  }

  .card-summary {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    line-height: 1.5;
    color: rgba(2, 215, 242, 0.7);
    margin: 0;
  }

  /* Tags */
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: auto;
    padding-top: 0.5rem;
  }

  .tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    color: var(--tag-color);
    border: 1px solid var(--tag-color);
    border-radius: 2px;
    padding: 0.1em 0.4em;
    opacity: 0.85;
    transition: opacity 0.2s;
  }

  .project-card.hovered .tag {
    opacity: 1;
  }

  /* Orbiting dots */
  .orbit {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #02d7f2;
    box-shadow: 0 0 6px #02d7f2;
    animation: orbit-path 2s linear infinite;
    pointer-events: none;
    z-index: 10;
  }

  .orbit-1 {
    animation-delay: 0s;
    background: #02d7f2;
    box-shadow: 0 0 6px #02d7f2;
  }
  .orbit-2 {
    animation-delay: -0.66s;
    background: #f2e900;
    box-shadow: 0 0 6px #f2e900;
  }
  .orbit-3 {
    animation-delay: -1.33s;
    background: #ed1e79;
    box-shadow: 0 0 6px #ed1e79;
  }

  @keyframes orbit-path {
    0% {
      top: -3px;
      left: calc(50% - 3px);
    }
    25% {
      top: calc(50% - 3px);
      left: calc(100% - 3px);
    }
    50% {
      top: calc(100% - 3px);
      left: calc(50% - 3px);
    }
    75% {
      top: calc(50% - 3px);
      left: -3px;
    }
    100% {
      top: -3px;
      left: calc(50% - 3px);
    }
  }
</style>
