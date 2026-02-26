<script lang="ts">
  import { onMount } from 'svelte';
  import LoadingBar from './LoadingBar.svelte';
  import NeonButton from './NeonButton.svelte';

  // ── Form state ────────────────────────────────────────────────────────────
  type FormState = 'idle' | 'submitting' | 'success' | 'error';
  let formState: FormState = 'idle';

  // ── Field values ──────────────────────────────────────────────────────────
  let name = '';
  let email = '';
  let subject = '';
  let message = '';

  // ── Validation errors ─────────────────────────────────────────────────────
  let errors: Record<string, string> = {};

  // ── Loading bar ───────────────────────────────────────────────────────────
  let loadingPercent = 0;
  let loadingInterval: ReturnType<typeof setInterval> | null = null;

  // ── Animated dots for uplink connecting text ──────────────────────────────
  let dots = '';
  let dotsInterval: ReturnType<typeof setInterval> | null = null;

  // ── Sequential field visibility ───────────────────────────────────────────
  let visibleFields = 1;

  // ── Glitch flash for success transition ───────────────────────────────────
  let glitchFlash = false;

  // ── Field refs for focus management ──────────────────────────────────────
  let nameInput: HTMLInputElement;
  let emailInput: HTMLInputElement;
  let subjectInput: HTMLInputElement;
  let messageInput: HTMLTextAreaElement;

  onMount(() => {
    // Focus the first input on mount
    nameInput?.focus();
  });

  function validate(): boolean {
    const e: Record<string, string> = {};

    if (name.trim().length < 2) {
      e.name = '// ERR: IDENTIFIER TOO SHORT (MIN 2 CHARS)';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = '// ERR: INVALID FREQUENCY FORMAT';
    }

    if (subject.trim().length < 3) {
      e.subject = '// ERR: SUBJECT TOO SHORT (MIN 3 CHARS)';
    }

    if (message.trim().length < 10) {
      e.message = '// ERR: MESSAGE TOO SHORT (MIN 10 CHARS)';
    }

    errors = e;
    return Object.keys(e).length === 0;
  }

  function startDots() {
    dots = '';
    dotsInterval = setInterval(() => {
      dots = dots.length >= 3 ? '' : dots + '.';
    }, 400);
  }

  function stopDots() {
    if (dotsInterval !== null) {
      clearInterval(dotsInterval);
      dotsInterval = null;
    }
    dots = '';
  }

  function startLoading() {
    loadingPercent = 0;
    const target = 100;
    const duration = 2500;
    const start = performance.now();

    loadingInterval = setInterval(() => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      loadingPercent = Math.round(progress * target);
      if (progress >= 1 && loadingInterval !== null) {
        clearInterval(loadingInterval);
        loadingInterval = null;
      }
    }, 50);
  }

  function stopLoading() {
    if (loadingInterval !== null) {
      clearInterval(loadingInterval);
      loadingInterval = null;
    }
  }

  async function handleSubmit() {
    if (!validate()) return;

    formState = 'submitting';
    startDots();
    startLoading();

    // Simulated network delay (2.5s)
    await new Promise<void>((resolve) => setTimeout(resolve, 2600));

    stopDots();
    stopLoading();
    loadingPercent = 100;

    // Brief pause to show 100% then flash
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    // Trigger glitch flash before success state
    glitchFlash = true;
    await new Promise<void>((resolve) => setTimeout(resolve, 220));
    glitchFlash = false;

    // Always succeed for demo (real backend integration deferred)
    formState = 'success';
  }

  function handleError() {
    formState = 'error';
  }

  function resetForm() {
    name = '';
    email = '';
    subject = '';
    message = '';
    errors = {};
    formState = 'idle';
    visibleFields = 1;
    loadingPercent = 0;
    stopDots();
    stopLoading();

    // Re-focus first field
    setTimeout(() => nameInput?.focus(), 50);
  }

  function handleFieldBlur(field: string) {
    // Advance visible fields on blur if the current one has content
    if (field === 'name' && name.trim().length >= 1 && visibleFields < 2) {
      visibleFields = 2;
      setTimeout(() => emailInput?.focus(), 50);
    } else if (field === 'email' && email.trim().length >= 1 && visibleFields < 3) {
      visibleFields = 3;
      setTimeout(() => subjectInput?.focus(), 50);
    } else if (field === 'subject' && subject.trim().length >= 1 && visibleFields < 4) {
      visibleFields = 4;
      setTimeout(() => messageInput?.focus(), 50);
    }
  }

  function handleFieldKeydown(e: KeyboardEvent, field: string) {
    if (e.key === 'Enter' && field !== 'message') {
      e.preventDefault();
      handleFieldBlur(field);
    }
  }
</script>

{#if glitchFlash}
  <div class="ct-glitch-flash" aria-hidden="true"></div>
{/if}

{#if formState === 'success'}
  <div class="ct-success" role="status">
    <p class="ct-success-line">// TRANSMISSION RECEIVED</p>
    <p class="ct-success-line ct-success-delay-1">// NEURAL ACK CONFIRMED</p>
    <p class="ct-success-line ct-success-delay-2">// SONGBIRD WILL RESPOND VIA ENCRYPTED CHANNEL</p>
    <div class="ct-success-action">
      <NeonButton label="[NEW TRANSMISSION]" variant="primary" on:click={resetForm} />
    </div>
  </div>

{:else if formState === 'error'}
  <div class="ct-error" role="alert">
    <p class="ct-err-line">// UPLINK FAILED — SIGNAL LOST</p>
    <p class="ct-err-sub">// CHECK FREQUENCY AND RETRY</p>
    <div class="ct-error-action">
      <NeonButton label="RETRY" variant="danger" on:click={resetForm} />
    </div>
  </div>

{:else}
  <form class="ct-form" on:submit|preventDefault={handleSubmit} novalidate>

    <!-- IDENTIFY -->
    <div class="ct-field ct-field--visible">
      <label class="ct-prompt" for="ct-name">
        <span class="ct-chevron">&gt;</span> IDENTIFY:
      </label>
      <input
        id="ct-name"
        bind:this={nameInput}
        bind:value={name}
        class="ct-input"
        class:ct-input--error={errors.name}
        type="text"
        autocomplete="name"
        placeholder="YOUR NAME"
        readonly={formState === 'submitting'}
        on:blur={() => handleFieldBlur('name')}
        on:keydown={(e) => handleFieldKeydown(e, 'name')}
      />
      {#if errors.name}
        <p class="ct-field-error" role="alert">{errors.name}</p>
      {/if}
    </div>

    <!-- FREQ -->
    {#if visibleFields >= 2}
      <div class="ct-field ct-field--slide-in">
        <label class="ct-prompt" for="ct-email">
          <span class="ct-chevron">&gt;</span> FREQ:
        </label>
        <input
          id="ct-email"
          bind:this={emailInput}
          bind:value={email}
          class="ct-input"
          class:ct-input--error={errors.email}
          type="email"
          autocomplete="email"
          placeholder="YOUR@EMAIL.NET"
          readonly={formState === 'submitting'}
          on:blur={() => handleFieldBlur('email')}
          on:keydown={(e) => handleFieldKeydown(e, 'email')}
        />
        {#if errors.email}
          <p class="ct-field-error" role="alert">{errors.email}</p>
        {/if}
      </div>
    {/if}

    <!-- SUBJECT -->
    {#if visibleFields >= 3}
      <div class="ct-field ct-field--slide-in">
        <label class="ct-prompt" for="ct-subject">
          <span class="ct-chevron">&gt;</span> SUBJECT:
        </label>
        <input
          id="ct-subject"
          bind:this={subjectInput}
          bind:value={subject}
          class="ct-input"
          class:ct-input--error={errors.subject}
          type="text"
          placeholder="MISSION DESCRIPTION"
          readonly={formState === 'submitting'}
          on:blur={() => handleFieldBlur('subject')}
          on:keydown={(e) => handleFieldKeydown(e, 'subject')}
        />
        {#if errors.subject}
          <p class="ct-field-error" role="alert">{errors.subject}</p>
        {/if}
      </div>
    {/if}

    <!-- MESSAGE -->
    {#if visibleFields >= 4}
      <div class="ct-field ct-field--slide-in">
        <label class="ct-prompt" for="ct-message">
          <span class="ct-chevron">&gt;</span> MESSAGE:
        </label>
        <textarea
          id="ct-message"
          bind:this={messageInput}
          bind:value={message}
          class="ct-textarea"
          class:ct-input--error={errors.message}
          rows="5"
          placeholder="ENCODE YOUR MESSAGE..."
          readonly={formState === 'submitting'}
        ></textarea>
        {#if errors.message}
          <p class="ct-field-error" role="alert">{errors.message}</p>
        {/if}
      </div>
    {/if}

    <!-- Submit / Loading -->
    {#if visibleFields >= 4}
      <div class="ct-submit-row">
        {#if formState === 'submitting'}
          <p class="ct-connecting" aria-live="polite">
            // UPLINK CONNECTING{dots}
          </p>
          <div class="ct-loading-bar-wrap">
            <LoadingBar percent={loadingPercent} label="TRANSMITTING PAYLOAD" duration={2500} />
          </div>
        {:else}
          <!-- Show all fields immediately so user can submit without tabbing through -->
          <NeonButton
            label="[BROADCAST]"
            variant="primary"
          />
        {/if}
      </div>
    {:else}
      <!-- Show hint when not all fields are visible yet -->
      {#if visibleFields < 4}
        <div class="ct-hint">
          // PRESS ENTER OR CLICK FIELD TO ADVANCE
        </div>
      {/if}
    {/if}

  </form>
{/if}

<style>
  /* ── Glitch flash ──────────────────────────────────────────────────────── */
  .ct-glitch-flash {
    position: fixed;
    inset: 0;
    z-index: 9998;
    pointer-events: none;
    animation: ct-flash-anim 220ms steps(1) forwards;
  }

  @keyframes ct-flash-anim {
    0%   { background: rgba(255,255,255,0.12); }
    20%  { background: rgba(2,215,242,0.15); }
    40%  { background: rgba(255,255,255,0.08); }
    60%  { background: rgba(237,30,121,0.1); }
    80%  { background: rgba(255,255,255,0.05); }
    100% { background: transparent; }
  }

  /* ── Form layout ─────────────────────────────────────────────────────── */
  .ct-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  /* ── Field wrapper ───────────────────────────────────────────────────── */
  .ct-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .ct-field--visible {
    opacity: 1;
  }

  .ct-field--slide-in {
    animation: ct-slide-in 300ms ease forwards;
  }

  @keyframes ct-slide-in {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ── Label / prompt ──────────────────────────────────────────────────── */
  .ct-prompt {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    color: rgba(2, 215, 242, 0.6);
    letter-spacing: 0.08em;
    user-select: none;
  }

  .ct-chevron {
    color: #25E1ED;
    margin-right: 0.25rem;
  }

  /* ── Inputs ───────────────────────────────────────────────────────────── */
  .ct-input,
  .ct-textarea {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1rem;
    color: #02D7F2;
    background: transparent;
    border: none;
    border-bottom: 1px solid #02D7F2;
    outline: none;
    padding: 0.4rem 0;
    letter-spacing: 0.05em;
    caret-color: #25E1ED;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
  }

  .ct-textarea {
    resize: vertical;
    border: 1px solid rgba(2, 215, 242, 0.4);
    padding: 0.5rem 0.75rem;
    margin-top: 0.25rem;
  }

  .ct-input:focus,
  .ct-textarea:focus {
    border-color: #25E1ED;
    box-shadow: 0 2px 0 0 rgba(37, 225, 237, 0.4);
  }

  .ct-textarea:focus {
    box-shadow: 0 0 0 1px rgba(37, 225, 237, 0.3), 0 0 8px rgba(37, 225, 237, 0.15);
  }

  .ct-input--error {
    border-color: #FF1111 !important;
    box-shadow: 0 2px 0 0 rgba(255, 17, 17, 0.4) !important;
  }

  .ct-input::placeholder,
  .ct-textarea::placeholder {
    color: rgba(2, 215, 242, 0.25);
    letter-spacing: 0.05em;
  }

  /* Blinking caret simulation via focus animation */
  @keyframes ct-cursor-blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  /* ── Validation errors ────────────────────────────────────────────────── */
  .ct-field-error {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.78rem;
    color: #FF1111;
    margin: 0;
    letter-spacing: 0.05em;
    text-shadow: 0 0 6px rgba(255, 17, 17, 0.5);
  }

  /* ── Hint ────────────────────────────────────────────────────────────── */
  .ct-hint {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: rgba(2, 215, 242, 0.35);
    letter-spacing: 0.06em;
  }

  /* ── Submit row ───────────────────────────────────────────────────────── */
  .ct-submit-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding-top: 0.5rem;
  }

  .ct-connecting {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.9rem;
    color: #25E1ED;
    margin: 0;
    letter-spacing: 0.08em;
    text-shadow: 0 0 8px rgba(37, 225, 237, 0.5);
  }

  .ct-loading-bar-wrap {
    width: 100%;
  }

  /* ── Success state ────────────────────────────────────────────────────── */
  .ct-success {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem 0;
  }

  .ct-success-line {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.05rem;
    color: #25E1ED;
    margin: 0;
    letter-spacing: 0.06em;
    text-shadow: 0 0 10px rgba(37, 225, 237, 0.6);
    animation: ct-success-in 400ms ease forwards;
    opacity: 0;
  }

  .ct-success-delay-1 {
    animation-delay: 300ms;
  }

  .ct-success-delay-2 {
    animation-delay: 600ms;
  }

  @keyframes ct-success-in {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .ct-success-action {
    margin-top: 1.5rem;
  }

  /* ── Error state ─────────────────────────────────────────────────────── */
  .ct-error {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 2rem 0;
  }

  .ct-err-line {
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.05rem;
    color: #FF1111;
    margin: 0;
    letter-spacing: 0.06em;
    text-shadow: 0 0 10px rgba(255, 17, 17, 0.5);
  }

  .ct-err-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    color: rgba(255, 17, 17, 0.7);
    margin: 0;
    letter-spacing: 0.05em;
  }

  .ct-error-action {
    margin-top: 1rem;
  }
</style>
