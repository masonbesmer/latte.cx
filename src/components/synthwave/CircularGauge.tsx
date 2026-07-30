interface CircularGaugeProps {
  value: number; // 0–100
  label: string;
  sub?: string;
  color: string;
  size?: number; // svg diameter in px
}

export function CircularGauge({
  value,
  label,
  sub,
  color,
  size = 100,
}: CircularGaugeProps) {
  const radius = (size - 16) / 2;
  const circ = 2 * Math.PI * radius;
  const filled = circ * (value / 100);
  const gap = circ - filled;
  const center = size / 2;

  // Color shifts from accent → orange → red based on value
  const strokeColor = value > 85 ? "#FF0055" : value > 70 ? "#FF6C11" : color;

  return (
    <div className="sw-gauge-panel">
      <svg
        className="sw-gauge-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`${label}: ${value}%`}
        role="img"
      >
        {/* Track ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={6}
        />
        {/* Value arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={6}
          strokeDasharray={`${filled} ${gap}`}
          strokeLinecap="butt"
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            filter: `drop-shadow(0 0 4px ${strokeColor}) drop-shadow(0 0 8px ${strokeColor}80)`,
            transition: "stroke-dasharray 0.8s ease",
          }}
        />
        {/* Percentage label */}
        <text
          x={center}
          y={center + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={strokeColor}
          fontFamily="'Orbitron', sans-serif"
          fontWeight="700"
          fontSize={size * 0.18}
          style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
        >
          {value}%
        </text>
      </svg>
      <div
        className="sw-gauge-label"
        style={{ color: strokeColor, textShadow: `0 0 6px ${strokeColor}` }}
      >
        {label}
      </div>
      {sub && <div className="sw-gauge-sub">{sub}</div>}
    </div>
  );
}
