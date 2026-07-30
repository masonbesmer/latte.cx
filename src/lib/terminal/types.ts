export type LineType = "output" | "error" | "system" | "prompt";

export interface Line {
  id: string;
  text: string;
  type: LineType;
}

export type ColorScheme = "green" | "amber" | "blue" | "white";

export type TerminalMode = "command" | "editing";
