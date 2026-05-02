import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { ColorScheme, Line, LineType, TerminalMode } from "./types";
import type { DirNode } from "./filesystem";
import { filesystem, getNode, resolvePath } from "./filesystem";
import { executeCommand } from "./commands";
import {
  applyScheme,
  isValidScheme,
  loadScheme,
  updateConfigContent,
} from "./theme";

let _id = 0;
function mkLine(text: string, type: LineType): Line {
  return { id: String(_id++), text, type };
}

interface State {
  outputLines: Line[];
  inputBuffer: string;
  cwd: string;
  historyStack: string[];
  historyIndex: number;
  mode: TerminalMode;
  scheme: ColorScheme;
}

export function useTerminal() {
  // Mutable copy of the filesystem so `edit` can write back to .terminal.conf
  const fsRef = useRef<DirNode>(
    JSON.parse(JSON.stringify(filesystem)) as DirNode,
  );

  const [state, setState] = useState<State>({
    outputLines: [],
    inputBuffer: "",
    cwd: "/home/vault_dweller",
    historyStack: [],
    historyIndex: -1,
    mode: "command",
    scheme: loadScheme(),
  });

  useLayoutEffect(() => {
    applyScheme(state.scheme);
  }, [state.scheme]);

  const setInputBuffer = useCallback((value: string) => {
    setState((prev) => ({ ...prev, inputBuffer: value }));
  }, []);

  const submit = useCallback((input: string) => {
    setState((prev) => {
      const promptLine = mkLine(`> ${input}`, "prompt");

      // ── EDITING MODE ──────────────────────────────────────────────────
      if (prev.mode === "editing") {
        const trimmed = input.trim();

        if (trimmed === "") {
          return {
            ...prev,
            outputLines: [
              ...prev.outputLines,
              promptLine,
              mkLine("Edit cancelled.", "system"),
            ],
            inputBuffer: "",
            mode: "command",
          };
        }

        if (!isValidScheme(trimmed)) {
          return {
            ...prev,
            outputLines: [
              ...prev.outputLines,
              promptLine,
              mkLine(`ERROR: '${trimmed}' is not a valid scheme.`, "error"),
              mkLine("Valid values: green  amber  blue  white", "error"),
              mkLine("ENTER NEW VALUE FOR COLOR_SCHEME:", "system"),
            ],
            inputBuffer: "",
            // stays in editing mode
          };
        }

        const newScheme = trimmed;
        const confNode = getNode("/etc/.terminal.conf", fsRef.current);
        if (confNode?.type === "file") {
          confNode.content = updateConfigContent(confNode.content, newScheme);
        }

        return {
          ...prev,
          outputLines: [
            ...prev.outputLines,
            promptLine,
            mkLine(
              `COLOR_SCHEME set to '${newScheme}'. Theme applied.`,
              "system",
            ),
          ],
          inputBuffer: "",
          mode: "command",
          scheme: newScheme,
        };
      }

      // ── COMMAND MODE ──────────────────────────────────────────────────
      const trimmed = input.trim();

      const nextHistory = trimmed
        ? [trimmed, ...prev.historyStack]
        : prev.historyStack;

      if (!trimmed) {
        return {
          ...prev,
          outputLines: [...prev.outputLines, promptLine],
          inputBuffer: "",
          historyIndex: -1,
        };
      }

      const result = executeCommand(
        trimmed,
        prev.cwd,
        fsRef.current,
        prev.scheme,
      );

      if (result.clear) {
        return {
          ...prev,
          outputLines: [],
          inputBuffer: "",
          historyStack: nextHistory,
          historyIndex: -1,
        };
      }

      const newLines: Line[] = [
        promptLine,
        ...result.lines.map((l) => mkLine(l.text, l.type)),
      ];

      if (result.edit) {
        const confNode = getNode("/etc/.terminal.conf", fsRef.current);
        const confContent =
          confNode?.type === "file" ? confNode.content.trimEnd() : "";
        return {
          ...prev,
          outputLines: [
            ...prev.outputLines,
            ...newLines,
            mkLine(confContent, "output"),
            mkLine("", "output"),
            mkLine(
              "ENTER NEW VALUE FOR COLOR_SCHEME (green / amber / blue / white):",
              "system",
            ),
            mkLine("(empty input to cancel)", "system"),
          ],
          inputBuffer: "",
          historyStack: nextHistory,
          historyIndex: -1,
          cwd: result.newCwd ?? prev.cwd,
          mode: "editing",
        };
      }

      return {
        ...prev,
        outputLines: [...prev.outputLines, ...newLines],
        inputBuffer: "",
        historyStack: nextHistory,
        historyIndex: -1,
        cwd: result.newCwd ?? prev.cwd,
      };
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setState((prev) => {
          if (prev.mode === "editing") return prev;
          if (prev.historyStack.length === 0) return prev;
          const newIndex = Math.min(
            prev.historyIndex + 1,
            prev.historyStack.length - 1,
          );
          return {
            ...prev,
            historyIndex: newIndex,
            inputBuffer: prev.historyStack[newIndex],
          };
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setState((prev) => {
          if (prev.mode === "editing") return prev;
          if (prev.historyIndex <= 0)
            return { ...prev, historyIndex: -1, inputBuffer: "" };
          const newIndex = prev.historyIndex - 1;
          return {
            ...prev,
            historyIndex: newIndex,
            inputBuffer: prev.historyStack[newIndex],
          };
        });
      }
    },
    [],
  );

  const handleTab = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setState((prev) => {
      if (prev.mode === "editing") return prev;
      const parts = prev.inputBuffer.split(" ");
      const lastPart = parts[parts.length - 1];

      const slashIdx = lastPart.lastIndexOf("/");
      const dirPath =
        slashIdx !== -1
          ? resolvePath(prev.cwd, lastPart.substring(0, slashIdx) || "/")
          : prev.cwd;
      const prefix =
        slashIdx !== -1 ? lastPart.substring(slashIdx + 1) : lastPart;

      const node = getNode(dirPath, fsRef.current);
      if (!node || node.type !== "dir") return prev;

      const matches = Object.keys(node.children).filter((name) =>
        name.startsWith(prefix),
      );
      if (matches.length === 0) return prev;

      if (matches.length === 1) {
        const completed = matches[0];
        const isDir = node.children[completed].type === "dir";
        const base = slashIdx !== -1 ? lastPart.substring(0, slashIdx + 1) : "";
        parts[parts.length - 1] = base + completed + (isDir ? "/" : "");
        return { ...prev, inputBuffer: parts.join(" ") };
      }

      // Multiple matches — show them
      const promptLine = mkLine(`> ${prev.inputBuffer}`, "prompt");
      const matchLine = mkLine(matches.join(" "), "output");
      return {
        ...prev,
        outputLines: [...prev.outputLines, promptLine, matchLine],
      };
    });
  }, []);

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
  };
}
