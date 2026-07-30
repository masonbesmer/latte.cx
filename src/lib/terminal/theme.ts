import type { ColorScheme } from "./types";

export const SCHEMES: Record<ColorScheme, { fg: string; glow: string }> = {
  green: { fg: "#39FF14", glow: "#39FF14" },
  amber: { fg: "#FFB000", glow: "#FF8C00" },
  blue: { fg: "#00BFFF", glow: "#0080FF" },
  white: { fg: "#E8E8E8", glow: "#FFFFFF" },
};

const STORAGE_KEY = "terminal-color-scheme";

export function isValidScheme(value: string): value is ColorScheme {
  return value in SCHEMES;
}

export function loadScheme(): ColorScheme {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved && isValidScheme(saved) ? saved : "green";
}

export function applyScheme(scheme: ColorScheme): void {
  const { fg, glow } = SCHEMES[scheme];
  document.documentElement.style.setProperty("--term-fg", fg);
  document.documentElement.style.setProperty("--term-glow", glow);
  localStorage.setItem(STORAGE_KEY, scheme);
}

export function getSchemeFromConfig(content: string): ColorScheme | null {
  const match = content.match(/^COLOR_SCHEME=(\w+)/m);
  if (!match) return null;
  const val = match[1];
  return isValidScheme(val) ? val : null;
}

export function updateConfigContent(
  content: string,
  scheme: ColorScheme,
): string {
  return content.replace(/COLOR_SCHEME=\w+/g, `COLOR_SCHEME=${scheme}`);
}
