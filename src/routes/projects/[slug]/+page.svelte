<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import type { ComponentType } from 'svelte';
  import type { PageData } from './$types';
  import GlitchText from '$lib/components/GlitchText.svelte';

  export let data: PageData;

  const MdContent = data.component as ComponentType;
  const meta = data.meta;

  // Line-by-line load-in animation
  let contentEl: HTMLDivElement;
  let linesReady = false;
  let cursorDone = false;

  onMount(() => {
    // Give the markdown time to render, then animate lines
    requestAnimationFrame(() => {
      if (!contentEl) return;
      const children = Array.from(contentEl.children) as HTMLElement[];
      children.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
        el.style.transition = 'none';

        setTimeout(() => {
          el.style.transition = 'opacity 200ms ease, transform 200ms ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';

          if (i === children.length - 1) {
            setTimeout(() => {
              cursorDone = true;
            }, 1000);
          }
        }, 80 + i * 15);
      });
      linesReady = children.length === 0;
      if (children.length === 0) {
        cursorDone = true;
      }
    });
  });

  function handleBack() {
    goto('/#projects');
  }
</script>

<div class="writeup-page">
  <!-- Back link -->
  <div class="back-link-row">
    <button class="back-link" on:click={handleBack}>
      ← BACK TO NET
    </button>
  </div>

  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/" class="crumb">NIGHT CITY NET</a>
    <span class="crumb-sep">&gt;</span>
    <a href="/" class="crumb">SONGBIRD</a>
    <span class="crumb-sep">&gt;</span>
    <a href="/#projects" class="crumb">PROJECTS</a>
    <span class="crumb-sep">&gt;</span>
    <span class="crumb crumb--current">{meta.title}</span>
  </nav>

  <!-- Project meta -->
  <header class="project-header">
    <GlitchText tag="h1" text={meta.title} trigger="always" />
    <div class="project-meta-row">
      <span class="meta-date">// DATE: {meta.date}</span>
      <div class="meta-tags">
        {#each meta.tags as tag}
          <span class="tag-badge">[{tag.toUpperCase()}]</span>
        {/each}
      </div>
    </div>
    <p class="project-summary">{meta.summary}</p>
  </header>

  <!-- Terminal content wrapper -->
  <div class="terminal-wrapper">
    <div class="terminal-topbar">
      <span class="terminal-label">// OUTPUT</span>
      <span class="terminal-dots">
        <span></span><span></span><span></span>
      </span>
    </div>
    <div class="terminal-body">
      <div class="md-content" bind:this={contentEl}>
        <svelte:component this={MdContent} />
      </div>
      {#if !cursorDone}
        <span class="stream-cursor" aria-hidden="true">|</span>
      {/if}
    </div>
  </div>

  <!-- Bottom back link -->
  <div class="bottom-nav">
    <button class="back-link" on:click={handleBack}>
      ← BACK TO NET
    </button>
  </div>
</div>

<style>
  .writeup-page {
    max-width: 860px;
    margin: 0 auto;
    padding: 2rem 1.5rem 6rem;
  }

  /* ── Back link ── */
  .back-link-row,
  .bottom-nav {
    margin-bottom: 1.5rem;
  }

  .bottom-nav {
    margin-top: 3rem;
    margin-bottom: 0;
  }

  .back-link {
    background: none;
    border: 1px solid rgba(2, 215, 242, 0.35);
    color: #02D7F2;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    padding: 0.35rem 0.85rem;
    cursor: pointer;
    letter-spacing: 0.08em;
    transition: border-color 0.2s, box-shadow 0.2s, color 0.2s;
  }

  .back-link:hover {
    border-color: #02D7F2;
    box-shadow: 0 0 8px rgba(2, 215, 242, 0.4);
    color: #25E1ED;
  }

  .back-link:focus-visible {
    outline: 1px solid #02D7F2;
    outline-offset: 2px;
  }

  /* ── Breadcrumb ── */
  .breadcrumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    margin-bottom: 2rem;
    opacity: 0.8;
  }

  .crumb {
    color: #02D7F2;
    text-decoration: none;
    transition: color 0.2s;
  }

  .crumb:hover {
    color: #25E1ED;
  }

  .crumb:focus-visible {
    outline: 1px solid #02D7F2;
    outline-offset: 2px;
  }

  .crumb--current {
    color: #F2E900;
    font-weight: 600;
  }

  .crumb-sep {
    color: rgba(2, 215, 242, 0.4);
    user-select: none;
  }

  /* ── Project header ── */
  .project-header {
    margin-bottom: 2rem;
  }

  .project-meta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-top: 0.75rem;
    margin-bottom: 1rem;
  }

  .meta-date {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.78rem;
    color: rgba(2, 215, 242, 0.6);
  }

  .meta-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag-badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    border: 1px solid rgba(2, 215, 242, 0.4);
    color: #02D7F2;
    letter-spacing: 0.05em;
  }

  .project-summary {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.88rem;
    color: rgba(2, 215, 242, 0.75);
    line-height: 1.6;
    border-left: 2px solid rgba(2, 215, 242, 0.3);
    padding-left: 1rem;
    margin: 0;
  }

  /* ── Terminal wrapper ── */
  .terminal-wrapper {
    border: 1px solid rgba(2, 215, 242, 0.2);
    border-radius: 2px;
    overflow: hidden;
  }

  .terminal-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(2, 215, 242, 0.06);
    border-bottom: 1px solid rgba(2, 215, 242, 0.15);
    padding: 0.4rem 1rem;
  }

  .terminal-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: rgba(2, 215, 242, 0.55);
    letter-spacing: 0.1em;
  }

  .terminal-dots {
    display: flex;
    gap: 0.3rem;
  }

  .terminal-dots span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(2, 215, 242, 0.25);
  }

  .terminal-body {
    padding: 2rem;
    position: relative;
  }

  /* ── Blinking stream cursor ── */
  .stream-cursor {
    display: inline-block;
    color: #02D7F2;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1rem;
    animation: blink-cursor 500ms steps(1) infinite;
    margin-left: 2px;
  }

  @keyframes blink-cursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  /* ── Markdown content styling ── */
  :global(.md-content) {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.8;
    color: #02D7F2;
  }

  :global(.md-content h1) {
    font-family: 'Rajdhani', sans-serif;
    font-size: 2rem;
    color: #F2E900;
    text-shadow: 0 0 12px rgba(242, 233, 0, 0.4);
    margin: 2rem 0 1rem;
    letter-spacing: 0.05em;
  }

  :global(.md-content h2) {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.4rem;
    color: #25E1ED;
    text-shadow: 0 0 8px rgba(37, 225, 237, 0.35);
    margin: 1.75rem 0 0.75rem;
    letter-spacing: 0.04em;
    border-bottom: 1px solid rgba(37, 225, 237, 0.2);
    padding-bottom: 0.4rem;
  }

  :global(.md-content h3) {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.15rem;
    color: #02D7F2;
    margin: 1.5rem 0 0.5rem;
    letter-spacing: 0.03em;
  }

  :global(.md-content h4) {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.95rem;
    color: rgba(2, 215, 242, 0.8);
    margin: 1.25rem 0 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  :global(.md-content p) {
    margin: 0 0 1.1rem;
    color: rgba(2, 215, 242, 0.85);
  }

  :global(.md-content a) {
    color: #25E1ED;
    text-decoration: none;
    border-bottom: 1px solid rgba(37, 225, 237, 0.4);
    transition: color 0.2s, border-color 0.2s;
  }

  :global(.md-content a:hover) {
    color: #F2E900;
    border-color: rgba(242, 233, 0, 0.5);
  }

  :global(.md-content ul),
  :global(.md-content ol) {
    margin: 0 0 1.1rem 1.5rem;
    color: rgba(2, 215, 242, 0.85);
  }

  :global(.md-content li) {
    margin-bottom: 0.35rem;
  }

  :global(.md-content li::marker) {
    color: rgba(2, 215, 242, 0.45);
  }

  :global(.md-content blockquote) {
    border-left: 3px solid rgba(242, 233, 0, 0.5);
    background: rgba(242, 233, 0, 0.04);
    margin: 1.25rem 0;
    padding: 0.75rem 1.25rem;
    color: rgba(242, 233, 0, 0.8);
    font-style: normal;
  }

  :global(.md-content blockquote p) {
    margin: 0;
    color: inherit;
  }

  :global(.md-content hr) {
    border: none;
    border-top: 1px solid rgba(2, 215, 242, 0.15);
    margin: 2rem 0;
  }

  :global(.md-content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.25rem 0;
    font-size: 0.85rem;
  }

  :global(.md-content th) {
    font-family: 'Rajdhani', sans-serif;
    color: #F2E900;
    border-bottom: 1px solid rgba(2, 215, 242, 0.3);
    padding: 0.5rem 0.75rem;
    text-align: left;
    letter-spacing: 0.05em;
    font-size: 0.9rem;
  }

  :global(.md-content td) {
    border-bottom: 1px solid rgba(2, 215, 242, 0.1);
    padding: 0.45rem 0.75rem;
    color: rgba(2, 215, 242, 0.8);
  }

  :global(.md-content tr:hover td) {
    background: rgba(2, 215, 242, 0.04);
  }

  :global(.md-content img) {
    max-width: 100%;
    height: auto;
    border: 1px solid rgba(2, 215, 242, 0.3);
    box-shadow: 0 0 12px rgba(2, 215, 242, 0.15);
    display: block;
    margin: 1.25rem auto;
  }

  /* ── Code blocks ── */
  :global(.md-content pre) {
    position: relative;
    background: rgba(10, 10, 15, 0.9);
    border: 1px solid rgba(2, 215, 242, 0.25);
    border-radius: 2px;
    margin: 1.25rem 0;
    overflow-x: auto;
  }

  :global(.md-content pre::before) {
    content: '// OUTPUT';
    display: block;
    background: rgba(2, 215, 242, 0.06);
    border-bottom: 1px solid rgba(2, 215, 242, 0.15);
    color: rgba(2, 215, 242, 0.5);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    padding: 0.3rem 1rem;
  }

  :global(.md-content pre code) {
    display: block;
    padding: 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.82rem;
    line-height: 1.6;
    color: #25E1ED;
    background: none;
    border: none;
  }

  :global(.md-content code) {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85em;
    color: #F2E900;
    background: rgba(242, 233, 0, 0.08);
    padding: 0.1em 0.35em;
    border-radius: 2px;
  }

  /* Don't double-style code inside pre */
  :global(.md-content pre code) {
    color: #25E1ED;
    background: none;
    padding: 0;
  }

  /* Syntax highlight token colors */
  :global(.md-content .token.comment),
  :global(.md-content .token.prolog),
  :global(.md-content .token.doctype),
  :global(.md-content .token.cdata) {
    color: rgba(2, 215, 242, 0.4);
  }

  :global(.md-content .token.keyword),
  :global(.md-content .token.selector),
  :global(.md-content .token.important) {
    color: #ED1E79;
  }

  :global(.md-content .token.string),
  :global(.md-content .token.attr-value) {
    color: #F2E900;
  }

  :global(.md-content .token.number),
  :global(.md-content .token.boolean) {
    color: #25E1ED;
  }

  :global(.md-content .token.function),
  :global(.md-content .token.class-name) {
    color: #02D7F2;
  }

  :global(.md-content .token.operator),
  :global(.md-content .token.punctuation) {
    color: rgba(2, 215, 242, 0.6);
  }
</style>
