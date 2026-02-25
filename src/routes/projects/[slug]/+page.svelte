<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import GlitchText from '$lib/components/GlitchText.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const { component: Content, meta } = data;

  let contentEl: HTMLElement;
  let revealed = false;
  let cursorVisible = true;
  let glitchFlash = false;

  let cursorInterval: ReturnType<typeof setInterval>;

  onMount(() => {
    // Blink cursor during load-in
    cursorInterval = setInterval(() => {
      cursorVisible = !cursorVisible;
    }, 500);

    // Grab all direct children of the markdown content wrapper
    const children = Array.from(contentEl?.children ?? []) as HTMLElement[];

    children.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
    });

    // Stagger-reveal each child element
    children.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity 120ms ease, transform 120ms ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';

        if (i === children.length - 1) {
          setTimeout(() => {
            clearInterval(cursorInterval);
            revealed = true;
          }, 200);
        }
      }, 80 + i * 50);
    });

    return () => clearInterval(cursorInterval);
  });

  function handleBack() {
    glitchFlash = true;
    setTimeout(() => {
      glitchFlash = false;
      goto('/#projects');
    }, 220);
  }
</script>

{#if glitchFlash}
  <div class="glitch-flash" aria-hidden="true"></div>
{/if}

<div class="writeup-page">
  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/" class="crumb">NIGHT CITY NET</a>
    <span class="sep">&gt;</span>
    <a href="/" class="crumb">SONGBIRD</a>
    <span class="sep">&gt;</span>
    <a href="/#projects" class="crumb">PROJECTS</a>
    <span class="sep">&gt;</span>
    <span class="crumb crumb--current">{meta.title}</span>
  </nav>

  <!-- Back link -->
  <button class="back-link" on:click={handleBack} aria-label="Back to projects">
    <span class="back-arrow">←</span> BACK TO NET
  </button>

  <!-- Page title -->
  <div class="page-title">
    <GlitchText tag="h1" text={meta.title} trigger="always" />
    <div class="meta-row">
      <span class="meta-date">// DATE: {meta.date}</span>
      <span class="meta-sep">|</span>
      <span class="meta-category">// CATEGORY: {meta.category.toUpperCase()}</span>
    </div>
    <div class="tag-row">
      {#each meta.tags as tag}
        <span class="tag-badge">[{tag.toUpperCase()}]</span>
      {/each}
    </div>
    <p class="meta-summary">{meta.summary}</p>
  </div>

  <!-- Terminal content wrapper -->
  <div class="terminal-frame">
    <div class="terminal-topbar">
      <span class="topbar-dot dot-red"></span>
      <span class="topbar-dot dot-yellow"></span>
      <span class="topbar-dot dot-green"></span>
      <span class="topbar-label">// OUTPUT</span>
    </div>

    <div class="content-scroll">
      <div class="markdown-content" bind:this={contentEl}>
        <Content />
      </div>

      {#if !revealed}
        <span
          class="stream-cursor"
          class:visible={cursorVisible}
          aria-hidden="true"
        >█</span>
      {/if}
    </div>
  </div>

  <!-- Bottom back link -->
  <div class="bottom-nav">
    <button class="back-link" on:click={handleBack} aria-label="Back to projects">
      <span class="back-arrow">←</span> BACK TO NET
    </button>
  </div>
</div>

<style>
  .writeup-page {
    max-width: 860px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    position: relative;
    z-index: 1;
  }

  /* ── Breadcrumb ─────────────────────────────────── */
  .breadcrumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  .crumb {
    color: #02D7F2;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .crumb:hover {
    color: #25E1ED;
    text-decoration: underline;
  }

  .crumb--current {
    color: #F2E900;
    cursor: default;
  }

  .sep {
    color: rgba(2, 215, 242, 0.4);
  }

  /* ── Back link ──────────────────────────────────── */
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: 1px solid rgba(2, 215, 242, 0.3);
    color: #02D7F2;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    padding: 0.35rem 0.75rem;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s, color 0.2s;
    margin-bottom: 2rem;
  }

  .back-link:hover {
    border-color: #02D7F2;
    box-shadow: 0 0 8px rgba(2, 215, 242, 0.4);
    color: #25E1ED;
  }

  .back-arrow {
    font-size: 0.9rem;
  }

  /* ── Page title block ───────────────────────────── */
  .page-title {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(2, 215, 242, 0.2);
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: rgba(2, 215, 242, 0.6);
    margin-top: 0.5rem;
    letter-spacing: 0.06em;
  }

  .meta-sep {
    opacity: 0.3;
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .tag-badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    border: 1px solid rgba(2, 215, 242, 0.35);
    color: #02D7F2;
    padding: 0.15rem 0.45rem;
    letter-spacing: 0.08em;
  }

  .meta-summary {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    color: rgba(2, 215, 242, 0.75);
    margin-top: 0.75rem;
    line-height: 1.6;
  }

  /* ── Terminal frame ─────────────────────────────── */
  .terminal-frame {
    border: 1px solid rgba(2, 215, 242, 0.2);
    border-radius: 2px;
    overflow: hidden;
    background: rgba(10, 10, 15, 0.7);
    backdrop-filter: blur(8px);
  }

  .terminal-topbar {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.75rem;
    background: rgba(2, 215, 242, 0.05);
    border-bottom: 1px solid rgba(2, 215, 242, 0.15);
  }

  .topbar-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .dot-red    { background: #FF1111; box-shadow: 0 0 4px #FF1111; }
  .dot-yellow { background: #F2E900; box-shadow: 0 0 4px #F2E900; }
  .dot-green  { background: #25E1ED; box-shadow: 0 0 4px #25E1ED; }

  .topbar-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(2, 215, 242, 0.4);
    margin-left: 0.5rem;
    letter-spacing: 0.1em;
  }

  .content-scroll {
    padding: 1.75rem 2rem;
    position: relative;
  }

  /* ── Stream cursor ──────────────────────────────── */
  .stream-cursor {
    display: inline-block;
    color: #02D7F2;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1rem;
    opacity: 0;
    transition: opacity 0.1s;
    margin-top: 0.5rem;
  }

  .stream-cursor.visible {
    opacity: 1;
  }

  /* ── Bottom nav ─────────────────────────────────── */
  .bottom-nav {
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(2, 215, 242, 0.15);
  }

  .bottom-nav .back-link {
    margin-bottom: 0;
  }

  /* ── Glitch flash overlay ───────────────────────── */
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

  /* ── Markdown content styles ────────────────────── */
  :global(.markdown-content) {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.88rem;
    line-height: 1.75;
    color: #02D7F2;
  }

  :global(.markdown-content h1) {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.8rem;
    color: #F2E900;
    text-shadow: 0 0 12px rgba(242, 233, 0, 0.5);
    border-bottom: 1px solid rgba(242, 233, 0, 0.2);
    padding-bottom: 0.4rem;
    margin: 2rem 0 1rem;
    letter-spacing: 0.05em;
  }

  :global(.markdown-content h2) {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.3rem;
    color: #25E1ED;
    text-shadow: 0 0 8px rgba(37, 225, 237, 0.4);
    margin: 1.75rem 0 0.75rem;
    letter-spacing: 0.06em;
  }

  :global(.markdown-content h3) {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.95rem;
    color: #02D7F2;
    margin: 1.5rem 0 0.5rem;
    letter-spacing: 0.04em;
  }

  :global(.markdown-content h4) {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    color: rgba(2, 215, 242, 0.75);
    margin: 1.25rem 0 0.5rem;
  }

  :global(.markdown-content p) {
    margin: 0 0 1rem;
    color: rgba(2, 215, 242, 0.85);
  }

  :global(.markdown-content ul),
  :global(.markdown-content ol) {
    margin: 0 0 1rem 1.5rem;
    padding: 0;
  }

  :global(.markdown-content li) {
    margin-bottom: 0.3rem;
    color: rgba(2, 215, 242, 0.85);
  }

  :global(.markdown-content li::marker) {
    color: #25E1ED;
  }

  :global(.markdown-content strong) {
    color: #F2E900;
    font-weight: 700;
  }

  :global(.markdown-content em) {
    color: #ED1E79;
    font-style: italic;
  }

  :global(.markdown-content blockquote) {
    border-left: 3px solid #25E1ED;
    margin: 1.25rem 0;
    padding: 0.75rem 1rem;
    background: rgba(37, 225, 237, 0.05);
    color: rgba(37, 225, 237, 0.9);
    font-style: italic;
  }

  :global(.markdown-content blockquote p) {
    margin: 0;
    color: inherit;
  }

  :global(.markdown-content code:not(pre code)) {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.82rem;
    color: #F2E900;
    background: rgba(242, 233, 0, 0.08);
    border: 1px solid rgba(242, 233, 0, 0.25);
    padding: 0.1rem 0.35rem;
    border-radius: 1px;
  }

  :global(.markdown-content pre) {
    background: rgba(10, 10, 15, 0.9);
    border: 1px solid rgba(2, 215, 242, 0.3);
    border-top: none;
    margin: 0 0 1.5rem;
    padding: 1rem 1.25rem;
    overflow-x: auto;
    position: relative;
  }

  :global(.markdown-content pre)::before {
    content: '// OUTPUT';
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(2, 215, 242, 0.4);
    letter-spacing: 0.1em;
    padding: 0.3rem 0.75rem;
    background: rgba(2, 215, 242, 0.05);
    border: 1px solid rgba(2, 215, 242, 0.3);
    border-bottom: none;
    margin: -1rem -1.25rem 0.75rem;
  }

  :global(.markdown-content pre code) {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    color: #02D7F2;
    background: none;
    border: none;
    padding: 0;
  }

  :global(.markdown-content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 1.5rem;
    font-size: 0.82rem;
  }

  :global(.markdown-content th) {
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.85rem;
    text-align: left;
    padding: 0.5rem 0.75rem;
    color: #F2E900;
    border-bottom: 1px solid rgba(242, 233, 0, 0.3);
    letter-spacing: 0.06em;
  }

  :global(.markdown-content td) {
    padding: 0.45rem 0.75rem;
    border-bottom: 1px solid rgba(2, 215, 242, 0.1);
    color: rgba(2, 215, 242, 0.8);
  }

  :global(.markdown-content tr:last-child td) {
    border-bottom: none;
  }

  :global(.markdown-content tr:nth-child(even) td) {
    background: rgba(2, 215, 242, 0.03);
  }

  :global(.markdown-content hr) {
    border: none;
    border-top: 1px solid rgba(2, 215, 242, 0.2);
    margin: 2rem 0;
  }

  :global(.markdown-content img) {
    max-width: 100%;
    height: auto;
    display: block;
    border: 1px solid rgba(2, 215, 242, 0.3);
    box-shadow: 0 0 12px rgba(2, 215, 242, 0.15);
    margin: 1rem auto;
  }

  :global(.markdown-content a) {
    color: #25E1ED;
    text-decoration: none;
    border-bottom: 1px solid rgba(37, 225, 237, 0.3);
    transition: color 0.2s, border-color 0.2s;
  }

  :global(.markdown-content a:hover) {
    color: #F2E900;
    border-color: rgba(242, 233, 0, 0.5);
  }

  /* ── Responsive ─────────────────────────────────── */
  @media (max-width: 640px) {
    .content-scroll {
      padding: 1.25rem 1rem;
    }

    .writeup-page {
      padding: 1.25rem 1rem 3rem;
    }
  }
</style>
