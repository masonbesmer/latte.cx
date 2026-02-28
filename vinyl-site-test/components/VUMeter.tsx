'use client';

import { useEffect, useRef, useState } from 'react';

interface VUMeterProps {
  label: string;
  value: number; // 0–100
  color?: string;
  height?: number;
}

export function VUMeter({ label, value, color = '#d4840a', height = 60 }: VUMeterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(value);

  useEffect(() => {
    targetRef.current = value;
    const animate = () => {
      setDisplayValue((prev) => {
        const jitter = (Math.random() - 0.5) * 8;
        const next = prev + (targetRef.current - prev) * 0.15 + jitter;
        return Math.max(0, Math.min(100, next));
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  const bars = 12;
  const filledBars = Math.round((displayValue / 100) * bars);

  return (
    <div className="flex flex-col items-center gap-1" aria-label={`${label}: ${Math.round(displayValue)}%`}>
      <div
        className="flex items-end gap-0.5"
        style={{ height }}
        role="meter"
        aria-valuenow={Math.round(displayValue)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: bars }).map((_, i) => {
          const filled = i < filledBars;
          const isHot = i >= bars * 0.75;
          const barColor = filled
            ? isHot
              ? '#c0392b'
              : i >= bars * 0.55
              ? '#e67e22'
              : color
            : 'rgba(255,255,255,0.1)';
          return (
            <div
              key={i}
              style={{
                width: 6,
                height: `${((i + 1) / bars) * 100}%`,
                backgroundColor: barColor,
                borderRadius: '1px 1px 0 0',
                transition: 'background-color 0.05s',
              }}
            />
          );
        })}
      </div>
      <span
        className="text-center font-mono"
        style={{ color: 'var(--cream)', fontSize: 9, letterSpacing: '0.05em' }}
      >
        {label}
      </span>
    </div>
  );
}
