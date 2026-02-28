import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { GlitchText } from '../../../components/cyberpunk/GlitchText'
import { ContactTerminal } from '../../../components/cyberpunk/ContactTerminal'

export const Route = createFileRoute('/cyberpunk/contact/')({
  component: ContactPage,
})

function ContactPage() {
  const [dotVisible, setDotVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setDotVisible(v => !v), 600)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="contact-page">
      <div className="contact-inner">
        <header className="contact-header">
          <GlitchText tag="h1" text="// SEND TRANSMISSION" trigger="always" />
          <p className="uplink-status">
            UPLINK STATUS: <span className="uplink-ready">READY</span>
            <span className="uplink-dot" style={{ opacity: dotVisible ? 1 : 0 }} aria-hidden="true">●</span>
          </p>
        </header>
        <div className="ct-divider" aria-hidden="true">
          // ──────────────────────────────────────────────────────────────────────
        </div>
        <main className="contact-body">
          <ContactTerminal />
        </main>
        <footer className="contact-footer">
          <a href="/cyberpunk" className="back-link">← BACK TO NET</a>
        </footer>
      </div>
      <style>{`
        .contact-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 4rem 1.5rem; font-family: 'Share Tech Mono', monospace; }
        .contact-inner { width: 100%; max-width: 680px; display: flex; flex-direction: column; gap: 2rem; }
        .contact-header { display: flex; flex-direction: column; gap: 0.75rem; }
        .contact-header h1 { font-family: 'Rajdhani', sans-serif; font-size: clamp(2rem, 6vw, 3.5rem); font-weight: 700; color: #02D7F2; text-shadow: 0 0 12px rgba(2,215,242,0.5); margin: 0; letter-spacing: 0.05em; }
        .uplink-status { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: rgba(2,215,242,0.55); letter-spacing: 0.08em; margin: 0; display: flex; align-items: center; gap: 0.4rem; }
        .uplink-ready { color: #25E1ED; text-shadow: 0 0 8px rgba(37,225,237,0.6); }
        .uplink-dot { font-size: 0.6rem; color: #25E1ED; text-shadow: 0 0 6px #25E1ED; transition: opacity 0.15s ease; }
        .ct-divider { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: rgba(2,215,242,0.2); letter-spacing: 0; overflow: hidden; white-space: nowrap; }
        .contact-body { padding: 0; }
        .contact-footer { padding-top: 1rem; border-top: 1px solid rgba(2,215,242,0.1); }
        .back-link { font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: rgba(2,215,242,0.5); text-decoration: none; letter-spacing: 0.06em; border: 1px solid rgba(2,215,242,0.2); padding: 0.3rem 0.75rem; transition: color 0.2s, border-color 0.2s, box-shadow 0.2s; display: inline-block; }
        .back-link:hover { color: #02D7F2; border-color: rgba(2,215,242,0.5); box-shadow: 0 0 8px rgba(2,215,242,0.2); }
      `}</style>
    </div>
  )
}
