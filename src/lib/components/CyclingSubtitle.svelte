<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  const roles: string[] = [
    '// HOME AUTOMATION ENGINEER',
    '// SYSTEMS ARCHITECT',
    '// NETWORK OPERATOR'
  ];

  const TYPE_SPEED = 30;   // ms per char while typing
  const ERASE_SPEED = 20;  // ms per char while erasing
  const HOLD_DURATION = 2000; // ms to hold full text

  let displayed = '';
  let cursorVisible = true;
  let roleIndex = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let cursorIntervalId: ReturnType<typeof setInterval> | null = null;

  function typeChar() {
    const target = roles[roleIndex];
    if (displayed.length < target.length) {
      displayed += target[displayed.length];
      timeoutId = setTimeout(typeChar, TYPE_SPEED);
    } else {
      timeoutId = setTimeout(eraseChar, HOLD_DURATION);
    }
  }

  function eraseChar() {
    if (displayed.length > 0) {
      displayed = displayed.slice(0, -1);
      timeoutId = setTimeout(eraseChar, ERASE_SPEED);
    } else {
      roleIndex = (roleIndex + 1) % roles.length;
      timeoutId = setTimeout(typeChar, 300);
    }
  }

  onMount(() => {
    timeoutId = setTimeout(typeChar, 600);
    cursorIntervalId = setInterval(() => {
      cursorVisible = !cursorVisible;
    }, 500);
  });

  onDestroy(() => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    if (cursorIntervalId !== null) clearInterval(cursorIntervalId);
  });
</script>

<span class="cycling-subtitle" aria-live="polite" aria-atomic="true" aria-label={displayed || 'loading role'}>
  {displayed}<span class="cursor" class:visible={cursorVisible}>█</span>
</span>

<style>
  .cycling-subtitle {
    font-family: 'Share Tech Mono', monospace;
    color: #25E1ED;
    font-size: clamp(0.85rem, 2vw, 1.1rem);
    letter-spacing: 0.04em;
    display: inline-block;
    min-height: 1.5em;
  }

  .cursor {
    display: inline-block;
    color: #25E1ED;
    opacity: 0;
    transition: opacity 0.05s;
  }

  .cursor.visible {
    opacity: 1;
  }
</style>
