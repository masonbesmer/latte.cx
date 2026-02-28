import { useState } from 'react'
import { Service, getStatusColor, getStatusLabel } from '../../lib/vinyl-data'
import { VUMeter } from './VUMeter'

interface RecordCardProps {
  service: Service
  isSelected: boolean
  onClick: () => void
}

function VinylDisc({
  service,
  spinning,
}: {
  service: Service
  spinning: boolean
}) {
  return (
    <div
      className={`relative rounded-full ${spinning ? 'spin-vinyl-slow' : ''}`}
      style={{
        width: 200,
        height: 200,
        background:
          'radial-gradient(circle, #2a2a2a 0%, #111 20%, #1c1c1c 21%, #0d0d0d 30%, #1a1a1a 31%, #111 45%, #1e1e1e 46%, #0d0d0d 60%, #1a1a1a 61%, #111 75%, #1e1e1e 76%, #0d0d0d 90%, #1a1a1a 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
      }}
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full flex items-center justify-center flex-col"
        style={{
          inset: '30%',
          background: `radial-gradient(circle at 40% 40%, ${service.accentColor}, ${service.coverColor})`,
        }}
      >
        <span style={{ fontSize: 22 }}>{service.icon}</span>
        <span
          className="font-bold text-center leading-tight"
          style={{ color: '#fff', fontSize: 7, textShadow: '0 1px 2px rgba(0,0,0,0.8)', maxWidth: 50, textAlign: 'center' }}
        >
          {service.name}
        </span>
      </div>
      <div
        className="absolute rounded-full"
        style={{ inset: '47%', background: '#111', border: '1px solid #333' }}
      />
    </div>
  )
}

function RecordFront({ service }: { service: Service }) {
  const statusColor = getStatusColor(service.status)
  return (
    <div
      className="card-face absolute inset-0 rounded-xl flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${service.coverColor}dd, ${service.accentColor}88)`,
        border: `2px solid ${service.coverColor}`,
      }}
    >
      <div
        className="absolute top-2 right-2 rounded-full px-2 py-0.5 font-mono font-bold"
        style={{ backgroundColor: statusColor, fontSize: 9, color: '#fff', letterSpacing: '0.1em' }}
        aria-label={`Status: ${getStatusLabel(service.status)}`}
      >
        ● {getStatusLabel(service.status)}
      </div>
      <div className="p-3 pb-1">
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {service.artist}
        </p>
        <h3 className="font-bold leading-tight" style={{ color: '#fff', fontSize: 15, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
          {service.albumTitle}
        </h3>
      </div>
      <div className="flex-1 flex items-center justify-center py-2">
        <VinylDisc service={service} spinning={service.status === 'healthy'} />
      </div>
      <div
        className="flex items-end justify-around p-2 gap-2"
        style={{ background: 'rgba(0,0,0,0.35)' }}
      >
        <VUMeter label="CPU" value={service.cpu} color={service.accentColor} height={40} />
        <VUMeter label="MEM" value={service.memory} color={service.accentColor} height={40} />
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="font-mono font-bold"
            style={{ color: service.accentColor, fontSize: 14 }}
            aria-label={`Uptime: ${service.uptimeDays} days`}
          >
            {service.uptimeDays}
          </span>
          <span className="font-mono" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9 }}>DAYS</span>
        </div>
      </div>
      <div className="text-center pb-1" aria-hidden="true">
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>↩ click to flip</span>
      </div>
    </div>
  )
}

function RecordBack({ service }: { service: Service }) {
  const statusColor = getStatusColor(service.status)
  return (
    <div
      className="card-face card-back absolute inset-0 rounded-xl overflow-y-auto"
      style={{
        background: 'var(--cream)',
        border: `2px solid ${service.coverColor}`,
      }}
    >
      <div
        className="p-3 flex items-center gap-2"
        style={{ background: service.coverColor }}
      >
        <span style={{ fontSize: 18 }}>{service.icon}</span>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {service.category} · v{service.version}
          </p>
          <h3 className="font-bold" style={{ color: '#fff', fontSize: 14 }}>
            {service.name}
          </h3>
        </div>
        <div
          className="ml-auto rounded-full px-2 py-0.5 font-mono font-bold"
          style={{ backgroundColor: statusColor, fontSize: 8, color: '#fff', letterSpacing: '0.1em' }}
        >
          ● {getStatusLabel(service.status)}
        </div>
      </div>
      <p className="px-3 py-2" style={{ color: 'var(--walnut)', fontSize: 10, fontStyle: 'italic', borderBottom: '1px solid var(--cream-dark)' }}>
        {service.description}
      </p>
      <div className="px-3 py-2">
        <p
          className="font-bold mb-1"
          style={{ color: 'var(--walnut)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}
        >
          ── Track Listing ──
        </p>
        <ol className="space-y-1">
          {service.tracks.map((track, i) => (
            <li
              key={i}
              className="flex justify-between items-center"
              style={{ color: 'var(--walnut)', fontSize: 10, borderBottom: '1px dashed var(--cream-dark)', paddingBottom: 2 }}
            >
              <span>
                <span className="font-mono" style={{ color: 'var(--copper)', marginRight: 4 }}>
                  {String(i + 1).padStart(2, '0')}.
                </span>
                {track.name}
              </span>
              <span className="font-mono font-bold" style={{ color: 'var(--walnut-light)', fontSize: 9 }}>
                {track.value}
              </span>
            </li>
          ))}
        </ol>
      </div>
      {service.url && (
        <div className="px-3 pb-3">
          <p
            className="font-bold mb-1"
            style={{ color: 'var(--walnut)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}
          >
            ── Open Service ──
          </p>
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded px-3 py-1 font-mono font-bold"
            style={{
              background: service.coverColor,
              color: '#fff',
              fontSize: 10,
              textDecoration: 'none',
            }}
            aria-label={`Open ${service.name} in new tab`}
          >
            🔗 {service.url.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}
      <div className="text-center pb-2" aria-hidden="true">
        <span style={{ color: 'rgba(0,0,0,0.25)', fontSize: 9 }}>↩ click to flip back</span>
      </div>
    </div>
  )
}

export function RecordCard({ service, isSelected, onClick }: RecordCardProps) {
  const [flipped, setFlipped] = useState(false)

  const handleClick = () => {
    if (!isSelected) {
      onClick()
    } else {
      setFlipped((f) => !f)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className="perspective-container flex-shrink-0 cursor-pointer"
      style={{ width: 260, height: 380 }}
    >
      <div
        className={`card-inner relative w-full h-full ${flipped && isSelected ? 'flipped' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${service.name}: ${getStatusLabel(service.status)}. ${isSelected ? 'Click to flip.' : 'Click to select.'}`}
        style={{
          outline: isSelected ? `3px solid ${service.accentColor}` : '3px solid transparent',
          borderRadius: 12,
          transform: `scale(${isSelected ? 1 : 0.92})`,
          transition: 'transform 0.3s ease, outline 0.3s ease',
        }}
      >
        <RecordFront service={service} />
        <RecordBack service={service} />
      </div>
    </div>
  )
}
