# Terminal Emulator — Design Spec

**Date:** 2026-04-17  
**Route:** `/` (root — replaces current vinyl page)  
**Vinyl page:** moves to `/vinyl`

---

## Overview

A full-viewport Fallout-style CRT terminal emulator at the site root. The entire page is the terminal — no chrome, no nav, no scroll. It presents a simulated ROBCO Industries shell with a fake filesystem full of Fallout-flavored lore content. Users interact via keyboard: type commands, navigate the filesystem, read lore files, discover a hidden config to change the color theme.

---

## Architecture

### Route Changes

- `src/routes/index.tsx` → becomes the terminal page entry point
- Current vinyl content moves to `src/routes/vinyl/index.tsx` + `src/routes/vinyl/route.tsx`

### File Structure

```
src/
  routes/
    index.tsx                        ← TerminalPage mount
    vinyl/
      route.tsx                      ← moved from root
      index.tsx                      ← moved from root
  components/terminal/
    TerminalPage.tsx                 ← full-viewport wrapper; manages boot→terminal transition
    BootSequence.tsx                 ← animated ROBCO boot screen
    TerminalScreen.tsx               ← scrollable output history + input line
    TerminalInput.tsx                ← current input with blinking block cursor
  lib/terminal/
    filesystem.ts                    ← fake FS as typed object tree (dirs + files with content)
    commands.ts                      ← command registry; maps command name → handler function
    useTerminal.ts                   ← state hook: input buffer, output history, cwd, command history (↑↓)
    theme.ts                         ← read/write color scheme; syncs CSS vars + localStorage
  styles/
    terminal.css                     ← all CRT effects, color tokens, layout

static/
  fonts/
    FixedsysExcelsior.woff2          ← self-hosted Fixedsys Excelsior web font
```

---

## Components

### `TerminalPage`
Top-level full-viewport container (`100vw × 100vh`, `overflow: hidden`). Renders `<BootSequence>` on first load; once boot completes, transitions to `<TerminalScreen>`. Applies the active color theme CSS custom properties to the root element.

### `BootSequence`
Plays the ROBCO Industries boot animation. Lines are revealed sequentially with short per-character typewriter delays. Progress bar (`[████████████]`) animates character by character. Total duration ~3 seconds. Fires an `onComplete` callback when done, triggering the switch to the interactive terminal.

Boot text:
```
ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL
COPYRIGHT 2075-2077 ROBCO INDUSTRIES
-----------------------------------------
> BIOS VERSION 2.3.0... OK
> CHECKING MEMORY... [████████████] 640K
> LOADING VAULT-TEC KERNEL... OK
> MOUNTING FILESYSTEM... OK
> AUTHENTICATING USER...
  WELCOME, VAULT DWELLER
-----------------------------------------
TYPE 'help' FOR AVAILABLE COMMANDS.
```

### `TerminalScreen`
Renders the full output history as a scrollable list of lines. Each line is typed text with appropriate color (normal output, error, system message). Auto-scrolls to bottom on new output. Renders `<TerminalInput>` pinned at the bottom.

### `TerminalInput`
Displays the current prompt (`C:\>`) and the live input buffer. Trailing `█` blinks via CSS keyframe. Captures `keydown` events: printable chars append to buffer, `Backspace` removes last char, `Enter` submits, `↑`/`↓` navigate command history, `Tab` completes file/dir names.

---

## Terminal Logic

### `useTerminal` Hook

State:
- `outputLines: Line[]` — all rendered output (each line has text + type: `output | error | system | prompt`)
- `inputBuffer: string` — current typed input
- `cwd: string` — current working directory path
- `historyStack: string[]` — submitted commands for ↑↓ recall
- `historyIndex: number` — current position in history stack

On `Enter`: appends `[prompt] <input>` to output, calls `executeCommand(input, cwd, fs)`, appends result lines, resets buffer.

### `commands.ts`

Command registry maps `string → (args: string[], ctx: CommandContext) => Line[]`.

| Command | Behavior |
|---|---|
| `ls [-la]` | List directory contents. `-a` reveals dotfiles (exposes `.terminal.conf`). |
| `cd <dir>` | Change directory. Supports `..`, relative and absolute paths. Error on missing dir. |
| `cat <file>` | Print file contents. Error on missing file or directory target. |
| `pwd` | Print current working directory. |
| `echo <text>` | Print arguments back as output. |
| `clear` | Clear all output history. |
| `help` | Print list of all commands with one-line descriptions. |
| `whoami` | Returns `VAULT_DWELLER_7`. |
| `date` | Returns vault-formatted date: `VAULT-TEC DATE: 2277.107 // SYSTEM TIME: <HH:MM>`. |
| `neofetch` | ASCII art system info block in Fallout style (see below). |
| `edit <file>` | Inline editor for `/etc/.terminal.conf` only. Prompts `COLOR_SCHEME=` and accepts a value. Applies immediately. |

`neofetch` output (ASCII art pip-boy silhouette + system stats):
```
  ██████╗ ██████╗ ██████╗   VAULT-TEC TERMLINK v2.3
  ██╔══██╗██╔══██╗██╔══██╗  -------------------------
  ██████╔╝██████╔╝██████╔╝  OS:       ROBCO KERNEL 2.3
  ██╔══██╗██╔══██╗██╔══██╗  HOST:     VAULT 111
  ██║  ██║██║  ██║██████╔╝  UPTIME:   211 YEARS
  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝   SHELL:    TERMLINK 1.0
                              MEMORY:   640K (SUFFICIENT)
                              THEME:    green
```

---

## Fake Filesystem

Represented as a typed JS object tree in `filesystem.ts`. Directories are `{ type: 'dir', children: Record<string, Node> }`. Files are `{ type: 'file', content: string }`. Dotfiles are included and only shown with `ls -a`.

```
/
├── etc/
│   └── .terminal.conf        ← COLOR_SCHEME=green
├── home/
│   └── vault_dweller/
│       ├── PERSONAL_LOG.txt  ← lore journal: first-person vault dweller entries
│       └── notes/
│           └── TODO.txt      ← humorous in-vault to-do list
├── var/
│   └── logs/
│       └── system.log        ← ROBCO system events log (automated entries)
├── vault/
│   ├── MANIFEST.txt          ← vault overview: purpose, capacity, overseer info
│   ├── residents/
│   │   └── roster.txt        ← redacted resident list with status codes
│   └── records/
│       └── incident_47.txt   ← ominous incident report, partially corrupted
└── ROBCO_README.txt          ← getting started hint, teases hidden files
```

---

## Color Theming

Defined via `/etc/.terminal.conf`. Discovered by running `ls -la /etc/`. Edited with `edit /etc/.terminal.conf`.

| Scheme | `--term-fg` | `--term-glow` |
|---|---|---|
| `green` (default) | `#39FF14` | `#39FF14` |
| `amber` | `#FFB000` | `#FF8C00` |
| `blue` | `#00BFFF` | `#0080FF` |
| `white` | `#E8E8E8` | `#FFFFFF` |

On change: `theme.ts` updates CSS custom properties on `:root` and persists to `localStorage` key `terminal-color-scheme`. On page load, saved scheme is restored before boot sequence plays.

---

## CRT Visual Design

**Font:** Fixedsys Excelsior (self-hosted `.woff2` in `/static/fonts/`), fallback `'Courier New', monospace`. All text uses this font — no exceptions.

**Base colors:**
- Background: `#0a0a0a`
- Foreground/glow: via `--term-fg` / `--term-glow` CSS vars (default green)

**Effects (all pure CSS):**
- **Phosphor glow:** `text-shadow: 0 0 6px var(--term-glow), 0 0 14px var(--term-glow)`
- **Scanlines:** `::before` pseudo on the screen container — `repeating-linear-gradient(transparent 0px, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)`, pointer-events none
- **Vignette:** `::after` pseudo — radial-gradient from transparent center to `rgba(0,0,0,0.6)` at corners
- **Flicker:** `@keyframes flicker` — subtle opacity oscillation (`1.0 → 0.97 → 1.0`) on a 5s loop with irregular steps
- **Cursor blink:** `@keyframes blink` — `visibility: visible` / `hidden` step at 0.75s interval on the `█` character

---

## Data Flow

```
keydown event
  → useTerminal: update inputBuffer
  → on Enter: executeCommand(input, cwd, fs)
    → commands.ts: parse argv, call handler
    → handler returns Line[]
  → outputLines updated → TerminalScreen re-renders → auto-scroll
  → if 'edit .terminal.conf': theme.ts updates CSS vars + localStorage
```

---

## Error Handling

- Unknown command: `'<cmd>': command not found`
- Missing file/dir: `cat: <path>: No such file or directory`
- Wrong type (e.g. `cat` on a dir): `cat: <path>: Is a directory`
- `edit` on non-config file: `edit: permission denied`
- All errors render as `type: 'error'` lines (same color, no special styling needed — Fallout terminals don't differentiate)

---

## Testing Considerations

- `commands.ts` handlers are pure functions (`args + ctx → Line[]`) — unit testable without React
- `filesystem.ts` tree is a plain object — traversal logic in `useTerminal` is independently testable
- `theme.ts` reads/writes localStorage — mock localStorage in tests
- No existing test suite in this project; no new test infrastructure added

---

## Out of Scope

- Actual shell execution (no Node.js subprocess, no `eval`)
- Multi-user or network features
- File creation/deletion commands (`touch`, `rm`, `mkdir`)
- Pipe (`|`), redirect (`>`), or glob (`*`) operators
- Mobile/touch input (keyboard-only terminal)
