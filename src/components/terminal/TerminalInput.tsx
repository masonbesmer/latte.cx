import { useEffect, useRef } from "react";
import type { TerminalMode } from "../../lib/terminal/types";

interface TerminalInputProps {
  value: string;
  mode: TerminalMode;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTab: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function TerminalInput({
  value,
  mode,
  onChange,
  onSubmit,
  onKeyDown,
  onTab,
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the hidden input on mount and whenever mode changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [mode]);

  // Reset cursor to end when value changes (e.g., after history navigation)
  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      input.setSelectionRange(value.length, value.length);
    }
  }, [value]);

  const promptLabel = "> ";

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") {
      onTab(e);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(value);
      return;
    }
    onKeyDown(e);
  }

  return (
    <div className="term-input-row" onClick={() => inputRef.current?.focus()}>
      <span className="term-prompt-label">{promptLabel}</span>
      <div className="term-input-field">
        <input
          ref={inputRef}
          className="term-input-real"
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
  );
}
