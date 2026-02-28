'use client';

import { services } from '@/lib/data';
import { AnalogClock } from './AnalogClock';
import { VUMeter } from './VUMeter';

function ServiceSpine({
  name,
  status,
  color,
}: {
  name: string;
  status: 'healthy' | 'warning' | 'down';
  color: string;
}) {
  const statusColors = {
    healthy: 'var(--status-green)',
    warning: 'var(--status-amber)',
    down: 'var(--status-red)',
  };

  return (
    <div
      className="flex flex-col items-center justify-between rounded"
      style={{
        width: 28,
        height: 80,
        background: `linear-gradient(180deg, ${color}cc, ${color}88)`,
        border: `1px solid ${color}`,
        padding: '4px 2px',
        writingMode: 'vertical-rl',
        cursor: 'default',
        position: 'relative',
      }}
      title={name}
      aria-label={`${name}: ${status}`}
    >
      {/* Status dot */}
      <div
        className="rounded-full flex-shrink-0"
        style={{
          width: 5,
          height: 5,
          backgroundColor: statusColors[status],
          boxShadow: `0 0 4px ${statusColors[status]}`,
        }}
        aria-hidden="true"
      />
      {/* Name */}
      <span
        style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: 7,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          transform: 'rotate(180deg)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxHeight: 55,
        }}
      >
        {name}
      </span>
    </div>
  );
}

export function ShelfHeader() {
  const healthyCount = services.filter((s) => s.status === 'healthy').length;
  const warningCount = services.filter((s) => s.status === 'warning').length;
  const downCount = services.filter((s) => s.status === 'down').length;
  const totalCpu = Math.round(services.reduce((sum, s) => sum + s.cpu, 0) / services.length);
  const totalMem = Math.round(services.reduce((sum, s) => sum + s.memory, 0) / services.length);

  return (
    <header
      className="rounded-xl p-4 flex flex-wrap items-center gap-4"
      style={{
        background: 'linear-gradient(135deg, #2a1a10 0%, #3d2b1f 50%, #2a1a10 100%)',
        border: '2px solid var(--copper)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
      }}
      aria-label="System overview shelf"
    >
      {/* Title / Branding */}
      <div className="flex flex-col">
        <h1
          className="font-bold tracking-widest"
          style={{ color: 'var(--amber)', fontSize: 20, letterSpacing: '0.3em', textShadow: '0 0 12px var(--amber-glow)' }}
        >
          VINYL CRATE
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Homelab Dashboard
        </p>
      </div>

      {/* Analog clock */}
      <AnalogClock />

      {/* Overall health badges */}
      <div
        className="flex gap-2 items-center rounded px-3 py-2"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}
        aria-label="Service health summary"
      >
        <div className="flex flex-col items-center">
          <span className="font-mono font-bold" style={{ color: 'var(--status-green)', fontSize: 18 }}>
            {healthyCount}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>UP</span>
        </div>
        <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.1)' }} aria-hidden="true" />
        <div className="flex flex-col items-center">
          <span className="font-mono font-bold" style={{ color: 'var(--status-amber)', fontSize: 18 }}>
            {warningCount}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>WARN</span>
        </div>
        <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.1)' }} aria-hidden="true" />
        <div className="flex flex-col items-center">
          <span className="font-mono font-bold" style={{ color: 'var(--status-red)', fontSize: 18 }}>
            {downCount}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>DOWN</span>
        </div>
      </div>

      {/* Average VU meters */}
      <div
        className="flex gap-4 items-end rounded px-3 py-2"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}
        aria-label="Average resource usage"
      >
        <VUMeter label="AVG CPU" value={totalCpu} height={50} />
        <VUMeter label="AVG MEM" value={totalMem} height={50} />
      </div>

      {/* Record spine shelf */}
      <div
        className="flex-1 min-w-0"
        aria-label="Service shelf"
      >
        <p
          style={{ color: 'rgba(255,255,255,0.3)', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}
        >
          Services on shelf
        </p>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {services.map((svc) => (
            <ServiceSpine
              key={svc.id}
              name={svc.name}
              status={svc.status}
              color={svc.coverColor}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
