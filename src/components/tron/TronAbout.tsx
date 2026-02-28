export function TronAbout() {
  const specs = [
    { label: 'DESIGNATION', value: 'SONGBIRD // MASON BESMER' },
    { label: 'FUNCTION', value: 'SYSTEMS ENGINEER / TINKERER' },
    { label: 'SECTOR', value: 'INFRASTRUCTURE & HOME AUTOMATION' },
    { label: 'EXPERTISE', value: 'LINUX · DOCKER · PROXMOX · NETWORKING' },
    { label: 'PHILOSOPHY', value: 'BUILD IT YOURSELF. UNDERSTAND EVERY LAYER.' },
    { label: 'STATUS', value: 'ACTIVE // OPEN TO COLLABORATION' },
    { label: 'LOCATION', value: 'GRID NODE: UNITED STATES' },
  ]

  return (
    <section id="about" className="tron-about" aria-label="About section">
      <div className="tron-about-inner">
        <div className="tron-section-header">
          <span className="tron-section-tag">// PROGRAM IDENTITY FILE</span>
          <h2 className="tron-section-title">IDENTITY.DAT</h2>
        </div>

        <div className="tron-hud-panel">
          <div className="tron-hud-corner tron-hud-tl" aria-hidden="true" />
          <div className="tron-hud-corner tron-hud-tr" aria-hidden="true" />
          <div className="tron-hud-corner tron-hud-bl" aria-hidden="true" />
          <div className="tron-hud-corner tron-hud-br" aria-hidden="true" />

          <div className="tron-hud-title">
            <span className="tron-hud-title-bar" aria-hidden="true" />
            ENCOM MAINFRAME — PROGRAM RECORD
            <span className="tron-hud-title-bar" aria-hidden="true" />
          </div>

          <dl className="tron-specs">
            {specs.map(({ label, value }) => (
              <div key={label} className="tron-spec-row">
                <dt className="tron-spec-label">{label}:</dt>
                <dd className="tron-spec-value">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="tron-hud-footer">
            <span className="tron-hud-footer-bar" aria-hidden="true" />
            <span className="tron-hud-footer-text">RECORD INTEGRITY: 100% // CLEARANCE: ALPHA</span>
            <span className="tron-hud-footer-bar" aria-hidden="true" />
          </div>
        </div>
      </div>

      <style>{`
        .tron-about {
          padding: 6rem 1.5rem;
          border-top: 1px solid rgba(0,170,255,0.2);
        }
        .tron-about-inner {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .tron-section-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .tron-section-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(0,170,255,0.5);
          letter-spacing: 0.12em;
        }
        .tron-section-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          font-weight: 700;
          color: #00AAFF;
          margin: 0;
          text-shadow: 0 0 12px rgba(0,170,255,0.6);
          letter-spacing: 0.1em;
        }
        .tron-hud-panel {
          position: relative;
          border: 1px solid rgba(0,170,255,0.4);
          padding: 2rem 2.5rem;
          background: rgba(5,5,16,0.75);
          box-shadow:
            0 0 16px rgba(0,170,255,0.15),
            inset 0 0 24px rgba(0,170,255,0.04);
        }
        .tron-hud-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: #00AAFF;
          border-style: solid;
          border-width: 0;
        }
        .tron-hud-tl { top: -1px; left: -1px; border-top-width: 2px; border-left-width: 2px; }
        .tron-hud-tr { top: -1px; right: -1px; border-top-width: 2px; border-right-width: 2px; }
        .tron-hud-bl { bottom: -1px; left: -1px; border-bottom-width: 2px; border-left-width: 2px; }
        .tron-hud-br { bottom: -1px; right: -1px; border-bottom-width: 2px; border-right-width: 2px; }
        .tron-hud-title {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: rgba(0,170,255,0.6);
          letter-spacing: 0.14em;
          text-align: center;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }
        .tron-hud-title-bar {
          flex: 1;
          height: 1px;
          background: rgba(0,170,255,0.3);
        }
        .tron-specs {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .tron-spec-row {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 1rem;
          align-items: baseline;
        }
        @media (max-width: 600px) {
          .tron-spec-row { grid-template-columns: 1fr; gap: 0.2rem; }
          .tron-hud-panel { padding: 1.5rem 1.25rem; }
        }
        .tron-spec-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: rgba(0,170,255,0.55);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .tron-spec-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.875rem;
          color: #FFFFFF;
          letter-spacing: 0.05em;
          text-shadow: 0 0 6px rgba(255,255,255,0.2);
          margin: 0;
        }
        .tron-hud-footer {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: rgba(0,170,255,0.4);
          letter-spacing: 0.1em;
          text-align: center;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.75rem;
        }
        .tron-hud-footer-bar {
          flex: 1;
          height: 1px;
          background: rgba(0,170,255,0.2);
        }
        .tron-hud-footer-text { white-space: nowrap; }
      `}</style>
    </section>
  )
}
