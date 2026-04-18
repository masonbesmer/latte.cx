interface NeonButtonProps {
  label: string;
  variant?: "primary" | "danger";
  disabled?: boolean;
  onClick?: () => void;
}

export function NeonButton({
  label,
  variant = "primary",
  disabled = false,
  onClick,
}: NeonButtonProps) {
  const colors =
    variant === "primary"
      ? {
          color: "#F2E900",
          shadow: "0 0 6px #F2E900, inset 0 0 6px rgba(242,233,0,0.1)",
        }
      : {
          color: "#FF1111",
          shadow: "0 0 6px #FF1111, inset 0 0 6px rgba(255,17,17,0.1)",
        };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.9rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        background: "transparent",
        border: `1px solid ${colors.color}`,
        color: colors.color,
        padding: "0.5rem 1.25rem",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: colors.shadow,
        opacity: disabled ? 0.4 : 1,
        transition: "box-shadow 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}
