import { useState, useEffect, useRef } from "react";

const ROLES = [
  "// HOME AUTOMATION ENGINEER",
  "// SYSTEMS ARCHITECT",
  "// NETWORK OPERATOR",
];
const TYPE_SPEED = 30;
const ERASE_SPEED = 20;
const HOLD_DURATION = 2000;

export function CyclingSubtitle() {
  const [displayed, setDisplayed] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const roleIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cursorId = setInterval(() => setCursorVisible((v) => !v), 500);

    function typeChar() {
      const target = ROLES[roleIndexRef.current];
      setDisplayed((prev) => {
        if (prev.length < target.length) {
          const next = prev + target[prev.length];
          timeoutRef.current = setTimeout(typeChar, TYPE_SPEED);
          return next;
        } else {
          timeoutRef.current = setTimeout(eraseChar, HOLD_DURATION);
          return prev;
        }
      });
    }

    function eraseChar() {
      setDisplayed((prev) => {
        if (prev.length > 0) {
          timeoutRef.current = setTimeout(eraseChar, ERASE_SPEED);
          return prev.slice(0, -1);
        } else {
          roleIndexRef.current = (roleIndexRef.current + 1) % ROLES.length;
          timeoutRef.current = setTimeout(typeChar, 300);
          return prev;
        }
      });
    }

    timeoutRef.current = setTimeout(typeChar, 600);

    return () => {
      clearInterval(cursorId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      className="cycling-subtitle"
      aria-live="polite"
      aria-atomic="true"
      aria-label={displayed || "loading role"}
    >
      {displayed}
      <span
        style={{
          display: "inline-block",
          color: "#25E1ED",
          opacity: cursorVisible ? 1 : 0,
          transition: "opacity 0.05s",
        }}
      >
        █
      </span>
      <style>{`
        .cycling-subtitle { font-family: 'Share Tech Mono', monospace; color: #25E1ED; font-size: clamp(0.85rem, 2vw, 1.1rem); letter-spacing: 0.04em; display: inline-block; min-height: 1.5em; }
      `}</style>
    </span>
  );
}
