'use client';

import { useEffect, useState } from 'react';

export function AnalogClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const sDeg = seconds * 6;
  const mDeg = minutes * 6 + seconds * 0.1;
  const hDeg = hours * 30 + minutes * 0.5;

  const size = 80;
  const cx = size / 2;
  const r = size / 2 - 4;

  const hand = (deg: number, length: number, width: number, color: string) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    const x = cx + length * Math.cos(rad);
    const y = cx + length * Math.sin(rad);
    return (
      <line
        x1={cx}
        y1={cx}
        x2={x}
        y2={y}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-1" aria-label={`Clock: ${time.toLocaleTimeString()}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        {/* Face */}
        <circle cx={cx} cy={cx} r={r} fill="#2a1a10" stroke="var(--copper)" strokeWidth={2} />
        {/* Hour ticks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          const x1 = cx + (r - 4) * Math.cos(a);
          const y1 = cx + (r - 4) * Math.sin(a);
          const x2 = cx + (r - 8) * Math.cos(a);
          const y2 = cx + (r - 8) * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--cream)" strokeWidth={1.5} />;
        })}
        {/* Hands */}
        {hand(hDeg, r * 0.55, 2.5, 'var(--cream)')}
        {hand(mDeg, r * 0.72, 1.5, 'var(--cream)')}
        {hand(sDeg, r * 0.8, 1, 'var(--amber-glow)')}
        {/* Center dot */}
        <circle cx={cx} cy={cx} r={2} fill="var(--amber)" />
      </svg>
      <span
        className="font-mono"
        style={{ color: 'var(--cream)', fontSize: 10, letterSpacing: '0.1em' }}
      >
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
