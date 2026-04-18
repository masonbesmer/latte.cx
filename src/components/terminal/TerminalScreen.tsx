import { useEffect, useRef } from "react";
import type { Line, TerminalMode } from "../../lib/terminal/types";
import { TerminalInput } from "./TerminalInput";

interface TerminalScreenProps {
  outputLines: Line[];
  inputBuffer: string;
  mode: TerminalMode;
  onInputChange: (v: string) => void;
  onSubmit: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTab: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function TerminalScreen({
  outputLines,
  inputBuffer,
  mode,
  onInputChange,
  onSubmit,
  onKeyDown,
  onTab,
}: TerminalScreenProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [outputLines]);

  return (
    <div
      className="term-screen"
      onClick={(e) => {
        // Clicks on the screen (but not on links) should refocus the input
        if ((e.target as HTMLElement).tagName !== "A") {
          e.currentTarget
            .querySelector<HTMLInputElement>(".term-input-real")
            ?.focus();
        }
      }}
    >
      <div
        className="term-output"
        role="log"
        aria-live="polite"
        aria-label="terminal output"
      >
        {outputLines.map((line) => (
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
  );
}
