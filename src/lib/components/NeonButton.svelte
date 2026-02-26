<script lang="ts">
  export let label: string;
  export let variant: 'primary' | 'danger' = 'primary';
  export let disabled: boolean = false;
</script>

<button
  class="neon-btn neon-btn--{variant}"
  {disabled}
  on:click
>
  {label}
</button>

<style>
  .neon-btn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: transparent;
    border: 1px solid currentColor;
    padding: 0.5rem 1.25rem;
    cursor: pointer;
    position: relative;
    transition: box-shadow 0.2s ease, color 0.2s ease;
  }

  .neon-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .neon-btn:focus-visible {
    outline: 1px solid currentColor;
    outline-offset: 2px;
  }

  /* Primary — Iconic Yellow */
  .neon-btn--primary {
    color: #F2E900;
    box-shadow: 0 0 6px #F2E900, inset 0 0 6px rgba(242, 233, 0, 0.1);
  }

  .neon-btn--primary:not(:disabled):hover {
    box-shadow:
      0 0 12px #F2E900,
      0 0 24px rgba(242, 233, 0, 0.5),
      inset 0 0 12px rgba(242, 233, 0, 0.15);
    animation: neon-pulse-primary 0.8s ease infinite alternate;
  }

  /* Danger — Hot Red */
  .neon-btn--danger {
    color: #FF1111;
    box-shadow: 0 0 6px #FF1111, inset 0 0 6px rgba(255, 17, 17, 0.1);
  }

  .neon-btn--danger:not(:disabled):hover {
    box-shadow:
      0 0 12px #FF1111,
      0 0 24px rgba(255, 17, 17, 0.5),
      inset 0 0 12px rgba(255, 17, 17, 0.15);
    animation: neon-pulse-danger 0.8s ease infinite alternate;
  }

  @keyframes neon-pulse-primary {
    from { box-shadow: 0 0 12px #F2E900, 0 0 24px rgba(242,233,0,0.5), inset 0 0 12px rgba(242,233,0,0.15); }
    to   { box-shadow: 0 0 20px #F2E900, 0 0 40px rgba(242,233,0,0.7), inset 0 0 16px rgba(242,233,0,0.25); }
  }

  @keyframes neon-pulse-danger {
    from { box-shadow: 0 0 12px #FF1111, 0 0 24px rgba(255,17,17,0.5), inset 0 0 12px rgba(255,17,17,0.15); }
    to   { box-shadow: 0 0 20px #FF1111, 0 0 40px rgba(255,17,17,0.7), inset 0 0 16px rgba(255,17,17,0.25); }
  }
</style>
