import { useEffect } from 'react'
import type { ServiceNode } from '../../lib/synthwave-data'
import { STATUS_COLOR, CATEGORY_COLOR } from '../../lib/synthwave-data'

interface ServiceModalProps {
  service: ServiceNode
  onClose: () => void
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const accentColor = CATEGORY_COLOR[service.category]

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="sw-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`${service.name} details`}
    >
      <div className="sw-modal" style={{ borderColor: `${accentColor}66` }}>
        <div className="sw-modal-header" style={{ borderBottomColor: `${accentColor}33` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{service.icon}</span>
            <span className="sw-modal-title" style={{ color: accentColor, textShadow: `0 0 8px ${accentColor}` }}>
              {service.name.toUpperCase()}
            </span>
            <span
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: STATUS_COLOR[service.status],
                boxShadow: `0 0 6px ${STATUS_COLOR[service.status]}`,
                display: 'inline-block',
              }}
            />
          </div>
          <button
            className="sw-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="sw-modal-body">
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem',
            letterSpacing: '0.06em',
          }}>
            {service.description}
          </p>

          <div className="sw-detail-row">
            <span className="sw-detail-key">STATUS</span>
            <span className="sw-detail-value" style={{ color: STATUS_COLOR[service.status], textTransform: 'uppercase' }}>
              {service.status}
            </span>
          </div>
          <div className="sw-detail-row">
            <span className="sw-detail-key">VERSION</span>
            <span className="sw-detail-value">{service.version}</span>
          </div>
          <div className="sw-detail-row">
            <span className="sw-detail-key">UPTIME</span>
            <span className="sw-detail-value">{service.uptimeDays} days</span>
          </div>
          <div className="sw-detail-row">
            <span className="sw-detail-key">CPU</span>
            <span className="sw-detail-value">{service.cpu}%</span>
          </div>
          <div className="sw-detail-row">
            <span className="sw-detail-key">MEMORY</span>
            <span className="sw-detail-value">{service.memory}%</span>
          </div>

          {Object.entries(service.details).map(([k, v]) => (
            <div className="sw-detail-row" key={k}>
              <span className="sw-detail-key">{k.toUpperCase()}</span>
              <span className="sw-detail-value">{v}</span>
            </div>
          ))}

          {service.url && (
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: accentColor,
                textDecoration: 'none',
                border: `1px solid ${accentColor}44`,
                padding: '0.3rem 0.6rem',
                display: 'inline-block',
                letterSpacing: '0.1em',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 10px ${accentColor}66`)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              → OPEN DASHBOARD
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
