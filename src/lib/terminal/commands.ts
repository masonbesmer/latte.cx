import type { Line, LineType, ColorScheme } from "./types";
import type { DirNode } from "./filesystem";
import { getNode, resolvePath } from "./filesystem";

export interface CommandContext {
  cwd: string;
  fs: DirNode;
  scheme: ColorScheme;
}

export interface CommandResult {
  lines: Line[];
  newCwd?: string;
  edit?: boolean;
  clear?: boolean;
}

type Handler = (args: string[], ctx: CommandContext) => CommandResult;

let _lineId = 0;
function mkLine(text: string, type: LineType): Line {
  return { id: String(_lineId++), text, type };
}
function out(text: string): Line {
  return mkLine(text, "output");
}
function err(text: string): Line {
  return mkLine(text, "error");
}

const commands: Record<string, Handler> = {
  help: () => ({
    lines: [
      out("Available commands:"),
      out("  ls [-la]         List directory contents"),
      out("  cd <dir>         Change directory"),
      out("  cat <file>       Print file contents"),
      out("  pwd              Print working directory"),
      out("  echo <text>      Print text"),
      out("  clear            Clear terminal output"),
      out("  whoami           Print current user"),
      out("  date             Print vault date and time"),
      out("  neofetch         System information"),
      out("  edit <file>      Edit /etc/.terminal.conf"),
      out("  help             Show this help"),
    ],
  }),

  pwd: (_args, ctx) => ({ lines: [out(ctx.cwd)] }),

  whoami: () => ({ lines: [out("VAULT_DWELLER_7")] }),

  date: () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor(
      (now.getTime() - start.getTime()) / 86_400_000,
    );
    return {
      lines: [
        out(
          `VAULT-TEC DATE: 2277.${String(dayOfYear).padStart(3, "0")} // SYSTEM TIME: ${hh}:${mm}`,
        ),
      ],
    };
  },

  echo: (args) => ({ lines: [out(args.join(" "))] }),

  clear: () => ({ lines: [], clear: true }),

  ls: (args, ctx) => {
    const flags = new Set(
      args
        .filter((a) => a.startsWith("-"))
        .flatMap((a) => a.slice(1).split("")),
    );
    const showHidden = flags.has("a");
    const showLong = flags.has("l");

    const targetArg = args.find((a) => !a.startsWith("-"));
    const targetPath = targetArg ? resolvePath(ctx.cwd, targetArg) : ctx.cwd;
    const node = getNode(targetPath, ctx.fs);

    if (!node)
      return { lines: [err(`ls: ${targetPath}: No such file or directory`)] };

    if (node.type === "file") {
      const name = targetPath.split("/").pop() ?? targetPath;
      return {
        lines: showLong
          ? [
              out(
                `-rw-r--r-- ${String(node.content.length).padStart(6)} ${name}`,
              ),
            ]
          : [out(name)],
      };
    }

    const entries = Object.entries(node.children)
      .filter(([name]) => showHidden || !name.startsWith("."))
      .sort(([a], [b]) => a.localeCompare(b));

    if (entries.length === 0) return { lines: [] };

    const lines = entries.map(([name, child]) => {
      const isDir = child.type === "dir";
      const display = isDir ? name + "/" : name;
      if (showLong) {
        const size =
          child.type === "dir"
            ? "     -"
            : String(child.content.length).padStart(6);
        const prefix = isDir ? "d" : "-";
        return out(`${prefix}rw-r--r-- ${size} ${display}`);
      }
      return out(display);
    });

    return { lines };
  },

  cd: (args, ctx) => {
    if (!args[0]) return { lines: [], newCwd: "/home/vault_dweller" };
    const target = resolvePath(ctx.cwd, args[0]);
    const node = getNode(target, ctx.fs);
    if (!node)
      return { lines: [err(`cd: ${args[0]}: No such file or directory`)] };
    if (node.type === "file")
      return { lines: [err(`cd: ${args[0]}: Not a directory`)] };
    return { lines: [], newCwd: target };
  },

  cat: (args, ctx) => {
    if (!args[0]) return { lines: [err("cat: missing operand")] };
    const target = resolvePath(ctx.cwd, args[0]);
    const node = getNode(target, ctx.fs);
    if (!node)
      return { lines: [err(`cat: ${target}: No such file or directory`)] };
    if (node.type === "dir")
      return { lines: [err(`cat: ${target}: Is a directory`)] };
    return { lines: node.content.split("\n").map((line) => out(line)) };
  },

  edit: (args) => {
    if (!args[0]) return { lines: [err("edit: missing file argument")] };
    if (args[0] !== "/etc/.terminal.conf") {
      return { lines: [err("edit: only /etc/.terminal.conf is editable")] };
    }
    return { lines: [], edit: true };
  },

  neofetch: (_args, ctx) => ({
    lines: [
      out("  ██████╗ ██████╗ ██████╗   VAULT-TEC TERMLINK v2.3"),
      out("  ██╔══██╗██╔══██╗██╔══██╗  -------------------------"),
      out("  ██████╔╝██████╔╝██████╔╝  OS:       ROBCO KERNEL 2.3"),
      out("  ██╔══██╗██╔══██╗██╔══██╗  HOST:     VAULT 111"),
      out("  ██║  ██║██║  ██║██████╔╝  UPTIME:   211 YEARS"),
      out("  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝   SHELL:    TERMLINK 1.0"),
      out("                              MEMORY:   640K (SUFFICIENT)"),
      out(`                              THEME:    ${ctx.scheme}`),
    ],
  }),
};

export function executeCommand(
  input: string,
  cwd: string,
  fs: DirNode,
  scheme: ColorScheme,
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const [cmd, ...args] = trimmed.split(/\s+/);
  const handler = commands[cmd];

  if (!handler) {
    return { lines: [mkLine(`'${cmd}': command not found`, "error")] };
  }

  return handler(args, { cwd, fs, scheme });
}
