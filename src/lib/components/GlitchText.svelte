<script lang="ts">
  import { onMount } from 'svelte';
  import '../styles/glitch.css';

  export let text: string;
  export let tag: 'h1' | 'h2' | 'h3' | 'p' = 'h1';
  export let trigger: 'hover' | 'scroll' | 'always' = 'hover';

  let el: HTMLElement;

  function glitchObserver(node: HTMLElement) {
    if (trigger !== 'scroll') return {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add('glitch--active');
          } else {
            node.classList.remove('glitch--active');
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      }
    };
  }

  $: triggerClass =
    trigger === 'hover'  ? 'glitch--hover'  :
    trigger === 'always' ? 'glitch--always' :
    'glitch--scroll';
</script>

{#if tag === 'h1'}
  <h1
    class="glitch {triggerClass}"
    data-text={text}
    bind:this={el}
    use:glitchObserver
  >{text}</h1>
{:else if tag === 'h2'}
  <h2
    class="glitch {triggerClass}"
    data-text={text}
    bind:this={el}
    use:glitchObserver
  >{text}</h2>
{:else if tag === 'h3'}
  <h3
    class="glitch {triggerClass}"
    data-text={text}
    bind:this={el}
    use:glitchObserver
  >{text}</h3>
{:else}
  <p
    class="glitch {triggerClass}"
    data-text={text}
    bind:this={el}
    use:glitchObserver
  >{text}</p>
{/if}
