import { createFileRoute } from '@tanstack/react-router'
import { TronHero } from '../../components/tron/TronHero'
import { TronAbout } from '../../components/tron/TronAbout'
import { TronProjects } from '../../components/tron/TronProjects'
import { TronSkills } from '../../components/tron/TronSkills'
import { TronContact } from '../../components/tron/TronContact'

export const Route = createFileRoute('/tron/')({
  component: TronHome,
})

function TronHome() {
  return (
    <>
      {/* Skip nav for accessibility */}
      <a
        href="#about"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        Skip to main content
      </a>

      <TronHero />
      <main>
        <TronAbout />
        <TronProjects />
        <TronSkills />

        {/* Contact section */}
        <section id="contact" aria-label="Contact section" style={{ padding: '6rem 1.5rem', borderTop: '1px solid rgba(0,170,255,0.2)' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: 'rgba(0,170,255,0.5)', letterSpacing: '0.12em' }}>
                // TERMINAL PROMPT
              </span>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 700, color: '#00AAFF', margin: '0.5rem 0 0', textShadow: '0 0 12px rgba(0,170,255,0.6)', letterSpacing: '0.1em' }}>
                UPLINK.TERMINAL
              </h2>
            </div>

            <div style={{ border: '1px solid rgba(0,170,255,0.3)', padding: '2rem', background: 'rgba(5,5,16,0.7)', position: 'relative' }}>
              {/* HUD corner brackets */}
              <div aria-hidden="true" style={{ position: 'absolute', top: -1, left: -1, width: 12, height: 12, borderTop: '2px solid #00AAFF', borderLeft: '2px solid #00AAFF' }} />
              <div aria-hidden="true" style={{ position: 'absolute', top: -1, right: -1, width: 12, height: 12, borderTop: '2px solid #00AAFF', borderRight: '2px solid #00AAFF' }} />
              <div aria-hidden="true" style={{ position: 'absolute', bottom: -1, left: -1, width: 12, height: 12, borderBottom: '2px solid #00AAFF', borderLeft: '2px solid #00AAFF' }} />
              <div aria-hidden="true" style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderBottom: '2px solid #00AAFF', borderRight: '2px solid #00AAFF' }} />

              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.78rem', color: 'rgba(0,170,255,0.5)', margin: '0 0 1.5rem', letterSpacing: '0.06em' }}>
                ENCOM MAINFRAME — UPLINK TERMINAL v2.4<br />
                <span style={{ color: 'rgba(0,170,255,0.35)' }}>TYPE YOUR TRANSMISSION AND EXECUTE</span>
              </p>
              <TronContact />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(0,170,255,0.15)', padding: '2rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: 'rgba(0,170,255,0.35)', letterSpacing: '0.1em', margin: 0 }}>
            // END OF LINE // ENCOM MAINFRAME SYS v2.4 // USER_7742
          </p>
        </footer>
      </main>
    </>
  )
}
