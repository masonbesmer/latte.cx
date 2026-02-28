import { Service, getStatusColor } from '../../lib/vinyl-data'
import { VUMeter } from './VUMeter'

interface TurntableProps {
  service: Service | null
}

function Tonearm({ activity }: { activity: number }) {
  const deg = -20 + (activity / 100) * 25
  return (
    <svg
      className="absolute"
      style={{ top: 10, right: 30, width: 100, height: 120, transformOrigin: '80px 20px', transform: `rotate(${deg}deg)`, transition: 'transform 1s ease-in-out', zIndex: 10 }}
      aria-hidden="true"
    >
      <circle cx={80} cy={20} r={8} fill="var(--copper)" stroke="var(--walnut)" strokeWidth={1.5} />
      <line x1={80} y1={20} x2={20} y2={100} stroke="var(--copper)" strokeWidth={3} strokeLinecap="round" />
      <rect x={8} y={92} width={18} height={8} rx={2} fill="var(--copper)" />
      <line x1={14} y1={100} x2={14} y2={110} stroke="#aaa" strokeWidth={1} />
    </svg>
  )
}

function Platter({ service, spinning }: { service: Service; spinning: boolean }) {
  return (
    <div
      className="relative rounded-full"
      style={{
        width: 200,
        height: 200,
        background: '#111',
        boxShadow: `0 0 20px rgba(0,0,0,0.8), 0 0 0 6px #1e1e1e, 0 0 0 8px var(--copper)`,
      }}
      aria-label={`Now playing: ${service.name}`}
    >
      <div
        className={`absolute inset-0 rounded-full ${spinning ? 'spin-vinyl' : 'spin-vinyl spin-vinyl-paused'}`}
        style={{
          background:
            'radial-gradient(circle, #2a2a2a 0%, #111 20%, #1c1c1c 21%, #0d0d0d 30%, #1a1a1a 31%, #111 45%, #1e1e1e 46%, #0d0d0d 60%, #1a1a1a 61%, #111 75%, #1e1e1e 76%, #0d0d0d 90%, #1a1a1a 100%)',
        }}
      />
      <div
        className="absolute rounded-full flex items-center justify-center flex-col"
        style={{
          inset: '28%',
          background: `radial-gradient(circle at 40% 40%, ${service.accentColor}, ${service.coverColor})`,
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: 24 }}>{service.icon}</span>
        <span
          className="font-bold text-center"
          style={{ color: '#fff', fontSize: 7, textShadow: '0 1px 2px rgba(0,0,0,0.8)', maxWidth: 50, textAlign: 'center' }}
        >
          {service.name}
        </span>
      </div>
      <div
        className="absolute rounded-full"
        style={{ inset: '47%', background: '#333', border: '1px solid #555', zIndex: 3 }}
      />
      {spinning && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none glow-amber"
          style={{ opacity: 0.15 }}
        />
      )}
    </div>
  )
}

function EmptyPlatter() {
  return (
    <div
      className="relative rounded-full flex items-center justify-center"
      style={{
        width: 200,
        height: 200,
        background: '#111',
        boxShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 0 6px #1e1e1e, 0 0 0 8px var(--copper)',
      }}
      aria-label="No record playing"
    >
      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 14, textAlign: 'center', padding: 20 }}>
        Select a record to play
      </span>
    </div>
  )
}

export function Turntable({ service }: TurntableProps) {
  const activity = service ? (service.cpu + service.memory) / 2 : 0
  const statusColor = service ? getStatusColor(service.status) : '#555'

  return (
    <section
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: 'linear-gradient(135deg, #1a0f08 0%, #2a1a10 60%, #1a0f08 100%)',
        border: '2px solid var(--copper)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
        minWidth: 300,
      }}
      aria-label="Turntable – Now Playing"
    >
      <div className="flex items-center gap-2">
        <div
          className="rounded-full"
          style={{ width: 8, height: 8, backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
          aria-hidden="true"
        />
        <h2
          className="font-bold tracking-widest uppercase"
          style={{ color: 'var(--amber)', fontSize: 11, letterSpacing: '0.25em' }}
        >
          Now Playing
        </h2>
      </div>
      <div className="relative flex items-center justify-center" style={{ height: 220 }}>
        {service ? (
          <>
            <Platter service={service} spinning={service.status === 'healthy'} />
            <Tonearm activity={activity} />
          </>
        ) : (
          <EmptyPlatter />
        )}
      </div>
      {service && (
        <div className="text-center">
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {service.artist}
          </p>
          <p className="font-bold" style={{ color: 'var(--cream)', fontSize: 15, marginTop: 2 }}>
            {service.albumTitle}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 1 }}>
            v{service.version} · {service.uptimeDays} days uptime
          </p>
        </div>
      )}
      <div
        className="flex items-end justify-around rounded px-4 py-3"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}
        aria-label="Resource meters"
      >
        <VUMeter label="CPU" value={service?.cpu ?? 0} height={60} />
        <VUMeter label="RAM" value={service?.memory ?? 0} height={60} />
        <VUMeter label="LOAD" value={activity} color="var(--copper)" height={60} />
      </div>
    </section>
  )
}
