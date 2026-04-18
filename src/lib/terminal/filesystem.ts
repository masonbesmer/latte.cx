export interface FileNode {
  type: "file";
  content: string;
}

export interface DirNode {
  type: "dir";
  children: Record<string, FSNode>;
}

export type FSNode = FileNode | DirNode;

export const filesystem: DirNode = {
  type: "dir",
  children: {
    etc: {
      type: "dir",
      children: {
        ".terminal.conf": {
          type: "file",
          content: "COLOR_SCHEME=green\n",
        },
      },
    },
    home: {
      type: "dir",
      children: {
        vault_dweller: {
          type: "dir",
          children: {
            "PERSONAL_LOG.txt": {
              type: "file",
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
              type: "dir",
              children: {
                "TODO.txt": {
                  type: "file",
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
      type: "dir",
      children: {
        logs: {
          type: "dir",
          children: {
            "system.log": {
              type: "file",
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
      type: "dir",
      children: {
        "MANIFEST.txt": {
          type: "file",
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
          type: "dir",
          children: {
            "roster.txt": {
              type: "file",
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
          type: "dir",
          children: {
            "incident_47.txt": {
              type: "file",
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
    "ROBCO_README.txt": {
      type: "file",
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
};

export function resolvePath(cwd: string, target: string): string {
  if (target.startsWith("/")) return normalizePath(target);
  const parts = cwd === "/" ? [] : cwd.split("/").filter(Boolean);
  for (const segment of target.split("/").filter(Boolean)) {
    if (segment === "..") parts.pop();
    else if (segment !== ".") parts.push(segment);
  }
  return "/" + parts.join("/");
}

function normalizePath(p: string): string {
  const parts = p.split("/").filter(Boolean);
  const out: string[] = [];
  for (const part of parts) {
    if (part === "..") out.pop();
    else if (part !== ".") out.push(part);
  }
  return "/" + out.join("/");
}

export function getNode(path: string, fs: DirNode = filesystem): FSNode | null {
  if (path === "/") return fs;
  const parts = path.split("/").filter(Boolean);
  let current: FSNode = fs;
  for (const part of parts) {
    if (current.type !== "dir") return null;
    const child: FSNode | undefined = current.children[part];
    if (!child) return null;
    current = child;
  }
  return current;
}
