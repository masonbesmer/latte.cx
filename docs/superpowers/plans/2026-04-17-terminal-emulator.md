# Terminal Emulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the root `/` route with a full-viewport Fallout-style ROBCO CRT terminal emulator, and move the existing vinyl dashboard to `/vinyl`.

**Architecture:** Pure React + custom CSS approach — command registry of pure functions, a typed fake filesystem object tree, a `useTerminal` hook for all state, and CRT effects via CSS pseudo-elements and keyframes. No new runtime dependencies.

**Tech Stack:** React 19, TanStack Router (file-based), TypeScript (strict), Vite, custom CSS (no Tailwind in terminal), Fixedsys Excelsior woff2 (self-hosted in `static/fonts/`)

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/lib/terminal/types.ts` | Shared types: `Line`, `LineType`, `ColorScheme`, `TerminalMode` |
| Create | `src/lib/terminal/filesystem.ts` | Fake FS typed object tree + `getNode` / `resolvePath` helpers |
| Create | `src/lib/terminal/theme.ts` | Load/apply/persist color scheme via CSS vars + localStorage |
| Create | `src/lib/terminal/commands.ts` | Command registry: pure `Handler` functions + `executeCommand` |
| Create | `src/lib/terminal/useTerminal.ts` | All terminal state: input, output, cwd, history, mode |
| Create | `src/styles/terminal.css` | CRT effects, color tokens, layout, animations |
| Create | `src/components/terminal/TerminalInput.tsx` | Hidden input + visible mirror + blinking `█` cursor |
| Create | `src/components/terminal/TerminalScreen.tsx` | Scrollable output history + pinned input row |
| Create | `src/components/terminal/BootSequence.tsx` | ROBCO boot animation, fires `onComplete` |
| Create | `src/components/terminal/TerminalPage.tsx` | Full-viewport wrapper, boot→terminal transition |
| Modify | `src/routes/index.tsx` | Replace vinyl with `<TerminalPage />` |
| Create | `src/routes/vinyl/index.tsx` | Vinyl dashboard moved to `/vinyl` |
| Download | `static/fonts/FixedsysExcelsior.woff2` | Self-hosted Fixedsys Excelsior font |

---

## Task 1: Download Font + Move Vinyl to `/vinyl`

**Files:**
- Download: `static/fonts/FixedsysExcelsior.woff2`
- Create: `src/routes/vinyl/index.tsx`

- [ ] **Step 1: Download Fixedsys Excelsior font**

```bash
mkdir -p static/fonts
curl -L "https://github.com/kika/fixedsys/raw/master/fonts/FSEX302.ttf" -o static/fonts/FixedsysExcelsior.ttf
# Convert TTF to WOFF2 using fonttools (if available):
#   pip install fonttools brotli && python -m fonttools ttLib.woff2 compress static/fonts/FixedsysExcelsior.ttf
# OR download the woff2 directly from the project releases:
curl -L "https://github.com/kika/fixedsys/raw/master/fonts/FSEX302.woff2" -o static/fonts/FixedsysExcelsior.woff2 2>/dev/null \
  || echo "WOFF2 not at that URL — place FixedsysExcelsior.woff2 manually in static/fonts/"
```

> **If curl fails:** Download from https://github.com/kika/fixedsys/releases and place the `.woff2` in `static/fonts/FixedsysExcelsior.woff2`. Vite's `publicDir: "static"` serves it at `/fonts/FixedsysExcelsior.woff2`.

- [ ] **Step 2: Create `src/routes/vinyl/index.tsx`**

Copy the full content of the current `src/routes/index.tsx` into the new file, then change the route path from `'/'` to `'/vinyl'`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ShelfHeader } from '../../components/vinyl/ShelfHeader'
import { RecordCrate } from '../../components/vinyl/RecordCrate'
import { Turntable } from '../../components/vinyl/Turntable'
import type { Service } from '../../lib/vinyl-data'
import '../../styles/vinyl.css'

export const Route = createFileRoute('/vinyl')({
  component: VinylDashboard,
})

function VinylDashboard() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  return (
    <main className="min-h-screen flex flex-col gap-4 p-4" style={{ background: 'var(--walnut)' }}>
      <ShelfHeader />
      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <h2
            className="px-4 font-bold tracking-widest uppercase"
            style={{ color: 'var(--amber)', fontSize: 13, letterSpacing: '0.25em' }}
          >
            ── The Crate ──
          </h2>
          <RecordCrate onServiceSelect={setSelectedService} selectedId={selectedService?.id ?? null} />
        </div>
        <div className="lg:w-80 flex flex-col gap-2 flex-shrink-0">
          <h2
            className="px-1 font-bold tracking-widest uppercase"
            style={{ color: 'var(--amber)', fontSize: 13, letterSpacing: '0.25em' }}
          >
            ── Turntable ──
          </h2>
          <Turntable service={selectedService} />
        </div>
      </div>
      <footer
        className="text-center py-2"
        style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: '0.2em' }}
      >
        VINYL CRATE DASHBOARD · HOMELAB EDITION ·{' '}
        {selectedService ? `${selectedService.name.toUpperCase()} SELECTED` : 'ALL SYSTEMS MONITORED'}
      </footer>
    </main>
  )
}
```

- [ ] **Step 3: Verify TypeScript and build pass**

```bash
npx tsc --noEmit
```

Expected: no errors (TanStack Router will auto-update `routeTree.gen.ts` on dev/build).

- [ ] **Step 4: Commit**

```bash
git add static/fonts/ src/routes/vinyl/index.tsx
git commit -m "feat: move vinyl dashboard to /vinyl, add Fixedsys Excelsior font"
```

---

## Task 2: Shared Types + Filesystem

**Files:**
- Create: `src/lib/terminal/types.ts`
- Create: `src/lib/terminal/filesystem.ts`

- [ ] **Step 1: Create `src/lib/terminal/types.ts`**

```typescript
export type LineType = 'output' | 'error' | 'system' | 'prompt'

export interface Line {
  id: string
  text: string
  type: LineType
}

export type ColorScheme = 'green' | 'amber' | 'blue' | 'white'

export type TerminalMode = 'command' | 'editing'
```

- [ ] **Step 2: Create `src/lib/terminal/filesystem.ts`**

```typescript
export interface FileNode {
  type: 'file'
  content: string
}

export interface DirNode {
  type: 'dir'
  children: Record<string, FSNode>
}

export type FSNode = FileNode | DirNode

export const filesystem: DirNode = {
  type: 'dir',
  children: {
    etc: {
      type: 'dir',
      children: {
        '.terminal.conf': {
          type: 'file',
          content: 'COLOR_SCHEME=green\n',
        },
      },
    },
    home: {
      type: 'dir',
      children: {
        vault_dweller: {
          type: 'dir',
          children: {
            'PERSONAL_LOG.txt': {
              type: 'file',
              content: `PERSONAL LOG — VAULT DWELLER 7
================================

DAY 1
Woke up in the cryopod. The others are still frozen. Overseer says
it's a "routine maintenance cycle." Something doesn't feel right.
The lights on Level B keep flickering.

DAY 47
Found a terminal on Level C with restricted access. Managed to
get in using the default password. There are... records here.
I shouldn't have read them. I need to get out.

DAY 103
The Overseer has been watching me. I've been more careful.
The exit is on Level D. I found the keycard hint in Incident Report 47.
Don't trust the water recycler readings. They're falsified.

[ENTRY CORRUPTED]
[ENTRY CORRUPTED]

DAY ???
If you're reading this, the terminal is still running.
That means I didn't make it out.
There's nothing left to say.
`,
            },
            notes: {
              type: 'dir',
              children: {
                'TODO.txt': {
                  type: 'file',
                  content: `VAULT DWELLER TODO LIST
=======================

[x] Survive cryosleep
[ ] Figure out what year it is
[ ] Fix water recycler on Level B
    (maintenance is... unavailable)
[ ] Find out why Level D is locked
[ ] Stop eating Vault-Tec brand "NUTRIENT PASTE"
    (what IS in this stuff)
[ ] Learn to tolerate radroaches
    (they're the only other company down here)
[ ] Send distress signal
    (to whom? unclear. send it anyway)
[ ] Read entire ROBCO terminal manual
    (page 1 complete. page 2: "see page 1")
`,
                },
              },
            },
          },
        },
      },
    },
    var: {
      type: 'dir',
      children: {
        logs: {
          type: 'dir',
          children: {
            'system.log': {
              type: 'file',
              content: `[2077-10-23 07:12:01] SYSTEM BOOT OK
[2077-10-23 07:12:03] VAULT DOOR SEALED — EXTERNAL DETONATION DETECTED
[2077-10-23 07:12:05] CRYOSLEEP INITIATED FOR 1030 RESIDENTS
[2077-10-23 07:14:22] WARNING: EXTERNAL RADIATION LEVELS CRITICAL
[2077-10-23 07:14:22] SURFACE ACCESS LOCKED INDEFINITELY
[2077-10-23 08:01:00] AUTOMATED SYSTEMS NOMINAL
[2077-10-23 08:01:00] ESTIMATED RESURFACING: 20 YEARS (REVISED: 200 YEARS)
[2150-04-01 03:22:11] SECTOR B WATER RECYCLER FAULT — LOGGED, NO ACTION TAKEN
[2200-01-15 11:05:44] CRYOPOD 7 MALFUNCTION — RESIDENT THAWED PREMATURELY
[2200-01-15 11:05:45] OVERSEER ALERTED
[2200-01-15 11:05:46] INCIDENT REPORT 47 FILED
[2200-01-15 11:07:00] LOG ACCESS RESTRICTED — INCIDENT 47
[2277-03-07 09:18:33] ANOMALOUS TERMINAL ACCESS — LEVEL C
[2277-03-07 09:18:34] USER: VAULT_DWELLER_7
[2277-03-07 09:18:34] WARNING ISSUED. MONITORING INCREASED.
[2277-04-17 00:00:00] SYSTEM HEARTBEAT OK
`,
            },
          },
        },
      },
    },
    vault: {
      type: 'dir',
      children: {
        'MANIFEST.txt': {
          type: 'file',
          content: `VAULT-TEC CORPORATION
VAULT 111 — FACILITY MANIFEST
==============================

CLASSIFICATION:  SOCIAL EXPERIMENT — TYPE 7-B
PURPOSE:         CRYOGENIC PRESERVATION STUDY
CAPACITY:        1000 RESIDENTS (ACTUAL: 1030 — SEE INCIDENT 12)
OVERSEER:        [REDACTED]
CONSTRUCTION:    2070
SEALED:          OCTOBER 23, 2077

EXPERIMENT PARAMETERS:
  - RESIDENTS FROZEN INDEFINITELY, NO SCHEDULED WAKE DATE
  - ONE RESIDENT TO BE THAWED PERIODICALLY FOR OBSERVATION
  - RESULTS TO BE REPORTED TO VAULT-TEC REGIONAL OFFICE
    (NOTE: REGIONAL OFFICE NO LONGER EXISTS)

CURRENT STATUS:  AUTONOMOUS OPERATION
OVERSEER STATUS: [REDACTED]
SURFACE STATUS:  UNINHABITABLE (ESTIMATED)

"A BETTER TOMORROW — UNDERGROUND"
  — VAULT-TEC MOTTO, CIRCA 2073
`,
        },
        residents: {
          type: 'dir',
          children: {
            'roster.txt': {
              type: 'file',
              content: `VAULT 111 RESIDENT ROSTER
==========================
[CLASSIFIED — OVERSEER ACCESS ONLY]

PARTIAL DATA (DECLASSIFIED 2200-01-01):

  ID   | NAME                    | STATUS
  -----|-------------------------|------------------
  001  | [REDACTED]              | CRYOSLEEP
  002  | [REDACTED]              | CRYOSLEEP
  003  | [REDACTED]              | CRYOSLEEP
  ...
  007  | VAULT_DWELLER_7         | ACTIVE (SEE INC. 47)
  ...
  1030 | [REDACTED]              | [REDACTED]

TOTAL CRYOSLEEP: 1029
TOTAL ACTIVE:    1
TOTAL DECEASED:  [REDACTED]

FOR FULL ROSTER, PRESENT OVERSEER KEYCARD AT TERMINAL B-3.
`,
            },
          },
        },
        records: {
          type: 'dir',
          children: {
            'incident_47.txt': {
              type: 'file',
              content: `INCIDENT REPORT #47
VAULT-TEC INTERNAL DOCUMENT
============================

DATE:      2200-01-15
FILED BY:  AUTOMATED SYSTEM (OVERSEER OFFLINE)
TYPE:      UNSCHEDULED CRYOPOD ACTIVATION

DESCRIPTION:
Cryopod unit #7 experienced an unexplained thermal fault at 11:05:44,
resulting in the premature thawing of resident VAULT_DWELLER_7.
Resident is ambulatory and cognitively functional.
Resident has been briefed on [TEXT CORRUPTED ████████████████████].

CONTAINMENT:
Resident assigned to [TEXT CORRUPTED ██████].
Terminal access granted: LEVEL C AND BELOW.
Level D access: DENIED.

NOTES FROM OVERSEER:
[TEXT CORRUPTED ████████████████████████████████████████████████████]
[TEXT CORRUPTED ████████████████████████████████████████████████████]
[TEXT CORRUPTED ████████████████████████]

FOLLOW-UP REQUIRED: YES
FOLLOW-UP DATE:     [TEXT CORRUPTED]
REPORT STATUS:      SEALED
`,
            },
          },
        },
      },
    },
    'ROBCO_README.txt': {
      type: 'file',
      content: `ROBCO INDUSTRIES TERMLINK v2.3
==============================

WELCOME, VAULT DWELLER.

You are now connected to the VAULT 111 local network terminal.
This terminal provides access to vault records and system logs.

GETTING STARTED:
  Type 'help' to list available commands.
  Type 'ls'   to list files in the current directory.
  Type 'cat <filename>' to read a file.
  Type 'cd <directory>' to navigate directories.

HINT: Some files are hidden. Try 'ls -a' in certain directories.

VAULT-TEC CORPORATION IS NOT RESPONSIBLE FOR:
  - Existential dread caused by system logs
  - Information found in sealed incident reports
  - The water. Just don't drink the water.
`,
    },
  },
}

export function resolvePath(cwd: string, target: string): string {
  if (target.startsWith('/')) return normalizePath(target)
  const parts = cwd === '/' ? [] : cwd.split('/').filter(Boolean)
  for (const segment of target.split('/')) {
    if (segment === '..') parts.pop()
    else if (segment !== '.') parts.push(segment)
  }
  return '/' + parts.join('/')
}

function normalizePath(p: string): string {
  const parts = p.split('/').filter(Boolean)
  const out: string[] = []
  for (const part of parts) {
    if (part === '..') out.pop()
    else if (part !== '.') out.push(part)
  }
  return '/' + out.join('/')
}

export function getNode(path: string, fs: DirNode = filesystem): FSNode | null {
  if (path === '/') return fs
  const parts = path.split('/').filter(Boolean)
  let current: FSNode = fs
  for (const part of parts) {
    if (current.type !== 'dir') return null
    const child = current.children[part]
    if (!child) return null
    current = child
  }
  return current
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/terminal/types.ts src/lib/terminal/filesystem.ts
git commit -m "feat: add terminal types and fake filesystem"
```

---

## Task 3: Theme Module

**Files:**
- Create: `src/lib/terminal/theme.ts`

- [ ] **Step 1: Create `src/lib/terminal/theme.ts`**

```typescript
import type { ColorScheme } from './types'

export const SCHEMES: Record<ColorScheme, { fg: string; glow: string }> = {
  green: { fg: '#39FF14', glow: '#39FF14' },
  amber: { fg: '#FFB000', glow: '#FF8C00' },
  blue:  { fg: '#00BFFF', glow: '#0080FF' },
  white: { fg: '#E8E8E8', glow: '#FFFFFF' },
}

const STORAGE_KEY = 'terminal-color-scheme'

export function isValidScheme(value: string): value is ColorScheme {
  return Object.keys(SCHEMES).includes(value)
}

export function loadScheme(): ColorScheme {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved && isValidScheme(saved) ? saved : 'green'
}

export function applyScheme(scheme: ColorScheme): void {
  const { fg, glow } = SCHEMES[scheme]
  document.documentElement.style.setProperty('--term-fg', fg)
  document.documentElement.style.setProperty('--term-glow', glow)
  localStorage.setItem(STORAGE_KEY, scheme)
}

export function getSchemeFromConfig(content: string): ColorScheme | null {
  const match = content.match(/COLOR_SCHEME=(\w+)/)
  if (!match) return null
  const val = match[1]
  return isValidScheme(val) ? val : null
}

export function updateConfigContent(content: string, scheme: ColorScheme): string {
  return content.replace(/COLOR_SCHEME=\w+/, `COLOR_SCHEME=${scheme}`)
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/terminal/theme.ts
git commit -m "feat: add terminal theme module"
```

---

## Task 4: Command Registry

**Files:**
- Create: `src/lib/terminal/commands.ts`

- [ ] **Step 1: Create `src/lib/terminal/commands.ts`**

```typescript
import type { Line, LineType, ColorScheme } from './types'
import type { DirNode } from './filesystem'
import { getNode, resolvePath } from './filesystem'

export interface CommandContext {
  cwd: string
  fs: DirNode
  scheme: ColorScheme
}

export interface CommandResult {
  lines: Line[]
  newCwd?: string
  edit?: boolean
  clear?: boolean
}

type Handler = (args: string[], ctx: CommandContext) => CommandResult

let _lineId = 0
function mkLine(text: string, type: LineType): Line {
  return { id: String(_lineId++), text, type }
}
function out(text: string): Line { return mkLine(text, 'output') }
function err(text: string): Line { return mkLine(text, 'error') }
function sys(text: string): Line { return mkLine(text, 'system') }

const commands: Record<string, Handler> = {
  help: () => ({
    lines: [
      out('Available commands:'),
      out('  ls [-la]         List directory contents'),
      out('  cd <dir>         Change directory'),
      out('  cat <file>       Print file contents'),
      out('  pwd              Print working directory'),
      out('  echo <text>      Print text'),
      out('  clear            Clear terminal output'),
      out('  whoami           Print current user'),
      out('  date             Print vault date and time'),
      out('  neofetch         System information'),
      out('  edit <file>      Edit /etc/.terminal.conf'),
      out('  help             Show this help'),
    ],
  }),

  pwd: (_args, ctx) => ({ lines: [out(ctx.cwd)] }),

  whoami: () => ({ lines: [out('VAULT_DWELLER_7')] }),

  date: () => {
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    const start = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
    return {
      lines: [out(`VAULT-TEC DATE: 2277.${String(dayOfYear).padStart(3, '0')} // SYSTEM TIME: ${hh}:${mm}`)],
    }
  },

  echo: (args) => ({ lines: [out(args.join(' '))] }),

  clear: () => ({ lines: [], clear: true }),

  ls: (args, ctx) => {
    const flags = new Set(
      args.filter(a => a.startsWith('-')).flatMap(a => a.slice(1).split('')),
    )
    const showHidden = flags.has('a')
    const showLong = flags.has('l')

    const targetArg = args.find(a => !a.startsWith('-'))
    const targetPath = targetArg ? resolvePath(ctx.cwd, targetArg) : ctx.cwd
    const node = getNode(targetPath, ctx.fs)

    if (!node) return { lines: [err(`ls: ${targetPath}: No such file or directory`)] }

    if (node.type === 'file') {
      const name = targetPath.split('/').pop() ?? targetPath
      return {
        lines: showLong
          ? [out(`-rw-r--r-- ${String(node.content.length).padStart(6)} ${name}`)]
          : [out(name)],
      }
    }

    const entries = Object.entries(node.children)
      .filter(([name]) => showHidden || !name.startsWith('.'))
      .sort(([a], [b]) => a.localeCompare(b))

    if (entries.length === 0) return { lines: [] }

    const lines = entries.map(([name, child]) => {
      const isDir = child.type === 'dir'
      const display = isDir ? name + '/' : name
      if (showLong) {
        const size = isDir ? '     -' : String((child as { content: string }).content.length).padStart(6)
        const prefix = isDir ? 'd' : '-'
        return out(`${prefix}rw-r--r-- ${size} ${display}`)
      }
      return out(display)
    })

    return { lines }
  },

  cd: (args, ctx) => {
    if (!args[0]) return { lines: [], newCwd: '/home/vault_dweller' }
    const target = resolvePath(ctx.cwd, args[0])
    const node = getNode(target, ctx.fs)
    if (!node) return { lines: [err(`cd: ${args[0]}: No such file or directory`)] }
    if (node.type === 'file') return { lines: [err(`cd: ${args[0]}: Not a directory`)] }
    return { lines: [], newCwd: target }
  },

  cat: (args, ctx) => {
    if (!args[0]) return { lines: [err('cat: missing operand')] }
    const target = resolvePath(ctx.cwd, args[0])
    const node = getNode(target, ctx.fs)
    if (!node) return { lines: [err(`cat: ${target}: No such file or directory`)] }
    if (node.type === 'dir') return { lines: [err(`cat: ${target}: Is a directory`)] }
    return { lines: node.content.split('\n').map(line => out(line)) }
  },

  edit: (args) => {
    if (!args[0]) return { lines: [err('edit: missing file argument')] }
    const t = args[0]
    if (t !== '/etc/.terminal.conf' && t !== '.terminal.conf') {
      return { lines: [err('edit: permission denied')] }
    }
    return { lines: [], edit: true }
  },

  neofetch: (_args, ctx) => ({
    lines: [
      out('  ██████╗ ██████╗ ██████╗   VAULT-TEC TERMLINK v2.3'),
      out('  ██╔══██╗██╔══██╗██╔══██╗  -------------------------'),
      out('  ██████╔╝██████╔╝██████╔╝  OS:       ROBCO KERNEL 2.3'),
      out('  ██╔══██╗██╔══██╗██╔══██╗  HOST:     VAULT 111'),
      out('  ██║  ██║██║  ██║██████╔╝  UPTIME:   211 YEARS'),
      out('  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝   SHELL:    TERMLINK 1.0'),
      out('                              MEMORY:   640K (SUFFICIENT)'),
      out(`                              THEME:    ${ctx.scheme}`),
    ],
  }),
}

export function executeCommand(
  input: string,
  cwd: string,
  fs: DirNode,
  scheme: ColorScheme,
): CommandResult {
  const trimmed = input.trim()
  if (!trimmed) return { lines: [] }

  const [cmd, ...args] = trimmed.split(/\s+/)
  const handler = commands[cmd]

  if (!handler) {
    return { lines: [mkLine(`'${cmd}': command not found`, 'error')] }
  }

  return handler(args, { cwd, fs, scheme })
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/terminal/commands.ts
git commit -m "feat: add terminal command registry"
```

---

## Task 5: `useTerminal` Hook

**Files:**
- Create: `src/lib/terminal/useTerminal.ts`

- [ ] **Step 1: Create `src/lib/terminal/useTerminal.ts`**

```typescript
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { ColorScheme, Line, LineType, TerminalMode } from './types'
import type { DirNode } from './filesystem'
import { filesystem, getNode, resolvePath } from './filesystem'
import { executeCommand } from './commands'
import { applyScheme, isValidScheme, loadScheme, updateConfigContent } from './theme'

let _id = 0
function mkLine(text: string, type: LineType): Line {
  return { id: String(_id++), text, type }
}

interface State {
  outputLines: Line[]
  inputBuffer: string
  cwd: string
  historyStack: string[]
  historyIndex: number
  mode: TerminalMode
  scheme: ColorScheme
}

export function useTerminal() {
  // Mutable copy of the filesystem so `edit` can write back to .terminal.conf
  const fsRef = useRef<DirNode>(JSON.parse(JSON.stringify(filesystem)) as DirNode)

  const [state, setState] = useState<State>({
    outputLines: [],
    inputBuffer: '',
    cwd: '/home/vault_dweller',
    historyStack: [],
    historyIndex: -1,
    mode: 'command',
    scheme: loadScheme(),
  })

  useLayoutEffect(() => {
    applyScheme(state.scheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const setInputBuffer = useCallback((value: string) => {
    setState(prev => ({ ...prev, inputBuffer: value }))
  }, [])

  const submit = useCallback((input: string) => {
    setState(prev => {
      const promptLine = mkLine(
        prev.mode === 'editing' ? `> ${input}` : `C:\\> ${input}`,
        'prompt',
      )

      // ── EDITING MODE ──────────────────────────────────────────────────
      if (prev.mode === 'editing') {
        const trimmed = input.trim()

        if (trimmed === '') {
          return {
            ...prev,
            outputLines: [...prev.outputLines, promptLine, mkLine('Edit cancelled.', 'system')],
            inputBuffer: '',
            mode: 'command',
          }
        }

        if (!isValidScheme(trimmed)) {
          return {
            ...prev,
            outputLines: [
              ...prev.outputLines,
              promptLine,
              mkLine(`ERROR: '${trimmed}' is not a valid scheme.`, 'error'),
              mkLine('Valid values: green  amber  blue  white', 'error'),
              mkLine('ENTER NEW VALUE FOR COLOR_SCHEME:', 'system'),
            ],
            inputBuffer: '',
            // stays in editing mode
          }
        }

        const newScheme = trimmed as ColorScheme
        applyScheme(newScheme)

        const confNode = getNode('/etc/.terminal.conf', fsRef.current)
        if (confNode?.type === 'file') {
          confNode.content = updateConfigContent(confNode.content, newScheme)
        }

        return {
          ...prev,
          outputLines: [
            ...prev.outputLines,
            promptLine,
            mkLine(`COLOR_SCHEME set to '${newScheme}'. Theme applied.`, 'system'),
          ],
          inputBuffer: '',
          mode: 'command',
          scheme: newScheme,
        }
      }

      // ── COMMAND MODE ──────────────────────────────────────────────────
      const trimmed = input.trim()

      const nextHistory = trimmed
        ? [trimmed, ...prev.historyStack]
        : prev.historyStack

      if (!trimmed) {
        return { ...prev, outputLines: [...prev.outputLines, promptLine], inputBuffer: '', historyIndex: -1 }
      }

      const result = executeCommand(trimmed, prev.cwd, fsRef.current, prev.scheme)

      if (result.clear) {
        return { ...prev, outputLines: [], inputBuffer: '', historyStack: nextHistory, historyIndex: -1 }
      }

      const newLines: Line[] = [
        promptLine,
        ...result.lines.map(l => mkLine(l.text, l.type)),
      ]

      if (result.edit) {
        const confNode = getNode('/etc/.terminal.conf', fsRef.current)
        const confContent = confNode?.type === 'file' ? confNode.content.trimEnd() : ''
        return {
          ...prev,
          outputLines: [
            ...prev.outputLines,
            ...newLines,
            mkLine(confContent, 'output'),
            mkLine('', 'output'),
            mkLine('ENTER NEW VALUE FOR COLOR_SCHEME (green / amber / blue / white):', 'system'),
            mkLine('(empty input to cancel)', 'system'),
          ],
          inputBuffer: '',
          historyStack: nextHistory,
          historyIndex: -1,
          cwd: result.newCwd ?? prev.cwd,
          mode: 'editing',
        }
      }

      return {
        ...prev,
        outputLines: [...prev.outputLines, ...newLines],
        inputBuffer: '',
        historyStack: nextHistory,
        historyIndex: -1,
        cwd: result.newCwd ?? prev.cwd,
      }
    })
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setState(prev => {
        if (prev.historyStack.length === 0) return prev
        const newIndex = Math.min(prev.historyIndex + 1, prev.historyStack.length - 1)
        return { ...prev, historyIndex: newIndex, inputBuffer: prev.historyStack[newIndex] }
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setState(prev => {
        if (prev.historyIndex <= 0) return { ...prev, historyIndex: -1, inputBuffer: '' }
        const newIndex = prev.historyIndex - 1
        return { ...prev, historyIndex: newIndex, inputBuffer: prev.historyStack[newIndex] }
      })
    }
  }, [])

  const handleTab = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      setState(prev => {
        const parts = prev.inputBuffer.split(' ')
        const lastPart = parts[parts.length - 1]
        if (!lastPart) return prev

        const slashIdx = lastPart.lastIndexOf('/')
        const dirPath =
          slashIdx !== -1
            ? resolvePath(prev.cwd, lastPart.substring(0, slashIdx) || '/')
            : prev.cwd
        const prefix = slashIdx !== -1 ? lastPart.substring(slashIdx + 1) : lastPart

        const node = getNode(dirPath, fsRef.current)
        if (!node || node.type !== 'dir') return prev

        const matches = Object.keys(node.children).filter(name => name.startsWith(prefix))
        if (matches.length === 0) return prev

        if (matches.length === 1) {
          const completed = matches[0]
          const isDir = node.children[completed].type === 'dir'
          const base = slashIdx !== -1 ? lastPart.substring(0, slashIdx + 1) : ''
          parts[parts.length - 1] = base + completed + (isDir ? '/' : '')
          return { ...prev, inputBuffer: parts.join(' ') }
        }

        // Multiple matches — show them
        const promptLine = mkLine(`C:\\> ${prev.inputBuffer}`, 'prompt')
        const matchLine = mkLine(matches.join('  '), 'output')
        return { ...prev, outputLines: [...prev.outputLines, promptLine, matchLine] }
      })
    },
    [],
  )

  return {
    outputLines: state.outputLines,
    inputBuffer: state.inputBuffer,
    cwd: state.cwd,
    mode: state.mode,
    scheme: state.scheme,
    setInputBuffer,
    submit,
    handleKeyDown,
    handleTab,
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/terminal/useTerminal.ts
git commit -m "feat: add useTerminal state hook"
```

---

## Task 6: Terminal CSS

**Files:**
- Create: `src/styles/terminal.css`

- [ ] **Step 1: Create `src/styles/terminal.css`**

```css
@font-face {
  font-family: 'FixedsysExcelsior';
  src: url('/fonts/FixedsysExcelsior.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* ── Tokens ──────────────────────────────────────────────────────── */
:root {
  --term-fg:  #39FF14;
  --term-glow: #39FF14;
  --term-bg:  #0a0a0a;
  --term-font: 'FixedsysExcelsior', 'Courier New', monospace;
  --term-size: 16px;
  --term-lh: 1.5;
}

/* ── Root ────────────────────────────────────────────────────────── */
.term-root {
  width: 100vw;
  height: 100vh;
  background: var(--term-bg);
  display: flex;
  overflow: hidden;
  font-family: var(--term-font);
  font-size: var(--term-size);
  color: var(--term-fg);
}

/* ── Screen wrapper (scanlines + vignette live here) ─────────────── */
.term-screen-wrap {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: flicker 5s ease-in-out infinite;
}

/* Scanlines overlay */
.term-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.18) 3px,
    rgba(0, 0, 0, 0.18) 4px
  );
}

/* Vignette overlay */
.term-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 11;
  background: radial-gradient(
    ellipse at center,
    transparent 55%,
    rgba(0, 0, 0, 0.65) 100%
  );
}

/* ── Animations ──────────────────────────────────────────────────── */
@keyframes flicker {
  0%   { opacity: 1.0; }
  5%   { opacity: 0.97; }
  10%  { opacity: 1.0; }
  58%  { opacity: 1.0; }
  63%  { opacity: 0.98; }
  68%  { opacity: 1.0; }
  100% { opacity: 1.0; }
}

@keyframes blink {
  0%, 49% { visibility: visible; }
  50%, 100% { visibility: hidden; }
}

/* ── Shared text glow ────────────────────────────────────────────── */
.term-glow {
  text-shadow: 0 0 6px var(--term-glow), 0 0 14px var(--term-glow);
}

/* ── Boot sequence ───────────────────────────────────────────────── */
.term-boot {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px 40px;
  overflow: hidden;
}

/* ── Terminal screen (output + input) ────────────────────────────── */
.term-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px 40px 24px;
  overflow: hidden;
  outline: none;
}

.term-output {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--term-fg) var(--term-bg);
  padding-bottom: 8px;
}

/* ── Lines ───────────────────────────────────────────────────────── */
.term-line {
  font-family: var(--term-font);
  font-size: var(--term-size);
  line-height: var(--term-lh);
  color: var(--term-fg);
  text-shadow: 0 0 6px var(--term-glow), 0 0 14px var(--term-glow);
  white-space: pre-wrap;
  word-break: break-all;
  min-height: calc(var(--term-size) * var(--term-lh));
}

.term-line--error  { opacity: 0.6; }
.term-line--prompt { opacity: 0.8; }
.term-line--system { opacity: 0.95; }
.term-line--output { opacity: 1.0; }

/* ── Input row ───────────────────────────────────────────────────── */
.term-input-row {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding-top: 4px;
}

.term-prompt-label {
  font-family: var(--term-font);
  font-size: var(--term-size);
  line-height: var(--term-lh);
  color: var(--term-fg);
  text-shadow: 0 0 6px var(--term-glow), 0 0 14px var(--term-glow);
  white-space: pre;
  user-select: none;
  flex-shrink: 0;
}

/* Mirror + hidden input container */
.term-input-field {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

/*
 * The real <input> is invisible; it captures keyboard events.
 * The mirror <span> shows the visible text with glow.
 */
.term-input-real {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: transparent;
  caret-color: transparent;
  font-family: var(--term-font);
  font-size: var(--term-size);
  padding: 0;
  margin: 0;
  z-index: 2;
}

.term-input-mirror {
  font-family: var(--term-font);
  font-size: var(--term-size);
  line-height: var(--term-lh);
  color: var(--term-fg);
  text-shadow: 0 0 6px var(--term-glow), 0 0 14px var(--term-glow);
  white-space: pre;
  pointer-events: none;
  display: flex;
  align-items: center;
}

/* ── Cursor ──────────────────────────────────────────────────────── */
.term-cursor {
  font-family: var(--term-font);
  font-size: var(--term-size);
  color: var(--term-fg);
  text-shadow: 0 0 6px var(--term-glow), 0 0 14px var(--term-glow);
  animation: blink 0.75s step-end infinite;
  flex-shrink: 0;
  line-height: var(--term-lh);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/terminal.css
git commit -m "feat: add terminal CRT CSS"
```

---

## Task 7: `TerminalInput` Component

**Files:**
- Create: `src/components/terminal/TerminalInput.tsx`

- [ ] **Step 1: Create `src/components/terminal/TerminalInput.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import type { TerminalMode } from '../../lib/terminal/types'

interface TerminalInputProps {
  value: string
  mode: TerminalMode
  onChange: (v: string) => void
  onSubmit: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onTab: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function TerminalInput({
  value, mode, onChange, onSubmit, onKeyDown, onTab,
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the hidden input on mount and whenever mode changes
  useEffect(() => {
    inputRef.current?.focus()
  }, [mode])

  const promptLabel = mode === 'editing' ? '> ' : 'C:\\> '

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab') {
      onTab(e)
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit(value)
      return
    }
    onKeyDown(e)
  }

  return (
    <div
      className="term-input-row"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="term-prompt-label">{promptLabel}</span>
      <div className="term-input-field">
        <input
          ref={inputRef}
          className="term-input-real"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="terminal input"
        />
        <span className="term-input-mirror" aria-hidden="true">
          {value}
          <span className="term-cursor">█</span>
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/terminal/TerminalInput.tsx
git commit -m "feat: add TerminalInput component"
```

---

## Task 8: `TerminalScreen` Component

**Files:**
- Create: `src/components/terminal/TerminalScreen.tsx`

- [ ] **Step 1: Create `src/components/terminal/TerminalScreen.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import type { Line, TerminalMode } from '../../lib/terminal/types'
import { TerminalInput } from './TerminalInput'

interface TerminalScreenProps {
  outputLines: Line[]
  inputBuffer: string
  mode: TerminalMode
  onInputChange: (v: string) => void
  onSubmit: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onTab: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function TerminalScreen({
  outputLines, inputBuffer, mode,
  onInputChange, onSubmit, onKeyDown, onTab,
}: TerminalScreenProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [outputLines])

  return (
    <div
      className="term-screen"
      onClick={e => {
        // Clicks on the screen (but not on links) should refocus the input
        if ((e.target as HTMLElement).tagName !== 'A') {
          e.currentTarget.querySelector<HTMLInputElement>('.term-input-real')?.focus()
        }
      }}
    >
      <div className="term-output" role="log" aria-live="polite" aria-label="terminal output">
        {outputLines.map(line => (
          <div key={line.id} className={`term-line term-line--${line.type}`}>
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <TerminalInput
        value={inputBuffer}
        mode={mode}
        onChange={onInputChange}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        onTab={onTab}
      />
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/terminal/TerminalScreen.tsx
git commit -m "feat: add TerminalScreen component"
```

---

## Task 9: `BootSequence` Component

**Files:**
- Create: `src/components/terminal/BootSequence.tsx`

- [ ] **Step 1: Create `src/components/terminal/BootSequence.tsx`**

```tsx
import { useEffect, useState } from 'react'

interface BootStep {
  text: string
  delay: number
  isMemBar?: boolean
}

const BOOT_SCRIPT: BootStep[] = [
  { text: 'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL',   delay: 100 },
  { text: 'COPYRIGHT 2075-2077 ROBCO INDUSTRIES',      delay: 120 },
  { text: '-----------------------------------------', delay: 80  },
  { text: '> BIOS VERSION 2.3.0... OK',                delay: 200 },
  { text: '> CHECKING MEMORY...',                      delay: 100, isMemBar: true },
  { text: '> LOADING VAULT-TEC KERNEL... OK',          delay: 250 },
  { text: '> MOUNTING FILESYSTEM... OK',               delay: 200 },
  { text: '> AUTHENTICATING USER...',                  delay: 300 },
  { text: '  WELCOME, VAULT_DWELLER_7',                delay: 200 },
  { text: '-----------------------------------------', delay: 100 },
  { text: "TYPE 'help' FOR AVAILABLE COMMANDS.",       delay: 300 },
]

const MEM_TICKS = 12
const MEM_TICK_MS = 80

interface Props {
  onComplete: () => void
}

export function BootSequence({ onComplete }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [memFill, setMemFill] = useState(0)

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const wait = (ms: number) =>
      new Promise<void>(res => {
        const t = setTimeout(res, ms)
        timers.push(t)
      })

    ;(async () => {
      for (const step of BOOT_SCRIPT) {
        if (cancelled) break
        await wait(step.delay)
        if (cancelled) break

        setLines(prev => [...prev, step.text])

        if (step.isMemBar) {
          for (let i = 1; i <= MEM_TICKS; i++) {
            await wait(MEM_TICK_MS)
            if (cancelled) break
            setMemFill(i)
          }
          if (!cancelled) {
            setLines(prev => {
              const copy = [...prev]
              const idx = copy.lastIndexOf('> CHECKING MEMORY...')
              if (idx !== -1) {
                copy[idx] = '> CHECKING MEMORY... [████████████] 640K OK'
              }
              return copy
            })
          }
        }
      }

      if (!cancelled) {
        await wait(400)
        if (!cancelled) onComplete()
      }
    })()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [onComplete])

  return (
    <div className="term-boot">
      {lines.map((line, i) => {
        const isActiveMemBar = line === '> CHECKING MEMORY...' && memFill < MEM_TICKS
        const display = isActiveMemBar
          ? `> CHECKING MEMORY... [${'█'.repeat(memFill)}${'░'.repeat(MEM_TICKS - memFill)}]`
          : line
        return (
          <div key={i} className="term-line term-line--output">
            {display}
          </div>
        )
      })}
      <span className="term-cursor">█</span>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/terminal/BootSequence.tsx
git commit -m "feat: add BootSequence component"
```

---

## Task 10: `TerminalPage` + Wire Root Route

**Files:**
- Create: `src/components/terminal/TerminalPage.tsx`
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Create `src/components/terminal/TerminalPage.tsx`**

```tsx
import { useState } from 'react'
import { BootSequence } from './BootSequence'
import { TerminalScreen } from './TerminalScreen'
import { useTerminal } from '../../lib/terminal/useTerminal'
import '../../styles/terminal.css'

export function TerminalPage() {
  const [booted, setBooted] = useState(false)
  const {
    outputLines, inputBuffer, mode,
    setInputBuffer, submit, handleKeyDown, handleTab,
  } = useTerminal()

  return (
    <div className="term-root">
      <div className="term-screen-wrap">
        <div className="term-scanlines" aria-hidden="true" />
        <div className="term-vignette" aria-hidden="true" />
        {booted ? (
          <TerminalScreen
            outputLines={outputLines}
            inputBuffer={inputBuffer}
            mode={mode}
            onInputChange={setInputBuffer}
            onSubmit={submit}
            onKeyDown={handleKeyDown}
            onTab={handleTab}
          />
        ) : (
          <BootSequence onComplete={() => setBooted(true)} />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace `src/routes/index.tsx` with terminal entry**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { TerminalPage } from '../components/terminal/TerminalPage'

export const Route = createFileRoute('/')({
  component: TerminalPage,
})
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: build succeeds with no errors. TanStack Router will auto-update `routeTree.gen.ts` to include the new `/vinyl` route and the updated `/` route.

- [ ] **Step 5: Smoke-test in browser**

```bash
npm run dev
```

Open http://localhost:5173 and verify:
- Boot sequence plays (~3s), memory bar animates
- Prompt appears after boot completes
- `help` lists all commands
- `ls` shows files in `/home/vault_dweller`
- `ls -a /etc/` reveals `.terminal.conf`
- `cat PERSONAL_LOG.txt` prints lore text
- `cd /vault/records && cat incident_47.txt` prints the incident report
- `↑` / `↓` navigates command history
- `Tab` completes filenames
- `edit /etc/.terminal.conf` prompts for new COLOR_SCHEME
- Entering `amber` changes the glow color immediately
- `neofetch` prints ASCII art with the current theme name
- http://localhost:5173/vinyl still shows the vinyl dashboard

- [ ] **Step 6: Commit**

```bash
git add src/components/terminal/TerminalPage.tsx src/routes/index.tsx
git commit -m "feat: wire TerminalPage to root route — terminal emulator complete"
```
