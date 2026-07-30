import { useEffect, useRef } from "react";
import "../../styles/glitch.css";

interface GlitchTextProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "p";
  trigger?: "hover" | "scroll" | "always";
}

export function GlitchText({
  text,
  tag = "h1",
  trigger = "hover",
}: GlitchTextProps) {
  const ref = useRef<HTMLElement>(null);

  const triggerClass =
    trigger === "hover"
      ? "glitch--hover"
      : trigger === "always"
        ? "glitch--always"
        : "glitch--scroll";

  useEffect(() => {
    if (trigger !== "scroll" || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ref.current?.classList.add("glitch--active");
          } else {
            ref.current?.classList.remove("glitch--active");
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [trigger]);

  const className = `glitch ${triggerClass}`;
  const props = { className, "data-text": text, ref };

  if (tag === "h1")
    return (
      <h1 {...(props as React.HTMLAttributes<HTMLHeadingElement>)}>{text}</h1>
    );
  if (tag === "h2")
    return (
      <h2 {...(props as React.HTMLAttributes<HTMLHeadingElement>)}>{text}</h2>
    );
  if (tag === "h3")
    return (
      <h3 {...(props as React.HTMLAttributes<HTMLHeadingElement>)}>{text}</h3>
    );
  return (
    <p {...(props as React.HTMLAttributes<HTMLParagraphElement>)}>{text}</p>
  );
}
